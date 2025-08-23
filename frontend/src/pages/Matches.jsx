// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const tabs = ["Live", "Upcoming", "Completed"];
// // const BASE_URL = "http://localhost:3026/api/matches"; // replace with your actual 3rd-party API + key

// // const Matches = () => {
// //   const [activeTab, setActiveTab] = useState("Live");
// //   const [matches, setMatches] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   // Local match management
// //   const [createdMatch, setCreatedMatch] = useState(null);
// //   const [score, setScore] = useState(null);
// //   const [inningsScores, setInningsScores] = useState([]);
// //   const [matchStatus, setMatchStatus] = useState("Not Started");
// //   const [currentInnings, setCurrentInnings] = useState(1);

// //   const fetchMatches = async (tab) => {
// //     setLoading(true);
// //     try {
// //       const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`);
// //       setMatches(res.data.matches || []);
// //     } catch (err) {
// //       console.error("Failed to fetch:", err);
// //       setMatches([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMatches(activeTab);
// //   }, [activeTab]);

// //   // Create local match
// //   const createMatch = async () => {
// //     try {
// //       const res = await axios.post("http://localhost:3026/matches", {
// //         teamA: "Team A",
// //         teamB: "Team B",
// //       });
// //       setCreatedMatch(res.data);
// //       setScore(res.data.currentScore);
// //       setMatchStatus("Live");
// //       setInningsScores([]);
// //       setCurrentInnings(1);
// //     } catch (err) {
// //       console.error(err.response?.data || err.message);
// //       alert("Error creating match");
// //     }
// //   };

// //   // Update ball in local match
// //   const updateBall = async (runs, isWicket = false) => {
// //     if (!createdMatch) return alert("Create a match first!");

// //     try {
// //       const res = await axios.patch(
// //         `http://localhost:3026/matches/${createdMatch._id}/ball`,
// //         { runs, isWicket }
// //       );

// //       const updatedMatch = res.data;

// //       if (updatedMatch.msg === "Match completed") {
// //         if (score) setInningsScores((prev) => [...prev, score]);
// //         setScore(null);
// //         setMatchStatus("Completed");
// //       } else {
// //         if (score && score.team !== updatedMatch.currentScore.team) {
// //           setInningsScores((prev) => [...prev, score]);
// //           setCurrentInnings((prev) => prev + 1);
// //           setScore({
// //             team: updatedMatch.currentScore.team,
// //             runs: 0,
// //             wickets: 0,
// //             overs: 0,
// //             balls: 0,
// //           });
// //         } else {
// //           setScore(updatedMatch.currentScore);
// //         }
// //       }

// //       setCreatedMatch(updatedMatch);
// //     } catch (err) {
// //       console.error(err.response?.data || err.message);
// //       alert("Error updating score");
// //     }
// //   };

// //   return (
// //     <div className="p-4">
// //       {/* Tabs */}
// //       <div className="flex gap-4 mb-4">
// //         {tabs.map((tab) => (
// //           <button
// //             key={tab}
// //             onClick={() => setActiveTab(tab)}
// //             className={`px-4 py-2 rounded ${
// //               activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
// //             }`}
// //           >
// //             {tab}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Match List */}
// //       {loading ? (
// //         <p>Loading matches...</p>
// //       ) : (
// //         <div>
// //           {matches
// //             .filter((m) => {
// //               if (activeTab === "Live") return m.status === "live";
// //               if (activeTab === "Upcoming") return m.status === "upcoming";
// //               if (activeTab === "Completed") return m.status === "completed";
// //               return true;
// //             })
// //             .map((match) => (
// //               <div
// //                 key={match.id}
// //                 className="border p-3 rounded mb-2 bg-white shadow"
// //               >
// //                 <p>
// //                   {match.teams?.[0]} vs {match.teams?.[1]}
// //                 </p>
// //                 <p>Status: {match.status}</p>
// //               </div>
// //             ))}
// //         </div>
// //       )}

// //       {/* Local Match Controls */}
// //       <div className="mt-6 border-t pt-4">
// //         <h2 className="text-lg font-bold mb-2">Local Match (Your App)</h2>
// //         {!createdMatch ? (
// //           <button
// //             onClick={createMatch}
// //             className="px-4 py-2 bg-green-600 text-white rounded"
// //           >
// //             Create Match
// //           </button>
// //         ) : (
// //           <div>
// //             <p>Status: {matchStatus}</p>
// //             {score && (
// //               <p>
// //                 Team {score.team}: {score.runs}/{score.wickets} ({score.overs}.
// //                 {score.balls})
// //               </p>
// //             )}
// //             <div className="flex gap-2 mt-2">
// //               <button
// //                 onClick={() => updateBall(1)}
// //                 className="px-3 py-1 bg-blue-500 text-white rounded"
// //               >
// //                 1 Run
// //               </button>
// //               <button
// //                 onClick={() => updateBall(4)}
// //                 className="px-3 py-1 bg-blue-500 text-white rounded"
// //               >
// //                 4 Runs
// //               </button>
// //               <button
// //                 onClick={() => updateBall(6)}
// //                 className="px-3 py-1 bg-blue-500 text-white rounded"
// //               >
// //                 6 Runs
// //               </button>
// //               <button
// //                 onClick={() => updateBall(0, true)}
// //                 className="px-3 py-1 bg-red-500 text-white rounded"
// //               >
// //                 Wicket
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Matches;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const tabs = ["Live", "Upcoming", "Completed"];
// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   const [activeTab, setActiveTab] = useState("Live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // fetch matches when tab changes
//   // const fetchMatches = async (category) => {
//   //   setLoading(true);
//   //   setError("");
//   //   try {
//   //     const res = await axios.get(`${BASE_URL}${category.toLowerCase()}`);

//   //     // ✅ Ensure API response is always an array
//   //     let data = res.data;
//   //     if (!Array.isArray(data)) {
//   //       if (data.matches) {
//   //         data = data.matches;
//   //       } else {
//   //         data = [];
//   //       }
//   //     }

//   //     setMatches(data);
//   //   } catch (err) {
//   //     console.error("Error fetching matches:", err);
//   //     setError("Failed to load matches");
//   //     setMatches([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

  
//     const fetchMatches = async (tab) => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`);
//         setMatches(res.data.matches || []);
//       } catch (err) {
//         console.error("Failed to fetch:", err);
//         setMatches([]);
//       } finally {
//         setLoading(false);
//       }
//     };
  


//   useEffect(() => {
//     fetchMatches(activeTab);
//   }, [activeTab]);

//   return (
//     <div className="p-6">
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-lg font-semibold transition ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white shadow"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Loading State */}
//       {loading && <p className="text-gray-500">Loading {activeTab} matches...</p>}

//       {/* Error State */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Matches List */}
//       {!loading && !error && matches.length === 0 && (
//         <p className="text-gray-500">No {activeTab} matches available.</p>
//       )}

//       {!loading && !error && matches.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {matches.map((match, idx) => (
//             <div
//               key={match._id || idx}
//               className="p-4 border rounded-lg shadow bg-white"
//             >
//               <h2 className="text-lg font-bold mb-2">
//                 {match.team1?.name || match.team1} vs{" "}
//                 {match.team2?.name || match.team2}
//               </h2>
//               <p>
//                 <strong>Status:</strong> {match.status || "N/A"}
//               </p>
//               <p>
//                 <strong>Score:</strong>{" "}
//                 {match.score
//                   ? `${match.score.team1 || 0} - ${match.score.team2 || 0}`
//                   : "Not available"}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {match.date
//                   ? new Date(match.date).toLocaleString()
//                   : "Not available"}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const tabs = ["Live", "Upcoming", "Completed"];
// const BASE_URL = "http://localhost:3026/api/matches"; // adjust if needed

// const Matches = () => {
//   const [title, setTitle] = useState("");
//   const [team1, setTeam1] = useState("");
//   const [team2, setTeam2] = useState("");
//   const [team1Players, setTeam1Players] = useState("");
//   const [team2Players, setTeam2Players] = useState("");
//   const [overs, setOvers] = useState(20);
//   const [battingTeam, setBattingTeam] = useState("Team 1");
//   const [status, setStatus] = useState("Upcoming");

//   const [activeTab, setActiveTab] = useState("Live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [score, setScore] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [inningsScores, setInningsScores] = useState([]);
//   const [currentInnings, setCurrentInnings] = useState(1);

//   const [showForm, setShowForm] = useState(false); // toggle modal

//   const fetchMatches = async (status) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}?status=${status}`);
//       setMatches(res.data);
//     } catch (error) {
//       console.error("Error fetching matches:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches(activeTab);
//   }, [activeTab]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const team1List = team1Players.split(",").map((p) => p.trim());
//     const team2List = team2Players.split(",").map((p) => p.trim());

//     const matchData = {
//       title,
//       teams: [
//         { name: team1, players: team1List },
//         { name: team2, players: team2List },
//       ],
//       overs: Number(overs),
//       currentScore: {
//         team: battingTeam === "Team 1" ? 0 : 1,
//         runs: 0,
//         wickets: 0,
//         overs: 0,
//         balls: 0,
//         innings: 1,
//       },
//       status,
//       createdBy: "64e8f9c2a1b2c3d4e5f67890",
//       date: new Date(),
//     };

//     try {
//       const res = await axios.post("http://localhost:3026/matches", matchData);
//       setCreatedMatch(res.data);
//       setScore(res.data.currentScore);
//       setMatchStatus(status);
//       setInningsScores([]);
//       setCurrentInnings(1);
//       setShowForm(false); // close modal after submit
//       alert("Match created successfully!");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Error creating match");
//     }
//   };

//   const updateBall = async (runs, isWicket = false) => {
//     if (!createdMatch) return alert("Create a match first!");

//     try {
//       const res = await axios.patch(
//         `http://localhost:3026/matches/${createdMatch._id}/ball`,
//         { runs, isWicket }
//       );

//       const updatedMatch = res.data;

//       if (updatedMatch.msg === "Match completed") {
//         if (score) {
//           setInningsScores((prev) => [...prev, score]);
//         }
//         setScore(null);
//         setMatchStatus("Completed");
//       } else {
//         if (score && score.team !== updatedMatch.currentScore.team) {
//           setInningsScores((prev) => [...prev, score]);
//           setCurrentInnings((prev) => prev + 1);
//           setScore({
//             team: updatedMatch.currentScore.team,
//             runs: 0,
//             wickets: 0,
//             overs: 0,
//             balls: 0,
//           });
//         } else {
//           setScore(updatedMatch.currentScore);
//         }
//       }

//       setCreatedMatch(updatedMatch);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Error updating score");
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 rounded-lg font-semibold ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Matches List */}
//       {loading ? (
//         <p>Loading matches...</p>
//       ) : matches.length === 0 ? (
//         <p>No {activeTab} matches found.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {matches.map((match) => (
//             <div
//               key={match._id}
//               className="border border-gray-300 rounded-xl shadow-md p-4 bg-white"
//             >
//               <h2 className="text-xl font-bold text-gray-900 mb-2">
//                 {match.title}
//               </h2>
//               <div className="mb-3">
//                 {match.teams?.map((team, index) => (
//                   <p key={index} className="text-gray-800">
//                     <span className="font-semibold">{team.name}</span>
//                     {team.players?.length > 0 && (
//                       <span className="text-sm text-gray-500">
//                         {" "}
//                         ({team.players.join(", ")})
//                       </span>
//                     )}
//                   </p>
//                 ))}
//               </div>
//               {match.currentScore && (
//                 <div className="bg-gray-100 rounded-lg p-2 mb-3">
//                   <p className="text-gray-700 font-medium">
//                     <span className="font-semibold">
//                       {match.teams?.[match.currentScore.team]?.name || "TBD"}
//                     </span>{" "}
//                     - {match.currentScore.runs}/{match.currentScore.wickets}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Overs: {match.currentScore.overs}.{match.currentScore.balls}
//                   </p>
//                 </div>
//               )}
//               <p className="text-sm text-gray-600">
//                 Format: {match.overs} overs
//               </p>
//               <p className="text-sm text-gray-600">
//                 Status: <span className="font-semibold">{match.status}</span>
//               </p>
//               <p className="text-sm text-gray-500">
//                 Date: {new Date(match.date).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Create Match Button */}
//       {!createdMatch && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//           >
//             Create Match
//           </button>
//         </div>
//       )}

//       {/* Create Match Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-xl font-bold mb-4">Create Custom Match</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Match Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 1 Name"
//                 value={team1}
//                 onChange={(e) => setTeam1(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 1 Players (comma separated)"
//                 value={team1Players}
//                 onChange={(e) => setTeam1Players(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Team 2 Name"
//                 value={team2}
//                 onChange={(e) => setTeam2(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 2 Players (comma separated)"
//                 value={team2Players}
//                 onChange={(e) => setTeam2Players(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Overs"
//                 value={overs}
//                 onChange={(e) => setOvers(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <select
//                 value={battingTeam}
//                 onChange={(e) => setBattingTeam(e.target.value)}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="Team 1">Team 1 Batting</option>
//                 <option value="Team 2">Team 2 Batting</option>
//               </select>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="Upcoming">Upcoming</option>
//                 <option value="Live">Live</option>
//                 <option value="Completed">Completed</option>
//               </select>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//                 >
//                   Create Match
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Created Match View */}
//       {createdMatch && (
//         <div className="mt-6 p-4 border rounded shadow">
//           <h3 className="text-lg font-bold mb-2">{createdMatch.title}</h3>
//           <p>
//             Status:{" "}
//             <span className="font-semibold">
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </p>

//           {inningsScores.map((s, i) => (
//             <div key={i} className="mt-2 p-2 border rounded bg-gray-50">
//               <h4 className="font-semibold">
//                 Innings {i + 1}: {createdMatch.teams[s.team]?.name}
//               </h4>
//               <p>
//                 Score: {s.runs}/{s.wickets} in {s.overs}.{s.balls} overs
//               </p>
//             </div>
//           ))}

//           {score ? (
//             <div className="mt-4">
//               <p>
//                 Batting:{" "}
//                 <span className="font-semibold">
//                   {createdMatch.teams[score.team]?.name || "TBD"}
//                 </span>
//               </p>
//               <p>
//                 Score:{" "}
//                 <span className="font-semibold">
//                   {score.runs}/{score.wickets}
//                 </span>{" "}
//                 in {score.overs}.{score.balls} overs
//               </p>
//             </div>
//           ) : (
//             <p>Waiting for score update...</p>
//           )}

//           {matchStatus !== "Completed" && score && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-bold">Update Score</h4>
//               <div className="flex gap-2 flex-wrap">
//                 {[0, 1, 2, 3, 4, 6].map((run) => (
//                   <button
//                     key={run}
//                     onClick={() => updateBall(run)}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     {run}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => updateBall(0, true)}
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Wicket
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;


///////////////////////////////////////////

// import React, { useState } from "react";
// import axios from "axios";

// const Matches = () => {
//   const [title, setTitle] = useState("");
//   const [team1, setTeam1] = useState("");
//   const [team2, setTeam2] = useState("");
//   const [team1Players, setTeam1Players] = useState("");
//   const [team2Players, setTeam2Players] = useState("");
//   const [overs, setOvers] = useState(20);
//   const [battingTeam, setBattingTeam] = useState("Team 1");
//   const [status, setStatus] = useState("Upcoming");

//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [score, setScore] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [inningsScores, setInningsScores] = useState([]);
//   const [currentInnings, setCurrentInnings] = useState(1);

//   const [showForm, setShowForm] = useState(false);

//   // Create a new custom match
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const team1List = team1Players.split(",").map((p) => p.trim());
//     const team2List = team2Players.split(",").map((p) => p.trim());

//     const matchData = {
//       title,
//       teams: [
//         { name: team1, players: team1List },
//         { name: team2, players: team2List },
//       ],
//       overs: Number(overs),
//       currentScore: {
//         team: battingTeam === "Team 1" ? 0 : 1,
//         runs: 0,
//         wickets: 0,
//         overs: 0,
//         balls: 0,
//         innings: 1,
//       },
//       status,
//       createdBy: "66c5d75ff1f3a48f2a3b7c1a", // static since no login yet
//       date: new Date(),
//     };

//     try {
//       const res = await axios.post("http://localhost:3026/matches", matchData);
//       setCreatedMatch(res.data);
//       setScore(res.data.currentScore);
//       setMatchStatus(status);
//       setInningsScores([]);
//       setCurrentInnings(1);
//       setShowForm(false);
//       alert("Match created successfully!");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Error creating match");
//     }
//   };

//   // Ball-by-ball update
//   const updateBall = async (runs, isWicket = false) => {
//     if (!createdMatch) return alert("Create a match first!");

//     try {
//       const res = await axios.patch(
//         `http://localhost:3026/matches/${createdMatch._id}/ball`,
//         { runs, isWicket }
//       );

//       const updatedMatch = res.data;

//       if (updatedMatch.msg === "Match completed") {
//         if (score) {
//           setInningsScores((prev) => [...prev, score]);
//         }
//         setScore(null);
//         setMatchStatus("Completed");
//       } else {
//         if (score && score.team !== updatedMatch.currentScore.team) {
//           setInningsScores((prev) => [...prev, score]);
//           setCurrentInnings((prev) => prev + 1);
//           setScore({
//             team: updatedMatch.currentScore.team,
//             runs: 0,
//             wickets: 0,
//             overs: 0,
//             balls: 0,
//           });
//         } else {
//           setScore(updatedMatch.currentScore);
//         }
//       }

//       setCreatedMatch(updatedMatch);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Error updating score");
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Create Match Button */}
//       {!createdMatch && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//           >
//             Create Match
//           </button>
//         </div>
//       )}

//       {/* Create Match Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-xl font-bold mb-4">Create Custom Match</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Match Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 1 Name"
//                 value={team1}
//                 onChange={(e) => setTeam1(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 1 Players (comma separated)"
//                 value={team1Players}
//                 onChange={(e) => setTeam1Players(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Team 2 Name"
//                 value={team2}
//                 onChange={(e) => setTeam2(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 2 Players (comma separated)"
//                 value={team2Players}
//                 onChange={(e) => setTeam2Players(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Overs"
//                 value={overs}
//                 onChange={(e) => setOvers(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <select
//                 value={battingTeam}
//                 onChange={(e) => setBattingTeam(e.target.value)}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="Team 1">Team 1 Batting</option>
//                 <option value="Team 2">Team 2 Batting</option>
//               </select>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="Upcoming">Upcoming</option>
//                 <option value="Live">Live</option>
//                 <option value="Completed">Completed</option>
//               </select>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//                 >
//                   Create Match
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Created Match View */}
//       {createdMatch && (
//         <div className="mt-6 p-4 border rounded shadow">
//           <h3 className="text-lg font-bold mb-2">{createdMatch.title}</h3>
//           <p>
//             Status:{" "}
//             <span className="font-semibold">
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </p>

//           {inningsScores.map((s, i) => (
//             <div key={i} className="mt-2 p-2 border rounded bg-gray-50">
//               <h4 className="font-semibold">
//                 Innings {i + 1}: {createdMatch.teams[s.team]?.name}
//               </h4>
//               <p>
//                 Score: {s.runs}/{s.wickets} in {s.overs}.{s.balls} overs
//               </p>
//             </div>
//           ))}

//           {score ? (
//             <div className="mt-4">
//               <p>
//                 Batting:{" "}
//                 <span className="font-semibold">
//                   {createdMatch.teams[score.team]?.name || "TBD"}
//                 </span>
//               </p>
//               <p>
//                 Score:{" "}
//                 <span className="font-semibold">
//                   {score.runs}/{score.wickets}
//                 </span>{" "}
//                 in {score.overs}.{score.balls} overs
//               </p>
//             </div>
//           ) : (
//             <p>Waiting for score update...</p>
//           )}

//           {matchStatus !== "Completed" && score && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-bold">Update Score</h4>
//               <div className="flex gap-2 flex-wrap">
//                 {[0, 1, 2, 3, 4, 6].map((run) => (
//                   <button
//                     key={run}
//                     onClick={() => updateBall(run)}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     {run}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => updateBall(0, true)}
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Wicket
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;
////////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
  const tabs = ["Live", "Upcoming", "Completed"];
const BASE_URL = "http://localhost:3026/api/matches";
const Matches = () => {
      // const token = localStorage.getItem('token');
  // const role = localStorage.getItem("role");

  const [title, setTitle] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [team1Players, setTeam1Players] = useState("");
  const [team2Players, setTeam2Players] = useState("");
  const [overs, setOvers] = useState(20);
  const [battingTeam, setBattingTeam] = useState("Team 1");
  const [status, setStatus] = useState("Upcoming");

  const [createdMatch, setCreatedMatch] = useState(null);
  const [score, setScore] = useState(null);
  const [matchStatus, setMatchStatus] = useState("Live");
  const [inningsScores, setInningsScores] = useState([]);
  const [currentInnings, setCurrentInnings] = useState(1);

  const [showForm, setShowForm] = useState(false);
    const token = localStorage.getItem("token");
  // const userId = JSON.parse(localStorage.getItem("userId"));
  // const role = localStorage.getItem("role");

  // Tabs state
   const [activeTab, setActiveTab] = useState("Live");
   const [matches, setMatches] = useState([]);
   const [loading, setLoading] = useState(false);


  /** ✅ Streaming states */
  const [isStreaming, setIsStreaming] = useState(false);
  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
 
   const fetchMatches = async (tab) => {
     setLoading(true);
     try {
       const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`);
       setMatches(res.data.matches || []);
     } catch (err) {
       console.error("Failed to fetch:", err);
       setMatches([]);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     fetchMatches(activeTab);
   }, [activeTab]);
 

  // Create a new custom match
  const handleSubmit = async (e) => {
    e.preventDefault();

    const team1List = team1Players.split(",").map((p) => p.trim());
    const team2List = team2Players.split(",").map((p) => p.trim());

    const matchData = {
      title,
      teams: [
        { name: team1, players: team1List },
        { name: team2, players: team2List },
      ],
      overs: Number(overs),
      currentScore: {
        team: battingTeam === "Team 1" ? 0 : 1,
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        innings: 1,
      },
      status,
      // createdBy: "66c5d75ff1f3a48f2a3b7c1a", // static since no login yet
      createdBy: String(localStorage.getItem("userId")),
      date: new Date(),
    };

    try {
      const res = await axios.post("http://localhost:3026/matches", matchData,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
      setCreatedMatch(res.data);
      setScore(res.data.currentScore);
      setMatchStatus(status);
      setInningsScores([]);
      setCurrentInnings(1);
      setShowForm(false);
      alert("Match created successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating match");
    }
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("You are not logged in. Please login first.");
//     return;
//   }

//   const team1List = team1Players.split(",").map((p) => p.trim());
//   const team2List = team2Players.split(",").map((p) => p.trim());

//   const matchData = {
//     title,
//     teams: [
//       { name: team1, players: team1List },
//       { name: team2, players: team2List },
//     ],
//     overs: Number(overs),
//     currentScore: {
//       team: battingTeam === "Team 1" ? 0 : 1,
//       runs: 0,
//       wickets: 0,
//       overs: 0,
//       balls: 0,
//       innings: 1,
//     },
//     status,
//     date: new Date(),
//   };

//   try {
//     const res = await axios.post("http://localhost:3026/matches", matchData, {
//       headers: {
//         Authorization: `Bearer ${token}`, // ✅ IMPORTANT
//         "Content-Type": "application/json",
//       },
//     });

//     setCreatedMatch(res.data);
//     setScore(res.data.currentScore);
//     setMatchStatus(status);
//     setInningsScores([]);
//     setCurrentInnings(1);
//     setShowForm(false);
//     alert("✅ Match created successfully!");
//   } catch (err) {
//     console.error("❌ Error:", err.response?.data || err.message);
//     const errorMsg =
//       err.response?.data?.error ||
//       err.response?.data?.message ||
//       "Error creating match.";
//     alert(errorMsg);
//   }
// };


  // Ball-by-ball update
  const updateBall = async (runs, isWicket = false) => {
    if (!createdMatch) return alert("Create a match first!");

    try {
      const res = await axios.patch(
        `http://localhost:3026/matches/${createdMatch._id}/ball`,
        { runs, isWicket }
      );

      const updatedMatch = res.data;

      if (updatedMatch.msg === "Match completed") {
        if (score) {
          setInningsScores((prev) => [...prev, score]);
        }
        setScore(null);
        setMatchStatus("Completed");
      } else {
        if (score && score.team !== updatedMatch.currentScore.team) {
          setInningsScores((prev) => [...prev, score]);
          setCurrentInnings((prev) => prev + 1);
          setScore({
            team: updatedMatch.currentScore.team,
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
          });
        } else {
          setScore(updatedMatch.currentScore);
        }
      }

      setCreatedMatch(updatedMatch);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating score");
    }
  };

  
  /** ✅ Start Streaming */
  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsStreaming(true);

      /** Create RTCPeerConnection */
      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // Placeholder for signaling
      console.log("✅ Streaming started. Setup signaling now.");
    } catch (err) {
      console.error("Error starting stream:", err);
      alert("Failed to start streaming");
    }
  };

   /** ✅ Stop Streaming */
  const stopStreaming = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsStreaming(false);
    console.log("✅ Streaming stopped");
  };


  return (
    <div className="p-6">
      {/* Tabs */}

      <div className="flex space-x-6 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
              {!createdMatch && (
        <div className="mt-0 text-center ml-112">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Create Match
          </button>
        </div>
      )}
      </div>

       {/* ✅ Streaming Section */}
      {createdMatch && (
        <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-50">
          <h3 className="text-lg font-bold mb-2">🎥 Live Streaming</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-lg border rounded"
          />
          <div className="mt-3 flex gap-4">
            {!isStreaming ? (
              <button
                onClick={startStreaming}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Start Streaming
              </button>
            ) : (
              <button
                onClick={stopStreaming}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Stop Streaming
              </button>
            )}
          </div>
        </div>
      )}

      {/* Matches List */}
      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length > 0 ? (
        <div className="grid gap-4">
          {matches.map((match, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{match.name}</h2>
              
              <p>{match.t1} <strong>vs</strong> {match.t2}</p>
              <p>Score: {match.t1}-{match.t1s}, {match.t2}-{match.t2s}   </p>
              <p><strong>Status: {match.status}</strong></p>
              <p>Date: {new Date(match.dateTimeGMT).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matches found for {activeTab}.</p>
      )}

      {/* Create Match Button */}
      {/* {!createdMatch && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Create Match
          </button>
        </div>
      )} */}

      {/* Create Match Modal */}
      {showForm && !createdMatch && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-blue-700 text-xl font-bold mb-4">Create Custom Match</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Match Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Team 1 Name"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Team 1 Players (comma separated)"
                value={team1Players}
                onChange={(e) => setTeam1Players(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Team 2 Name"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Team 2 Players (comma separated)"
                value={team2Players}
                onChange={(e) => setTeam2Players(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Overs"
                value={overs}
                onChange={(e) => setOvers(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <select
                value={battingTeam}
                onChange={(e) => setBattingTeam(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Team 1">Team 1 Batting</option>
                <option value="Team 2">Team 2 Batting</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Create Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Created Match View */}
      {createdMatch && (
        <div className="mt-6 p-4 border rounded shadow">
          <h3 className="text-lg font-bold mb-2">{createdMatch.title}</h3>
          <p>
            Status:{" "}
            <span className="font-semibold">
              {matchStatus === "Completed" ? "Match Over" : matchStatus}
            </span>
          </p>

          {inningsScores.map((s, i) => (
            <div key={i} className="mt-2 p-2 border rounded bg-gray-50">
              <h4 className="font-semibold">
                Innings {i + 1}: {createdMatch.teams[s.team]?.name}
              </h4>
              <p>
                Score: {s.runs}/{s.wickets} in {s.overs}.{s.balls} overs
              </p>
            </div>
          ))}

          {score ? (
            <div className="mt-4">
              <p>
                Batting:{" "}
                <span className="font-semibold">
                  {createdMatch.teams[score.team]?.name || "TBD"}
                </span>
              </p>
              <p>
                Score:{" "}
                <span className="font-semibold">
                  {score.runs}/{score.wickets}
                </span>{" "}
                in {score.overs}.{score.balls} overs
              </p>
            </div>
          ) : (
            <p>Waiting for score update...</p>
          )}

          {matchStatus !== "Completed" && score && (
            <div className="mt-4 space-y-2">
              <h4 className="font-bold">Update Score</h4>
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2, 3, 4, 6].map((run) => (
                  <button
                    key={run}
                    onClick={() => updateBall(run)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    {run}
                  </button>
                ))}
                <button
                  onClick={() => updateBall(0, true)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Wicket
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Matches;





// // ///////////////////////////////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import StreamSettings from "../components/StreamSettings";
// import axios from "axios";

// const tabs = ["Live", "Upcoming", "Completed"];
// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   const navigate = useNavigate();
//   // const user = JSON.parse(localStorage.getItem("user")) || null;
//     const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // Check authentication
//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in to view matches!");
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   const [title, setTitle] = useState("");
//   const [team1, setTeam1] = useState("");
//   const [team2, setTeam2] = useState("");
//   const [team1Players, setTeam1Players] = useState("");
//   const [team2Players, setTeam2Players] = useState("");
//   const [overs, setOvers] = useState(20);
//   const [battingTeam, setBattingTeam] = useState("Team 1");
//   const [status, setStatus] = useState("Upcoming");
//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [score, setScore] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [inningsScores, setInningsScores] = useState([]);
//   const [currentInnings, setCurrentInnings] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   const [activeTab, setActiveTab] = useState("Live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchMatches = async (tab) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMatches(res.data.matches || []);
//     } catch (err) {
//       console.error("Failed to fetch:", err);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches(activeTab);
//   }, [activeTab]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const team1List = team1Players.split(",").map((p) => p.trim());
//   //   const team2List = team2Players.split(",").map((p) => p.trim());

//   //   const matchData = {
//   //     title,
//   //     teams: [
//   //       { name: team1, players: team1List },
//   //       { name: team2, players: team2List },
//   //     ],
//   //     overs: Number(overs),
//   //     currentScore: {
//   //       team: battingTeam === "Team 1" ? 0 : 1,
//   //       runs: 0,
//   //       wickets: 0,
//   //       overs: 0,
//   //       balls: 0,
//   //       innings: 1,
//   //     },
//   //     status,
//   //     // createdBy: user_id, // dynamic now
//   //     date: new Date(),
//   //   };

//   //   try {
//   //     const res = await axios.post("http://localhost:3026/matches", matchData, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     setCreatedMatch(res.data);
//   //     setScore(res.data.currentScore);
//   //     setMatchStatus(status);
//   //     setInningsScores([]);
//   //     setCurrentInnings(1);
//   //     setShowForm(false);
//   //     alert("Match created successfully!");
//   //   } catch (err) {
//   //     console.error(err.response?.data || err.message);
//   //     alert("Error creating match");
//   //   }
//   // };

  

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const team1List = team1Players.split(",").map((p) => p.trim());
//   const team2List = team2Players.split(",").map((p) => p.trim());

//   let userId = null;
//   try {
//     const decoded = jwtDecode(token);
//     userId = decoded.userId; // Make sure your backend sends this in the token
//   } catch (err) {
//     console.error("Invalid token:", err);
//     alert("Authentication error! Please log in again.");
//     navigate("/login");
//     return;
//   }

//   const matchData = {
//     title,
//     teams: [
//       { name: team1, players: team1List },
//       { name: team2, players: team2List },
//     ],
//     overs: Number(overs),
//     currentScore: {
//       team: battingTeam === "Team 1" ? 0 : 1,
//       runs: 0,
//       wickets: 0,
//       overs: 0,
//       balls: 0,
//       innings: 1,
//     },
//     status,
//     createdBy: userId, // ✅ Now included
//     date: new Date(),
//   };

//   try {
//     const res = await axios.post("http://localhost:3026/matches", matchData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setCreatedMatch(res.data);
//     setScore(res.data.currentScore);
//     setMatchStatus(status);
//     setInningsScores([]);
//     setCurrentInnings(1);
//     setShowForm(false);
//     alert("Match created successfully!");
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     alert("Error creating match");
//   }
// };

//   const updateBall = async (runs, isWicket = false) => {
//     if (!createdMatch) return alert("Create a match first!");
//     try {
//       const res = await axios.patch(
//         `http://localhost:3026/matches/${createdMatch._id}/ball`,
//         { runs, isWicket },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedMatch = res.data;
//       if (updatedMatch.msg === "Match completed") {
//         if (score) setInningsScores((prev) => [...prev, score]);
//         setScore(null);
//         setMatchStatus("Completed");
//       } else {
//         if (score && score.team !== updatedMatch.currentScore.team) {
//           setInningsScores((prev) => [...prev, score]);
//           setCurrentInnings((prev) => prev + 1);
//           setScore({
//             team: updatedMatch.currentScore.team,
//             runs: 0,
//             wickets: 0,
//             overs: 0,
//             balls: 0,
//           });
//         } else {
//           setScore(updatedMatch.currentScore);
//         }
//       }
//       setCreatedMatch(updatedMatch);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Error updating score");
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Tabs */}

//       <div className="flex space-x-6 mb-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 rounded ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//               {!createdMatch && (
//         <div className="mt-0 text-center ml-112">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//           >
//             Create Match
//           </button>
//         </div>
//       )}
//       </div>

//       {/* Matches List */}
//       {loading ? (
//         <p>Loading matches...</p>
//       ) : matches.length > 0 ? (
//         <div className="grid gap-4">
//           {matches.map((match, index) => (
//             <div key={index} className="p-4 border rounded shadow">
//               <h2 className="text-lg font-semibold">{match.name}</h2>
              
//               <p>{match.t1} <strong>vs</strong> {match.t2}</p>
//               <p>Score: {match.t1}-{match.t1s}, {match.t2}-{match.t2s}   </p>
//               <p><strong>Status: {match.status}</strong></p>
//               <p>Date: {new Date(match.dateTimeGMT).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No matches found for {activeTab}.</p>
//       )}
//       {createdMatch && (
//   <StreamSettings
//     match={createdMatch}
//     role={role}
//     onUpdated={(updatedMatch) => setCreatedMatch(updatedMatch)}
//   />
// )}


//       {/* Create Match Button */}
//       {/* {!createdMatch && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//           >
//             Create Match
//           </button>
//         </div>
//       )} */}

//       {/* Create Match Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-blue-700 text-xl font-bold mb-4">Create Custom Match</h2>
//             <form onSubmit={handleSubmit} className="space-y-2">
//               <input
//                 type="text"
//                 placeholder="Match Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 1 Name"
//                 value={team1}
//                 onChange={(e) => setTeam1(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 1 Players (comma separated)"
//                 value={team1Players}
//                 onChange={(e) => setTeam1Players(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Team 2 Name"
//                 value={team2}
//                 onChange={(e) => setTeam2(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Team 2 Players (comma separated)"
//                 value={team2Players}
//                 onChange={(e) => setTeam2Players(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Overs"
//                 value={overs}
//                 onChange={(e) => setOvers(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <select
//                 value={battingTeam}
//                 onChange={(e) => setBattingTeam(e.target.value)}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="Team 1">Team 1 Batting</option>
//                 <option value="Team 2">Team 2 Batting</option>
//               </select>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="Upcoming">Upcoming</option>
//                 <option value="Live">Live</option>
//                 <option value="Completed">Completed</option>
//               </select>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//                 >
//                   Create Match
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}


//       {/* Created Match View */}
//       {createdMatch && (
//         <div className="mt-6 p-4 border rounded shadow">
//           <h3 className="text-lg font-bold mb-2">{createdMatch.title}</h3>
//           <p>
//             Status:{" "}
//             <span className="font-semibold">
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </p>

//           {inningsScores.map((s, i) => (
//             <div key={i} className="mt-2 p-2 border rounded bg-gray-50">
//               <h4 className="font-semibold">
//                 Innings {i + 1}: {createdMatch.teams[s.team]?.name}
//               </h4>
//               <p>
//                 Score: {s.runs}/{s.wickets} in {s.overs}.{s.balls} overs
//               </p>
//             </div>
//           ))}

//           {score ? (
//             <div className="mt-4">
//               <p>
//                 Batting:{" "}
//                 <span className="font-semibold">
//                   {createdMatch.teams[score.team]?.name || "TBD"}
//                 </span>
//               </p>
//               <p>
//                 Score:{" "}
//                 <span className="font-semibold">
//                   {score.runs}/{score.wickets}
//                 </span>{" "}
//                 in {score.overs}.{score.balls} overs
//               </p>
//             </div>
//           ) : (
//             <p>Waiting for score update...</p>
//           )}

//           {matchStatus !== "Completed" && score && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-bold">Update Score</h4>
//               <div className="flex gap-2 flex-wrap">
//                 {[0, 1, 2, 3, 4, 6].map((run) => (
//                   <button
//                     key={run}
//                     onClick={() => updateBall(run)}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     {run}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => updateBall(0, true)}
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Wicket
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
      
//     </div>
//   );
// };
// export default Matches;


