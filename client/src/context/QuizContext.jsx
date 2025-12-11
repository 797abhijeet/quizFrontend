import React, { createContext, useState, useContext } from 'react';

const QuizContext = createContext(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizForm, setQuizForm] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 0,
    questions: [
      {
        questionText: "What is your Question No. 1?",
        questionType: "multiple-choice",
        options: [
          { optionText: "My First Option" },
          { optionText: "My Second Option" },
          { optionText: "My Third Option" },
          { optionText: "My Fourth Option" },
        ],
        answerKey: "",
        points: 0,
        answer: false,
      },
    ],
  });

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const updateQuizForm = (updates) => {
    setQuizForm(prev => ({ ...prev, ...updates }));
  };

  const updateQuestion = (index, updates) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], ...updates };
      return { ...prev, questions: newQuestions };
    });
  };

  const updateOption = (questionIndex, optionIndex, updates) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      const question = { ...newQuestions[questionIndex] };
      question.options[optionIndex] = { ...question.options[optionIndex], ...updates };
      newQuestions[questionIndex] = question;
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = (index) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index + 1, 0, {
        questionText: "New Question",
        questionType: "multiple-choice",
        options: [{ optionText: "Option 1" }],
        answerKey: "",
        points: 0,
        answer: false,
      });
      return { ...prev, questions: newQuestions };
    });
  };

  const removeQuestion = (index) => {
    if (quizForm.questions.length > 1) {
      setQuizForm(prev => {
        const newQuestions = [...prev.questions];
        newQuestions.splice(index, 1);
        return { ...prev, questions: newQuestions };
      });
    }
  };

  const addOption = (questionIndex) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      const question = { ...newQuestions[questionIndex] };
      
      if (question.questionType === 'short-answer') {
        question.options = [{ optionText: '' }];
      } else if (question.questionType === 'true-false') {
        question.options = [
          { optionText: 'True' },
          { optionText: 'False' },
        ];
      } else if (question.options.length < 5) {
        question.options.push({
          optionText: `Option ${question.options.length + 1}`,
        });
      }
      
      newQuestions[questionIndex] = question;
      return { ...prev, questions: newQuestions };
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      const question = { ...newQuestions[questionIndex] };
      if (question.options.length > 1) {
        question.options.splice(optionIndex, 1);
        newQuestions[questionIndex] = question;
      }
      return { ...prev, questions: newQuestions };
    });
  };

  const resetQuizForm = () => {
    setQuizForm({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      duration: 0,
      questions: [
        {
          questionText: "What is your Question No. 1?",
          questionType: "multiple-choice",
          options: [
            { optionText: "My First Option" },
            { optionText: "My Second Option" },
            { optionText: "My Third Option" },
            { optionText: "My Fourth Option" },
          ],
          answerKey: "",
          points: 0,
          answer: false,
        },
      ],
    });
  };

  const setAnswerKeyMode = (questionIndex, mode) => {
    setQuizForm(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = { 
        ...newQuestions[questionIndex], 
        answer: mode 
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const setUserAnswer = (questionIndex, answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const clearUserAnswers = () => {
    setUserAnswers([]);
  };

  const value = {
    quizForm,
    updateQuizForm,
    updateQuestion,
    updateOption,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    resetQuizForm,
    activeQuestionIndex,
    setActiveQuestionIndex,
    userAnswers,
    setUserAnswer,
    clearUserAnswers,
    currentQuiz,
    setCurrentQuiz,
    setAnswerKeyMode,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};