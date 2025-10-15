


// import React, { useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import "chart.js/auto";
// import { Line } from "react-chartjs-2";

// const API_BASE = "http://localhost:3026/api/players";

// const Analytics = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [playerStats, setPlayerStats] = useState([]);
//   // const [venue, setVenue] = useState("neutral");
//   const [error, setError] = useState("");
//   const [bestTeam, setBestTeam] = useState([]);
//   const [selectedTeamId, setSelectedTeamId] = useState("");
//   const [teams, setTeams] = useState([]);
//   const [expertise,setExpertise] = useState([{id:1,role:"batsman"},{id:2,role:"bowler"},{id:3,role:"allrounder"},{id:4,role:"keeper"}]);
//   const [playerA,setPlayerA] = useState("");
//   const [playerB,setPlayerB] = useState("");
//   const [selectedRole,setSelectedRole] = useState("");
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");

//     const fieldPositions = [
//     { top: "80%", left: "50%" },  // wicketkeeper
//     { top: "60%", left: "45%" },  // slip 1
//     { top: "60%", left: "55%" },  // slip 2
//     { top: "40%", left: "30%" },  // point
//     { top: "40%", left: "70%" },  // cover
//     { top: "20%", left: "20%" },  // mid-off
//     { top: "20%", left: "80%" },  // mid-on
//     { top: "10%", left: "50%" },  // bowler
//     { top: "5%", left: "30%" },   // long off
//     { top: "5%", left: "70%" },   // long on
//     { top: "2%", left: "50%" },   // keeper/another fielder
//   ];

//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//       return;
//     }
//     if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//       return;
//     }
//     setIsAuthenticated(true);
//     fetchPlayerStats();
//   }, [token, role, navigate, selectedTeamId]);

//   // Add this useEffect to fetch teams
//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const response = await axios.get('http://localhost:3026/api/teams', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('Teams response:', response.data); // Debug
//         setTeams(response.data); // Adjust based on your API structure
//       } catch (error) {
//         console.error('Failed to fetch teams:', error);
//         setTeams([]);
//       }
//     };

//     if (token && role === "admin") { // Only fetch if admin
//       fetchTeams();
//     }
//   }, [token, role]);


//   // const fetchPlayerStats = async () => {
//   //   try {
//   //     setLoading(true);

//   //     let endpoint = API_BASE;
//   //     let params = {};

//   //     if (role === "admin") {
//   //       endpoint = "http://localhost:3026/api/players/all";

//   //       if (selectedTeamId) {
//   //         params.teamId = selectedTeamId; // ✅ filter by teamId if chosen
//   //       }
//   //     } else if (role === "team_owner") {
//   //       params.createdBy = userId; // ✅ only team owner's players
//   //     } else if (role === "player") {
//   //       params.playerId = userId; // ✅ single player stats
//   //     }

//   //     const res = await axios.get(endpoint, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //       params,
//   //     });

//   //     console.log("Fetched player stats:", res.data);
//   //     setPlayerStats(res.data.players || []);
//   //     setError("");
//   //   } catch (err) {
//   //     console.error("Error fetching player stats:", err.response?.data || err.message);
//   //     setError("Failed to fetch player stats. Please try again.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchPlayerStats = async () => {
//   try {
//     setLoading(true);

//     // default endpoint
//     let endpoint = API_BASE;
//     let params = {};

//     if (role === "admin") {
//       // admin sees all players
//       endpoint = `${API_BASE}/all`;

//       if (selectedTeamId) {
//         params.teamId = selectedTeamId; //  filter players by teamId
//       }
//     } else if (role === "team_owner") {
//       params.createdBy = userId; //  only players created by team_owner
//     } else if (role === "player") {
//       params.playerId = userId; // fetch only the logged-in player
//     }

//     const res = await axios.get(endpoint, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });

//     console.log("Fetched player stats:", res.data);

//     //  Handle both cases: { players: [...] } OR [...]
//     const players = Array.isArray(res.data) ? res.data : res.data.players || [];
//     setPlayerStats(players);
//     setError("");
//   } catch (err) {
//     console.error("Error fetching player stats:", err.response?.data || err.message);
//     setError(
//       "Failed to fetch player stats: " +
//         (err.response?.data?.error || err.message)
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   const fetchBestTeam = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/select-team`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {  teamId: selectedTeamId || undefined },
//       });
//       setBestTeam(res.data.bestTeam);
//     } catch (err) {
//       setError("Failed to select best team: " + (err.response?.data?.error || err.message));
//     }
//   };

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

//   const filteredStats = selectedRole ? playerStats.filter((player)=>player.role === selectedRole) : playerStats;
//   const filteredPlayerA = filteredStats.filter((player)=>player._id != playerB);
//   const filteredPlayerB = filteredStats.filter((player)=>player._id != playerA);

//   const selectedPlayerA = playerStats.find((p) => p._id === playerA);
// const selectedPlayerB = playerStats.find((p) => p._id === playerB);



//   //   chart data /


//   const isComparing = selectedPlayerA && selectedPlayerB;

// const playersToShow = isComparing
//   ? playerStats.filter(p => p._id === playerA || p._id === playerB)
//   : filteredStats;

// const teamChartData = {
//   labels: playersToShow.map((player) => player.name),
//   datasets: [
//     {
//       label: "Runs",
//       data: playersToShow.map((player) => player.runs || 0),
//       backgroundColor: "#4F46E5",
//     },
//     {
//       label: "Wickets",
//       data: playersToShow.map((player) => player.wickets || 0),
//       backgroundColor: "#22C55E",
//     },
//     {
//       label: "Batting Average",
//       data: playersToShow.map((player) => player.average || 0),
//       backgroundColor: "#F59E0B",
//     },
//   ],
// };

// const comparisonLineData = {
//   labels: ["Runs", "Wickets", "Batting Average"],
//   datasets: [],
// };

// if (selectedPlayerA && selectedPlayerB) {
//   comparisonLineData.datasets = [
//     {
//       label: selectedPlayerA.name,
//       data: [
//         selectedPlayerA.runs || 0,
//         selectedPlayerA.wickets || 0,
//         selectedPlayerA.average || 0,
//       ],
//       borderColor: "#3B82F6",
//       backgroundColor: "rgba(59, 130, 246, 0.2)",
//       tension: 0.3,
//     },
//     {
//       label: selectedPlayerB.name,
//       data: [
//         selectedPlayerB.runs || 0,
//         selectedPlayerB.wickets || 0,
//         selectedPlayerB.average || 0,
//       ],
//       borderColor: "#EF4444",
//       backgroundColor: "rgba(239, 68, 68, 0.2)",
//       tension: 0.3,
//     },
//   ];
// }

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "Player Performance Comparison" },
//     },
//   };


// //   responsive: true,
// //   scales: {
// //     r: {
// //       angleLines: { display: true },
// //       suggestedMin: 0,
// //       suggestedMax: 100, // adjust based on your stat range
// //       ticks: {
// //         stepSize: 10,
// //         backdropColor: "transparent",
// //       },
// //     },
// //   },
// //   plugins: {
// //     legend: { position: "top" },
// //     title: {
// //       display: true,
// //       text: "Player vs Player Radar Comparison",
// //     },
// //   },
// // };

//   // ✅ Summary stats
  
//   const lineOptions = {
//   responsive: true,
//   plugins: {
//     legend: { position: "top" },
//     title: {
//       display: true,
//       text: "Player vs Player Line Comparison",
//     },
//   },
// };
  
//   const totalRuns = filteredStats.reduce((sum, player) => sum + (player.runs || 0), 0);
//   const totalWickets = filteredStats.reduce((sum, player) => sum + (player.wickets || 0), 0);
//   const averageBattingAvg =
//     filteredStats.length > 0
//       ? (filteredStats.reduce((sum, player) => sum + (player.average || 0), 0) / filteredStats.length).toFixed(2)
//       : 0;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
//         <p className="text-lg text-gray-600">
//           Visualize player performance, match statistics, and more.
//         </p>
//         {error && <p className="text-red-500 mt-2">{error}</p>}  
//       </div>
//       <div className="mb-2">
//         <h3 className="text-red-900 text-2xl">Compare player vs player</h3>
//       </div>
//       <div className="flex justify-between items-center">
//         <select name="" value={selectedRole} onChange={(e)=>{setSelectedRole(e.target.value)}}>
//           <option value="">All Players</option>
//           {expertise.map((exp)=>{
//             return <option key={exp.id}>{exp.role}</option>
//           })}
//         </select>
//         <select name="" value={playerA} onChange={(e)=>setPlayerA(e.target.value)}>
//           <option value="">Select Player</option>
//           {filteredPlayerA.map((player)=>{
//             return <option key={player._id} value={player._id}>{player.name}</option>
//           })}
//         </select>
//         <select name="" value={playerB} onChange={(e)=>setPlayerB(e.target.value)}>
//           <option value="">Select Player</option>
//           {filteredPlayerB.map((player)=>{
//             return <option key={player._id} value={player._id}>{player.name}</option>
//           })}

//         </select>
//       </div>

//       {/* Dropdown: Admin only */}
//       {role === "admin" && (
//         <div className="mb-6">
//           <label htmlFor="teamSelect" className="block text-sm font-medium text-gray-700">
//             Select Team
//           </label>
//           <select
//             id="teamSelect"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={selectedTeamId}
//             onChange={(e) => setSelectedTeamId(e.target.value)}
//           >
//             <option value="">All Teams</option>
//             {teams.map((team) => (
//               <option key={team._id} value={team._id}>
//                 {team.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

      

//       {/*  Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">Player Stats</h2>
//           <p>Total Runs: <strong>{totalRuns}</strong></p>
//           <p>Average Batting Avg: <strong>{averageBattingAvg}</strong></p>
//         </div>
//         <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">Bowling Insights</h2>
//           <p>Total Wickets: <strong>{totalWickets}</strong></p>
//         </div>
//         <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">Team Overview</h2>
//           <p>Players Analyzed: <strong>{filteredStats.length}</strong></p>
//         </div>
//       </div>



// {/* Team or Comparison Bar Chart */}
// {playerStats.length > 0 ? (
//   <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
//     <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//       {selectedPlayerA && selectedPlayerB ? "Selected Players Overview" : "Team/Role Performance Overview"}
//     </h2>
//     <div className="h-96">
//       <Bar data={teamChartData} options={chartOptions} />
//     </div>
//   </div>
// ) : (
//   <div className="bg-white shadow-md rounded-2xl p-6 text-center">
//     <p className="text-gray-600">No players found. Add players to see analytics.</p>
//   </div>
// )}

// {/* Line Comparison Chart */}
// {selectedPlayerA && selectedPlayerB && (
//   <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
//     <h2 className="text-2xl font-semibold text-gray-800 mb-4">Player vs Player Line Comparison</h2>
//     <div className="h-96">
//       <Line data={comparisonLineData} options={lineOptions} />
//     </div>
//   </div>
// )}


//       {/* Best Playing 11 */}
// {/* <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
//   <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//      Best Playing 11
//   </h2>

//   <button
//     onClick={fetchBestTeam}
//     className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:scale-105 transition mb-6"
//   >
//      Generate Best Team
//   </button>

//   {bestTeam.length > 0 ? (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {bestTeam.map((player, index) => (
//         <div
//           key={index}
//           className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-lg font-semibold text-gray-800">{player.name}</h3>
//             <span
//               className={`text-xs px-2 py-1 rounded-full font-medium ${
//                 player.role === "Bowler"
//                   ? "bg-green-100 text-green-700"
//                   : player.role === "Batsman"
//                   ? "bg-blue-100 text-blue-700"
//                   : "bg-yellow-100 text-yellow-700"
//               }`}
//             >
//               {player.role}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600">{player.reason}</p>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <div className="text-center text-gray-500 mt-4">
//       <p>Click the button to generate the best playing 11.</p>
//       <p className="text-sm mt-1">Based on performance, role balance, and match conditions.</p>
//     </div>
//   )}
// </div> */}

// {/* Best Playing 11 */}
// {/* <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
//   <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//      Best Playing 11 on Field
//   </h2>

//   <button
//     onClick={fetchBestTeam}
//     className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:scale-105 transition mb-6"
//   >
//      Generate Best Team
//   </button>

//   {bestTeam.length > 0 ? (
//     // ⬇️ Your snippet goes here ⬇️
//     <div className="relative w-full h-[600px] bg-green-500">
//       <img
//         src="https://www.shutterstock.com/image-photo/cricket-field-top-view-pitch-600nw-2593340443.jpg"
//         alt="Cricket Ground"
//         className="absolute inset-0 w-full h-full object-cover rounded-2xl"
//       />

//       {bestTeam.map((player, index) => {
//         const pos = fieldPositions[index] || { top: "50%", left: "50%" };
//         return (
//           <div
//             key={index}
//             className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
//             style={{ top: pos.top, left: pos.left }}
//           >
//             <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-full px-3 py-1 text-xs shadow-md">
//               <p className="font-bold">{player.name}</p>
//               <p className="text-[10px]">{player.role}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   ) : (
//     <div className="text-center text-gray-500 mt-4">
//       <p>Click the button to generate the best playing 11.</p>
//       <p className="text-sm mt-1">Based on performance, role balance, and match conditions.</p>
//     </div>
//   )}
// </div> */}

// {/* Best Playing 11 */}
// <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
//   <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//     Best Playing 11 on Field
//   </h2>

//   <button
//     onClick={fetchBestTeam}
//     className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:scale-105 transition mb-6"
//   >
//     Generate Best Team
//   </button>

//   {bestTeam.length > 0 ? (
//     <div className="relative w-full aspect-[4/3] bg-green-700 rounded-2xl overflow-hidden shadow-xl">

//       {/* Ground */}
// <img
//   src="https://www.shutterstock.com/image-photo/cricket-field-top-view-pitch-600nw-2593340443.jpg"
//   alt="Cricket Ground"
//   className="absolute inset-0 w-full h-full object-contain bg-black"
// />

//       {/* Dark overlay for contrast */}
//        <div className="absolute inset-0 bg-black/10" />

//       {/* Players */}
//       {bestTeam.map((player, index) => {
//         const pos = fieldPositions[index] || { top: "50%", left: "50%" };
//         return (
//           <div
//             key={index}
//             className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
//             style={{ top: pos.top, left: pos.left }}
//           >
//             <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full px-4 py-2 text-xs shadow-md hover:shadow-lg hover:scale-105 transition-transform">
//               <p className="font-semibold text-gray-800">{player.name}</p>
//               <p className="text-[11px] text-gray-600">{player.role}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   ) : (
//     <div className="text-center text-gray-500 mt-4">
//       <p>Click the button to generate the best playing 11.</p>
//       <p className="text-sm mt-1">
//         Based on performance, role balance, and match conditions.
//       </p>
//     </div>
//   )}
// </div>






//     </div>
//   );
// };

// export default Analytics;


///////////////////////////////////////////////////


// import React, { useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import "chart.js/auto";
// import { Line } from "react-chartjs-2";
// import { Link } from "react-router-dom";

// const API_BASE = "http://localhost:3026/api/players";

// const Analytics = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [playerStats, setPlayerStats] = useState([]);
//   const [error, setError] = useState("");
//   const [bestTeam, setBestTeam] = useState([]);
//   const [selectedTeamId, setSelectedTeamId] = useState("");
//   const [teams, setTeams] = useState([]);
//   const [expertise, setExpertise] = useState([
//     { id: 1, role: "batsman" },
//     { id: 2, role: "bowler" },
//     { id: 3, role: "allrounder" },
//     { id: 4, role: "keeper" }
//   ]);
//   const [playerA, setPlayerA] = useState("");
//   const [playerB, setPlayerB] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [isGeneratingTeam, setIsGeneratingTeam] = useState(false);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");

// const fieldPositions = [
//   { top: "90%", left: "50%" },  // wicketkeeper
//   { top: "75%", left: "42%" },  // slip 1
//   { top: "75%", left: "58%" },  // slip 2
//   { top: "55%", left: "30%" },  // point
//   { top: "55%", left: "70%" },  // cover
//   { top: "35%", left: "20%" },  // mid-off
//   { top: "35%", left: "80%" },  // mid-on
//   { top: "20%", left: "50%" },  // bowler
//   { top: "10%", left: "30%" },  // long off
//   { top: "10%", left: "70%" },  // long on
//   { top: "5%", left: "50%" },   // extra deep fielder
// ];


//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//       return;
//     }
//     if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//       return;
//     }
//     setIsAuthenticated(true);
//     fetchPlayerStats();
//   }, [token, role, navigate, selectedTeamId]);

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const response = await axios.get('http://localhost:3026/api/teams', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('Teams response:', response.data);
//         setTeams(response.data);
//       } catch (error) {
//         console.error('Failed to fetch teams:', error);
//         setTeams([]);
//       }
//     };

//     if (token && role === "admin") {
//       fetchTeams();
//     }
//   }, [token, role]);

//   const fetchPlayerStats = async () => {
//     try {
//       setLoading(true);

//       let endpoint = API_BASE;
//       let params = {};

//       if (role === "admin") {
//         endpoint = `${API_BASE}/all`;
//         if (selectedTeamId) {
//           params.teamId = selectedTeamId;
//         }
//       } else if (role === "team_owner") {
//         params.createdBy = userId;
//       } else if (role === "player") {
//         params.playerId = userId;
//       }

//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       console.log("Fetched player stats:", res.data);

//       const players = Array.isArray(res.data) ? res.data : res.data.players || [];
//       setPlayerStats(players);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching player stats:", err.response?.data || err.message);
//       setError(
//         "Failed to fetch player stats: " +
//           (err.response?.data?.error || err.message)
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBestTeam = async () => {
//     try {
//       setIsGeneratingTeam(true);
//       // Simulate loading for better UX
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       const res = await axios.get(`${API_BASE}/select-team`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { teamId: selectedTeamId || undefined },
//       });
//       setBestTeam(res.data.bestTeam);
//     } catch (err) {
//       setError("Failed to select best team: " + (err.response?.data?.error || err.message));
//     } finally {
//       setIsGeneratingTeam(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="text-center">
//           <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-xl font-semibold text-gray-700">Loading Analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   const filteredStats = selectedRole ? playerStats.filter((player) => player.role === selectedRole) : playerStats;
//   const filteredPlayerA = filteredStats.filter((player) => player._id !== playerB);
//   const filteredPlayerB = filteredStats.filter((player) => player._id !== playerA);

//   const selectedPlayerA = playerStats.find((p) => p._id === playerA);
//   const selectedPlayerB = playerStats.find((p) => p._id === playerB);

//   const isComparing = selectedPlayerA && selectedPlayerB;

//   const playersToShow = isComparing
//     ? playerStats.filter(p => p._id === playerA || p._id === playerB)
//     : filteredStats;

//   const teamChartData = {
//     labels: playersToShow.map((player) => player.name),
//     datasets: [
//       {
//         label: "Runs",
//         data: playersToShow.map((player) => player.runs || 0),
//         backgroundColor: "rgba(59, 130, 246, 0.8)",
//         borderColor: "#3B82F6",
//         borderWidth: 2,
//         borderRadius: 8,
//       },
//       {
//         label: "Wickets",
//         data: playersToShow.map((player) => player.wickets || 0),
//         backgroundColor: "rgba(34, 197, 94, 0.8)",
//         borderColor: "#22C55E",
//         borderWidth: 2,
//         borderRadius: 8,
//       },
//       {
//         label: "Batting Average",
//         data: playersToShow.map((player) => player.average || 0),
//         backgroundColor: "rgba(245, 158, 11, 0.8)",
//         borderColor: "#F59E0B",
//         borderWidth: 2,
//         borderRadius: 8,
//       },
//     ],
//   };

//   const comparisonLineData = {
//     labels: ["Runs", "Wickets", "Batting Average"],
//     datasets: [],
//   };

//   if (selectedPlayerA && selectedPlayerB) {
//     comparisonLineData.datasets = [
//       {
//         label: selectedPlayerA.name,
//         data: [
//           selectedPlayerA.runs || 0,
//           selectedPlayerA.wickets || 0,
//           selectedPlayerA.average || 0,
//         ],
//         borderColor: "#3B82F6",
//         backgroundColor: "rgba(59, 130, 246, 0.1)",
//         tension: 0.4,
//         borderWidth: 3,
//         pointBackgroundColor: "#3B82F6",
//         pointBorderWidth: 3,
//         pointRadius: 6,
//       },
//       {
//         label: selectedPlayerB.name,
//         data: [
//           selectedPlayerB.runs || 0,
//           selectedPlayerB.wickets || 0,
//           selectedPlayerB.average || 0,
//         ],
//         borderColor: "#EF4444",
//         backgroundColor: "rgba(239, 68, 68, 0.1)",
//         tension: 0.4,
//         borderWidth: 3,
//         pointBackgroundColor: "#EF4444",
//         pointBorderWidth: 3,
//         pointRadius: 6,
//       },
//     ];
//   }

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { 
//         position: "top",
//         labels: {
//           padding: 20,
//           font: { size: 12, weight: 'bold' }
//         }
//       },
//       title: { 
//         display: true, 
//         text: "Player Performance Comparison",
//         font: { size: 16, weight: 'bold' }
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.1)',
//         }
//       },
//       x: {
//         grid: {
//           display: false,
//         }
//       }
//     }
//   };

//   const lineOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { 
//         position: "top",
//         labels: {
//           padding: 20,
//           font: { size: 12, weight: 'bold' }
//         }
//       },
//       title: {
//         display: true,
//         text: "Player vs Player Comparison",
//         font: { size: 16, weight: 'bold' }
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.1)',
//         }
//       },
//     }
//   };

//   const totalRuns = filteredStats.reduce((sum, player) => sum + (player.runs || 0), 0);
//   const totalWickets = filteredStats.reduce((sum, player) => sum + (player.wickets || 0), 0);
//   const averageBattingAvg =
//     filteredStats.length > 0
//       ? (filteredStats.reduce((sum, player) => sum + (player.average || 0), 0) / filteredStats.length).toFixed(2)
//       : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="bg-white shadow-xl rounded-3xl p-8 mb-8 border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                   Analytics Dashboard
//                 </h1>
//                 <p className="text-gray-500 text-lg mt-1">
//                   Comprehensive player performance insights and team analysis
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
//                 <span className="text-green-700 font-medium text-sm flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   Live Data
//                 </span>
                
//               </div>
              
//               <button 
//                 onClick={fetchPlayerStats}
//                 className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
//               >
//                 <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//               </button>
//               <button className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors" onClick={()=>navigate('/points-table')}>Points Table</button>
//             </div>
            
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
//               <p className="text-red-600 font-medium">{error}</p>
//             </div>
//           )}
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white shadow-xl rounded-3xl p-6 mb-8 border border-gray-100">
//           <div className="flex items-center gap-3 mb-6">
//             <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
//             </svg>
//             <h2 className="text-2xl font-bold text-gray-800">Player Comparison & Filters</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Role Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
//               <select 
//                 value={selectedRole} 
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
//               >
//                 <option value="">All Players</option>
//                 {expertise.map((exp) => (
//                   <option key={exp.id} value={exp.role}>
//                     {exp.role.charAt(0).toUpperCase() + exp.role.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Player A */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Player A</label>
//               <select 
//                 value={playerA} 
//                 onChange={(e) => setPlayerA(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
//               >
//                 <option value="">Select Player A</option>
//                 {filteredPlayerA.map((player) => (
//                   <option key={player._id} value={player._id}>{player.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Player B */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Player B</label>
//               <select 
//                 value={playerB} 
//                 onChange={(e) => setPlayerB(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
//               >
//                 <option value="">Select Player B</option>
//                 {filteredPlayerB.map((player) => (
//                   <option key={player._id} value={player._id}>{player.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Team Filter (Admin only) */}
//             {role === "admin" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Team</label>
//                 <select
//                   value={selectedTeamId}
//                   onChange={(e) => setSelectedTeamId(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
//                 >
//                   <option value="">All Teams</option>
//                   {teams.map((team) => (
//                     <option key={team._id} value={team._id}>
//                       {team.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-blue-500 p-3 rounded-2xl">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-bold text-gray-800">Batting Stats</h2>
//             </div>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Total Runs:</span>
//                 <span className="font-bold text-blue-600 text-2xl">{totalRuns}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Average Batting:</span>
//                 <span className="font-bold text-blue-600 text-2xl">{averageBattingAvg}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-green-500 p-3 rounded-2xl">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-bold text-gray-800">Bowling Insights</h2>
//             </div>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Total Wickets:</span>
//                 <span className="font-bold text-green-600 text-2xl">{totalWickets}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-lg rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-purple-500 p-3 rounded-2xl">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-bold text-gray-800">Team Overview</h2>
//             </div>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Players Analyzed:</span>
//                 <span className="font-bold text-purple-600 text-2xl">{filteredStats.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         {playerStats.length > 0 ? (
//           <div className="bg-white shadow-xl rounded-3xl p-8 mb-8 border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
//               </svg>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {selectedPlayerA && selectedPlayerB ? "Selected Players Overview" : "Team/Role Performance Overview"}
//               </h2>
//             </div>
//             <div className="h-96 p-4">
//               <Bar data={teamChartData} options={chartOptions} />
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white shadow-xl rounded-3xl p-8 text-center border border-gray-100">
//             <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//             </svg>
//             <p className="text-gray-600 text-lg">No players found. Add players to see analytics.</p>
//           </div>
//         )}

//         {/* Line Comparison Chart */}
//         {selectedPlayerA && selectedPlayerB && (
//           <div className="bg-white shadow-xl rounded-3xl p-8 mb-8 border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//               <h2 className="text-2xl font-bold text-gray-800">Player vs Player Line Comparison</h2>
//             </div>
//             <div className="h-96 p-4">
//               <Line data={comparisonLineData} options={lineOptions} />
//             </div>
//           </div>
//         )}

//         {/* Best Playing 11 */}
// <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
//   <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//     Best Playing 11 on Field
//   </h2>

//   <button
//     onClick={fetchBestTeam}
//     className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:scale-105 transition mb-6"
//   >
//     Generate Best Team
//   </button>

//   {bestTeam.length > 0 ? (
//     <div className="relative w-full aspect-[4/3] bg-green-700 rounded-2xl overflow-hidden shadow-xl">
//       <img
//         src="https://www.shutterstock.com/image-photo/cricket-field-top-view-pitch-600nw-2593340443.jpg"
//         alt="Cricket Ground"
//         className="absolute inset-0 w-full h-full object-contain bg-black"
//       />

//       <div className="absolute inset-0 bg-black/10" />

//       {bestTeam.map((player, index) => {
//         const pos = fieldPositions[index] || { top: "50%", left: "50%" };
//         return (
//           <div
//             key={index}
//             className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
//             style={{ top: pos.top, left: pos.left }}
//           >
//             <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full px-4 py-2 text-xs shadow-md hover:shadow-lg hover:scale-105 transition-transform">
//               <p className="font-semibold text-gray-800">{player.name}</p>
//               <p className="text-[11px] text-gray-600">{player.role}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   ) : (
//     <div className="text-center text-gray-500 mt-4">
//       <p>Click the button to generate the best playing 11.</p>
//       <p className="text-sm mt-1">
//         Based on performance, role balance, and match conditions.
//       </p>
//     </div>
//   )}
// </div>
//         {/* Additional Analytics Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
//           {/* Performance Insights */}
//           <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//               </svg>
//               <h2 className="text-2xl font-bold text-gray-800">Performance Insights</h2>
//             </div>
            
//             {filteredStats.length > 0 && (
//               <div className="space-y-4">
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
//                   <h3 className="font-semibold text-blue-800 mb-2">Top Performer</h3>
//                   {(() => {
//                     const topScorer = filteredStats.reduce((prev, current) => 
//                       (prev.runs || 0) > (current.runs || 0) ? prev : current
//                     );
//                     return (
//                       <p className="text-blue-700">
//                         <span className="font-bold">{topScorer.name}</span> - {topScorer.runs || 0} runs
//                       </p>
//                     );
//                   })()}
//                 </div>
                
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
//                   <h3 className="font-semibold text-green-800 mb-2">Best Bowler</h3>
//                   {(() => {
//                     const topBowler = filteredStats.reduce((prev, current) => 
//                       (prev.wickets || 0) > (current.wickets || 0) ? prev : current
//                     );
//                     return (
//                       <p className="text-green-700">
//                         <span className="font-bold">{topBowler.name}</span> - {topBowler.wickets || 0} wickets
//                       </p>
//                     );
//                   })()}
//                 </div>
                
//                 <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200">
//                   <h3 className="font-semibold text-purple-800 mb-2">Highest Average</h3>
//                   {(() => {
//                     const bestAverage = filteredStats.reduce((prev, current) => 
//                       (prev.average || 0) > (current.average || 0) ? prev : current
//                     );
//                     return (
//                       <p className="text-purple-700">
//                         <span className="font-bold">{bestAverage.name}</span> - {bestAverage.average || 0} avg
//                       </p>
//                     );
//                   })()}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Team Composition */}
//           <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               <h2 className="text-2xl font-bold text-gray-800">Team Composition</h2>
//             </div>
            
//             <div className="space-y-4">
//               {expertise.map((exp) => {
//                 const roleCount = playerStats.filter(player => player.role === exp.role).length;
//                 const percentage = playerStats.length > 0 ? (roleCount / playerStats.length * 100).toFixed(1) : 0;
//                 return (
//                   <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
//                     <div className="flex items-center gap-3">
//                       <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
//                       <span className="font-medium text-gray-700 capitalize">{exp.role}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-gray-800">{roleCount}</span>
//                       <span className="text-sm text-gray-500">({percentage}%)</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Quick Stats Footer */}
//         <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 mt-8 text-white">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
//             <div>
//               <div className="text-3xl font-bold text-blue-300 mb-2">{playerStats.length}</div>
//               <div className="text-gray-300">Total Players</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-green-300 mb-2">{totalRuns}</div>
//               <div className="text-gray-300">Total Runs</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-yellow-300 mb-2">{totalWickets}</div>
//               <div className="text-gray-300">Total Wickets</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-purple-300 mb-2">{averageBattingAvg}</div>
//               <div className="text-gray-300">Avg Batting</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
// //////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/AnalyticsFolder/Header";
import Filters from "../components/AnalyticsFolder/Filters";
import StatsCards from "../components/AnalyticsFolder/StatsCards";
import Charts from "../components/AnalyticsFolder/Charts";
import BestPlaying11 from "../components/AnalyticsFolder/BestPlaying11";
import PerformanceInsights from "../components/AnalyticsFolder/PerformanceInsights";
import TeamComposition from "../components/AnalyticsFolder/TeamComposition";
import QuickStats from "../components/AnalyticsFolder/QuickStats";
import MatchPerformance from "../components/AnalyticsFolder/MatchPerformance";

const API_BASE = "http://localhost:3026/api/players";

const Analytics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState("");
  const [bestTeam, setBestTeam] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isGeneratingTeam, setIsGeneratingTeam] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const expertise = [
    { id: 1, role: "batsman" },
    { id: 2, role: "bowler" },
    { id: 3, role: "allrounder" },
    { id: 4, role: "keeper" }
  ];

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

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3026/api/teams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
        setTeams([]);
      }
    };

    if (token && role === "admin") {
      fetchTeams();
    }
  }, [token, role]);

  const fetchPlayerStats = async () => {
    try {
      setLoading(true);
      let endpoint = API_BASE;
      let params = {};

      if (role === "admin") {
        endpoint = `${API_BASE}/all`;
        if (selectedTeamId) {
          params.teamId = selectedTeamId;
        }
      } else if (role === "team_owner") {
        params.createdBy = userId;
      } else if (role === "player") {
        params.playerId = userId;
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const players = Array.isArray(res.data) ? res.data : res.data.players || [];
      setPlayerStats(players);
      setError("");
    } catch (err) {
      console.error("Error fetching player stats:", err.response?.data || err.message);
      setError("Failed to fetch player stats: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchBestTeam = async () => {
    try {
      setIsGeneratingTeam(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await axios.get(`${API_BASE}/select-team`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { teamId: selectedTeamId || undefined },
      });
      setBestTeam(res.data.bestTeam);
    } catch (err) {
      setError("Failed to select best team: " + (err.response?.data?.error || err.message));
    } finally {
      setIsGeneratingTeam(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const filteredStats = selectedRole ? playerStats.filter((player) => player.role === selectedRole) : playerStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <Header 
          error={error} 
          onRefresh={fetchPlayerStats}
          onNavigateToPointsTable={() => navigate('/points-table')}
        />

        <Filters
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          playerA={playerA}
          setPlayerA={setPlayerA}
          playerB={playerB}
          setPlayerB={setPlayerB}
          selectedTeamId={selectedTeamId}
          setSelectedTeamId={setSelectedTeamId}
          role={role}
          teams={teams}
          playerStats={playerStats}
          filteredStats={filteredStats}
          expertise={expertise}
           selectedPlayer={selectedPlayer} // ADD THIS
          setSelectedPlayer={setSelectedPlayer} // ADD THIS
        />

        <StatsCards filteredStats={filteredStats} />

                {/* ADD MATCH PERFORMANCE SECTION */}
        <div className="mt-8">
          <MatchPerformance 
            playerId={selectedPlayer}
            playerName={playerStats.find(p => p._id === selectedPlayer)?.name}
          />
        </div>

        <Charts
          playerStats={playerStats}
          filteredStats={filteredStats}
          playerA={playerA}
          playerB={playerB}
          selectedRole={selectedRole}
        />

        <BestPlaying11
          bestTeam={bestTeam}
          onGenerateTeam={fetchBestTeam}
          isGenerating={isGeneratingTeam}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <PerformanceInsights filteredStats={filteredStats} />
          <TeamComposition playerStats={playerStats} expertise={expertise} />
        </div>

        <QuickStats 
          playerStats={playerStats} 
          filteredStats={filteredStats} 
        />
      </div>
    </div>
  );
};

export default Analytics;