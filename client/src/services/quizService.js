import api from './api';

export const quizService = {
  // Quiz CRUD operations
  createQuiz: async (quizData) => {
    const response = await api.post('/add-quiz', quizData);
    return response.data;
  },

  getQuiz: async (quizId) => {
    const response = await api.post('/get-quiz', { quizId });
    return response.data;
  },

  getQuizzesByAdmin: async (quizIds) => {
    const response = await api.post('/get-quizzes', { quizIds });
    return response.data;
  },

  deleteQuiz: async (quizId) => {
    const response = await api.post('/delete-quiz', { quizId });
    return response.data;
  },

  // User Quiz Operations
  submitQuiz: async (submissionData) => {
    const response = await api.post('/save-quiz', submissionData);
    return response.data;
  },

  getUserHistory: async (userId) => {
    const response = await api.post('/get-userHistory', { userId });
    return response.data;
  },

  getResult: async (userId, quizId) => {
    const response = await api.post('/get-result', { userId, quizId });
    return response.data;
  },

  // Admin Operations
  publishResult: async (adminId, quizId, userIds) => {
    const response = await api.post('/publish-result', { adminId, quizId, userIds });
    return response.data;
  },

  calculateScore: async (quizId) => {
    const response = await api.post('/calculate-score', { quizId });
    return response.data;
  },

  getLeaderboard: async (quizId) => {
    const response = await api.post('/get-leaderboard', { quizId });
    return response.data;
  },

  checkResultPublished: async (adminId, quizId) => {
    const response = await api.post('/check-result-published', { adminId, quizId });
    return response.data;
  },

  getAdminUserHistory: async (quizId) => {
    const response = await api.post('/admin-user-history', { quizId });
    return response.data;
  },

  // OpenTDB API for random quizzes
  fetchOpenTDBQuestions: async (amount = 10, category = '', difficulty = '', type = '') => {
    let url = `https://opentdb.com/api.php?amount=${amount}`;
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;
    
    const response = await fetch(url);
    return response.json();
  },
};