import { useQuiz } from '../context/QuizContext';

export const useQuizHook = () => {
  const quiz = useQuiz();
  return quiz;
};