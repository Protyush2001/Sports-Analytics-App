

// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { Bar } from "react-chartjs-2";
// import "chart.js/auto";

// const Analytics = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [playerStats, setPlayerStats] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-xl font-semibold">Loading...</p>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Dummy chart data (replace with API data later)
//   const data = {
//     labels: ["Player A", "Player B", "Player C"],
//     datasets: [
//       {
//         label: "Runs",
//         data: [50, 75, 100],
//         backgroundColor: ["#4F46E5", "#22C55E", "#F59E0B"],
//       },
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-gray-900 mb-2">
//           Analytics Dashboard
//         </h1>
//         <p className="text-lg text-gray-600">
//           Visualize player performance, match statistics, and more.
//         </p>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">
//             Player Stats
//           </h2>
//           <p className="text-gray-600 text-sm">
//             Track runs, wickets, and strike rates of players across matches.
//           </p>
//         </div>

//         <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">
//             Match Insights
//           </h2>
//           <p className="text-gray-600 text-sm">
//             Analyze match performance with win/loss ratios and key highlights.
//           </p>
//         </div>

//         <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">
//             Team Comparisons
//           </h2>
//           <p className="text-gray-600 text-sm">
//             Compare teams based on batting, bowling, and overall efficiency.
//           </p>
//         </div>
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white shadow-md rounded-2xl p-6">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//           Top Player Runs
//         </h2>
//         <Bar data={data} />
//       </div>
//     </div>
//   );
// };

// export default Analytics;


import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const API_BASE = "http://localhost:3026/api/players";

const Analytics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState([]);
  const [venue, setVenue] = useState("neutral");
  const [error, setError] = useState("");
  const [bestTeam, setBestTeam] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }
    if (!["player", "team_owner", "admin"].includes(role)) {
      alert("Access denied! Only players, team owners, and admins can view this page.");
      navigate("/");
      return;
    }
    setIsAuthenticated(true);
    fetchPlayerStats();
  }, [token, role, navigate]);

  const fetchPlayerStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
        params: { createdBy: userId }, // Filter by userId
      });
      console.log("Fetched player stats:", res.data);
      setPlayerStats(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching player stats:", err.response?.data || err.message);
      setError("Failed to fetch player stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchBestTeam = async () => {
  try {
    const res = await axios.get(`${API_BASE}/select-team`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { venue },
    });
    setBestTeam(res.data.bestTeam);
  } catch (err) {
    setError("Failed to select best team: " + (err.response?.data?.error || err.message));
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Prepare chart data
  const chartData = {
    labels: playerStats.map((player) => player.name),
    datasets: [
      {
        label: "Runs",
        data: playerStats.map((player) => player.runs || 0),
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
        borderWidth: 1,
      },
      {
        label: "Wickets",
        data: playerStats.map((player) => player.wickets || 0),
        backgroundColor: "#22C55E",
        borderColor: "#22C55E",
        borderWidth: 1,
      },
      {
        label: "Batting Average",
        data: playerStats.map((player) => player.average || 0),
        backgroundColor: "#F59E0B",
        borderColor: "#F59E0B",
        borderWidth: 1,
      },
    ],
  };

  // Chart options for better x-axis spacing
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
          color: "#1F2937",
        },
      },
      title: {
        display: true,
        text: "Player Performance Comparison",
        font: { size: 16 },
        color: "#1F2937",
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
          color: "#1F2937",
          maxRotation: 45,
          minRotation: 45,
          padding: 10, // Increase gap from x-axis
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: "#1F2937",
        },
        title: {
          display: true,
          text: "Value",
          font: { size: 14 },
          color: "#1F2937",
        },
      },
    },
  };

  // Calculate summary stats for cards
  const totalRuns = playerStats.reduce((sum, player) => sum + (player.runs || 0), 0);
  const totalWickets = playerStats.reduce((sum, player) => sum + (player.wickets || 0), 0);
  const averageBattingAvg =
    playerStats.length > 0
      ? (playerStats.reduce((sum, player) => sum + (player.average || 0), 0) / playerStats.length).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-lg text-gray-600">
          Visualize player performance, match statistics, and more.
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Player Stats</h2>
          <p className="text-gray-600 text-sm">
            Total Runs: <strong>{totalRuns}</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Average Batting Avg: <strong>{averageBattingAvg}</strong>
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Bowling Insights</h2>
          <p className="text-gray-600 text-sm">
            Total Wickets: <strong>{totalWickets}</strong>
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Team Overview</h2>
          <p className="text-gray-600 text-sm">
            Players Analyzed: <strong>{playerStats.length}</strong>
          </p>
        </div>
      </div>

      {/* Chart Section */}
      {playerStats.length > 0 ? (
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Player Performance Comparison
          </h2>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <p className="text-gray-600">No players found. Add players to see analytics.</p>
        </div>
      )}
      {/* Best Playing 11 Section */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Best Playing 11</h2>
        <button
          onClick={fetchBestTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Generate Best Team
        </button>
        {bestTeam.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {bestTeam.map((player, index) => (
              <li key={index} className="text-gray-600">
                <strong>{player.name}</strong> ({player.role}) - {player.reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Click the button to generate the best playing 11.</p>
        )}
      </div>


    </div>
  );
};

export default Analytics;