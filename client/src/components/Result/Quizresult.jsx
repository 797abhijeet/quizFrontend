/*import React, { useState } from 'react';
import './Result.css';
import Header from '../Header';

const Result = () => {
    const [answers, setAnswers] = useState([]);

    
    const questions = [
        { question: 'What is the capital of France?', correctAnswer: 'Paris' },
        { question: 'What is 2 + 2?', correctAnswer: '4' },
        { question: 'Which planet is known as the Red Planet?', correctAnswer: 'Mars' },
    ];

    const handleAnswer = (index, userAnswer) => {
        const newAnswers = [...answers];
        newAnswers[index] = userAnswer;
        setAnswers(newAnswers);
    };

    const calculateScore = () => {
        let score = 0;
        answers.forEach((userAnswer, index) => {
            if (userAnswer === questions[index].correctAnswer) {
                score += 1;
            }
        });
        return score;
    };

    return (
        <div>
            <Header />
            <div className="Result-container">
                <h1>Quiz App</h1>
                {questions.map((q, index) => (
                    <div key={index} className="question-container">
                        <p>{q.question}</p>
                        <div className="answer-options">
                            <button onClick={() => handleAnswer(index, q.correctAnswer)}>A. {q.correctAnswer}</button>
                            <button onClick={() => handleAnswer(index, 'wrong')}>B. Wrong Answer</button>
                        </div>
                    </div>
                ))}
                <div className="result-container">
                    <h2>Quiz Results</h2>
                    <p>Your score: {calculateScore()} out of {questions.length}</p>
                </div>
            </div>
        </div>
    );
}
*/
import React, { useState, useEffect } from 'react';
import './Result.css';
import Header from '../Header';

const Result = () => {
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // api
    fetch('api-endpoint')
      .then(response => response.json())
      .then(data => setQuizData(data))
      .catch(error => console.error('Error fetching quiz data:', error));
  }, []);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const { questions, userAnswers } = quizData;

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((userAnswer, index) => {
      if (userAnswer === questions[index].correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div>
      <Header />
      <div className="Result-container">
        <h1>Quiz App</h1>
        {questions.map((q, index) => (
          <div key={index} className="question-container">
            <p>{q.question}</p>
            <div className="answer-options">
              <p>Your Answer: {userAnswers[index]}</p>
              <p>Correct Answer: {q.correctAnswer}</p>
            </div>
          </div>
        ))}
        <div className="result-container">
          <h2>Quiz Results</h2>
          <p>Your score: {calculateScore()} out of {questions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Result;
