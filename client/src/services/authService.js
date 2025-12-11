import api from './api';

export const authService = {
  loginUser: async (email, password) => {
    const response = await api.post('/login-user', { email, password });
    return response.data;
  },

  loginAdmin: async (email, password) => {
    const response = await api.post('/login-admin', { email, password });
    return response.data;
  },

  registerUser: async (name, email, password) => {
    const response = await api.post('/register-user', { name, email, password });
    return response.data;
  },

  registerAdmin: async (name, email, password) => {
    const response = await api.post('/register-admin', { name, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};