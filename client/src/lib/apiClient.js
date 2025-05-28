import axios from 'axios';

// Assume the API is running on localhost:5000 and prefixed with /api
// Adjust this baseURL if your API endpoint is different
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Replace with your actual API base URL
});

// Request interceptor to add the auth token header to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored with key 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for handling common responses or errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Example: Handle 401 Unauthorized errors (e.g., redirect to login)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      // Potentially clear local storage and redirect
      localStorage.removeItem('token');
      window.location.href = import.meta.env.VITE_BASE_URL + 'login';
    }
    return Promise.reject(error);
  }
);

const getProject = async (id) => {
  try {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data; // The API now returns { project, tasks }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error; // Re-throw the error for the component to handle
  }
};

export default apiClient;
export { getProject };