import apiClient from '../lib/apiClient';

// Function to fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};