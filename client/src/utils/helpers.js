export const decodeHTMLEntities = (text) => {
  if (!text) return '';
  
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent;
};

export const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateRemainingTime = (endTime) => {
  if (!endTime) return 0;
  
  const end = new Date(endTime);
  const now = new Date();
  const diffMs = end - now;
  
  if (diffMs <= 0) return 0;
  
  return Math.floor(diffMs / 1000);
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const calculateScore = (questions, userAnswers) => {
  let score = 0;
  let total = 0;
  
  questions.forEach((question, index) => {
    total += question.points || 1;
    if (userAnswers[index] === question.correctAnswer) {
      score += question.points || 1;
    }
  });
  
  return { score, total, percentage: total > 0 ? Math.round((score / total) * 100) : 0 };
};