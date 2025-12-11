import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import {
  TrophyIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  UsersIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../services/quizService";
import { PageLoader } from "../Common/LoadingSpinner";
import { decodeHTMLEntities, calculateScore } from "../../utils/helpers";

const Result = () => {
  const location = useLocation();
  const { send } = location.state || {};
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (send?.userId && send?.quizId) {
      fetchResult();
    } else {
      navigate('/user');
    }
  }, [send]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await quizService.getResult(send.userId, send.quizId);
      
      if (response?.quizDetails) {
        setQuizData(response.quizDetails);
        
        // Calculate score
        const { score: calculatedScore, total, percentage } = calculateScore(
          response.quizDetails,
          response.quizDetails.map(q => q.userSelectedOption)
        );
        
        setScore({
          obtained: calculatedScore,
          total: total,
          percentage: percentage,
        });
      }
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeaderboard = () => {
    navigate("/quiz/leaderboard", { state: { quizId: send.quizId } });
  };

  const handleDownloadPDF = () => {
    // This would integrate with a PDF generation service
    alert("PDF download feature would be implemented here");
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding! 🎯";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 70) return "Very Good! 👍";
    if (percentage >= 60) return "Good! 💪";
    if (percentage >= 50) return "Average 📊";
    if (percentage >= 40) return "Needs Improvement 📈";
    return "Keep Practicing! 📚";
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!quizData || !score) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Result Found
          </h2>
          <button
            onClick={() => navigate('/user')}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/user')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Quiz Results
            </h1>
            <p className="text-gray-600">
              Review your performance and answers
            </p>
          </div>

          {/* Score Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {score.percentage}%
                </div>
                <div className={`text-lg font-semibold ${getScoreColor(score.percentage)}`}>
                  {getPerformanceMessage(score.percentage)}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-semibold">{score.obtained} / {score.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-semibold">
                    {score.obtained} out of {score.total} points
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold">
                    {Math.round((score.obtained / score.total) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleViewLeaderboard}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <UsersIcon className="h-5 w-5 mr-2" />
                  View Leaderboard
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download Result
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
              Detailed Results
            </h2>

            <div className="space-y-6">
              {quizData.map((question, index) => {
                const isCorrect = question.userSelectedOption === question.correctAnswer;
                const hasAnswer = question.userSelectedOption !== undefined && question.userSelectedOption !== null;
                
                return (
                  <div
                    key={index}
                    className={`border rounded-xl p-6 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50'
                        : hasAnswer
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full mr-3 ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <XCircleIcon className="h-5 w-5" />
                          )}
                        </span>
                        <span className="font-medium text-gray-900">
                          Question {index + 1}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {question.points || 1} point{question.points !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {decodeHTMLEntities(question.question)}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3 mb-4">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = option === question.userSelectedOption;
                        const isCorrectAnswer = option === question.correctAnswer;
                        
                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg flex items-center ${
                              isCorrectAnswer
                                ? 'bg-green-100 border border-green-200'
                                : isUserAnswer && !isCorrectAnswer
                                ? 'bg-red-100 border border-red-200'
                                : 'bg-gray-100'
                            }`}
                          >
                            <div className={`
                              h-6 w-6 rounded-full border mr-3 flex items-center justify-center flex-shrink-0
                              ${isCorrectAnswer ? 'border-green-500 bg-green-500 text-white' :
                                isUserAnswer && !isCorrectAnswer ? 'border-red-500 bg-red-500 text-white' :
                                'border-gray-300'}
                            `}>
                              {String.fromCharCode(65 + optIndex)}
                            </div>
                            <span className="flex-1">{decodeHTMLEntities(option)}</span>
                            
                            {isCorrectAnswer && (
                              <CheckCircleIcon className="h-5 w-5 text-green-600 ml-2" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircleIcon className="h-5 w-5 text-red-600 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Answer Status */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                      <div>
                        {hasAnswer ? (
                          <div className={`flex items-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? (
                              <>
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                <span>Correct! You earned {question.points || 1} point{question.points !== 1 ? 's' : ''}</span>
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="h-5 w-5 mr-2" />
                                <span>Incorrect. Your answer: {decodeHTMLEntities(question.userSelectedOption)}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600">
                            <XCircleIcon className="h-5 w-5 mr-2" />
                            <span>Not answered</span>
                          </div>
                        )}
                      </div>
                      
                      {!isCorrect && question.correctAnswer && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center text-green-800">
                            <TrophyIcon className="h-5 w-5 mr-2" />
                            <span>Correct answer: {decodeHTMLEntities(question.correctAnswer)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Areas of Strength</h3>
                <ul className="space-y-2">
                  {quizData
                    .filter(q => q.userSelectedOption === q.correctAnswer)
                    .slice(0, 3)
                    .map((q, i) => (
                      <li key={i} className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{decodeHTMLEntities(q.question).substring(0, 50)}...</span>
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {quizData
                    .filter(q => q.userSelectedOption !== q.correctAnswer && q.userSelectedOption)
                    .slice(0, 3)
                    .map((q, i) => (
                      <li key={i} className="flex items-center text-red-600">
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{decodeHTMLEntities(q.question).substring(0, 50)}...</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;