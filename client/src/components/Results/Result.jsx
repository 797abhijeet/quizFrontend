import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import BannerBackground from "./home-banner-background.png";
import "./Result.css";
import LeaderBoard from "./LeaderBoard";

const Result = () => {
  const [quizData, setQuizData] = useState([]);
  const location = useLocation();
  const { send } = location.state || {};
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
 
  useEffect(() => {
    if (send && send.userId && send.quizId) {
      getResult();
    }
  }, [send]);

  const getResult = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get-result", {
        userId: send.userId,
        quizId: send.quizId,
      });
      if (response.data.quizDetails) {
        setQuizData(response.data.quizDetails);
      } else {
        console.log("No quiz details found in response");
      }
    } catch (error) {
      console.log("Error fetching quiz result:", error);
    }
  };

  const getLeaderBoard = () => {
    const quiz = { quizId: send.quizId };
    navigate("/leaderboard", { state: { quiz } });
  };

  return (
    <div>
      <Header />
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="Banner" className="img" />
      </div>
      <div className="Result-container">
        <h1>Quiz Result</h1>
        <div className="show-quest">
          {quizData.length !== 0 ? (
            quizData.map((question, index) => (
              <div className="question-sec" key={index}>
                <div>
                  {index + 1}. {question.question}
                </div>
                <div className="options-multiple">
                  {question.options.map((option, idx) => (
                    <div key={idx}>
                      <input type="radio" disabled />
                      {option}
                    </div>
                  ))}
                </div>
                <div>Correct Answer: {question.correctAnswer}</div>
                <div>Marked Answer: {question.userSelectedOption}</div>
              </div>
            ))
          ) : (
            <div>Nothing to show</div>
          )}
        </div>
      </div>
      <button onClick={getLeaderBoard}>Leaderboard</button>
    </div>
  );
};

export default Result;
