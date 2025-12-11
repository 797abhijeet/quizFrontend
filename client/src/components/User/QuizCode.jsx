import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { useAuth } from "../../context/AuthContext";
import { 
  HashtagIcon, 
  ClockIcon, 
  TrophyIcon, 
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../services/quizService";
import { PageLoader } from "../Common/LoadingSpinner";
import { formatDate } from "../../utils/helpers";
import { validateQuizCode } from "../../utils/validation";

const QuizCode = () => {
  const [quizCode, setQuizCode] = useState("");
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAllHistory, setShowAllHistory] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) {
      fetchQuizHistory();
    }
  }, [user]);

  const fetchQuizHistory = async () => {
    try {
      const response = await quizService.getUserHistory(user.userId);
      if (response?.userHistory) {
        setQuizHistory(response.userHistory);
      }
    } catch (error) {
      console.error("Error fetching quiz history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    const validationError = validateQuizCode(quizCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await quizService.getQuiz(quizCode);
      
      if (response.status === 422) {
        setError("Quiz not found or not available");
        return;
      }

      if (response.quiz) {
        const detail = {
          userId: user.userId,
          userName: user.userName,
          quiz: response.quiz,
        };
        navigate("/user/instruction", { state: { detail } });
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      setError("Failed to start quiz. Please check the code and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewResult = (quizId) => {
    const send = { quizId, userId: user.userId };
    navigate("/quiz/result", { state: { send } });
  };

  const getRecentHistory = () => {
    const sortedHistory = [...quizHistory].sort((a, b) => 
      new Date(b.date || 0) - new Date(a.date || 0)
    );
    return showAllHistory ? sortedHistory : sortedHistory.slice(0, 3);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{user?.userName}</span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Enter a quiz code to start a new challenge or review your previous attempts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Quiz Code Entry */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quiz Code Entry Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <HashtagIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Enter Quiz Code</h2>
                    <p className="text-gray-600 text-sm">Get the code from your instructor</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={quizCode}
                        onChange={(e) => {
                          setQuizCode(e.target.value.toUpperCase());
                          setError("");
                        }}
                        className={`w-full px-4 py-3 pl-12 text-lg font-mono border ${
                          error ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                        placeholder="e.g., ABCD1234"
                        maxLength="8"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <HashtagIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        {quizCode.length}/8
                      </div>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    disabled={submitting || quizCode.length < 4}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading Quiz...
                      </div>
                    ) : (
                      <>
                        Start Quiz
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have a code? Ask your instructor or check your email
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {quizHistory.filter(q => q.score !== "Not available").length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {quizHistory.filter(q => q.score === "Not available").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {quizHistory.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>

            {/* Right Column - Recent History */}
            <div className="space-y-8">
              {/* Recent History Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <ClockIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Recent History</h2>
                      <p className="text-gray-600 text-sm">Your latest attempts</p>
                    </div>
                  </div>
                  {quizHistory.length > 3 && (
                    <button
                      onClick={() => setShowAllHistory(!showAllHistory)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {showAllHistory ? "Show Less" : "Show All"}
                    </button>
                  )}
                </div>

                {quizHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No quiz history yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getRecentHistory().map((quiz, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900 truncate">
                              {quiz.quizName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {quiz.date ? formatDate(quiz.date) : "N/A"}
                            </div>
                          </div>
                          {quiz.score !== "Not available" && (
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(quiz.score)}`}>
                              {quiz.score}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {quiz.duration} min
                          </div>
                          
                          {quiz.score !== "Not available" && quiz.quizId ? (
                            <button
                              onClick={() => handleViewResult(quiz.quizId)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </button>
                          ) : (
                            <span className="text-yellow-600 text-sm font-medium flex items-center">
                              <EyeSlashIcon className="h-4 w-4 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {quizHistory.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => navigate("/user")}
                      className="w-full text-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Full History →
                    </button>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrophyIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Quiz Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </div>
                    <span>Make sure you have a stable internet connection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </div>
                    <span>Read questions carefully before answering</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </div>
                    <span>Manage your time wisely during the quiz</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                      4
                    </div>
                    <span>Review your answers before submitting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCode;