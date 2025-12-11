import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./AdminQuizDetail.css";
import BannerBackground from "./home-banner-background.png";
import Header from "./Header";
import Login from "./LoginRegister/Login";
import axios from "axios";

const AdminQuizDetail = () => {
  const location = useLocation();
  const { detail } = location.state || {};

  const [isResultPublished, setIsResultPublished] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (detail && detail.quiz) {
      getHistory();
      checkResultPublished();
      setIsChecked(new Array(detail.quiz.attemptedBy.length).fill(true));
    }
  }, [detail]);

  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isChecked];
    newCheckedState[index] = !newCheckedState[index];
    setIsChecked(newCheckedState);
  };

  const getHistory = async () => {
    try {
      const response = await axios.post("http://localhost:3000/admin-user-history", {
        quizId: detail.quiz._id
      });
      if (response.data.result) {
        setUserHistory(response.data.result);
      } else {
        console.log("No user history found in response");
      }
    } catch (error) {
      console.log('Error fetching user history:', error);
    }
  };

  const checkResultPublished = async () => {
    try {
      const response = await axios.post('http://localhost:3000/check-result-published', {
        adminId: detail.adminId,
        quizId: detail.quiz._id
      });
      if (response.data.isresultPublished !== undefined) {
        setIsResultPublished(response.data.isresultPublished);
      } else {
        console.log("No result published status found in response");
      }
    } catch (error) {
      console.log('Error checking result published status:', error);
    }
  };

  const publishResult = async () => {
    const userIds = detail.quiz.attemptedBy.map((user, i) => ({
      userId: user._id,
      isAllowedToViewResult: isChecked[i]
    }));

    try {
      const response = await axios.post('http://localhost:3000/publish-result', {
        adminId: detail.adminId,
        userIds: userIds,
        quizId: detail.quiz._id
      });
      if (response.data) {
        setIsClicked(true);
        setIsResultPublished(true);
        window.alert('Quiz Result published successfully');
      } else {
        console.log('No response data received after publishing result');
      }
    } catch (error) {
      console.log('Error publishing result:', error);
    }
  };

  const calculateScore = async () => {
    try {
      const response = await axios.post('http://localhost:3000/calculate-score', {
        quizId: detail.quiz._id
      });
      if (response.data) {
        window.alert('Score calculated successfully');
        getHistory(); // Refresh user history after score calculation
      } else {
        console.log('No response data received after calculating score');
      }
    } catch (error) {
      console.log('Error calculating score:', error);
    }
  };

  return (
    <div>
      {detail ? (
        <div className="main-detail">
          <Header />
          <div className="home-bannerImage-container">
            <img src={BannerBackground} alt="" />
          </div>
          <div className="quiz-detail">
            <div className="details">
              <div>
                <div className="quiz-name">Quiz Name : {detail.quiz.name}</div>
                <div className="quiz-name">Quiz Description : {detail.quiz.description}</div>
              </div>
              <div>
                <div className="quiz-name">Quiz Start Time : {detail.quiz.startTime.split("T")[0]}</div>
                <div className="quiz-name">Quiz End Time : {detail.quiz.endTime.split("T")[0]}</div>
              </div>
              <div>
                <div className="quiz-name">Date : {detail.quiz.dateCreated.split("T")[0]}</div>
                <div className="quiz-name">Total Time of Quiz: {detail.quiz.duration} mins</div>
              </div>
            </div>
            <div className="quest-detail">
              {detail.quiz.questions.map((ques, i) => (
                <div className="questions-detail" key={i}>
                  <div className="ques-text">
                    <div>{i + 1}. {ques.questionText}</div>
                    <div>Marks: {ques.marks}</div>
                  </div>
                  <div className="ques-options">
                    {ques.options.map((op, j) => (
                      <div className="option-text" key={j}>
                        <input type="radio" disabled />
                        <div className="op-txt">{op}</div>
                      </div>
                    ))}
                  </div>
                  <div className="correct-ans">
                    {ques.questionType !== "short-answer" && <div>Correct Answer: {ques.correctAnswer}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="user-detail-attempted">
            <p>User Attempted Quiz</p>
            <table className="table table-striped table-hover" id="table-history">
              <thead>
                <tr>
                  <th scope="col">S. No.</th>
                  <th scope="col">User-Name</th>
                  <th scope="col">Time-taken</th>
                  <th scope="col">Score</th>
                  <th scope="col">Allow Result View</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.length !== 0 ? (
                  userHistory.map((usr, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{usr.name}</td>
                      <td>{usr.timeTaken} mins</td>
                      <td>{usr.score}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No users attempted the quiz yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="publish-quiz">
            <button className="btn btn-primary1" onClick={calculateScore}>Calculate Score</button>
            {isResultPublished && isClicked ? (
              <button className="btn btn-primary1" disabled>Result Published</button>
            ) : (
              <button className="btn btn-primary1" onClick={publishResult}>Publish Result</button>
            )}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default AdminQuizDetail;
