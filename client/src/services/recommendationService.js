import apiClient from '../lib/apiClient';

const recommendationService = {
    getRecommendedProjects: async () => {
        try {
            const response = await apiClient.get('/recommendations/projects');
            return response.data;
        } catch (error) {
            console.error('Error fetching recommended projects:', error);
            throw error;
        }
    },

    getRecommendedMentors: async () => {
        try {
            const response = await apiClient.get('/recommendations/mentors');
            return response.data;
        } catch (error) {
            console.error('Error fetching recommended mentors:', error);
            throw error;
        }
    }
};

export default recommendationService;
