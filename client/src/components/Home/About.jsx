import React from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const teamMembers = [
    {
      name: 'Madhur Bajpai',
      role: 'Full Stack Developer',
      description: 'Backend architecture and API development',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Shantanu Aswal',
      role: 'Frontend Developer',
      description: 'UI/UX design and frontend implementation',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Abhijeet Saxena',
      role: 'DevOps Engineer',
      description: 'Infrastructure and deployment management',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000+', label: 'Quizzes Created' },
    { value: '1M+', label: 'Questions Answered' },
    { value: '4.8', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Quest Quiz
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're on a mission to make learning engaging, interactive, and accessible to everyone through the power of quizzes.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-6">
              <HeartIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              To create a platform where knowledge meets excitement, making learning 
              an enjoyable experience for students, professionals, and lifelong learners alike.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-100 rounded-full mb-4">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Educational Excellence
              </h3>
              <p className="text-gray-600">
                We believe in providing high-quality educational content that challenges 
                and enhances knowledge in meaningful ways.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-green-100 rounded-full mb-4">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Focus
              </h3>
              <p className="text-gray-600">
                Building a supportive community where learners can share knowledge, 
                compete healthily, and grow together.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-purple-100 rounded-full mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Innovation
              </h3>
              <p className="text-gray-600">
                Continuously improving our platform with cutting-edge features to 
                provide the best possible learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Quest Quiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-32 w-32 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-center">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-blue-100 text-xl mb-8">
            Start your learning journey today and be part of something amazing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;