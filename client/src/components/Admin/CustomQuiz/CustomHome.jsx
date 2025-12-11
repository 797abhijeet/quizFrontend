import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header";
import Forms from "./Forms";
import { useQuiz } from "../../../context/QuizContext";
import { useAuth } from "../../../context/AuthContext";
import {
  DocumentDuplicateIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../../services/quizService";
import { validateQuizForm } from "../../../utils/validation";
import { ButtonLoader } from "../../Common/LoadingSpinner";

const CustomHome = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [isGetCode, setIsGetCode] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { quizForm, updateQuizForm, resetQuizForm } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  const quizCodeRef = useRef(null);

  const copyQuizCodeToClipboard = useCallback(() => {
    if (quizId) {
      quizCodeRef.current?.select();
      document.execCommand("copy");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [quizId]);

  const toggleGetCode = () => {
    setIsGetCode(!isGetCode);
    if (!isGetCode) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleInputChange = (field, value) => {
    updateQuizForm({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const createQuiz = async () => {
    // Validate form
    const validation = validateQuizForm(quizForm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      alert("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    try {
      const response = await quizService.createQuiz({
        name: quizForm.name,
        description: quizForm.description,
        dateCreated: new Date(),
        startTime: quizForm.startTime,
        endTime: quizForm.endTime,
        duration: parseInt(quizForm.duration),
        createdBy: user.adminId,
        attemptedBy: [],
        questions: quizForm.questions.map((ques) => ({
          questionText: ques.questionText,
          questionType: ques.questionType,
          options: ques.options.map((op) => op.optionText),
          correctAnswer:
            ques.questionType === "short-answer" ? "" : ques.answerKey,
          marks: ques.points || 1,
        })),
      });

      if (response?.quizId) {
        setIsCreated(true);
        setQuizId(response.quizId);
        alert("Quiz created successfully!");
        resetQuizForm();
      } else {
        throw new Error("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createAnotherQuiz = () => {
    setIsCreated(false);
    setIsGetCode(false);
    setQuizId("");
    setErrors({});
    resetQuizForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create Custom Quiz
            </h1>
            <p className="text-gray-600">
              Design your own quiz with custom questions and full control
            </p>
          </div>

          {/* Quiz Information Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
              Quiz Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quiz Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Name *
                </label>
                <input
                  type="text"
                  value={quizForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                  placeholder="Enter quiz name"
                  required
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={quizForm.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    min="1"
                    className={`w-full px-4 py-3 pl-12 border ${
                      errors.duration ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    placeholder="Enter duration"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.duration && (
                  <p className="mt-2 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={quizForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter quiz description (optional)"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={quizForm.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    className={`w-full px-4 py-3 pl-12 border ${
                      errors.startTime ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.startTime && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={quizForm.endTime}
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                    className={`w-full px-4 py-3 pl-12 border ${
                      errors.endTime ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.endTime && (
                  <p className="mt-2 text-sm text-red-600">{errors.endTime}</p>
                )}
                {quizForm.startTime &&
                  quizForm.endTime &&
                  new Date(quizForm.endTime) <=
                    new Date(quizForm.startTime) && (
                    <p className="mt-2 text-sm text-yellow-600">
                      End time must be after start time
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <Forms />
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isCreated ? (
                <button
                  onClick={createQuiz}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <ButtonLoader />
                  ) : (
                    <>
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Create Quiz
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleGetCode}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center"
                  >
                    <HashtagIcon className="h-5 w-5 mr-2" />
                    {isGetCode ? "Hide Quiz Code" : "Get Quiz Code"}
                  </button>

                  <button
                    onClick={createAnotherQuiz}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all flex items-center"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Create Another Quiz
                  </button>
                </>
              )}
            </div>

            {/* Quiz Code Display */}
            {isCreated && isGetCode && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <HashtagIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Quiz Code Generated Successfully!
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share this code with participants:
                    </label>
                    <div className="relative">
                      <input
                        ref={quizCodeRef}
                        type="text"
                        value={quizId}
                        readOnly
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-center font-mono text-lg font-bold"
                      />
                      // In the copy button, replace:
                      <button
                        onClick={copyQuizCodeToClipboard}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                        title="Copy to clipboard"
                      >
                        {isCopied ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <div className="h-6 w-6" />
                        )}
                      </button>
                      <button
                        onClick={copyQuizCodeToClipboard}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                        title="Copy to clipboard"
                      >
                        {isCopied ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <DocumentDuplicateIcon className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Participants can use this code to join your quiz
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate("/admin")}
                      className="bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/quiz-detail`, {
                          state: { quizId, adminId: user.adminId },
                        })
                      }
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Quiz Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-blue-600">
                {quizForm.questions.length}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {quizForm.questions.reduce(
                  (total, q) => total + (q.points || 1),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-purple-600">
                {quizForm.duration || 0}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const PlusCircleIcon = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default CustomHome;
