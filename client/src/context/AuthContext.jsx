import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'https://quizbackend-3-fjmj.onrender.com'; // Define base URL

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const endpoint = role === 'admin' ? '/login-admin' : '/login-user';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        email,
        password,
      });

      if (response.data.message === 'User does not exist' || 
          response.data.message === 'Admin does not exist' ||
          response.data.message === 'Invalid Password') {
        throw new Error('Invalid credentials');
      }

      const userData = role === 'admin' 
        ? { 
            adminId: response.data.adminId, 
            adminName: response.data.adminName, 
            adminEmail: response.data.adminEmail, 
            quizIds: response.data.quizIds,
            role: 'admin'
          }
        : { 
            userId: response.data.userInfo._id, 
            userName: response.data.userInfo.name, 
            userEmail: response.data.userInfo.email, 
            quizIds: response.data.userInfo.attemptedQuizes,
            role: 'user'
          };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name, email, password, role) => {
    try {
      const endpoint = role === 'admin' ? '/register-admin' : '/register-user';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        name,
        email,
        password,
      });

      // Check for specific error messages from your backend
      if (response.data.error) {
        if (response.data.error === 'User already Exist' || 
            response.data.error === 'Admin already Exist' ||
            response.data.error === 'Already registered as Admin') {
          return { 
            success: false, 
            message: response.data.error 
          };
        }
      }

      // If no error field or error is empty/null, consider it success
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || error.message || 'Registration failed' 
      };
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};