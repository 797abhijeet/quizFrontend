import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalculatorIcon,
  EyeIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../services/quizService";
import { PageLoader, ButtonLoader } from "../Common/LoadingSpinner";
import { formatDate, formatDateTime, decodeHTMLEntities } from "../../utils/helpers";

const AdminQuizDetail = () => {
  const location = useLocation();
  const { quizId, adminId } = location.state || {};
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [isResultPublished, setIsResultPublished] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (quizId && adminId) {
      fetchQuizDetails();
      checkResultPublished();
    } else {
      navigate('/admin');
    }
  }, [quizId, adminId]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const [quizData, userHistoryData] = await Promise.all([
        quizService.getQuiz(quizId),
        quizService.getAdminUserHistory(quizId),
      ]);

      if (quizData.quiz) {
        setQuiz(quizData.quiz);
      }

      if (userHistoryData.result) {
        const history = userHistoryData.result;
        setUserHistory(history);
        setIsChecked(new Array(history.length).fill(true));
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkResultPublished = async () => {
    try {
      const response = await quizService.checkResultPublished(adminId, quizId);
      if (response.isresultPublished !== undefined) {
        setIsResultPublished(response.isresultPublished);
      }
    } catch (error) {
      console.error("Error checking result published status:", error);
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isChecked];
    newCheckedState[index] = !newCheckedState[index];
    setIsChecked(newCheckedState);
  };

  const handleCalculateScore = async () => {
    try {
      setCalculating(true);
      const response = await quizService.calculateScore(quizId);
      if (response) {
        alert("Scores calculated successfully!");
        fetchQuizDetails(); // Refresh data
      }
    } catch (error) {
      console.error("Error calculating scores:", error);
      alert("Failed to calculate scores. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const handlePublishResult = async () => {
    if (!window.confirm("Are you sure you want to publish results? This action cannot be undone.")) {
      return;
    }

    try {
      setPublishing(true);
      const userIds = userHistory.map((user, i) => ({
        userId: user._id,
        isAllowedToViewResult: isChecked[i],
      }));

      const response = await quizService.publishResult(adminId, userIds, quizId);
      if (response) {
        setIsResultPublished(true);
        alert("Results published successfully!");
      }
    } catch (error) {
      console.error("Error publishing results:", error);
      alert("Failed to publish results. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (loading || !quiz) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{quiz.name}</h1>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {quiz.questions?.length || 0} Questions
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {quiz.duration} Minutes
                </span>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                  {userHistory.length} Attempts
                </span>
              </div>
            </div>
          </div>

          {/* Quiz Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Start Time</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDateTime(quiz.startTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">End Time</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDateTime(quiz.endTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Created On</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(quiz.dateCreated)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Questions</h2>
            
            <div className="space-y-6">
              {quiz.questions?.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                          Q{index + 1}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                          {question.questionType}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {decodeHTMLEntities(question.questionText)}
                      </h3>
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {question.points || 1} points
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {question.options?.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center p-3 rounded-lg ${
                          option === question.correctAnswer
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                          option === question.correctAnswer
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                        <span className="flex-1">{decodeHTMLEntities(option)}</span>
                        {option === question.correctAnswer && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>

                  {question.correctAnswer && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">Correct Answer:</span>
                        <span className="ml-2 text-green-700">{decodeHTMLEntities(question.correctAnswer)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Attempts Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Attempts</h2>
                <p className="text-gray-600 mt-1">
                  Manage user results and publishing settings
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <button
                  onClick={handleCalculateScore}
                  disabled={calculating || userHistory.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {calculating ? (
                    <ButtonLoader />
                  ) : (
                    <>
                      <CalculatorIcon className="h-5 w-5 mr-2" />
                      Calculate Scores
                    </>
                  )}
                </button>
                
                {!isResultPublished && (
                  <button
                    onClick={handlePublishResult}
                    disabled={publishing || userHistory.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {publishing ? (
                      <ButtonLoader />
                    ) : (
                      <>
                        <EyeIcon className="h-5 w-5 mr-2" />
                        Publish Results
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {isResultPublished && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Results are published</span>
                </div>
              </div>
            )}

            {userHistory.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No attempts yet
                </h3>
                <p className="text-gray-500">
                  Users haven't attempted this quiz yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Taken
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View Result
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userHistory.map((userAttempt, index) => (
                      <tr key={userAttempt._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {userAttempt.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {userAttempt.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {userAttempt.timeTaken || 'N/A'} mins
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-lg font-bold ${getScoreColor(userAttempt.score || 0, quiz.questions?.length || 1)}`}>
                            {userAttempt.score || 'Not calculated'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {!isResultPublished ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked[index]}
                                onChange={() => handleCheckboxChange(index)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Allow</span>
                            </label>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              isChecked[index] 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isChecked[index] ? (
                                <>
                                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                                  Allowed
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="h-4 w-4 mr-1" />
                                  Restricted
                                </>
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizDetail;