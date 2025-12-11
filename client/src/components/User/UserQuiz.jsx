import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { useAuth } from "../../context/AuthContext";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FlagIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../services/quizService";
import { formatTime, decodeHTMLEntities } from "../../utils/helpers";
import { ButtonLoader } from "../Common/LoadingSpinner";

const UserQuiz = () => {
  const location = useLocation();
  const { detail } = location.state || {};
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timer, setTimer] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [startTime] = useState(new Date());

  const quizContainerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!detail) {
      navigate("/user");
      return;
    }

    // Calculate total quiz duration in seconds
    const quizDuration = (detail.quiz.duration || 30) * 60;
    setTimer(quizDuration);

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          handleTimeUp();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [detail, navigate]);

  const handleTimeUp = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setQuizOver(true);
    submitQuiz();
  }, []);

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleMarkQuestion = (questionIndex) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, detail.quiz.questions.length - 1));
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const submitQuiz = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000 / 60); // in minutes

      const markedOptions = detail.quiz.questions.map((question, index) => ({
        question: question._id,
        selectedOption: selectedOptions[question._id] || null,
      }));

      const response = await quizService.submitQuiz({
        userId: user.userId,
        quizId: detail.quiz._id,
        markedOptions,
        timeTaken,
      });

      if (response) {
        navigate("/quiz/submitted");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    submitQuiz();
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  if (!detail || quizOver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = detail.quiz.questions[currentQuestionIndex];
  const totalQuestions = detail.quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredQuestions = Object.keys(selectedOptions).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Quiz Header */}
      <div className="pt-16 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{detail.quiz.name}</h1>
              <p className="text-gray-600 text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span className="font-mono font-bold">{formatTime(timer)}</span>
              </div>
              
              <div className="hidden md:block">
                <div className="text-sm text-gray-600">Answered</div>
                <div className="font-semibold">{answeredQuestions}/{totalQuestions}</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FlagIcon className="h-5 w-5 text-blue-600 mr-2" />
                Questions
              </h3>
              
              <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
                {detail.quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`
                      h-10 w-10 rounded-lg flex items-center justify-center font-medium transition-all
                      ${index === currentQuestionIndex 
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                        : markedQuestions.has(index)
                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                          : selectedOptions[detail.quiz.questions[index]._id]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm">
                  <div className="h-3 w-3 bg-blue-600 rounded mr-2"></div>
                  <span className="text-gray-600">Current Question</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-3 w-3 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-3 w-3 bg-yellow-100 border-2 border-yellow-300 rounded mr-2"></div>
                  <span className="text-gray-600">Marked for Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Question and Options */}
          <div className="lg:col-span-2">
            <div ref={quizContainerRef} className="bg-white rounded-xl shadow-lg p-6">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.points || 1} point{currentQuestion.points !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <button
                  onClick={() => handleMarkQuestion(currentQuestionIndex)}
                  className={`flex items-center text-sm font-medium ${
                    markedQuestions.has(currentQuestionIndex)
                      ? 'text-yellow-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FlagIcon className="h-4 w-4 mr-1" />
                  {markedQuestions.has(currentQuestionIndex) ? 'Marked' : 'Mark'}
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {decodeHTMLEntities(currentQuestion.questionText)}
                </h2>
                
                {currentQuestion.questionType === 'short-answer' ? (
                  <div className="mt-4">
                    <textarea
                      value={selectedOptions[currentQuestion._id] || ''}
                      onChange={(e) => handleOptionSelect(currentQuestion._id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      rows="4"
                      placeholder="Type your answer here..."
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(currentQuestion._id, option)}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all
                          ${selectedOptions[currentQuestion._id] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <div className={`
                            h-5 w-5 rounded-full border mr-3 flex items-center justify-center flex-shrink-0
                            ${selectedOptions[currentQuestion._id] === option
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300'
                            }
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-900">{decodeHTMLEntities(option)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-2" />
                  Previous
                </button>
                
                <div className="flex gap-3">
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                      Next
                      <ChevronRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitClick}
                      disabled={submitting}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quiz Info and Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Timer Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Time Remaining</div>
                  <div className="text-3xl font-bold text-gray-900 font-mono">
                    {formatTime(timer)}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Quiz ends automatically
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Quiz Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Answered:</span>
                    <span className="font-medium text-green-600">{answeredQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-orange-600">{totalQuestions - answeredQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marked for Review:</span>
                    <span className="font-medium text-yellow-600">{markedQuestions.size}</span>
                  </div>
                </div>
              </div>

              {/* Submit Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Ready to Submit?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Make sure you've answered all questions before submitting.
                </p>
                <button
                  onClick={handleSubmitClick}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <ButtonLoader />
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                      Submit Quiz
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  You cannot change answers after submission
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Submit Quiz?
              </h3>
              <p className="text-gray-600">
                You have answered {answeredQuestions} out of {totalQuestions} questions.
                Are you sure you want to submit?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component
const ExclamationTriangleIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.643 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export default UserQuiz;