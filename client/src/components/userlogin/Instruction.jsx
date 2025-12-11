import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import BannerBackground from './home-banner-background.png';
import './Instruction.css'; // Import CSS file for styles

const Instruction = () => {
  const navigate = useNavigate();
  const [proceedClicked, setProceedClicked] = useState(false);
  const location = useLocation();
  const { detail } = location.state || {};

  const handleProceedClick = () => {
    const newDetail = detail;
    navigate('/quiz', { state: { newDetail } });
  };

  return (
    <div>
      <Header />
      <div className="instruction-container">
        <div className='instruction-content'>
          <div className="home-bannerImage-container">
            <img src={BannerBackground} alt="Banner" className="img" />
          </div>
          <h1>Quiz Instructions</h1>
          <p>
            Welcome to our Quiz App! Before you begin, please take note of the following:
          </p>
          <p>
            - Answer each question by selecting the best option.
            <br />
            - Each question has a time limit displayed.
            <br />
            - You can navigate between questions freely.
            <br />
            - Your progress is saved automatically.
            <br />
            - Review your answers before submitting.
            <br />
            - Once submitted, answers cannot be changed.
            <br />
            - Your score will be shown immediately.
            <br />
            - You'll receive feedback on correct and incorrect answers.
            <br />
            - Enjoy the quiz and good luck!
          </p>

          <div className="quiz-detail-user">
            {/* Placeholder for any relevant user details */}
          </div>

          {proceedClicked ? (
            <p>Proceed button clicked! Implement your custom logic here.</p>
          ) : (
            <button className="proceed-button" onClick={handleProceedClick}>Proceed to Quiz</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instruction;
