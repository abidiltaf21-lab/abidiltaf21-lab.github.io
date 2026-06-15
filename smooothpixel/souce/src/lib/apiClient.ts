import axios from 'axios';

// In dev, prefer /api (Vite proxy → backend). Fallback to direct HTTPS URL.
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? '/api' : 'https://localhost:7273/api');

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Authentication (if using JWT)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
