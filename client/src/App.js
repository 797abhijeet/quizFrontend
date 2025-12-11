import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { AdminRoute, UserRoute } from './components/Common/ProtectedRoute';

// Layout Components
import Header from './components/Layout/Header';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Home Components
import Home from './components/Home/Home';
import About from './components/Home/About';
import Contact from './components/Home/Contact';

// Admin Components
import AdminDashboard from './components/Admin/Dashboard';
import AdminQuizDetail from './components/Admin/QuizDetail';
import CustomQuiz from './components/Admin/CustomQuiz/CustomHome';
import RandomQuiz from './components/Admin/RandomQuiz/RandomHome';

// User Components
import UserDashboard from './components/User/Dashboard';
import QuizCode from './components/User/QuizCode';
import Instruction from './components/User/Instruction';
import UserQuiz from './components/User/UserQuiz';

// Quiz Components
import Result from './components/Quiz/Result';
import Submitted from './components/Quiz/Submitted';
import LeaderBoard from './components/Quiz/LeaderBoard';

// Tailwind CSS
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/custom-quiz"
              element={
                <AdminRoute>
                  <QuizProvider>
                    <CustomQuiz />
                  </QuizProvider>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/random-quiz"
              element={
                <AdminRoute>
                  <RandomQuiz />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quiz-detail"
              element={
                <AdminRoute>
                  <AdminQuizDetail />
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />
            <Route
              path="/user/quiz-code"
              element={
                <UserRoute>
                  <QuizCode />
                </UserRoute>
              }
            />
            <Route
              path="/user/instruction"
              element={
                <UserRoute>
                  <Instruction />
                </UserRoute>
              }
            />
            <Route
              path="/user/quiz"
              element={
                <UserRoute>
                  <UserQuiz />
                </UserRoute>
              }
            />

            {/* Quiz Result Routes */}
            <Route
              path="/quiz/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/submitted"
              element={
                <ProtectedRoute>
                  <Submitted />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/leaderboard"
              element={
                <ProtectedRoute>
                  <LeaderBoard />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;