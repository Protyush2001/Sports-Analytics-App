


import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Line } from "react-chartjs-2";

const API_BASE = "http://localhost:3026/api/players";

const Analytics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState([]);
  // const [venue, setVenue] = useState("neutral");
  const [error, setError] = useState("");
  const [bestTeam, setBestTeam] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [expertise,setExpertise] = useState([{id:1,role:"batsman"},{id:2,role:"bowler"},{id:3,role:"allrounder"},{id:4,role:"keeper"}]);
  const [playerA,setPlayerA] = useState("");
  const [playerB,setPlayerB] = useState("");
  const [selectedRole,setSelectedRole] = useState("");
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
  }, [token, role, navigate, selectedTeamId]);

  // Add this useEffect to fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3026/api/teams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Teams response:', response.data); // Debug
        setTeams(response.data); // Adjust based on your API structure
      } catch (error) {
        console.error('Failed to fetch teams:', error);
        setTeams([]);
      }
    };

    if (token && role === "admin") { // Only fetch if admin
      fetchTeams();
    }
  }, [token, role]);


  // const fetchPlayerStats = async () => {
  //   try {
  //     setLoading(true);

  //     let endpoint = API_BASE;
  //     let params = {};

  //     if (role === "admin") {
  //       endpoint = "http://localhost:3026/api/players/all";

  //       if (selectedTeamId) {
  //         params.teamId = selectedTeamId; // ✅ filter by teamId if chosen
  //       }
  //     } else if (role === "team_owner") {
  //       params.createdBy = userId; // ✅ only team owner's players
  //     } else if (role === "player") {
  //       params.playerId = userId; // ✅ single player stats
  //     }

  //     const res = await axios.get(endpoint, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params,
  //     });

  //     console.log("Fetched player stats:", res.data);
  //     setPlayerStats(res.data.players || []);
  //     setError("");
  //   } catch (err) {
  //     console.error("Error fetching player stats:", err.response?.data || err.message);
  //     setError("Failed to fetch player stats. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPlayerStats = async () => {
  try {
    setLoading(true);

    // default endpoint
    let endpoint = API_BASE;
    let params = {};

    if (role === "admin") {
      // admin sees all players
      endpoint = `${API_BASE}/all`;

      if (selectedTeamId) {
        params.teamId = selectedTeamId; // ✅ filter players by teamId
      }
    } else if (role === "team_owner") {
      params.createdBy = userId; // ✅ only players created by team_owner
    } else if (role === "player") {
      params.playerId = userId; // ✅ fetch only the logged-in player
    }

    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    console.log("Fetched player stats:", res.data);

    // ✅ Handle both cases: { players: [...] } OR [...]
    const players = Array.isArray(res.data) ? res.data : res.data.players || [];
    setPlayerStats(players);
    setError("");
  } catch (err) {
    console.error("Error fetching player stats:", err.response?.data || err.message);
    setError(
      "Failed to fetch player stats: " +
        (err.response?.data?.error || err.message)
    );
  } finally {
    setLoading(false);
  }
};

  const fetchBestTeam = async () => {
    try {
      const res = await axios.get(`${API_BASE}/select-team`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {  teamId: selectedTeamId || undefined },
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

  const filteredStats = selectedRole ? playerStats.filter((player)=>player.role === selectedRole) : playerStats;
  const filteredPlayerA = filteredStats.filter((player)=>player._id != playerB);
  const filteredPlayerB = filteredStats.filter((player)=>player._id != playerA);

  const selectedPlayerA = playerStats.find((p) => p._id === playerA);
const selectedPlayerB = playerStats.find((p) => p._id === playerB);



  // ✅ Prepare chart data // change korchi


  const isComparing = selectedPlayerA && selectedPlayerB;

const playersToShow = isComparing
  ? playerStats.filter(p => p._id === playerA || p._id === playerB)
  : filteredStats;

const teamChartData = {
  labels: playersToShow.map((player) => player.name),
  datasets: [
    {
      label: "Runs",
      data: playersToShow.map((player) => player.runs || 0),
      backgroundColor: "#4F46E5",
    },
    {
      label: "Wickets",
      data: playersToShow.map((player) => player.wickets || 0),
      backgroundColor: "#22C55E",
    },
    {
      label: "Batting Average",
      data: playersToShow.map((player) => player.average || 0),
      backgroundColor: "#F59E0B",
    },
  ],
};

const comparisonLineData = {
  labels: ["Runs", "Wickets", "Batting Average"],
  datasets: [],
};

if (selectedPlayerA && selectedPlayerB) {
  comparisonLineData.datasets = [
    {
      label: selectedPlayerA.name,
      data: [
        selectedPlayerA.runs || 0,
        selectedPlayerA.wickets || 0,
        selectedPlayerA.average || 0,
      ],
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.3,
    },
    {
      label: selectedPlayerB.name,
      data: [
        selectedPlayerB.runs || 0,
        selectedPlayerB.wickets || 0,
        selectedPlayerB.average || 0,
      ],
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      tension: 0.3,
    },
  ];
}

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Player Performance Comparison" },
    },
  };


//   responsive: true,
//   scales: {
//     r: {
//       angleLines: { display: true },
//       suggestedMin: 0,
//       suggestedMax: 100, // adjust based on your stat range
//       ticks: {
//         stepSize: 10,
//         backdropColor: "transparent",
//       },
//     },
//   },
//   plugins: {
//     legend: { position: "top" },
//     title: {
//       display: true,
//       text: "Player vs Player Radar Comparison",
//     },
//   },
// };

  // ✅ Summary stats
  
  const lineOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "Player vs Player Line Comparison",
    },
  },
};
  
  const totalRuns = filteredStats.reduce((sum, player) => sum + (player.runs || 0), 0);
  const totalWickets = filteredStats.reduce((sum, player) => sum + (player.wickets || 0), 0);
  const averageBattingAvg =
    filteredStats.length > 0
      ? (filteredStats.reduce((sum, player) => sum + (player.average || 0), 0) / filteredStats.length).toFixed(2)
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
      <div className="mb-2">
        <h3 className="text-red-900 text-2xl">Compare player vs player</h3>
      </div>
      <div className="flex justify-between items-center">
        <select name="" value={selectedRole} onChange={(e)=>{setSelectedRole(e.target.value)}}>
          <option value="">All Players</option>
          {expertise.map((exp)=>{
            return <option key={exp.id}>{exp.role}</option>
          })}
        </select>
        <select name="" value={playerA} onChange={(e)=>setPlayerA(e.target.value)}>
          <option value="">Select Player</option>
          {filteredPlayerA.map((player)=>{
            return <option key={player._id} value={player._id}>{player.name}</option>
          })}
        </select>
        <select name="" value={playerB} onChange={(e)=>setPlayerB(e.target.value)}>
          <option value="">Select Player</option>
          {filteredPlayerB.map((player)=>{
            return <option key={player._id} value={player._id}>{player.name}</option>
          })}

        </select>
      </div>

      {/* ✅ Dropdown: Admin only */}
      {role === "admin" && (
        <div className="mb-6">
          <label htmlFor="teamSelect" className="block text-sm font-medium text-gray-700">
            Select Team
          </label>
          <select
            id="teamSelect"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Player Stats</h2>
          <p>Total Runs: <strong>{totalRuns}</strong></p>
          <p>Average Batting Avg: <strong>{averageBattingAvg}</strong></p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Bowling Insights</h2>
          <p>Total Wickets: <strong>{totalWickets}</strong></p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Team Overview</h2>
          <p>Players Analyzed: <strong>{filteredStats.length}</strong></p>
        </div>
      </div>



{/* Team or Comparison Bar Chart */}
{playerStats.length > 0 ? (
  <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
      {selectedPlayerA && selectedPlayerB ? "Selected Players Overview" : "Team/Role Performance Overview"}
    </h2>
    <div className="h-96">
      <Bar data={teamChartData} options={chartOptions} />
    </div>
  </div>
) : (
  <div className="bg-white shadow-md rounded-2xl p-6 text-center">
    <p className="text-gray-600">No players found. Add players to see analytics.</p>
  </div>
)}

{/* Line Comparison Chart */}
{selectedPlayerA && selectedPlayerB && (
  <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Player vs Player Line Comparison</h2>
    <div className="h-96">
      <Line data={comparisonLineData} options={lineOptions} />
    </div>
  </div>
)}


      {/* ✅ Best Playing 11 */}
<div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
     Best Playing 11
  </h2>

  <button
    onClick={fetchBestTeam}
    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:scale-105 transition mb-6"
  >
     Generate Best Team
  </button>

  {bestTeam.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bestTeam.map((player, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{player.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                player.role === "Bowler"
                  ? "bg-green-100 text-green-700"
                  : player.role === "Batsman"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {player.role}
            </span>
          </div>
          <p className="text-sm text-gray-600">{player.reason}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-500 mt-4">
      <p>Click the button to generate the best playing 11.</p>
      <p className="text-sm mt-1">Based on performance, role balance, and match conditions.</p>
    </div>
  )}
</div>





    </div>
  );
};

export default Analytics;
