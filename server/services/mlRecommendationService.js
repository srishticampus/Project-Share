import User from '../models/user.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Application from '../models/Application.js';
import pkg from 'natural';
const { TfIdf, PorterStemmer, WordTokenizer } = pkg; // Import WordTokenizer

class MLRecommendationService {
    constructor() {
        this.tfidf = new TfIdf();
        this.projectVectors = {}; // Stores TF-IDF vectors for projects
        this.collaboratorVectors = {}; // Stores TF-IDF vectors for collaborators
        this.projectData = {}; // Stores raw project data for quick lookup
        this.collaboratorData = {}; // Stores raw collaborator data for quick lookup
        this.userProjectInteractions = {}; // Stores implicit feedback for collaborative filtering
    }

    async initialize() {
        console.log('Initializing ML Recommendation Service...');
        await this.buildProjectFeatures();
        await this.buildCollaboratorFeatures();
        await this.buildUserProjectInteractions();
        console.log('ML Recommendation Service initialized.');
    }

    async buildProjectFeatures() {
        console.log('Building project features...');
        const projects = await Project.find({ status: { $in: ['Planning', 'In Progress'] } }).lean();
        
        this.tfidf = new TfIdf(); // Reset TF-IDF for fresh corpus
        this.projectVectors = {};
        this.projectData = {};

        for (const project of projects) {
            // Fetch tasks separately for each project
            const tasks = await Task.find({ project: project._id }).lean();
            const projectWithTasks = { ...project, tasks }; // Combine project data with its tasks
            
            const projectText = this.getProjectText(projectWithTasks);
            // Tokenize and stem before adding to TF-IDF
            const tokenizer = new WordTokenizer();
            const projectTokens = tokenizer.tokenize(projectText);
            const stemmedProjectTerms = projectTokens.map(token => PorterStemmer.stem(token));
            this.tfidf.addDocument(stemmedProjectTerms, project._id.toString()); // Add array of terms
            this.projectData[project._id.toString()] = projectWithTasks; // Store combined data
        }

        // After all documents are added, generate vectors
        for (const project of projects) {
            const projectWithTasks = this.projectData[project._id.toString()]; // Retrieve combined data
            const vector = {};
            this.tfidf.listTerms(project._id.toString()).forEach(item => { // Use listTerms with the key
                vector[item.term] = item.tfidf;
            });
            this.projectVectors[project._id.toString()] = vector;
        }
        console.log(`Built features for ${Object.keys(this.projectVectors).length} projects.`);
        // console.log('Sample project vector:', this.projectVectors[Object.keys(this.projectVectors)[0]]); // Log a sample
    }

    async buildCollaboratorFeatures() {
        console.log('Building collaborator features...');
        const collaborators = await User.find({ role: 'collaborator' }).lean();
        const tokenizer = new WordTokenizer();

        // Add collaborator skills to the TF-IDF corpus
        for (const collaborator of collaborators) {
            const skillsText = this.getCollaboratorSkillsText(collaborator);
            if (skillsText) {
                const skillsTokens = tokenizer.tokenize(skillsText);
                const stemmedSkillsTerms = skillsTokens.map(token => PorterStemmer.stem(token));
                this.tfidf.addDocument(stemmedSkillsTerms, collaborator._id.toString()); // Add array of terms
            }
            this.collaboratorData[collaborator._id.toString()] = collaborator;
        }

        // Generate vectors for collaborators
        for (const collaborator of collaborators) {
            const skillsText = this.getCollaboratorSkillsText(collaborator);
            console.log(`Processing collaborator ${collaborator._id}: Skills Text = "${skillsText}"`);
            if (skillsText) {
                const vector = {};
                this.tfidf.listTerms(collaborator._id.toString()).forEach(item => { // Use listTerms with the key
                    vector[item.term] = item.tfidf;
                });
                this.collaboratorVectors[collaborator._id.toString()] = vector;
                console.log(`Collaborator ${collaborator._id} vector:`, vector);
            } else {
                this.collaboratorVectors[collaborator._id.toString()] = {}; // Ensure an empty object is stored
                console.log(`Collaborator ${collaborator._id} has no skills, storing empty vector.`);
            }
        }
        console.log(`Built features for ${Object.keys(this.collaboratorVectors).length} collaborators.`);
        // console.log('Sample collaborator vector:', this.collaboratorVectors[Object.keys(this.collaboratorVectors)[0]]); // Log a sample
        console.log('All collaborator vectors:', this.collaboratorVectors); // Log all vectors for debugging
    }

    async buildUserProjectInteractions() {
        console.log('Building user-project interactions...');
        const applications = await Application.find({ status: { $in: ['Pending', 'Accepted'] } }).lean();
        this.userProjectInteractions = {};
 
        for (const app of applications) {
            const userId = app.applicantId.toString();
            const projectId = app.projectId.toString();
            if (!this.userProjectInteractions[userId]) {
                this.userProjectInteractions[userId] = new Set();
            }
            this.userProjectInteractions[userId].add(projectId);
        }
        console.log(`Built interactions for ${Object.keys(this.userProjectInteractions).length} users.`);
    }

    getProjectText(project) {
        let text = `${project.title} ${project.description} ${project.category}`;
        if (project.techStack && project.techStack.length > 0) {
            text += ` ${project.techStack.join(' ')}`;
        }
        if (project.tasks && project.tasks.length > 0) {
            text += ` ${project.tasks.map(task => task.description).join(' ')}`;
        }
        return text.toLowerCase();
    }

    getCollaboratorSkillsText(collaborator) {
        if (collaborator.skills && collaborator.skills.length > 0) {
            return collaborator.skills.join(' ').toLowerCase();
        }
        return '';
    }

    // Cosine Similarity calculation
    cosineSimilarity(vec1, vec2) {
        const commonTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        for (const term of commonTerms) {
            const val1 = vec1[term] || 0;
            const val2 = vec2[term] || 0;
            dotProduct += val1 * val2;
            magnitude1 += val1 * val1;
            magnitude2 += val2 * val2;
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        if (magnitude1 === 0 || magnitude2 === 0) {
            return 0;
        }

        return dotProduct / (magnitude1 * magnitude2);
    }

    async getRecommendedProjectsForCollaborator(collaboratorId) {
        const collaboratorVector = this.collaboratorVectors[collaboratorId];
        if (!collaboratorVector) {
            console.warn(`Collaborator vector not found for ID: ${collaboratorId}`);
            return [];
        }

        const recommendations = [];
        const appliedProjects = this.userProjectInteractions[collaboratorId] || new Set();
        // No need for currentCollaborator.collaborators, as project.collaborators is available

        console.log(`Getting recommendations for collaborator: ${collaboratorId}`);
        console.log('Collaborator vector:', collaboratorVector);
        console.log('Applied projects:', appliedProjects);

        for (const projectId in this.projectVectors) {
            const project = this.projectData[projectId]; // Get the full project object
            
            // Check if the collaborator is already a part of this project
            const isAlreadyCollaborator = project.collaborators && project.collaborators.some(c => c.toString() === collaboratorId);

            // Skip projects the collaborator has already applied to or is already a part of
            if (appliedProjects.has(projectId) || isAlreadyCollaborator) {
                console.log(`Skipping project ${projectId}: Applied (${appliedProjects.has(projectId)}) or Already Collaborator (${isAlreadyCollaborator})`);
                continue;
            }

            const projectVector = this.projectVectors[projectId];
            const score = this.cosineSimilarity(collaboratorVector, projectVector);

            console.log(`Project ${projectId}: Score = ${score}`);

            if (score > 0) {
                recommendations.push({
                    project: this.projectData[projectId],
                    score: score
                });
            }
        }

        // Sort by score in descending order
        recommendations.sort((a, b) => b.score - a.score);

        console.log(`Found ${recommendations.length} recommendations.`);

        // Simple collaborative filtering boost (placeholder for now)
        // In a more advanced system, this would involve finding similar users and recommending projects they liked.
        // For now, we'll just return the content-based recommendations.

        return recommendations.map(rec => ({ ...rec.project, recommendationScore: rec.score }));
    }
}

export default new MLRecommendationService();
