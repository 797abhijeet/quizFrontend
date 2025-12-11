import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { useAuth } from "../../context/AuthContext";
import {
  HashtagIcon,
  ClockIcon,
  TrophyIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../services/quizService";
import { PageLoader } from "../Common/LoadingSpinner";
import { formatDate, calculateScore } from "../../utils/helpers";
import { validateQuizCode } from "../../utils/validation";

const UserDashboard = () => {
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
      setLoading(true);
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

  const handleViewResult = async (quizId) => {
    try {
      const send = { quizId: quizId, userId: user.userId };
      navigate("/quiz/result", { state: { send } });
    } catch (error) {
      console.error("Error viewing result:", error);
    }
  };

  const getRecentHistory = () => {
    const sortedHistory = [...quizHistory].sort((a, b) => 
      new Date(b.date || 0) - new Date(a.date || 0)
    );
    return showAllHistory ? sortedHistory : sortedHistory.slice(0, 5);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">{user?.userName}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Ready for your next challenge? Enter a quiz code or explore your history.
            </p>
          </div>

          {/* Quiz Code Entry */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <HashtagIcon className="h-6 w-6 text-blue-600 mr-2" />
              Enter Quiz Code
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={quizCode}
                    onChange={(e) => {
                      setQuizCode(e.target.value);
                      setError("");
                    }}
                    className={`w-full px-4 py-3 pl-12 border ${
                      error ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    placeholder="Enter the quiz code provided by your instructor"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <HashtagIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={submitting || !quizCode.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </div>
                ) : (
                  <>
                    Start Quiz
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {quizHistory.filter(q => q.score !== "Not available").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-2xl font-bold text-green-600">
                  {quizHistory.filter(q => q.score === "Not available").length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {quizHistory.length}
                </div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
            </div>
          </div>

          {/* Quiz History */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Quiz History</h2>
                <p className="text-gray-600 mt-1">Track your progress and results</p>
              </div>
              
              {quizHistory.length > 5 && (
                <button
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="mt-4 sm:mt-0 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  {showAllHistory ? (
                    <>
                      <EyeSlashIcon className="h-5 w-5 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Show All ({quizHistory.length})
                    </>
                  )}
                </button>
              )}
            </div>

            {quizHistory.length === 0 ? (
              <div className="text-center py-12">
                <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No quiz history yet
                </h3>
                <p className="text-gray-500">
                  Enter a quiz code above to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getRecentHistory().map((quiz, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                            {quiz.quizName}
                          </div>
                          {quiz.score === "Not available" ? (
                            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                              Results Pending
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center">
                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium">{quiz.duration} minutes</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600">Attempted</p>
                              <p className="font-medium">
                                {quiz.date ? formatDate(quiz.date) : "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <TrophyIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600">Score</p>
                              <p className={`font-bold ${getScoreColor(quiz.score)}`}>
                                {quiz.score === "Not available" ? "Pending" : `${quiz.score}%`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {quiz.score !== "Not available" && quiz.quizId ? (
                          <button
                            onClick={() => handleViewResult(quiz.quizId)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                          >
                            <EyeIcon className="h-5 w-5 mr-2" />
                            View Result
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-200 text-gray-500 px-6 py-2 rounded-lg font-medium cursor-not-allowed flex items-center"
                          >
                            <ClockIcon className="h-5 w-5 mr-2" />
                            Results Pending
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {quizHistory.length > 0 && quizHistory.some(q => q.score !== "Not available") && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        quizHistory
                          .filter(q => q.score !== "Not available")
                          .reduce((acc, q) => acc + q.score, 0) /
                          Math.max(1, quizHistory.filter(q => q.score !== "Not available").length)
                      )}
                      %
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Quizzes Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {quizHistory.filter(q => q.score !== "Not available").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Total Time Spent</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {quizHistory.reduce((acc, q) => acc + (q.duration || 0), 0)} min
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;