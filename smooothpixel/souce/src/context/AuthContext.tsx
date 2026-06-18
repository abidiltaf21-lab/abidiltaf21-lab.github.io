import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: any, password: any) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    // Immediate sync check from localStorage on init
    const savedUser = localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.get('/auth/verify');
        setUser(data);
        localStorage.setItem('adminUser', JSON.stringify(data));
      } catch (err) {
        console.error("Session verification failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: any, password: any) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      if (data && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setUser(data.user);
        return { data, error: null };
      }
      return { data: null, error: { message: "Invalid login response" } };
    } catch (err: any) {
      return { data: null, error: err.response?.data || { message: "Connection failed" } };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    // Force hard reload to clear all states and redirect
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
