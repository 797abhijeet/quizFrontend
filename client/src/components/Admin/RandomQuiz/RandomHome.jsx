import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header";
import { useAuth } from "../../../context/AuthContext";
import {
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
  HashtagIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../../services/quizService";
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS, QUESTION_TYPES } from "../../../utils/constants";
import { decodeHTMLEntities, shuffleArray } from "../../../utils/helpers";
import { ButtonLoader } from "../../Common/LoadingSpinner";

const RandomHome = () => {
  const [questions, setQuestions] = useState([]);
  const [quizData, setQuizData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: "",
  });
  const [quizSettings, setQuizSettings] = useState({
    noq: 10,
    category: "",
    difficulty: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [errors, setErrors] = useState({});

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSettingsChange = (field, value) => {
    setQuizSettings(prev => ({ ...prev, [field]: value }));
  };

  const fetchQuestions = async () => {
    if (!quizSettings.noq || quizSettings.noq < 1 || quizSettings.noq > 50) {
      alert("Number of questions must be between 1 and 50");
      return;
    }

    setLoading(true);
    try {
      const data = await quizService.fetchOpenTDBQuestions(
        quizSettings.noq,
        quizSettings.category,
        quizSettings.difficulty,
        quizSettings.type
      );

      if (data.results && data.results.length > 0) {
        setQuestions(data.results);
        setGenerated(true);
      } else {
        alert("No questions found with the selected criteria. Please try different settings.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!quizData.name.trim()) newErrors.name = "Quiz name is required";
    if (!quizData.startTime) newErrors.startTime = "Start time is required";
    if (!quizData.endTime) newErrors.endTime = "End time is required";
    if (!quizData.duration || quizData.duration < 1) newErrors.duration = "Valid duration is required";

    if (quizData.startTime && quizData.endTime) {
      const start = new Date(quizData.startTime);
      const end = new Date(quizData.endTime);
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (questions.length === 0) {
      newErrors.questions = "Please generate questions first";
    }

    return newErrors;
  };

  const saveQuiz = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert("Please fix the errors before saving.");
      return;
    }

    setSaving(true);
    try {
      const formattedQuestions = questions.map((question) => ({
        questionText: decodeHTMLEntities(question.question),
        questionType: question.type === "multiple" ? "multiple-choice" : "true-false",
        options: shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
        ]).map(decodeHTMLEntities),
        correctAnswer: decodeHTMLEntities(question.correct_answer),
        marks: 1,
      }));

      const response = await quizService.createQuiz({
        name: quizData.name,
        description: quizData.description,
        dateCreated: new Date(),
        startTime: quizData.startTime,
        endTime: quizData.endTime,
        duration: parseInt(quizData.duration),
        createdBy: user.adminId,
        attemptedBy: [],
        questions: formattedQuestions,
      });

      if (response?.quizId) {
        setQuizId(response.quizId);
        alert("Quiz saved successfully!");
        setShowCode(true);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copyQuizCode = () => {
    if (quizId) {
      navigator.clipboard.writeText(quizId);
      alert("Quiz code copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create Random Quiz
            </h1>
            <p className="text-gray-600">
              Generate quizzes automatically from thousands of questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-8">
              {/* Quiz Details Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                  Quiz Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Name *
                    </label>
                    <input
                      type="text"
                      value={quizData.name}
                      onChange={(e) => handleQuizDataChange("name", e.target.value)}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors`}
                      placeholder="Enter quiz name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={quizData.description}
                      onChange={(e) => handleQuizDataChange("description", e.target.value)}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      placeholder="Enter quiz description (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={quizData.startTime}
                          onChange={(e) => handleQuizDataChange("startTime", e.target.value)}
                          className={`w-full px-4 py-3 pl-12 border ${errors.startTime ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors`}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.startTime && (
                        <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time *
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={quizData.endTime}
                          onChange={(e) => handleQuizDataChange("endTime", e.target.value)}
                          className={`w-full px-4 py-3 pl-12 border ${errors.endTime ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors`}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.endTime && (
                        <p className="mt-2 text-sm text-red-600">{errors.endTime}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={quizData.duration}
                        onChange={(e) => handleQuizDataChange("duration", e.target.value)}
                        min="1"
                        className={`w-full px-4 py-3 pl-12 border ${errors.duration ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors`}
                        placeholder="Enter duration"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.duration && (
                      <p className="mt-2 text-sm text-red-600">{errors.duration}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Settings Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                  Question Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions (1-50)
                    </label>
                    <input
                      type="number"
                      value={quizSettings.noq}
                      onChange={(e) => handleSettingsChange("noq", Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                      min="1"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={quizSettings.category}
                      onChange={(e) => handleSettingsChange("category", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    >
                      {QUIZ_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={quizSettings.difficulty}
                      onChange={(e) => handleSettingsChange("difficulty", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    >
                      {DIFFICULTY_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={quizSettings.type}
                      onChange={(e) => handleSettingsChange("type", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    >
                      {QUESTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={fetchQuestions}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <ButtonLoader />
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview and Actions */}
            <div className="space-y-8">
              {/* Preview Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-green-600 mr-2" />
                  Questions Preview
                </h2>

                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No questions yet
                    </h3>
                    <p className="text-gray-500">
                      Generate questions to see preview here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start mb-3">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-2">
                            Q{index + 1}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
                            {question.difficulty}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          {decodeHTMLEntities(question.question)}
                        </h4>
                        <div className="space-y-2">
                          {question.type === "multiple" ? (
                            <>
                              <div className="flex items-center">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm text-green-700">
                                  {decodeHTMLEntities(question.correct_answer)}
                                </span>
                              </div>
                              {question.incorrect_answers.map((answer, i) => (
                                <div key={i} className="flex items-center">
                                  <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    {decodeHTMLEntities(answer)}
                                  </span>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              <div className="flex items-center">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm text-green-700">
                                  {decodeHTMLEntities(question.correct_answer)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {decodeHTMLEntities(question.incorrect_answers[0])}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Actions
                </h2>

                <div className="space-y-4">
                  {generated && questions.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium text-green-800">
                            {questions.length} questions generated successfully!
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            Ready to save your quiz
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.questions && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-700">{errors.questions}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={saveQuiz}
                      disabled={saving || questions.length === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {saving ? (
                        <ButtonLoader />
                      ) : (
                        <>
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          Save Quiz
                        </>
                      )}
                    </button>

                    {showCode && quizId && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <HashtagIcon className="h-5 w-5 text-purple-600 mr-2" />
                          Quiz Code Generated!
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3">
                            <code className="font-mono text-lg font-bold text-purple-600">
                              {quizId}
                            </code>
                          </div>
                          <button
                            onClick={copyQuizCode}
                            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Share this code with participants
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomHome;