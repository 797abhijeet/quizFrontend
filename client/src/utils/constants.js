export const QUIZ_CATEGORIES = [
  { value: "", label: "Any Category" },
  { value: "9", label: "General Knowledge" },
  { value: "10", label: "Entertainment: Books" },
  { value: "11", label: "Entertainment: Film" },
  { value: "12", label: "Entertainment: Music" },
  { value: "13", label: "Entertainment: Musicals & Theatres" },
  { value: "14", label: "Entertainment: Television" },
  { value: "15", label: "Entertainment: Video Games" },
  { value: "16", label: "Entertainment: Board Games" },
  { value: "17", label: "Science & Nature" },
  { value: "18", label: "Science: Computers" },
  { value: "19", label: "Science: Mathematics" },
  { value: "20", label: "Mythology" },
  { value: "21", label: "Sports" },
  { value: "22", label: "Geography" },
  { value: "23", label: "History" },
  { value: "24", label: "Politics" },
  { value: "25", label: "Art" },
  { value: "26", label: "Celebrities" },
  { value: "27", label: "Animals" },
];

export const DIFFICULTY_LEVELS = [
  { value: "", label: "Any Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const QUESTION_TYPES = [
  { value: "", label: "Any Type" },
  { value: "multiple", label: "Multiple Choice" },
  { value: "boolean", label: "True / False" },
];

export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: "multiple-choice",
  TRUE_FALSE: "true-false",
  SHORT_ANSWER: "short-answer",
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  USER: '/user',
  ABOUT: '/about',
  CONTACT: '/contact',
  CUSTOM_QUIZ: '/admin/custom-quiz',
  RANDOM_QUIZ: '/admin/random-quiz',
  QUIZ_DETAIL: '/admin/quiz-detail',
  INSTRUCTION: '/user/instruction',
  USER_QUIZ: '/user/quiz',
  RESULT: '/quiz/result',
  SUBMITTED: '/quiz/submitted',
  LEADERBOARD: '/quiz/leaderboard',
};

export const LOCAL_STORAGE_KEYS = {
  USER: 'user',
  QUIZ_STATE: 'quiz_state',
  ANSWERS: 'quiz_answers',
};

export const API_ENDPOINTS = {
  LOGIN_USER: '/login-user',
  LOGIN_ADMIN: '/login-admin',
  REGISTER_USER: '/register-user',
  REGISTER_ADMIN: '/register-admin',
  ADD_QUIZ: '/add-quiz',
  GET_QUIZ: '/get-quiz',
  GET_QUIZZES: '/get-quizzes',
  DELETE_QUIZ: '/delete-quiz',
  SAVE_QUIZ: '/save-quiz',
  GET_USER_HISTORY: '/get-userHistory',
  GET_RESULT: '/get-result',
  PUBLISH_RESULT: '/publish-result',
  CALCULATE_SCORE: '/calculate-score',
  GET_LEADERBOARD: '/get-leaderboard',
  CHECK_RESULT_PUBLISHED: '/check-result-published',
  ADMIN_USER_HISTORY: '/admin-user-history',
};