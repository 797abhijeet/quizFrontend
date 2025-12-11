import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { calculateRemainingTime, formatDateTime } from '../../utils/helpers';

const Instruction = () => {
  const location = useLocation();
  const { detail } = location.state || {};
  const navigate = useNavigate();

  if (!detail) {
    navigate('/user');
    return null;
  }

  const { quiz, userName } = detail;
  const remainingTime = calculateRemainingTime(quiz.endTime);

  const handleProceedClick = () => {
    navigate('/user/quiz', { state: { detail } });
  };

  const getQuizStatus = () => {
    const now = new Date();
    const start = new Date(quiz.startTime);
    const end = new Date(quiz.endTime);

    if (now < start) {
      return {
        status: 'Scheduled',
        color: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon,
        message: `Starts in ${Math.ceil((start - now) / (1000 * 60 * 60))} hours`,
      };
    } else if (now >= start && now <= end) {
      return {
        status: 'Active',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
        message: `Ends in ${Math.ceil((end - now) / (1000 * 60))} minutes`,
      };
    } else {
      return {
        status: 'Ended',
        color: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon,
        message: 'This quiz has ended',
      };
    }
  };

  const status = getQuizStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Quiz Instructions
            </h1>
            <p className="text-gray-600">
              Please read the instructions carefully before starting
            </p>
          </div>

          {/* Quiz Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{quiz.name}</h2>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
                  <status.icon className="h-4 w-4 mr-2" />
                  {status.status}
                </span>
                <span className="text-sm text-gray-500">{status.message}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quiz.questions?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quiz.duration} minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Participant</p>
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {userName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Available Until</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDateTime(quiz.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <LightBulbIcon className="h-6 w-6 text-yellow-600 mr-2" />
              Important Instructions
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Time Management</h3>
                    <p className="text-gray-600">
                      The quiz has a total duration of <strong>{quiz.duration} minutes</strong>.
                      You must complete all questions within this time frame.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Navigation</h3>
                    <p className="text-gray-600">
                      You can navigate between questions using the navigation panel.
                      Use the Previous and Next buttons to move between questions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Answer Submission</h3>
                    <p className="text-gray-600">
                      Click on the option to select your answer. You can change your answer
                      anytime before submitting the quiz.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 text-red-600 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Submission Rules</h3>
                    <p className="text-gray-600">
                      Once you submit the quiz, you cannot change your answers.
                      Make sure to review all questions before final submission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 text-yellow-600 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Technical Requirements</h3>
                    <p className="text-gray-600">
                      Ensure you have a stable internet connection throughout the quiz.
                      Do not refresh the page or navigate away during the quiz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Important Notice</h4>
                    <p className="text-yellow-700 text-sm">
                      The quiz will auto-submit when the time expires. Any unanswered
                      questions will be marked as incorrect. Make sure to submit your
                      answers before the time runs out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/user')}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              
              <button
                onClick={handleProceedClick}
                disabled={status.status === 'Ended'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {status.status === 'Ended' ? (
                  'Quiz Ended'
                ) : (
                  <>
                    Proceed to Quiz
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>

            {status.status === 'Ended' && (
              <div className="mt-4 text-center text-red-600 text-sm">
                This quiz is no longer available. Please contact your instructor.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instruction;