import { useLocation } from "react-router-dom";
import Header from "../Header";
import BannerBackground from "./home-banner-background.png";
import "./LeaderBoard.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaderBoard = () => {
  const location = useLocation();
  const { quiz } = location.state || {};
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quiz) {
      getLeaderBoard();
    }
  }, [quiz]);

  const getLeaderBoard = async () => {
    try {
      const response = await axios.post(
        "quest-quiz-test.netlify.app/get-leaderboard",
        {
          quizId: quiz.quizId,
        }
      );
      if (response && response.data && response.data.leaderboard) {
        setLeaderboardData(response.data.leaderboard);
      }
    } catch (error) {
      console.log("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="home-bannerImage-container">
            <img src={BannerBackground} alt="Banner" className="img" />
          </div>
      <h2 className="leader-h2">LEADERBOARD</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          
          {leaderboardData.length > 0 ? (
            <table className="leader-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>User Name</th>
                  <th>Score</th>
                  <th>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.userId.name}</td>
                    <td>{entry.score}</td>
                    <td>{entry.timeTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leaderboard data available for this quiz.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
