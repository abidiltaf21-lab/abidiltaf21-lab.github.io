import axios from 'axios';

// Use the env variable set in Vercel / .env — NEVER fall back to localhost in production
const API_BASE_URL =
    import.meta.env.VITE_PRODUCTION_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? '/api' : '');

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
