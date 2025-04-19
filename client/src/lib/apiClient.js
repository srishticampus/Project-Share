import axios from 'axios';

// Assume the API is running on localhost:5000 and prefixed with /api
// Adjust this baseURL if your API endpoint is different
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your actual API base URL
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
// apiClient.interceptors.response.use(
//   (response) => {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   (error) => {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     // Example: Handle 401 Unauthorized errors (e.g., redirect to login)
//     if (error.response && error.response.status === 401) {
//       console.error('Unauthorized access - redirecting to login');
//       // Potentially clear local storage and redirect
//       // localStorage.removeItem('token');
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;