import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const authService = {
  login: async (credentials: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  verifyToken: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status === 200;
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }
  }
};

export default authService;
