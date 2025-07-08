import User from '../models/user.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Application from '../models/Application.js';
import mlRecommendationService from '../services/mlRecommendationService.js'; // Import the new service

// Helper function to calculate similarity between two sets of skills/keywords
const calculateSimilarity = (set1, set2) => {
    const s1 = new Set(set1 || []);
    const s2 = new Set(set2 || []);
    
    if (s1.size === 0 && s2.size === 0) return 0; // No items to compare
    
    let intersectionCount = 0;
    for (const item of s1) {
        if (s2.has(item)) {
            intersectionCount++;
        }
    }
    
    const unionCount = s1.size + s2.size - intersectionCount;
    
    return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

// Mapping of specific skills to broader expertise areas for mentor recommendations
const skillToExpertiseMap = {
    'react': 'web development',
    'js': 'web development',
    'javascript': 'web development',
    'html': 'web development',
    'css': 'web development',
    'next': 'web development',
    'express': 'web development',
    'node.js': 'web development',
    'mongodb': 'web development',
    'python': 'data science',
    'pandas': 'data science',
    'numpy': 'data science',
    'machine learning': 'machine learning',
    'android': 'mobile development',
    'kotlin': 'mobile development',
    'ios': 'mobile development',
    'swift': 'mobile development',
    'ui/ux': 'ui/ux design',
    'figma': 'ui/ux design',
    'adobe xd': 'ui/ux design',
    'aws': 'cloud computing',
    'azure': 'cloud computing',
    'gcp': 'cloud computing',
    'docker': 'devops',
    'kubernetes': 'devops',
    'ci/cd': 'devops',
    'security': 'cybersecurity',
    'network security': 'cybersecurity',
    'project management': 'project management',
    'agile': 'project management',
    'scrum': 'project management',
    'marketing': 'marketing',
    'seo': 'marketing',
    'content': 'content creation',
    'writing': 'content creation',
    'business': 'business strategy',
    'strategy': 'business strategy',
    // Add more mappings as needed
};

// Get recommended projects for a collaborator
export const getRecommendedProjectsForCollaborator = async (req, res) => {
    try {
        const collaboratorId = req.user.id; // Assuming user ID is available from auth middleware

        // Use the ML recommendation service
        let recommendedProjects = await mlRecommendationService.getRecommendedProjectsForCollaborator(collaboratorId);
        
        // If ML recommendations are empty, fall back to the old scoring system
        if (!recommendedProjects || recommendedProjects.length === 0) {
            console.log('ML recommendations empty, falling back to old scoring system.');
            const collaborator = await User.findById(collaboratorId);
            if (!collaborator || collaborator.role !== 'collaborator') {
                return res.status(403).json({ message: 'Access denied. Not a collaborator.' });
            }

            // Ensure skills are correctly processed as an array of strings and lowercased
            const collaboratorSkills = (collaborator.skills && collaborator.skills.length > 0)
                ? collaborator.skills[0].split(',').map(s => s.trim().toLowerCase())
                : [];

            // Find active projects
            const projects = await Project.find({ status: { $in: ['Planning', 'In Progress'] } })
                .populate('creator', 'name email')
                .lean();

            const fallbackRecommendedProjects = [];

            for (const project of projects) {
                // Get tasks/issues for the project
                const tasks = await Task.find({ project: project._id });
                const projectDescriptionKeywords = project.description.toLowerCase().split(/\s+/);
                const projectTaskKeywords = tasks.flatMap(task => task.description.toLowerCase().split(/\s+/));

                const allProjectKeywords = [
                    ...(project.techStack || []).map(s => s.toLowerCase()),
                    ...projectDescriptionKeywords,
                    ...projectTaskKeywords
                ];

                // Filter out common words and duplicates, keep only potentially relevant keywords
                const relevantProjectKeywords = [...new Set(allProjectKeywords.filter(word => word.length > 2))];

                // Calculate tech stack similarity
                const projectTechStack = (project.techStack || []).map(s => s.toLowerCase());
                const techStackScore = calculateSimilarity(collaboratorSkills, projectTechStack);

                // Calculate keyword similarity (from description and tasks)
                const keywordScore = calculateSimilarity(collaboratorSkills, relevantProjectKeywords);

                // Combine scores with a weighting (e.g., 70% tech stack, 30% keywords)
                const combinedScore = (techStackScore * 0.7) + (keywordScore * 0.3);

                if (combinedScore > 0) {
                    let collaboratorStatus = null;

                    // Check if the current user is an active collaborator on the project
                    if (project.collaborators.includes(collaboratorId) && project.status === 'In Progress') {
                        collaboratorStatus = 'Active';
                    } else {
                        // Check if the current user has applied to this project
                        const application = await Application.findOne({
                            projectId: project._id,
                            applicantId: collaboratorId,
                            status: { $in: ['Pending', 'Accepted'] }
                        });
                        if (application) {
                            collaboratorStatus = 'Applied';
                        }
                    }

                    fallbackRecommendedProjects.push({
                        ...project,
                        recommendationScore: combinedScore,
                        collaboratorStatus,
                    });
                }
            }

            // Sort by score in descending order
            fallbackRecommendedProjects.sort((a, b) => b.recommendationScore - a.recommendationScore);
            recommendedProjects = fallbackRecommendedProjects; // Assign fallback recommendations
        }
        
        res.status(200).json(recommendedProjects);

    } catch (error) {
        console.error('Error getting recommended projects:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get recommended mentors for a user (creator or mentor)
export const getRecommendedMentorsForUser = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available from auth middleware

        const requestingUser = await User.findById(userId);
        if (!requestingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Determine the skills/needs of the requesting user
        let userSkills = (requestingUser.skills && requestingUser.skills.length > 0)
            ? requestingUser.skills[0].split(',').map(s => s.trim().toLowerCase())
            : [];

        if (requestingUser.role === 'creator') {
            const creatorProjects = await Project.find({ creator: userId, status: { $in: ['Planning', 'In Progress'] } });
            creatorProjects.forEach(proj => {
                userSkills = [...userSkills, ...(proj.techStack || []).map(s => s.toLowerCase())];
            });
        }
        userSkills = [...new Set(userSkills)]; // Deduplicate

        // Convert specific user skills into broader expertise areas for matching
        const userExpertiseNeeds = new Set();
        userSkills.forEach(skill => {
            if (skillToExpertiseMap[skill]) {
                userExpertiseNeeds.add(skillToExpertiseMap[skill]);
            }
        });

        // If no specific mapping, use the raw skills as a fallback
        const finalUserNeeds = userExpertiseNeeds.size > 0 ? [...userExpertiseNeeds] : userSkills;


        // Find all mentors
        const mentors = await User.find({ role: 'mentor' });

        const recommendedMentors = [];

        for (const mentor of mentors) {
            const mentorExpertise = [
                ...(mentor.areasOfExpertise || []).map(e => e.toLowerCase()), // Ensure mentor expertise is lowercased
                mentor.credentials ? mentor.credentials.toLowerCase() : ''
            ];

            const score = calculateSimilarity(finalUserNeeds, mentorExpertise);

            if (score > 0) { // Only include mentors with some level of match
                recommendedMentors.push({
                    ...mentor.toObject(), // Convert Mongoose document to plain object
                    recommendationScore: score
                });
            }
        }

        // Sort by score in descending order
        recommendedMentors.sort((a, b) => b.recommendationScore - a.recommendationScore);

        res.status(200).json(recommendedMentors);

    } catch (error) {
        console.error('Error getting recommended mentors:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get recommended projects for a mentor based on their areas of expertise
export const getRecommendedProjectsForMentor = async (req, res) => {
    try {
        const mentorId = req.user.id; // Assuming user ID is available from auth middleware

        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== 'mentor') {
            return res.status(403).json({ message: 'Access denied. Not a mentor.' });
        }

        const mentorExpertise = mentor.areasOfExpertise || [];

        if (mentorExpertise.length === 0) {
            return res.status(200).json([]); // No expertise defined, no recommendations
        }

        // Find projects whose category matches any of the mentor's areas of expertise
        const recommendedProjects = await Project.find({
            category: { $in: mentorExpertise },
            status: { $in: ['Planning', 'In Progress'] } // Only recommend active projects
        })
        .populate('creator', 'name email')
        .lean();

        res.status(200).json(recommendedProjects);

    } catch (error) {
        console.error('Error getting recommended projects for mentor:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
