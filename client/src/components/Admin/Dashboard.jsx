import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';
import { 
  EyeIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  SparklesIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { quizService } from '../../services/quizService';
import { PageLoader } from '../Common/LoadingSpinner';
import { formatDate, calculateRemainingTime, formatTime } from '../../utils/helpers';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    activeQuizzes: 0,
    averageScore: 0,
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.quizIds) {
      fetchQuizzes();
    }
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzesByAdmin(user.quizIds);
      const quizzesData = data.quizzes || [];
      setQuizzes(quizzesData);

      // Calculate stats
      const totalAttempts = quizzesData.reduce((sum, quiz) => sum + (quiz.attemptedBy?.length || 0), 0);
      const activeQuizzes = quizzesData.filter(quiz => {
        const endTime = new Date(quiz.endTime);
        return endTime > new Date();
      }).length;

      setStats({
        totalQuizzes: quizzesData.length,
        totalAttempts,
        activeQuizzes,
        averageScore: quizzesData.length > 0 ? Math.round(totalAttempts / quizzesData.length) : 0,
      });
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId, quizName) => {
    if (window.confirm(`Are you sure you want to delete "${quizName}"? This action cannot be undone.`)) {
      try {
        await quizService.deleteQuiz(quizId);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        // Update stats
        setStats(prev => ({
          ...prev,
          totalQuizzes: prev.totalQuizzes - 1,
        }));
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz. Please try again.');
      }
    }
  };

  const handleViewQuiz = (quizId) => {
    navigate('/admin/quiz-detail', { state: { quizId, adminId: user.adminId } });
  };

  const getQuizStatus = (quiz) => {
    const now = new Date();
    const start = new Date(quiz.startTime);
    const end = new Date(quiz.endTime);

    if (now < start) {
      return {
        label: 'Scheduled',
        color: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon,
      };
    } else if (now >= start && now <= end) {
      return {
        label: 'Active',
        color: 'bg-green-100 text-green-800',
        icon: ClockIcon,
      };
    } else {
      return {
        label: 'Ended',
        color: 'bg-gray-100 text-gray-800',
        icon: ClockIcon,
      };
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">{user?.adminName}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your quizzes, track performance, and create new challenges
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Quizzes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeQuizzes}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Attempts/Quiz</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageScore}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div 
              onClick={() => navigate('/admin/custom-quiz')}
              className="group bg-white rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-blue-300 cursor-pointer transition-all hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                  <PlusCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Create Custom Quiz</h3>
                  <p className="text-gray-600 text-sm">Design your own quiz with full control</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-blue-600 text-sm">
                <span>Start creating</span>
                <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/random-quiz')}
              className="group bg-white rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-purple-300 cursor-pointer transition-all hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors">
                  <SparklesIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Create Random Quiz</h3>
                  <p className="text-gray-600 text-sm">Generate quiz from thousands of questions</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-purple-600 text-sm">
                <span>Try it now</span>
                <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quiz History */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Quizzes</h2>
                <p className="text-gray-600 mt-1">Manage and view all your created quizzes</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  {quizzes.length} quizzes
                </span>
              </div>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <PlusCircleIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No quizzes yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first quiz to get started
                </p>
                <button
                  onClick={() => navigate('/admin/custom-quiz')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Your First Quiz
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizzes.map((quiz) => {
                      const status = getQuizStatus(quiz);
                      const StatusIcon = status.icon;
                      
                      return (
                        <tr 
                          key={quiz._id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleViewQuiz(quiz._id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {quiz.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Created {formatDate(quiz.dateCreated)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {quiz.duration} mins
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {quiz.attemptedBy?.length || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewQuiz(quiz._id);
                                }}
                                className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                                title="View Details"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuiz(quiz._id, quiz.name);
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors p-1"
                                title="Delete Quiz"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default AdminDashboard;