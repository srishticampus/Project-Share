import apiClient from '@/lib/apiClient';

const createTask = async (taskData) => {
    try {
        const response = await apiClient.post('/creator/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

const getTasksByProject = async (projectId) => {
    try {
        const response = await apiClient.get(`/creator/projects/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
};

export { createTask, getTasksByProject };