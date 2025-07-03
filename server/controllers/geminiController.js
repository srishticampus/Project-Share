import { generateTaskContent } from '../services/geminiService.js';
import Project from '../models/Project.js'; // Assuming Project model is needed for context

const generateTask = async (req, res) => {
    const { prompt, projectId } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required.' });
    }

    try {
        let projectDetails = null;
        if (projectId) {
            projectDetails = await Project.findById(projectId);
            if (!projectDetails) {
                console.warn(`Project with ID ${projectId} not found for AI task generation.`);
                // Continue without project details if not found
            }
        }

        const { title, description } = await generateTaskContent(prompt, projectDetails);
        res.status(200).json({ title, description });
    } catch (error) {
        console.error('Error in generateTask controller:', error);
        res.status(500).json({ message: 'Failed to generate task with AI.', error: error.message });
    }
};

export {
    generateTask
};
