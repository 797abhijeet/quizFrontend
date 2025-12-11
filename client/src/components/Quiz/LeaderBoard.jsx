import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import {
  TrophyIcon,
  UserIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { quizService } from "../../services/quizService";
import { PageLoader } from "../Common/LoadingSpinner";

const LeaderBoard = () => {
  const location = useLocation();
  const { quizId } = location.state || {};
  const navigate = useNavigate();

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  useEffect(() => {
    if (quizId) {
      fetchLeaderboard();
      fetchQuizInfo();
    } else {
      navigate('/user');
    }
  }, [quizId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await quizService.getLeaderboard(quizId);
      if (response?.leaderboard) {
        setLeaderboardData(response.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizInfo = async () => {
    try {
      const response = await quizService.getQuiz(quizId);
      if (response?.quiz) {
        setQuizInfo(response.quiz);
      }
    } catch (error) {
      console.error("Error fetching quiz info:", error);
    }
  };

  const getFilteredData = () => {
    let filtered = [...leaderboardData];

    // Apply filters
    if (filter === "top10") {
      filtered = filtered.slice(0, 10);
    } else if (filter === "top50") {
      filtered = filtered.slice(0, 50);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score;
      } else if (sortBy === "time") {
        return a.timeTaken - b.timeTaken;
      } else if (sortBy === "name") {
        return (a.userId?.name || "").localeCompare(b.userId?.name || "");
      }
      return 0;
    });

    return filtered;
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-100 to-orange-50 border-orange-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <GoldMedalIcon className="h-6 w-6 text-yellow-600" />;
      case 2:
        return <SilverMedalIcon className="h-6 w-6 text-gray-600" />;
      case 3:
        return <BronzeMedalIcon className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-gray-500 font-medium">{rank}</span>;
    }
  };

  const handleDownloadCSV = () => {
    // Convert data to CSV
    const headers = ["Rank", "Name", "Score", "Time Taken", "Percentage"];
    const csvData = getFilteredData().map((item, index) => [
      index + 1,
      item.userId?.name || "Unknown",
      item.score,
      `${item.timeTaken} mins`,
      `${Math.round((item.score / (quizInfo?.questions?.length || 1)) * 100)}%`,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaderboard-${quizId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <PageLoader />;
  }

  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {quizInfo?.name || "Quiz"} Leaderboard
                </h1>
                <p className="text-gray-600">
                  See how you stack up against other participants
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDownloadCSV}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {leaderboardData.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {leaderboardData.length > 0
                      ? Math.round(
                          leaderboardData.reduce((acc, item) => acc + item.score, 0) /
                          leaderboardData.length
                        )
                      : 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Time</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {leaderboardData.length > 0
                      ? Math.round(
                          leaderboardData.reduce((acc, item) => acc + (item.timeTaken || 0), 0) /
                          leaderboardData.length
                        )
                      : 0}
                    <span className="text-sm text-gray-500 ml-1">mins</span>
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700 font-medium">Filter & Sort</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Show</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Participants</option>
                    <option value="top10">Top 10</option>
                    <option value="top50">Top 50</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="score">Score (High to Low)</option>
                    <option value="time">Time Taken (Low to High)</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">No data available</h3>
                        <p className="text-gray-500">Be the first to participate!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => {
                      const rank = index + 1;
                      const percentage = Math.round((item.score / (quizInfo?.questions?.length || 1)) * 100);
                      
                      return (
                        <tr
                          key={item._id || index}
                          className={`hover:bg-gray-50 transition-colors ${getRankColor(rank)}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex items-center justify-center">
                                {getRankIcon(rank)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <UserIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.userId?.name || "Anonymous"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.userId?.email || ""}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">
                              {item.score} / {quizInfo?.questions?.length || 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {item.timeTaken || "N/A"} mins
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className={`h-full rounded-full ${
                                    percentage >= 80
                                      ? "bg-green-500"
                                      : percentage >= 60
                                      ? "bg-yellow-500"
                                      : percentage >= 40
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center mr-3">
                  <GoldMedalIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">1st Place</span>
                  <p className="text-sm text-gray-600">Top scorer</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center mr-3">
                  <SilverMedalIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">2nd Place</span>
                  <p className="text-sm text-gray-600">Second highest score</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-100 border border-orange-200 rounded flex items-center justify-center mr-3">
                  <BronzeMedalIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">3rd Place</span>
                  <p className="text-sm text-gray-600">Third highest score</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 border border-blue-200 rounded flex items-center justify-center mr-3">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Percentage Bar</span>
                  <p className="text-sm text-gray-600">Score percentage visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const GoldMedalIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SilverMedalIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const BronzeMedalIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default LeaderBoard;