import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
                                          baseURL: API_BASE_URL,
                                          headers: {
                                              'Content-Type': 'application/json',
                                          },
                                      });

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log('Making API request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('API response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
    }
);

export default apiClient;