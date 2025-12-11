import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import {
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  ArrowLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

const Submitted = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/user');
  };

  const handleViewLeaderboard = () => {
    // This would navigate to leaderboard if we had quiz context
    alert('Leaderboard would be shown here');
  };

  const handleShareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Completed!',
        text: 'I just completed a quiz on Quest Quiz!',
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText('I just completed a quiz on Quest Quiz!');
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <CheckCircleIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Quiz Submitted!</h1>
              <p className="text-green-100 text-lg">
                Your answers have been successfully submitted
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-24 w-24 bg-green-100 rounded-full mb-6">
                  <TrophyIcon className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You for Participating!
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Your quiz has been submitted successfully. Results will be available 
                  once they are published by your instructor. You'll be notified when 
                  results are ready.
                </p>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-100 rounded-full mb-4">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
                  <p className="text-gray-600 text-sm">
                    Results typically take 24-48 hours to process
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-purple-100 rounded-full mb-4">
                    <TrophyIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Check Back Soon</h3>
                  <p className="text-gray-600 text-sm">
                    Visit your dashboard to see results when available
                  </p>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-orange-100 rounded-full mb-4">
                    <ShareIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Share Your Experience</h3>
                  <p className="text-gray-600 text-sm">
                    Let others know about your quiz experience
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGoBack}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                
                <button
                  onClick={handleViewLeaderboard}
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <TrophyIcon className="h-5 w-5 mr-2" />
                  View Leaderboard
                </button>
                
                <button
                  onClick={handleShareResult}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share Result
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t text-center">
                <p className="text-gray-600">
                  Need help? Contact support at{' '}
                  <a href="mailto:support@questquiz.com" className="text-blue-600 hover:text-blue-800">
                    support@questquiz.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Check Your Dashboard</h4>
                  <p className="text-gray-600 text-sm">
                    Visit your dashboard regularly to see when results are published
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Take More Quizzes</h4>
                  <p className="text-gray-600 text-sm">
                    Explore other available quizzes to improve your skills
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 text-purple-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Review Your Performance</h4>
                  <p className="text-gray-600 text-sm">
                    Once results are available, review your answers to learn from mistakes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submitted;