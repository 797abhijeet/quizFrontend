import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import {
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  BoltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-blue-600" />,
      title: 'Interactive Quizzes',
      description: 'Engage with a wide variety of quizzes across different subjects and difficulty levels.',
      color: 'bg-blue-50',
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-green-600" />,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics and performance insights.',
      color: 'bg-green-50',
    },
    {
      icon: <TrophyIcon className="h-8 w-8 text-yellow-600" />,
      title: 'Leaderboards',
      description: 'Compete with others and climb the leaderboards to showcase your skills.',
      color: 'bg-yellow-50',
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-purple-600" />,
      title: 'Community Learning',
      description: 'Join a community of learners and share knowledge with peers.',
      color: 'bg-purple-50',
    },
    {
      icon: <BoltIcon className="h-8 w-8 text-orange-600" />,
      title: 'Quick Learning',
      description: 'Bite-sized quizzes for quick learning sessions anytime, anywhere.',
      color: 'bg-orange-50',
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-red-600" />,
      title: 'Secure Platform',
      description: 'Your data and progress are secured with industry-standard encryption.',
      color: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Engage Your Mind with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Quest Quiz
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Test your knowledge, challenge your friends, and climb the leaderboards with our 
            interactive quiz platform. Whether you're a student, professional, or trivia enthusiast, 
            we have something for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Quest Quiz?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need for an engaging learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Quiz Journey?
          </h2>
          <p className="text-blue-100 text-xl mb-8">
            Join thousands of users who are already enhancing their knowledge with Quest Quiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;