import React from 'react';
import {
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  RadioIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useQuiz } from '../../../context/QuizContext';

const Forms = () => {
  const {
    quizForm,
    updateQuestion,
    updateOption,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    setAnswerKeyMode,
  } = useQuiz();

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'multiple-choice':
        return <RadioIcon className="h-5 w-5 text-blue-600" />;
      case 'true-false':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'short-answer':
        return <DocumentTextIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <RadioIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const renderQuestion = (question, index) => {
    const isAnswerKeyMode = question.answer;

    if (isAnswerKeyMode) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-blue-200 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 mb-6 text-center">
            <h3 className="text-lg font-semibold flex items-center justify-center">
              <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
              Choose Correct Answer for Question {index + 1}
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={question.questionText}
              disabled
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              placeholder="Question text"
            />
            <input
              type="number"
              value={question.points}
              min="0"
              step="1"
              onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 0 })}
              className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Points"
            />
          </div>

          <div className="space-y-3 mb-6">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-3 group">
                <button
                  type="button"
                  onClick={() => {
                    updateQuestion(index, { answerKey: option.optionText });
                  }}
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    question.answerKey === option.optionText
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  title="Select as correct answer"
                >
                  {question.answerKey === option.optionText && (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="text"
                  value={option.optionText}
                  disabled
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              {question.answerKey ? (
                <span className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Correct answer selected
                </span>
              ) : (
                <span className="text-yellow-600">Select correct answer above</span>
              )}
            </div>
            <button
              onClick={() => setAnswerKeyMode(index, false)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 animate-slide-up">
        {/* Question Header */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start lg:items-center">
          <div className="flex items-center gap-3 flex-1">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Q{index + 1}
            </span>
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your question"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {getQuestionTypeIcon(question.questionType)}
            </div>
            <select
              value={question.questionType}
              onChange={(e) => updateQuestion(index, { questionType: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-3 group">
              {question.questionType === 'multiple-choice' || question.questionType === 'true-false' ? (
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {String.fromCharCode(65 + optionIndex)}
                </div>
              ) : null}
              
              <input
                type="text"
                value={option.optionText}
                onChange={(e) => updateOption(index, optionIndex, { optionText: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter option text"
              />
              
              <button
                type="button"
                onClick={() => removeOption(index, optionIndex)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove option"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Option Button */}
        {question.options.length < 5 && question.questionType !== 'true-false' && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => addOption(index)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Add Option
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAnswerKeyMode(index, true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <DocumentDuplicateIcon className="h-5 w-5" />
              Set Answer Key
            </button>
            
            <div className="text-sm text-gray-600">
              {question.questionType === 'true-false' && (
                <span className="text-yellow-600">Auto options: True, False</span>
              )}
              {question.questionType === 'short-answer' && (
                <span className="text-purple-600">Short answer type</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addQuestion(index)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              title="Add Question After This"
            >
              <PlusCircleIcon className="h-5 w-5" />
            </button>
            {quizForm.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Question"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quiz Questions ({quizForm.questions.length})
          </h2>
          <p className="text-gray-600">
            Add and customize your quiz questions below. Click "Set Answer Key" to mark correct answers.
          </p>
        </div>
        
        <div className="space-y-6">
          {quizForm.questions.map((question, index) => (
            <div key={index}>
              {renderQuestion(question, index)}
            </div>
          ))}
        </div>

        {/* Add First Question Button (if no questions) */}
        {quizForm.questions.length === 0 && (
          <div className="text-center py-12">
            <button
              type="button"
              onClick={() => addQuestion(0)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 inline mr-2" />
              Add First Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forms;