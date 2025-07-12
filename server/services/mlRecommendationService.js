import User from '../models/user.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Application from '../models/Application.js';

class MLRecommendationService {
    constructor() {
        this.projectVectors = {}; // Stores TF-IDF vectors for projects
        this.collaboratorVectors = {}; // Stores TF-IDF vectors for collaborators
        this.projectData = {}; // Stores raw project data for quick lookup
        this.collaboratorData = {}; // Stores raw collaborator data for quick lookup
        this.userProjectInteractions = {}; // Stores implicit feedback for collaborative filtering
        this.corpusTerms = new Set(); // All unique terms across all documents for IDF calculation
        this.documentTermCounts = {}; // Stores term counts for each document
        this.documentCount = 0; // Total number of documents in the corpus
    }

    // Helper to tokenize and lowercase text
    tokenizeAndProcess(text) {
        return text.toLowerCase().split(/\s+/).filter(word => word.length > 2); // Filter out short words
    }

    // Calculate Term Frequency (TF)
    calculateTf(terms) {
        const tf = {};
        const totalTerms = terms.length;
        if (totalTerms === 0) return tf;

        terms.forEach(term => {
            tf[term] = (tf[term] || 0) + 1;
        });

        for (const term in tf) {
            tf[term] = tf[term] / totalTerms;
        }
        return tf;
    }

    // Calculate Inverse Document Frequency (IDF)
    calculateIdf(term) {
        if (this.documentCount === 0) return 0;
        const termDocumentCount = Object.values(this.documentTermCounts).filter(docTerms => docTerms[term]).length;
        if (termDocumentCount === 0) return 0;
        return Math.log(this.documentCount / termDocumentCount);
    }

    // Build TF-IDF vector for a document
    buildTfIdfVector(documentId) {
        const vector = {};
        const tf = this.documentTermCounts[documentId];
        if (!tf) return vector;

        for (const term in tf) {
            const tfValue = tf[term];
            const idfValue = this.calculateIdf(term);
            vector[term] = tfValue * idfValue;
        }
        return vector;
    }

    async initialize() {
        console.log('Initializing ML Recommendation Service...');
        await this.buildCorpus(); // Build corpus first to calculate IDF
        await this.buildProjectFeatures();
        await this.buildCollaboratorFeatures();
        await this.buildUserProjectInteractions();
        console.log('ML Recommendation Service initialized.');
    }

    async buildCorpus() {
        console.log('Building corpus for TF-IDF...');
        this.corpusTerms = new Set();
        this.documentTermCounts = {};
        this.documentCount = 0;
        this.projectData = {}; // Initialize projectData here to store projectWithTasks

        // Add project documents to corpus
        const projects = await Project.find({ status: { $in: ['Planning', 'In Progress'] } }).populate('creator').lean();
        for (const project of projects) {
            const tasks = await Task.find({ project: project._id }).lean();
            const projectWithTasks = { ...project, tasks }; // Combined here
            const projectText = this.getProjectText(projectWithTasks);
            const terms = this.tokenizeAndProcess(projectText);
            
            this.documentTermCounts[project._id.toString()] = this.calculateTf(terms);
            this.documentCount++;
            terms.forEach(term => this.corpusTerms.add(term));
            this.projectData[project._id.toString()] = projectWithTasks; // Store projectWithTasks here
        }

        // Add collaborator documents to corpus
        const collaborators = await User.find({ role: 'collaborator' }).lean();
        for (const collaborator of collaborators) {
            const skillsText = this.getCollaboratorSkillsText(collaborator);
            const terms = this.tokenizeAndProcess(skillsText);

            this.documentTermCounts[collaborator._id.toString()] = this.calculateTf(terms);
            this.documentCount++;
            terms.forEach(term => this.corpusTerms.add(term));
            this.collaboratorData[collaborator._id.toString()] = collaborator; // Store collaborator data here
        }
        console.log(`Corpus built with ${this.documentCount} documents and ${this.corpusTerms.size} unique terms.`);
    }

    async buildProjectFeatures() {
        console.log('Building project features...');
        const projects = await Project.find({ status: { $in: ['Planning', 'In Progress'] } }).lean(); // Re-fetch projects to ensure consistency, though projectData should have them
        
        this.projectVectors = {};
        // this.projectData is already populated in buildCorpus

        for (const project of projects) {
            // projectWithTasks is already stored in this.projectData from buildCorpus
            // No need to re-fetch or populate tasks here
            const vector = this.buildTfIdfVector(project._id.toString());
            this.projectVectors[project._id.toString()] = vector;
        }
        console.log(`Built features for ${Object.keys(this.projectVectors).length} projects.`);
        console.log('Sample project vector (first 5 terms):', Object.fromEntries(Object.entries(this.projectVectors[Object.keys(this.projectVectors)[0]] || {}).slice(0, 5)));
    }

    async buildCollaboratorFeatures() {
        console.log('Building collaborator features...');
        const collaborators = await User.find({ role: 'collaborator' }).lean(); // Re-fetch collaborators to ensure consistency, though collaboratorData should have them

        this.collaboratorVectors = {};
        // this.collaboratorData is already populated in buildCorpus

        for (const collaborator of collaborators) {
            // collaboratorData is already stored in this.collaboratorData from buildCorpus
            const vector = this.buildTfIdfVector(collaborator._id.toString());
            this.collaboratorVectors[collaborator._id.toString()] = vector;
        }
        console.log(`Built features for ${Object.keys(this.collaboratorVectors).length} collaborators.`);
        console.log('Sample collaborator vector (first 5 terms):', Object.fromEntries(Object.entries(this.collaboratorVectors[Object.keys(this.collaboratorVectors)[0]] || {}).slice(0, 5)));
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
            let processedSkills = [];
            if (typeof collaborator.skills[0] === 'string' && collaborator.skills[0].includes(',')) {
                processedSkills = collaborator.skills[0].split(',').map(s => s.trim().toLowerCase()).filter(s => s);
            } else {
                processedSkills = collaborator.skills.map(s => s.trim().toLowerCase()).filter(s => s);
            }
            return processedSkills.join(' ');
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
        if (!collaboratorVector || Object.keys(collaboratorVector).length === 0) { // Check if vector is empty
            console.warn(`Collaborator vector not found or empty for ID: ${collaboratorId}`);
            return [];
        }

        const recommendations = [];
        const appliedProjects = this.userProjectInteractions[collaboratorId] || new Set();

        console.log(`Getting recommendations for collaborator: ${collaboratorId}`);
        console.log('Collaborator vector:', collaboratorVector);
        console.log('Applied projects:', appliedProjects);

        for (const projectId in this.projectVectors) {
            const project = this.projectData[projectId];
            
            const isAlreadyCollaborator = project.collaborators && project.collaborators.some(c => c.toString() === collaboratorId);

            // if (appliedProjects.has(projectId) || isAlreadyCollaborator) {
            //     console.log(`Skipping project ${projectId}: Applied (${appliedProjects.has(projectId)}) or Already Collaborator (${isAlreadyCollaborator})`);
            //     continue;
            // }

            const projectVector = this.projectVectors[projectId];
            if (Object.keys(projectVector).length === 0) { // Skip empty project vectors
                console.log(`Skipping project ${projectId}: Project vector is empty.`);
                continue;
            }

            const score = this.cosineSimilarity(collaboratorVector, projectVector);

            console.log(`Project ${projectId}: Score = ${score}`);

            if (score > 0) {
                recommendations.push({
                    project: this.projectData[projectId],
                    score: score
                });
            }
        }

        recommendations.sort((a, b) => b.score - a.score);

        console.log(`Found ${recommendations.length} recommendations.`);

        return recommendations.map(rec => ({ ...rec.project, recommendationScore: rec.score }));
    }
}

export default new MLRecommendationService();
