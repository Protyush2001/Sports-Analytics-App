// //////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import MatchCard from "../components/MatchCard";
// import MatchForm from "../components/MatchForm";
// import ScoreUpdater from "../components/ScoreUpdater";
// import StreamBroadcaster from "../components/StreamBroadcaster";
// import StreamViewer from "../components/StreamViewer";

// const tabs = ["Live", "Upcoming", "Completed"];
// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [showForm, setShowForm] = useState(false);

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");

//   const [activeTab, setActiveTab] = useState("Live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [isStreaming, setIsStreaming] = useState(false);
//   const localVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const socket = useRef(null);
//   const [liveUpdates, setLiveUpdates] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const matchesPerPage = 6;
//   const indexOfLastMatch = currentPage * matchesPerPage;
//   const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
//   const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
//   const totalPages = Math.ceil(matches.length / matchesPerPage);

//   // Socket connection setup
//   useEffect(() => {
//     socket.current = io("http://localhost:3026");

//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, []);

//   const fetchMatches = async (tab) => {
//     setLoading(true);
//     try {
//       // Updated API endpoint to match backend
//       const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // setMatches(filteredMatches);
//       setMatches(res.data.matches || []);
//     } catch (err) {
//       console.error("Failed to fetch:", err);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Match-specific socket listener
//   useEffect(() => {
//     if (createdMatch && socket.current) {
//       const matchId = createdMatch._id;

//       socket.current.off(`match-${matchId}-ballUpdate`);
//       socket.current.on(`match-${matchId}-ballUpdate`, (data) => {
//         setLiveUpdates((prev) => [...prev, data]);
//         // Auto-refresh match data when receiving updates
//         refreshMatch(matchId);
//       });

//       return () => {
//         socket.current.off(`match-${matchId}-ballUpdate`);
//       };
//     }
//   }, [createdMatch]);

//   useEffect(() => {
//     fetchMatches(activeTab);
//     setLiveUpdates([]);
//   }, [activeTab, token, userId, role]);

//   // Helper function to refresh single match data
//   const refreshMatch = async (matchId) => {
//     try {
//       const res = await axios.get(`http://localhost:3026/api/matches/${matchId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCreatedMatch(res.data);
//       setMatchStatus(res.data.status);
//     } catch (err) {
//       console.error("Failed to refresh match:", err);
//     }
//   };

//   const handleMatchCreated = (match) => {
//     setCreatedMatch(match);
//     setMatchStatus(match.status);
//     setShowForm(false);
//   };

//   const handleScoreUpdated = (updatedMatch) => {
//     setCreatedMatch(updatedMatch);
//     setMatchStatus(updatedMatch.status);

//     // Refresh the matches list if status changed
//     if (updatedMatch.status !== matchStatus) {
//       fetchMatches(activeTab);
//     }
//   };

//   // const stopStreaming = () => {
//   //   if (localVideoRef.current?.srcObject) {
//   //     localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//   //   }
//   //   if (peerConnection.current) {
//   //     peerConnection.current.close();
//   //     peerConnection.current = null;
//   //   }
//   //   setIsStreaming(false);
//   //   console.log("✅ Streaming stopped");
//   // };

//   // Helper function to format overs display

//   const startStreaming = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//     }
//     setIsStreaming(true);
//     peerConnection.current = new RTCPeerConnection();
//     stream.getTracks().forEach((track) => {
//       peerConnection.current.addTrack(track, stream);
//     });
//     console.log("Streaming started locally");

//     // 🔹 call backend to mark stream started
//     await axios.post(
//       `${BASE_URL}/${createdMatch._id}/start-stream`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     // 🔹 refresh match data
//     await refreshMatch(createdMatch._id);
//   } catch (err) {
//     console.error("Error starting stream:", err);
//     alert("Failed to start streaming");
//   }
// };

//   const stopStreaming = async () => {
//   try {
//     // Stop local tracks
//     if (localVideoRef.current?.srcObject) {
//       localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//     }
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }
//     setIsStreaming(false);
//     console.log(" Streaming stopped locally");

//     // 🔹 here you’d get the URL of the recorded stream
//     // (for now you can hardcode or leave blank until you integrate recording)
//     const recordingUrl = "https://your-storage.com/recordings/stream.mp4"; // placeholder

//     // 🔹 call backend to mark stream ended and save recording
//     await axios.post(
//       `${BASE_URL}/${createdMatch._id}/stop-stream`,
//       { recordingUrl },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     // 🔹 refresh the match to show updated pastStreams
//     await refreshMatch(createdMatch._id);

//     console.log(" Stop-stream API called");
//   } catch (err) {
//     console.error("Error stopping stream:", err);
//     alert("Failed to stop streaming");
//   }
// };

//   const formatOvers = (overs, balls) => {
//     if (!balls || balls === 0) return `${overs}.0`;
//     return `${overs}.${balls}`;
//   };

//   // Helper function to get team name
//   const getTeamName = (match, teamIndex) => {
//     return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
//   };

//   return (
//     <div className="p-6">
//       {/* Tabs */}
//       <div className="flex space-x-6 mb-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 rounded ${
//               activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//         {!createdMatch && (
//           <div className="mt-0 text-center ml-auto">
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//             >
//               Create Match
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Streaming */}
//       {createdMatch && (
//         <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-50">
//           <h3 className="text-lg font-bold mb-2">🎥 Live Streaming</h3>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full max-w-lg border rounded"
//           />
//           <div className="mt-3 flex gap-4">
//             {!isStreaming ? (
//               <button
//                 onClick={startStreaming}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 Start Streaming
//               </button>
//             ) : (
//               <button
//                 onClick={stopStreaming}
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Stop Streaming
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Match List */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading matches...</p>
//       ) : currentMatches.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentMatches.map((match) => (
//             <MatchCard key={match._id} match={match} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No matches found for {activeTab}.</p>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-3 mt-8">
//           <button
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <span className="text-gray-700 font-semibold">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Match Form Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <MatchForm onMatchCreated={handleMatchCreated} />
//         </div>
//       )}

//       {/* Created Match View */}
//       {createdMatch && (
//         <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
//           <h3 className="text-xl font-bold mb-4 text-blue-700">{createdMatch.title}</h3>

//           {/* Match Status */}
//           <div className="mb-4">
//             <span className="text-sm text-gray-600">Status: </span>
//             <span className={`font-semibold px-2 py-1 rounded text-sm ${
//               matchStatus === "Completed" ? "bg-green-100 text-green-800" :
//               matchStatus === "Live" ? "bg-red-100 text-red-800" :
//               "bg-yellow-100 text-yellow-800"
//             }`}>
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </div>

//               {/*  STREAM SECTION */}
//     {matchStatus === "Live" && (
//       <div className="mb-6">
//         <h4 className="text-lg font-bold mb-2">🎥 Live Stream</h4>

//         {/* If logged-in user is admin or team_owner → show broadcaster */}
//         {(role === "admin" || role === "team_owner") ? (
//           <StreamBroadcaster match={createdMatch} />
//         ) : (
//           <StreamViewer match={createdMatch} />
//         )}
//       </div>
//     )}

//           {/* Result Display */}
//           {matchStatus === "Completed" && createdMatch.result && (
//             <div className="mt-2 p-3 border rounded-lg bg-green-50 border-green-200">
//               <h4 className="text-green-800 font-bold text-lg">🏆 Match Result</h4>
//               <p className="text-green-700 font-semibold">{createdMatch.result}</p>
//             </div>
//           )}

//           {/* Recording Playback for Completed Matches */}
// {matchStatus === "Completed" && createdMatch.recordingUrl && (
//   <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//     <h4 className="text-lg font-bold text-gray-800 mb-2">📺 Watch Previous Stream</h4>
//     <video
//       src={createdMatch.recordingUrl}
//       controls
//       className="w-full max-w-2xl rounded shadow"
//     />
//   </div>
// )}

//           {/* Innings Scores Display */}
//           {createdMatch.inningsScores && createdMatch.inningsScores.length > 0 && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-semibold text-gray-800">Innings Summary:</h4>
//               {createdMatch.inningsScores.map((innings, index) => (
//                 <div key={index} className="p-3 border rounded bg-gray-50">
//                   <h5 className="font-semibold text-blue-600">
//                     Innings {innings.innings}: {getTeamName(createdMatch, innings.team)}
//                   </h5>
//                   <p className="text-gray-700">
//                     Score: <span className="font-bold">{innings.runs}/{innings.wickets}</span> in{' '}
//                     <span className="font-bold">{formatOvers(innings.overs, innings.balls)}</span> overs
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Current Score Display */}
//           {matchStatus !== "Completed" && createdMatch.currentScore ? (
//             <div className="mt-4 p-4 border rounded-lg bg-blue-50">
//               <h4 className="font-semibold text-blue-800 mb-2">Current Innings:</h4>
//               <p className="text-gray-700">
//                 <span className="font-semibold">
//                   {getTeamName(createdMatch, createdMatch.currentScore.team)}
//                 </span>{' '}
//                 batting
//               </p>
//               <p className="text-xl font-bold text-blue-600">
//                 {createdMatch.currentScore.runs}/{createdMatch.currentScore.wickets}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Overs: {formatOvers(createdMatch.currentScore.overs, createdMatch.currentScore.balls)}
//               </p>
//             </div>
//           ) : matchStatus === "Completed" ? (
//             <div className="mt-4 p-3 text-center text-green-700 font-semibold bg-green-50 rounded">
//                Match Completed
//             </div>
//           ) : (
//             <p className="mt-4 text-gray-500">Waiting for match to start...</p>
//           )}

//           {/* Score Updater */}
//           {matchStatus !== "Completed" && createdMatch.currentScore && (
//             <ScoreUpdater match={createdMatch} onScoreUpdated={handleScoreUpdated} />
//           )}

//           {/* Live Updates Feed */}
//           {liveUpdates.length > 0 && (
//             <div className="mt-4 p-3 border rounded bg-gray-50">
//               <h4 className="font-semibold mb-2">📡 Live Updates:</h4>
//               <div className="space-y-1 max-h-32 overflow-y-auto">
//                 {liveUpdates.slice(-5).map((update, index) => (
//                   <p key={index} className="text-sm text-gray-600">
//                     {JSON.stringify(update)}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;

///////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import MatchCard from "../components/MatchCard";
// import MatchForm from "../components/MatchForm";
// import ScoreUpdater from "../components/ScoreUpdater";
// import StreamBroadcaster from "../components/StreamBroadcaster";
// import StreamViewer from "../components/StreamViewer";

// const tabs = ["Live", "Upcoming", "Completed"];
// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [showForm, setShowForm] = useState(false);

//   // New state for viewing streams
//   const [selectedStreamMatch, setSelectedStreamMatch] = useState(null);
//   const [showStreamModal, setShowStreamModal] = useState(false);

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");

//   const [activeTab, setActiveTab] = useState("Live");
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [isStreaming, setIsStreaming] = useState(false);
//   const localVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const socket = useRef(null);
//   const [liveUpdates, setLiveUpdates] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const matchesPerPage = 6;
//   const indexOfLastMatch = currentPage * matchesPerPage;
//   const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
//   const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
//   const totalPages = Math.ceil(matches.length / matchesPerPage);

//   // Socket connection setup
//   useEffect(() => {
//     socket.current = io("http://localhost:3026");

//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, []);

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

//   // Match-specific socket listener
//   useEffect(() => {
//     if (createdMatch && socket.current) {
//       const matchId = createdMatch._id;

//       socket.current.off(`match-${matchId}-ballUpdate`);
//       socket.current.on(`match-${matchId}-ballUpdate`, (data) => {
//         setLiveUpdates((prev) => [...prev, data]);
//         refreshMatch(matchId);
//       });

//       return () => {
//         socket.current.off(`match-${matchId}-ballUpdate`);
//       };
//     }
//   }, [createdMatch]);

//   useEffect(() => {
//     fetchMatches(activeTab);
//     setLiveUpdates([]);
//   }, [activeTab, token, userId, role]);

//   // Helper function to refresh single match data
//   const refreshMatch = async (matchId) => {
//     try {
//       const res = await axios.get(`http://localhost:3026/api/matches/${matchId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCreatedMatch(res.data);
//       setMatchStatus(res.data.status);
//     } catch (err) {
//       console.error("Failed to refresh match:", err);
//     }
//   };

//   const handleMatchCreated = (match) => {
//     setCreatedMatch(match);
//     setMatchStatus(match.status);
//     setShowForm(false);
//   };

//   const handleScoreUpdated = (updatedMatch) => {
//     setCreatedMatch(updatedMatch);
//     setMatchStatus(updatedMatch.status);

//     if (updatedMatch.status !== matchStatus) {
//       fetchMatches(activeTab);
//     }
//   };

//   // New function to handle stream viewing
//   const handleWatchStream = (match) => {
//     setSelectedStreamMatch(match);
//     setShowStreamModal(true);
//   };

//   const closeStreamModal = () => {
//     setSelectedStreamMatch(null);
//     setShowStreamModal(false);
//   };

//   const startStreaming = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }
//       setIsStreaming(true);
//       peerConnection.current = new RTCPeerConnection();
//       stream.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, stream);
//       });
//       console.log("Streaming started locally");

//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/start-stream`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await refreshMatch(createdMatch._id);
//     } catch (err) {
//       console.error("Error starting stream:", err);
//       alert("Failed to start streaming");
//     }
//   };

//   const stopStreaming = async () => {
//     try {
//       if (localVideoRef.current?.srcObject) {
//         localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//         peerConnection.current = null;
//       }
//       setIsStreaming(false);
//       console.log("Streaming stopped locally");

//       const recordingUrl = "https://your-storage.com/recordings/stream.mp4";

//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/stop-stream`,
//         { recordingUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await refreshMatch(createdMatch._id);
//       console.log("Stop-stream API called");
//     } catch (err) {
//       console.error("Error stopping stream:", err);
//       alert("Failed to stop streaming");
//     }
//   };

//   const formatOvers = (overs, balls) => {
//     if (!balls || balls === 0) return `${overs}.0`;
//     return `${overs}.${balls}`;
//   };

//   const getTeamName = (match, teamIndex) => {
//     return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
//   };

//   // Enhanced MatchCard component with stream viewing option
//   const EnhancedMatchCard = ({ match }) => {
//     const isLiveStream = match.stream?.isLive;

//     return (
//       <div className="border rounded-lg p-4 shadow-md bg-white">
//         <h3 className="text-lg font-bold text-blue-700 mb-2">{match.title}</h3>

//         <div className="mb-2">
//           <span className="text-sm text-gray-600">Status: </span>
//           <span className={`font-semibold px-2 py-1 rounded text-sm ${
//             match.status === "Completed" ? "bg-green-100 text-green-800" :
//             match.status === "Live" ? "bg-red-100 text-red-800" :
//             "bg-yellow-100 text-yellow-800"
//           }`}>
//             {match.status}
//           </span>
//         </div>

//         {/* Live Stream Indicator */}
//         {isLiveStream && (
//           <div className="mb-2 flex items-center">
//             <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
//             <span className="text-red-600 font-semibold text-sm">LIVE STREAM</span>
//           </div>
//         )}

//         {/* Teams */}
//         <div className="mb-3">
//           <div className="text-sm text-gray-700">
//             {match.teams?.map((team, index) => (
//               <div key={index} className="mb-1">
//                 <strong>{team.name}</strong>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Current Score */}
//         {match.currentScore && match.status === "Live" && (
//           <div className="mb-3 p-2 bg-blue-50 rounded">
//             <div className="text-sm text-gray-600">
//               {getTeamName(match, match.currentScore.team)} batting
//             </div>
//             <div className="font-bold text-blue-600">
//               {match.currentScore.runs}/{match.currentScore.wickets}
//             </div>
//             <div className="text-xs text-gray-500">
//               Overs: {formatOvers(match.currentScore.overs, match.currentScore.balls)}
//             </div>
//           </div>
//         )}

//         {/* Final Result */}
//         {match.status === "Completed" && match.result && (
//           <div className="mb-3 p-2 bg-green-50 rounded border-green-200">
//             <div className="text-green-800 font-semibold text-sm">
//               {match.result}
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-2 mt-3">
//           {/* Watch Stream Button - shown for any live stream */}
//           {isLiveStream && (
//             <button
//               onClick={() => handleWatchStream(match)}
//               className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
//             >
//               Watch Live
//             </button>
//           )}

//           {/* View Details Button */}
//           <button
//             onClick={() => {
//               setCreatedMatch(match);
//               setMatchStatus(match.status);
//             }}
//             className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition"
//           >
//             View Details
//           </button>

//           {/* Manage Button - only for match creators or admins */}
//           {(match.createdBy === userId || role === 'admin') && (
//             <button
//               onClick={() => {
//                 setCreatedMatch(match);
//                 setMatchStatus(match.status);
//               }}
//               className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition"
//             >
//               Manage
//             </button>
//           )}
//         </div>

//         {/* Past Recordings */}
//         {match.status === "Completed" && match.recordingUrl && (
//           <div className="mt-2">
//             <button
//               className="w-full bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition"
//               onClick={() => window.open(match.recordingUrl, '_blank')}
//             >
//               Watch Recording
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       {/* Tabs */}
//       <div className="flex space-x-6 mb-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 rounded ${
//               activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab} {tab === "Live" && matches.filter(m => m.stream?.isLive).length > 0 && (
//               <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
//                 {matches.filter(m => m.stream?.isLive).length}
//               </span>
//             )}
//           </button>
//         ))}
//         {!createdMatch && (
//           <div className="mt-0 text-center ml-auto">
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//             >
//               Create Match
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Stream Modal */}
//       {showStreamModal && selectedStreamMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">{selectedStreamMatch.title} - Live Stream</h2>
//               <button
//                 onClick={closeStreamModal}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 ×
//               </button>
//             </div>
//             <StreamViewer match={selectedStreamMatch} />

//             {/* Match Info in Stream Modal */}
//             <div className="mt-4 p-4 bg-gray-50 rounded">
//               <h3 className="font-semibold mb-2">Match Information</h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Teams: </span>
//                   {selectedStreamMatch.teams?.map(t => t.name).join(' vs ')}
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Status: </span>
//                   <span className="font-semibold">{selectedStreamMatch.status}</span>
//                 </div>
//                 {selectedStreamMatch.currentScore && (
//                   <>
//                     <div>
//                       <span className="text-gray-600">Score: </span>
//                       <span className="font-semibold">
//                         {selectedStreamMatch.currentScore.runs}/{selectedStreamMatch.currentScore.wickets}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Overs: </span>
//                       <span className="font-semibold">
//                         {formatOvers(selectedStreamMatch.currentScore.overs, selectedStreamMatch.currentScore.balls)}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Streaming Controls for Created Match */}
//       {createdMatch && createdMatch.createdBy === userId && (
//         <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-50">
//           <h3 className="text-lg font-bold mb-2">Live Streaming Controls</h3>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full max-w-lg border rounded"
//           />
//           <div className="mt-3 flex gap-4">
//             {!isStreaming ? (
//               <button
//                 onClick={startStreaming}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 Start Streaming
//               </button>
//             ) : (
//               <button
//                 onClick={stopStreaming}
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Stop Streaming
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Match List */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading matches...</p>
//       ) : currentMatches.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentMatches.map((match) => (
//             <EnhancedMatchCard key={match._id} match={match} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No matches found for {activeTab}.</p>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-3 mt-8">
//           <button
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <span className="text-gray-700 font-semibold">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Match Form Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <MatchForm onMatchCreated={handleMatchCreated} />
//         </div>
//       )}

//       {/* Created/Selected Match Details View */}
//       {createdMatch && (
//         <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
//           <h3 className="text-xl font-bold mb-4 text-blue-700">{createdMatch.title}</h3>

//           <div className="mb-4">
//             <span className="text-sm text-gray-600">Status: </span>
//             <span className={`font-semibold px-2 py-1 rounded text-sm ${
//               matchStatus === "Completed" ? "bg-green-100 text-green-800" :
//               matchStatus === "Live" ? "bg-red-100 text-red-800" :
//               "bg-yellow-100 text-yellow-800"
//             }`}>
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </div>

//           {/* Stream Section */}
//           {matchStatus === "Live" && (
//             <div className="mb-6">
//               <h4 className="text-lg font-bold mb-2">Live Stream</h4>
//               {(role === "admin" || role === "team_owner" || createdMatch.createdBy === userId) ? (
//                 <StreamBroadcaster match={createdMatch} />
//               ) : (
//                 <StreamViewer match={createdMatch} />
//               )}
//             </div>
//           )}

//           {/* Result Display */}
//           {matchStatus === "Completed" && createdMatch.result && (
//             <div className="mt-2 p-3 border rounded-lg bg-green-50 border-green-200">
//               <h4 className="text-green-800 font-bold text-lg">Match Result</h4>
//               <p className="text-green-700 font-semibold">{createdMatch.result}</p>
//             </div>
//           )}

//           {/* Recording Playback */}
//           {matchStatus === "Completed" && createdMatch.recordingUrl && (
//             <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//               <h4 className="text-lg font-bold text-gray-800 mb-2">Watch Previous Stream</h4>
//               <video
//                 src={createdMatch.recordingUrl}
//                 controls
//                 className="w-full max-w-2xl rounded shadow"
//               />
//             </div>
//           )}

//           {/* Rest of the match details... */}
//           {createdMatch.inningsScores && createdMatch.inningsScores.length > 0 && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-semibold text-gray-800">Innings Summary:</h4>
//               {createdMatch.inningsScores.map((innings, index) => (
//                 <div key={index} className="p-3 border rounded bg-gray-50">
//                   <h5 className="font-semibold text-blue-600">
//                     Innings {innings.innings}: {getTeamName(createdMatch, innings.team)}
//                   </h5>
//                   <p className="text-gray-700">
//                     Score: <span className="font-bold">{innings.runs}/{innings.wickets}</span> in{' '}
//                     <span className="font-bold">{formatOvers(innings.overs, innings.balls)}</span> overs
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {matchStatus !== "Completed" && createdMatch.currentScore ? (
//             <div className="mt-4 p-4 border rounded-lg bg-blue-50">
//               <h4 className="font-semibold text-blue-800 mb-2">Current Innings:</h4>
//               <p className="text-gray-700">
//                 <span className="font-semibold">
//                   {getTeamName(createdMatch, createdMatch.currentScore.team)}
//                 </span>{' '}
//                 batting
//               </p>
//               <p className="text-xl font-bold text-blue-600">
//                 {createdMatch.currentScore.runs}/{createdMatch.currentScore.wickets}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Overs: {formatOvers(createdMatch.currentScore.overs, createdMatch.currentScore.balls)}
//               </p>
//             </div>
//           ) : matchStatus === "Completed" ? (
//             <div className="mt-4 p-3 text-center text-green-700 font-semibold bg-green-50 rounded">
//               Match Completed
//             </div>
//           ) : (
//             <p className="mt-4 text-gray-500">Waiting for match to start...</p>
//           )}

//           {/* Score Updater - only for match creators/admins */}
//           {matchStatus !== "Completed" && createdMatch.currentScore && (createdMatch.createdBy === userId || role === 'admin') && (
//             <ScoreUpdater match={createdMatch} onScoreUpdated={handleScoreUpdated} />
//           )}

//           {/* Live Updates Feed */}
//           {liveUpdates.length > 0 && (
//             <div className="mt-4 p-3 border rounded bg-gray-50">
//               <h4 className="font-semibold mb-2">Live Updates:</h4>
//               <div className="space-y-1 max-h-32 overflow-y-auto">
//                 {liveUpdates.slice(-5).map((update, index) => (
//                   <p key={index} className="text-sm text-gray-600">
//                     {JSON.stringify(update)}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;

// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import MatchForm from "../components/MatchForm";
// import ScoreUpdater from "../components/ScoreUpdater";

// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [showForm, setShowForm] = useState(false);

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // STREAMING
//   const [isStreaming, setIsStreaming] = useState(false);
//   const localVideoRef = useRef(null);
//   const peerConnection = useRef(null);

//   const socket = useRef(null);
//   const [liveUpdates, setLiveUpdates] = useState([]);

//   // Socket connection setup
//   useEffect(() => {
//     socket.current = io("http://localhost:3026");
//     return () => {
//       if (socket.current) socket.current.disconnect();
//     };
//   }, []);

//   useEffect(() =>{
//     const fetchMatches = async () =>{
//       try{
//         const response = await axios.get('http://localhost:3026/getAllMatches')
//       }catch(err){
//         console.log(err);
//       }

//     }
//     fetchMatches();
//   },[])

//   // Match-specific socket listener
//   useEffect(() => {
//     if (createdMatch && socket.current) {
//       const matchId = createdMatch._id;
//       socket.current.off(`match-${matchId}-ballUpdate`);
//       socket.current.on(`match-${matchId}-ballUpdate`, (data) => {
//         setLiveUpdates((prev) => [...prev, data]);
//         refreshMatch(matchId);
//       });
//       return () => socket.current.off(`match-${matchId}-ballUpdate`);
//     }
//   }, [createdMatch]);

//   // Helper function to refresh single match data
//   const refreshMatch = async (matchId) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/${matchId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCreatedMatch(res.data);
//       setMatchStatus(res.data.status);
//     } catch (err) {
//       console.error("Failed to refresh match:", err);
//     }
//   };

//   const handleMatchCreated = (match) => {
//     setCreatedMatch(match);
//     setMatchStatus(match.status);
//     setShowForm(false);
//   };

//   const handleScoreUpdated = (updatedMatch) => {
//     setCreatedMatch(updatedMatch);
//     setMatchStatus(updatedMatch.status);
//   };

//   // Streaming start
//   const startStreaming = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       setIsStreaming(true);

//       peerConnection.current = new RTCPeerConnection();
//       stream.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, stream);
//       });

//       // Backend: mark stream started
//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/start-stream`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await refreshMatch(createdMatch._id);
//     } catch (err) {
//       console.error("Error starting stream:", err);
//       alert("Failed to start streaming");
//     }
//   };

//   // Streaming stop
//   const stopStreaming = async () => {
//     try {
//       // Stop local tracks
//       if (localVideoRef.current?.srcObject) {
//         localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//         peerConnection.current = null;
//       }
//       setIsStreaming(false);

//       const recordingUrl = "https://your-storage.com/recordings/stream.mp4"; // placeholder

//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/stop-stream`,
//         { recordingUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await refreshMatch(createdMatch._id);
//     } catch (err) {
//       console.error("Error stopping stream:", err);
//       alert("Failed to stop streaming");
//     }
//   };

//   // Helper
//   const formatOvers = (overs, balls) => {
//     if (!balls || balls === 0) return `${overs}.0`;
//     return `${overs}.${balls}`;
//   };

//   const getTeamName = (match, teamIndex) => {
//     return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
//   };

//   return (
//     <div className="p-6">
//       {/* Create Match Button */}
//       {!createdMatch && (
//         <div className="text-center mb-6">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//           >
//             Create Match
//           </button>
//         </div>
//       )}

//       {/* Streaming Section */}
//       {createdMatch && (
//         <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-50">
//           <h3 className="text-lg font-bold mb-2">🎥 Live Streaming</h3>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full max-w-lg border rounded"
//           />
//           <div className="mt-3 flex gap-4">
//             {!isStreaming ? (
//               <button
//                 onClick={startStreaming}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 Start Streaming
//               </button>
//             ) : (
//               <button
//                 onClick={stopStreaming}
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Stop Streaming
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Match Form Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <MatchForm onMatchCreated={handleMatchCreated} />
//         </div>
//       )}

//       {/* Created Match View */}
//       {createdMatch && (
//         <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
//           <h3 className="text-xl font-bold mb-4 text-blue-700">{createdMatch.title}</h3>

//           {/* Match Status */}
//           <div className="mb-4">
//             <span className="text-sm text-gray-600">Status: </span>
//             <span
//               className={`font-semibold px-2 py-1 rounded text-sm ${
//                 matchStatus === "Completed"
//                   ? "bg-green-100 text-green-800"
//                   : matchStatus === "Live"
//                   ? "bg-red-100 text-red-800"
//                   : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </div>

//           {/* Past Streams */}
//           {createdMatch?.pastStreams?.length > 0 && (
//             <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//               <h4 className="text-lg font-bold text-gray-800 mb-2">📺 Past Streams</h4>
//               {createdMatch.pastStreams.map((stream, index) => (
//                 <div key={index} className="mb-4">
//                   <p className="text-sm text-gray-600">
//                     Started: {new Date(stream.startedAt).toLocaleString()}
//                   </p>
//                   {stream.endedAt && (
//                     <p className="text-sm text-gray-600">
//                       Ended: {new Date(stream.endedAt).toLocaleString()}
//                     </p>
//                   )}
//                   {stream.recordingUrl ? (
//                     <video
//                       src={stream.recordingUrl}
//                       controls
//                       className="w-full max-w-2xl rounded shadow"
//                     />
//                   ) : (
//                     <p className="text-gray-500 text-sm">No recording available</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Innings Scores Display */}
//           {createdMatch.inningsScores && createdMatch.inningsScores.length > 0 && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-semibold text-gray-800">Innings Summary:</h4>
//               {createdMatch.inningsScores.map((innings, index) => (
//                 <div key={index} className="p-3 border rounded bg-gray-50">
//                   <h5 className="font-semibold text-blue-600">
//                     Innings {innings.innings}: {getTeamName(createdMatch, innings.team)}
//                   </h5>
//                   <p className="text-gray-700">
//                     Score:{" "}
//                     <span className="font-bold">
//                       {innings.runs}/{innings.wickets}
//                     </span>{" "}
//                     in{" "}
//                     <span className="font-bold">
//                       {formatOvers(innings.overs, innings.balls)}
//                     </span>{" "}
//                     overs
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Current Score Display */}
//           {matchStatus !== "Completed" && createdMatch.currentScore ? (
//             <div className="mt-4 p-4 border rounded-lg bg-blue-50">
//               <h4 className="font-semibold text-blue-800 mb-2">Current Innings:</h4>
//               <p className="text-gray-700">
//                 <span className="font-semibold">
//                   {getTeamName(createdMatch, createdMatch.currentScore.team)}
//                 </span>{" "}
//                 batting
//               </p>
//               <p className="text-xl font-bold text-blue-600">
//                 {createdMatch.currentScore.runs}/{createdMatch.currentScore.wickets}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Overs:{" "}
//                 {formatOvers(
//                   createdMatch.currentScore.overs,
//                   createdMatch.currentScore.balls
//                 )}
//               </p>
//             </div>
//           ) : matchStatus === "Completed" ? (
//             <div className="mt-4 p-3 text-center text-green-700 font-semibold bg-green-50 rounded">
//               Match Completed
//             </div>
//           ) : (
//             <p className="mt-4 text-gray-500">Waiting for match to start...</p>
//           )}

//           {/* Score Updater */}
//           {matchStatus !== "Completed" && createdMatch.currentScore && (
//             <ScoreUpdater match={createdMatch} onScoreUpdated={handleScoreUpdated} />
//           )}

//           {/* Live Updates Feed */}
//           {liveUpdates.length > 0 && (
//             <div className="mt-4 p-3 border rounded bg-gray-50">
//               <h4 className="font-semibold mb-2">📡 Live Updates:</h4>
//               <div className="space-y-1 max-h-32 overflow-y-auto">
//                 {liveUpdates.slice(-5).map((update, index) => (
//                   <p key={index} className="text-sm text-gray-600">
//                     {JSON.stringify(update)}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;

// //////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Matches = () => {
//   const [matches, setMatches] = useState([]); // store all matches
//   const [createdMatch, setCreatedMatch] = useState(null); // the match you just created
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // fetch all matches from backend
//   const fetchMatches = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:3026/getAllMatches");
//       setMatches(response.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // call on mount
//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   // filter completed matches
//   const completedMatches = matches.filter((m) => m.status === "Completed");

//   return (
//     <div className="p-6">
//       {/* Completed Matches List */}
//       {completedMatches.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             🏁 Completed Matches
//           </h2>
//           <div className="space-y-4">
//             {completedMatches.map((match) => (
//               <div
//                 key={match._id}
//                 className="p-4 border rounded bg-white shadow"
//               >
//                 <h3 className="font-bold text-blue-600">{match.title}</h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Result: {match.result || "Match completed"}
//                 </p>

//                 {/* Highlights / Past Streams */}
//                 {match.pastStreams?.length > 0 ? (
//                   <div className="space-y-2">
//                     {match.pastStreams.map((stream, index) => (
//                       <div key={index} className="border-t pt-2">
//                         <p className="text-xs text-gray-500">
//                           Stream started{" "}
//                           {new Date(stream.startedAt).toLocaleString()}
//                         </p>
//                         {stream.recordingUrl ? (
//                           <video
//                             src={stream.recordingUrl}
//                             controls
//                             className="w-full max-w-md rounded shadow"
//                           />
//                         ) : (
//                           <button
//                             className="text-blue-500 underline text-sm"
//                             onClick={() =>
//                               alert("Highlights not yet uploaded")
//                             }
//                           >
//                             Watch Highlights
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No highlights yet</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Your Created Match */}
//       {createdMatch && (
//         <div className="p-4 border rounded bg-gray-50 shadow">
//           <h3 className="font-bold text-blue-600">
//             {createdMatch.title} (Live)
//           </h3>
//           <p className="text-sm text-gray-600 mb-2">
//             Status: {createdMatch.status}
//           </p>
//         </div>
//       )}

//       {/* Create Match Button */}
//       <div className="text-right">
//         <button
//           onClick={() => navigate("/create-match")} // your form route
//           className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//         >
//           Create Match
//         </button>
//       </div>

//       {/* Loading indicator */}
//       {loading && (
//         <p className="text-gray-500 mt-4 text-center">Loading matches...</p>
//       )}
//     </div>
//   );
// };

// export default Matches;

// //////////////////////////////////////////////////////

// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import MatchForm from "../components/MatchForm";
// import ScoreUpdater from "../components/ScoreUpdater";

// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   // State for all matches
//   const [matches, setMatches] = useState([]); // store all matches
//   const [loading, setLoading] = useState(false);

//   // State for created match and form
//   const [createdMatch, setCreatedMatch] = useState(null); // the match you just created
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [showForm, setShowForm] = useState(false);

//   // Auth
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // Navigation
//   const navigate = useNavigate();

//   // STREAMING
//   const [isStreaming, setIsStreaming] = useState(false);
//   const localVideoRef = useRef(null);
//   const peerConnection = useRef(null);

//   // Socket and live updates
//   const socket = useRef(null);
//   const [liveUpdates, setLiveUpdates] = useState([]);

//   // Socket connection setup
//   useEffect(() => {
//     socket.current = io("http://localhost:3026");
//     return () => {
//       if (socket.current) socket.current.disconnect();
//     };
//   }, []);

//   // fetch all matches from backend
//   const fetchMatches = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:3026/getAllMatches");
//       setMatches(response.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // call on mount
//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   // Match-specific socket listener
//   useEffect(() => {
//     if (createdMatch && socket.current) {
//       const matchId = createdMatch._id;
//       socket.current.off(`match-${matchId}-ballUpdate`);
//       socket.current.on(`match-${matchId}-ballUpdate`, (data) => {
//         setLiveUpdates((prev) => [...prev, data]);
//         refreshMatch(matchId);
//       });
//       return () => socket.current.off(`match-${matchId}-ballUpdate`);
//     }
//   }, [createdMatch]);

//   // Helper function to refresh single match data
//   const refreshMatch = async (matchId) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/${matchId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCreatedMatch(res.data);
//       setMatchStatus(res.data.status);
//       // Also refresh the matches list
//       fetchMatches();
//     } catch (err) {
//       console.error("Failed to refresh match:", err);
//     }
//   };

//   const handleMatchCreated = (match) => {
//     setCreatedMatch(match);
//     setMatchStatus(match.status);
//     setShowForm(false);
//     // Refresh matches list to include the new match
//     fetchMatches();
//   };

//   const handleScoreUpdated = (updatedMatch) => {
//     setCreatedMatch(updatedMatch);
//     setMatchStatus(updatedMatch.status);
//     // Refresh matches list to reflect updates
//     fetchMatches();
//   };

//   // Streaming start
//   const startStreaming = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       setIsStreaming(true);

//       peerConnection.current = new RTCPeerConnection();
//       stream.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, stream);
//       });

//       // Backend: mark stream started
//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/start-stream`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await refreshMatch(createdMatch._id);
//     } catch (err) {
//       console.error("Error starting stream:", err);
//       alert("Failed to start streaming");
//     }
//   };

//   // Streaming stop
//   const stopStreaming = async () => {
//     try {
//       // Stop local tracks
//       if (localVideoRef.current?.srcObject) {
//         localVideoRef.current.srcObject
//           .getTracks()
//           .forEach((track) => track.stop());
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//         peerConnection.current = null;
//       }
//       setIsStreaming(false);

//       const recordingUrl = "https://your-storage.com/recordings/stream.mp4"; // placeholder

//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/stop-stream`,
//         { recordingUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await refreshMatch(createdMatch._id);
//     } catch (err) {
//       console.error("Error stopping stream:", err);
//       alert("Failed to stop streaming");
//     }
//   };

//   // Helper functions
//   const formatOvers = (overs, balls) => {
//     if (!balls || balls === 0) return `${overs}.0`;
//     return `${overs}.${balls}`;
//   };

//   const getTeamName = (match, teamIndex) => {
//     return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
//   };

//   // filter completed matches
//   const completedMatches = matches.filter((m) => m.status === "Completed");
//   const liveMatches = matches.filter(
//     (m) => m.status === "Live" && m._id !== createdMatch?._id
//   );

//   return (
//     <div className="p-6">
//       {/* Create Match Button - Show when no active created match */}
//       {!createdMatch && (
//         <div className="text-center mb-6">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition mr-4"
//           >
//             Create Match
//           </button>
//           {/* <button
//             onClick={() => navigate("/create-match")}
//             className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
//           >
//             Create Match (Form)
//           </button> */}
//         </div>
//       )}

//       {/* Match Form Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold">Create New Match</h3>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
//             <MatchForm onMatchCreated={handleMatchCreated} />
//           </div>
//         </div>
//       )}

//       {/* Your Created Match */}
//       {createdMatch && (
//         <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white mb-8">
//           <h3 className="text-xl font-bold mb-4 text-blue-700">
//             {createdMatch.title}
//           </h3>

//           {/* Match Status */}
//           <div className="mb-4">
//             <span className="text-sm text-gray-600">Status: </span>
//             <span
//               className={`font-semibold px-2 py-1 rounded text-sm ${
//                 matchStatus === "Completed"
//                   ? "bg-green-100 text-green-800"
//                   : matchStatus === "Live"
//                   ? "bg-red-100 text-red-800"
//                   : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </div>

//           {/* Streaming Section */}
//           <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-50">
//             <h3 className="text-lg font-bold mb-2">🎥 Live Streaming</h3>
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               className="w-full max-w-lg border rounded"
//             />
//             <div className="mt-3 flex gap-4">
//               {!isStreaming ? (
//                 <button
//                   onClick={startStreaming}
//                   className="bg-green-500 text-white px-4 py-2 rounded"
//                 >
//                   Start Streaming
//                 </button>
//               ) : (
//                 <button
//                   onClick={stopStreaming}
//                   className="bg-red-500 text-white px-4 py-2 rounded"
//                 >
//                   Stop Streaming
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Past Streams */}
//           {createdMatch?.pastStreams?.length > 0 && (
//             <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//               <h4 className="text-lg font-bold text-gray-800 mb-2">
//                 📺 Past Streams
//               </h4>
//               {createdMatch.pastStreams.map((stream, index) => (
//                 <div key={index} className="mb-4">
//                   <p className="text-sm text-gray-600">
//                     Started: {new Date(stream.startedAt).toLocaleString()}
//                   </p>
//                   {stream.endedAt && (
//                     <p className="text-sm text-gray-600">
//                       Ended: {new Date(stream.endedAt).toLocaleString()}
//                     </p>
//                   )}
//                   {/* {stream.recordingUrl ? (
//                     <video
//                       src={stream.recordingUrl}
//                       controls
//                       className="w-full max-w-2xl rounded shadow"
//                     />
//                   ) : (
//                     <p className="text-gray-500 text-sm">No recording available</p>
//                   )} */}
//                   {stream.recordingUrl && stream.processed ? (
//                     <video
//                       src={stream.recordingUrl}
//                       controls
//                       className="w-full max-w-2xl rounded shadow"
//                     />
//                   ) : stream.uploadStatus === "pending" ? (
//                     <p className="text-yellow-600 text-sm">
//                       Uploading... {stream.uploadProgress || 0}%
//                     </p>
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       Recording not yet processed
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Innings Scores Display */}
//           {createdMatch.inningsScores &&
//             createdMatch.inningsScores.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 <h4 className="font-semibold text-gray-800">
//                   Innings Summary:
//                 </h4>
//                 {createdMatch.inningsScores.map((innings, index) => (
//                   <div key={index} className="p-3 border rounded bg-gray-50">
//                     <h5 className="font-semibold text-blue-600">
//                       Innings {innings.innings}:{" "}
//                       {getTeamName(createdMatch, innings.team)}
//                     </h5>
//                     <p className="text-gray-700">
//                       Score:{" "}
//                       <span className="font-bold">
//                         {innings.runs}/{innings.wickets}
//                       </span>{" "}
//                       in{" "}
//                       <span className="font-bold">
//                         {formatOvers(innings.overs, innings.balls)}
//                       </span>{" "}
//                       overs
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//           {/* Current Score Display */}
//           {matchStatus !== "Completed" && createdMatch.currentScore ? (
//             <div className="mt-4 p-4 border rounded-lg bg-blue-50">
//               <h4 className="font-semibold text-blue-800 mb-2">
//                 Current Innings:
//               </h4>
//               <p className="text-gray-700">
//                 <span className="font-semibold">
//                   {getTeamName(createdMatch, createdMatch.currentScore.team)}
//                 </span>{" "}
//                 batting
//               </p>
//               <p className="text-xl font-bold text-blue-600">
//                 {createdMatch.currentScore.runs}/
//                 {createdMatch.currentScore.wickets}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Overs:{" "}
//                 {formatOvers(
//                   createdMatch.currentScore.overs,
//                   createdMatch.currentScore.balls
//                 )}
//               </p>
//             </div>
//           ) : matchStatus === "Completed" ? (
//             <div className="mt-4 p-3 text-center text-green-700 font-semibold bg-green-50 rounded">
//               Match Completed
//             </div>
//           ) : (
//             <p className="mt-4 text-gray-500">Waiting for match to start...</p>
//           )}

//           {/* Score Updater */}
//           {matchStatus !== "Completed" && createdMatch.currentScore && (
//             <ScoreUpdater
//               match={createdMatch}
//               onScoreUpdated={handleScoreUpdated}
//             />
//           )}

//           {/* Live Updates Feed */}
//           {liveUpdates.length > 0 && (
//             <div className="mt-4 p-3 border rounded bg-gray-50">
//               <h4 className="font-semibold mb-2">📡 Live Updates:</h4>
//               <div className="space-y-1 max-h-32 overflow-y-auto">
//                 {liveUpdates.slice(-5).map((update, index) => (
//                   <p key={index} className="text-sm text-gray-600">
//                     {JSON.stringify(update)}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Live Matches (other than your created match) */}
//       {liveMatches.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             🔴 Live Matches
//           </h2>
//           <div className="space-y-4">
//             {liveMatches.map((match) => (
//               <div
//                 key={match._id}
//                 className="p-4 border rounded bg-white shadow border-red-200"
//               >
//                 <h3 className="font-bold text-red-600">{match.title}</h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Status: {match.status}
//                 </p>
//                 {match.currentScore && (
//                   <div className="text-sm">
//                     <p className="text-gray-700">
//                       <span className="font-semibold">
//                         {getTeamName(match, match.currentScore.team)}
//                       </span>{" "}
//                       batting: {match.currentScore.runs}/
//                       {match.currentScore.wickets} (
//                       {formatOvers(
//                         match.currentScore.overs,
//                         match.currentScore.balls
//                       )}{" "}
//                       overs)
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Completed Matches List */}
//       {completedMatches.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             🏁 Completed Matches
//           </h2>
//           <div className="space-y-4">
//             {completedMatches.map((match) => (
//               <div
//                 key={match._id}
//                 className="p-4 border rounded bg-white shadow"
//               >
//                 <h3 className="font-bold text-blue-600">{match.title}</h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Result: {match.result || "Match completed"}
//                 </p>

//                 {/* Highlights / Past Streams */}
//                 {match.pastStreams?.length > 0 ? (
//                   <div className="space-y-2">
//                     {match.pastStreams.map((stream, index) => (
//                       <div key={index} className="border-t pt-2">
//                         <p className="text-xs text-gray-500">
//                           Stream started{" "}
//                           {new Date(stream.startedAt).toLocaleString()}
//                         </p>
//                         {stream.recordingUrl ? (
//                           <video
//                             src={stream.recordingUrl}
//                             controls
//                             className="w-full max-w-md rounded shadow"
//                           />
//                         ) : (
//                           <button
//                             className="text-blue-500 underline text-sm"
//                             onClick={() => alert("Highlights not yet uploaded")}
//                           >
//                             Watch Highlights
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No highlights yet</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Loading indicator */}
//       {loading && (
//         <p className="text-gray-500 mt-4 text-center">Loading matches...</p>
//       )}
//     </div>
//   );
// };

// export default Matches;





/////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import MatchForm from "../components/MatchForm";
// import ScoreUpdater from "../components/ScoreUpdater";

// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   // State for all matches
//   const [matches, setMatches] = useState([]); // store all matches
//   const [loading, setLoading] = useState(false);

//   // State for created match and form
//   const [createdMatch, setCreatedMatch] = useState(null); // the match you just created
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [showForm, setShowForm] = useState(false);

//   const mediaRecorder = useRef(null);


//   // Auth
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // Navigation
//   const navigate = useNavigate();

//   // STREAMING
//   const [isStreaming, setIsStreaming] = useState(false);
//   const localVideoRef = useRef(null);
//   const peerConnection = useRef(null);

//   // Socket and live updates
//   const socket = useRef(null);
//   const [liveUpdates, setLiveUpdates] = useState([]);

//   // Socket connection setup
//   useEffect(() => {
//     socket.current = io("http://localhost:3026", {
//       reconnectionAttempts: 5, // Prevent infinite reconnection loops
//       timeout: 10000, // 10-second timeout for connection
//     });

//     socket.current.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//     });

//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//         socket.current = null;
//       }
//     };
//   }, []);

//   // Fetch all matches from backend
//   const fetchMatches = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:3026/getAllMatches", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMatches(response.data || []);
//     } catch (err) {
//       console.error("Failed to fetch matches:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Call on mount
//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   // Match-specific socket listener
//   useEffect(() => {
//     if (!createdMatch || !socket.current) return;

//     const matchId = createdMatch._id;
//     const eventName = `match-${matchId}-ballUpdate`;

//     socket.current.on(eventName, (data) => {
//       setLiveUpdates((prev) => [...prev, data]);
//       refreshMatch(matchId);
//     });

//     return () => {
//       socket.current.off(eventName);
//     };
//   }, [createdMatch]);

//   // Helper function to refresh single match data
//   const refreshMatch = async (matchId) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/${matchId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCreatedMatch(res.data);
//       setMatchStatus(res.data.status);
//       fetchMatches(); // Refresh matches list
//     } catch (err) {
//       console.error("Failed to refresh match:", err);
//     }
//   };

//   const handleMatchCreated = (match) => {
//     setCreatedMatch(match);
//     setMatchStatus(match.status);
//     setShowForm(false);
//     fetchMatches();
//   };

//   const handleScoreUpdated = (updatedMatch) => {
//     setCreatedMatch(updatedMatch);
//     setMatchStatus(updatedMatch.status);
//     fetchMatches();
//   };

//   // Streaming start
//   // const startStreaming = async () => {
//   //   try {
//   //     const stream = await navigator.mediaDevices.getUserMedia({
//   //       video: true,
//   //       audio: true,
//   //     });
//   //     if (localVideoRef.current) {
//   //       localVideoRef.current.srcObject = stream;
//   //     }
//   //     setIsStreaming(true);

//   //     peerConnection.current = new RTCPeerConnection();
//   //     stream.getTracks().forEach((track) => {
//   //       peerConnection.current.addTrack(track, stream);
//   //     });

//   //     await axios.post(
//   //       `${BASE_URL}/${createdMatch._id}/start-stream`,
//   //       {},
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     await refreshMatch(createdMatch._id);
//   //   } catch (err) {
//   //     console.error("Error starting stream:", err);
//   //     alert("Failed to start streaming. Please check your camera and microphone permissions.");
//   //     setIsStreaming(false);
//   //   }
//   // };
//   // Streaming start
// const startStreaming = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     // Show local preview
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//     }

//     setIsStreaming(true);

//     // Setup peer connection
//     peerConnection.current = new RTCPeerConnection();
//     stream.getTracks().forEach((track) => {
//       peerConnection.current.addTrack(track, stream);
//     });

//     // Setup MediaRecorder for recording
//     mediaRecorder.current = new MediaRecorder(stream);
//     const chunks = [];

//     mediaRecorder.current.ondataavailable = (e) => {
//       if (e.data.size > 0) chunks.push(e.data);
//     };

//     mediaRecorder.current.onstop = async () => {
//       const blob = new Blob(chunks, { type: 'video/mp4' });
//       const formData = new FormData();
//       formData.append('recording', blob, 'stream.mp4');

//       // Upload the recording
//       const uploadRes = await axios.post(`${BASE_URL}/upload-recording`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const recordingUrl = uploadRes.data.url;

//       // Notify backend that stream has stopped and recording is available
//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/stop-stream`,
//         { recordingUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await refreshMatch(createdMatch._id);
//     };

//     // Start recording
//     mediaRecorder.current.start();

//     // Notify backend that stream has started
//     await axios.post(
//       `${BASE_URL}/${createdMatch._id}/start-stream`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     await refreshMatch(createdMatch._id);
//   } catch (err) {
//     console.error("Error starting stream:", err);
//     alert("Failed to start streaming. Please check your camera and microphone permissions.");
//     setIsStreaming(false);
//   }
// };

//   // Streaming stop
//   // const stopStreaming = async () => {
//   //   try {
//   //     if (localVideoRef.current?.srcObject) {
//   //       localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//   //       localVideoRef.current.srcObject = null;
//   //     }
//   //     if (peerConnection.current) {
//   //       peerConnection.current.close();
//   //       peerConnection.current = null;
//   //     }
//   //     setIsStreaming(false);

//   //     const recordingUrl = "https://your-storage.com/recordings/stream.mp4"; // Placeholder
//   //     await axios.post(
//   //       `${BASE_URL}/${createdMatch._id}/stop-stream`,
//   //       { recordingUrl },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     await refreshMatch(createdMatch._id);
//   //   } catch (err) {
//   //     console.error("Error stopping stream:", err);
//   //     alert("Failed to stop streaming.");
//   //   }
//   // };

//   const stopStreaming = async () => {
//   try {
//     // Stop local video preview
//     if (localVideoRef.current?.srcObject) {
//       localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       localVideoRef.current.srcObject = null;
//     }

//     // Close peer connection
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }

//     setIsStreaming(false);

//     // Stop recording and upload
//     if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
//       mediaRecorder.current.stop(); // triggers onstop handler defined in startStreaming
//     } else {
//       // Fallback: no recording available
//       const recordingUrl = null;

//       await axios.post(
//         `${BASE_URL}/${createdMatch._id}/stop-stream`,
//         { recordingUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await refreshMatch(createdMatch._id);
//     }
//   } catch (err) {
//     console.error("Error stopping stream:", err);
//     alert("Failed to stop streaming.");
//   }
// };



//   // Helper functions
//   const formatOvers = (overs, balls) => {
//     if (!balls || balls === 0) return `${overs}.0`;
//     return `${overs}.${balls}`;
//   };

//   const getTeamName = (match, teamIndex) => {
//     return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
//   };

//   // Filter completed matches
//   const completedMatches = matches.filter((m) => m.status === "Completed");
//   const liveMatches = matches.filter(
//     (m) => m.status === "Live" && m._id !== createdMatch?._id
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 md:p-8">
//       {/* Create Match Button - Show when no active created match */}
//       {!createdMatch && (
//         <div className="text-center mb-8">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 font-semibold"
//           >
//             Create New Match
//           </button>
//         </div>
//       )}

//       {/* Match Form Modal */}
//       {showForm && !createdMatch && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-800">Create New Match</h3>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl font-bold"
//               >
//                 ✕
//               </button>
//             </div>
//             <MatchForm onMatchCreated={handleMatchCreated} />
//           </div>
//         </div>
//       )}

//       {/* Your Created Match */}
//       {createdMatch && (
//         <div className="mt-8 p-6 bg-white rounded-xl shadow-lg mb-10">
//           <h3 className="text-2xl font-bold text-indigo-700 mb-6">
//             {createdMatch.title}
//           </h3>

//           {/* Match Status */}
//           <div className="mb-6">
//             <span className="text-sm text-gray-600 font-medium">Status: </span>
//             <span
//               className={`font-semibold px-3 py-1 rounded-full text-sm ${
//                 matchStatus === "Completed"
//                   ? "bg-green-100 text-green-700"
//                   : matchStatus === "Live"
//                   ? "bg-red-100 text-red-700"
//                   : "bg-yellow-100 text-yellow-700"
//               }`}
//             >
//               {matchStatus === "Completed" ? "Match Over" : matchStatus}
//             </span>
//           </div>

//           {/* Streaming Section */}
//           <div className="my-6 p-6 bg-gray-50 rounded-lg shadow-md">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">🎥 Live Streaming</h3>
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               className="w-full max-w-2xl border-2 border-gray-200 rounded-lg shadow-sm"
//             />
//             <div className="mt-4 flex gap-4">
//               {!isStreaming ? (
//                 <button
//                   onClick={startStreaming}
//                   className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
//                 >
//                   Start Streaming
//                 </button>
//               ) : (
//                 <button
//                   onClick={stopStreaming}
//                   className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300"
//                 >
//                   Stop Streaming
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Past Streams */}
//           {createdMatch?.pastStreams?.length > 0 && (
//             <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
//               <h4 className="text-xl font-semibold text-gray-800 mb-4">
//                 📺 Past Streams
//               </h4>
//               {createdMatch.pastStreams.map((stream, index) => (
//                 <div key={index} className="mb-6">
//                   <p className="text-sm text-gray-600">
//                     Started: {new Date(stream.startedAt).toLocaleString()}
//                   </p>
//                   {stream.endedAt && (
//                     <p className="text-sm text-gray-600">
//                       Ended: {new Date(stream.endedAt).toLocaleString()}
//                     </p>
//                   )}
//                   {stream.recordingUrl && stream.processed ? (
//                     <video
//                       src={stream.recordingUrl}
//                       controls
//                       className="w-full max-w-2xl rounded-lg shadow-md mt-2"
//                     />
//                   ) : stream.uploadStatus === "pending" ? (
//                     <p className="text-yellow-600 text-sm mt-2">
//                       Uploading... {stream.uploadProgress || 0}%
//                     </p>
//                   ) : (
//                     <p className="text-gray-500 text-sm mt-2">
//                       Recording not yet processed
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Innings Scores Display */}
//           {createdMatch.inningsScores &&
//             createdMatch.inningsScores.length > 0 && (
//               <div className="mt-6 space-y-4">
//                 <h4 className="text-lg font-semibold text-gray-800">
//                   Innings Summary:
//                 </h4>
//                 {createdMatch.inningsScores.map((innings, index) => (
//                   <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                     <h5 className="text-lg font-semibold text-indigo-600">
//                       Innings {innings.innings}:{" "}
//                       {getTeamName(createdMatch, innings.team)}
//                     </h5>
//                     <p className="text-gray-700">
//                       Score:{" "}
//                       <span className="font-bold">
//                         {innings.runs}/{innings.wickets}
//                       </span>{" "}
//                       in{" "}
//                       <span className="font-bold">
//                         {formatOvers(innings.overs, innings.balls)}
//                       </span>{" "}
//                       overs
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//           {/* Current Score Display */}
//           {/* {matchStatus !== "Completed" && createdMatch.currentScore ? (
//             <div className="mt-6 p-6 bg-indigo-50 rounded-lg shadow-md">
//               <h4 className="text-lg font-semibold text-indigo-800 mb-3">
//                 Current Innings:
//               </h4>
//               <p className="text-gray-700 font-medium">
//                 <span className="font-semibold">
//                   {getTeamName(createdMatch, createdMatch.currentScore.team)}
//                 </span>{" "}
//                 batting
//               </p>
//               <p className="text-2xl font-bold text-indigo-600">
//                 {createdMatch.currentScore.runs}/
//                 {createdMatch.currentScore.wickets}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Overs:{" "}
//                 {formatOvers(
//                   createdMatch.currentScore.overs,
//                   createdMatch.currentScore.balls
//                 )}
//               </p>
//             </div>
//           ) : matchStatus === "Completed" ? (
//             <div className="mt-6 p-4 text-center text-green-700 font-semibold bg-green-50 rounded-lg">
//               Match Completed
//             </div>
//           ) : (
//             <p className="mt-6 text-gray-500">Waiting for match to start...</p>
//           )} */}

//           {/* Current Score / Result Display */}
// {matchStatus !== "Completed" && createdMatch.currentScore ? (
//   // 🔴 Live / In-progress score
//   <div className="mt-6 p-6 bg-indigo-50 rounded-lg shadow-md">
//     <h4 className="text-lg font-semibold text-indigo-800 mb-3">
//       Current Innings:
//     </h4>
//     <p className="text-gray-700 font-medium">
//       <span className="font-semibold">
//         {getTeamName(createdMatch, createdMatch.currentScore.team)}
//       </span>{" "}
//       batting
//     </p>
//     <p className="text-2xl font-bold text-indigo-600">
//       {createdMatch.currentScore.runs}/{createdMatch.currentScore.wickets}
//     </p>
//     <p className="text-sm text-gray-600">
//       Overs:{" "}
//       {formatOvers(
//         createdMatch.currentScore.overs,
//         createdMatch.currentScore.balls
//       )}
//     </p>
//   </div>
// ) : matchStatus === "Completed" ? (
//   // ✅ Completed — show real result
//   <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-md text-center">
//     <h4 className="text-lg font-semibold text-green-800 mb-2">🏆 Match Result</h4>
//     <p className="text-xl font-bold text-green-700">
//       {/* Use backend-provided result or compute it */}
//       {createdMatch.result || computeResult(createdMatch)}
//     </p>
//   </div>
// ) : (
//   <p className="mt-6 text-gray-500">Waiting for match to start...</p>
// )}


//           {/* Score Updater */}
//           {matchStatus !== "Completed" && createdMatch.currentScore && (
//             <ScoreUpdater
//               match={createdMatch}
//               onScoreUpdated={handleScoreUpdated}
//             />
//           )}

//           {/* Live Updates Feed */}
//           {liveUpdates.length > 0 && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">📡 Live Updates:</h4>
//               <div className="space-y-2 max-h-40 overflow-y-auto">
//                 {liveUpdates.slice(-5).map((update, index) => (
//                   <p key={index} className="text-sm text-gray-600 bg-white p-2 rounded">
//                     {JSON.stringify(update)}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Live Matches (other than your created match) */}
//       {liveMatches.length > 0 && (
//         <div className="mb-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             🔴 Live Matches
//           </h2>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {liveMatches.map((match) => (
//               <div
//                 key={match._id}
//                 className="p-6 bg-white rounded-xl shadow-lg border border-red-100"
//               >
//                 <h3 className="text-lg font-bold text-red-600">{match.title}</h3>
//                 <p className="text-sm text-gray-600 mb-3">
//                   Status: {match.status}
//                 </p>
//                 {match.currentScore && (
//                   <div className="text-sm">
//                     <p className="text-gray-700">
//                       <span className="font-semibold">
//                         {getTeamName(match, match.currentScore.team)}
//                       </span>{" "}
//                       batting: {match.currentScore.runs}/
//                       {match.currentScore.wickets} (
//                       {formatOvers(
//                         match.currentScore.overs,
//                         match.currentScore.balls
//                       )}{" "}
//                       overs)
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Completed Matches List */}
//       {completedMatches.length > 0 && (
//         <div className="mb-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             🏁 Completed Matches
//           </h2>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {completedMatches.map((match) => (
//               <div
//                 key={match._id}
//                 className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
//               >
//                 <h3 className="text-lg font-bold text-indigo-600">{match.title}</h3>
//                 <p className="text-sm text-gray-600 mb-3">
//                   Result: {match.result || "Match completed"}
//                 </p>

//                 {/* Highlights / Past Streams */}
//                 {match.pastStreams?.length > 0 ? (
//                   <div className="space-y-3">
//                     {match.pastStreams.map((stream, index) => (
//                       <div key={index} className="border-t pt-3">
//                         <p className="text-xs text-gray-500">
//                           Stream started{" "}
//                           {new Date(stream.startedAt).toLocaleString()}
//                         </p>
//                         {stream.recordingUrl ? (
//                           <video
//                             src={stream.recordingUrl}
//                             controls
//                             className="w-full max-w-md rounded-lg shadow-md"
//                           />
//                         ) : (
//                           <button
//                             className="text-indigo-500 underline text-sm hover:text-indigo-700"
//                             onClick={() => alert("Highlights not yet uploaded")}
//                           >
//                             Watch Highlights
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No highlights yet</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Loading indicator */}
//       {loading && (
//         <p className="text-gray-500 mt-6 text-center text-lg font-medium">
//           Loading matches...
//         </p>
//       )}
//     </div>
//   );
// };

// export default Matches;

/////////////////////////////////////////////////////////////////////

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MatchForm from "../components/MatchForm";
import ScoreUpdater from "../components/ScoreUpdater";

const BASE_URL = "http://localhost:3026/api/matches";

const Matches = () => {
  // State for all matches
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for created match and form
  const [createdMatch, setCreatedMatch] = useState(null);
  const [matchStatus, setMatchStatus] = useState("Live");
  const [showForm, setShowForm] = useState(false);

  // Recording state
  const [recordingId, setRecordingId] = useState(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const mediaRecorder = useRef(null);

  // Auth
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Navigation
  const navigate = useNavigate();

  // STREAMING
  const [isStreaming, setIsStreaming] = useState(false);
  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);

  // Socket and live updates
  const socket = useRef(null);
  const [liveUpdates, setLiveUpdates] = useState([]);

  // Socket connection setup
  useEffect(() => {
    socket.current = io("http://localhost:3026", {
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  // Fetch all matches from backend
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3026/getAllMatches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(response.data || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  // Call on mount
  useEffect(() => {
    fetchMatches();
  }, []);

  // Match-specific socket listener
  useEffect(() => {
    if (!createdMatch || !socket.current) return;

    const matchId = createdMatch._id;
    const eventName = `match-${matchId}-ballUpdate`;

    socket.current.on(eventName, (data) => {
      setLiveUpdates((prev) => [...prev, data]);
      refreshMatch(matchId);
    });

    return () => {
      socket.current.off(eventName);
    };
  }, [createdMatch]);

  // Helper function to refresh single match data
  const refreshMatch = async (matchId) => {
    try {
      const res = await axios.get(`${BASE_URL}/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreatedMatch(res.data);
      setMatchStatus(res.data.status);
      fetchMatches();
    } catch (err) {
      console.error("Failed to refresh match:", err);
    }
  };

  const handleMatchCreated = (match) => {
    setCreatedMatch(match);
    setMatchStatus(match.status);
    setShowForm(false);
    fetchMatches();
  };

  const handleScoreUpdated = (updatedMatch) => {
    setCreatedMatch(updatedMatch);
    setMatchStatus(updatedMatch.status);
    fetchMatches();
  };

  // FIXED Streaming start
  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      // Show local preview
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsStreaming(true);

      // Setup peer connection
      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // Setup MediaRecorder for recording
      const options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/mp4';
        }
      }

      mediaRecorder.current = new MediaRecorder(stream, options);
      const chunks = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        try {
          console.log('MediaRecorder stopped, processing recording...');
          const blob = new Blob(chunks, { type: options.mimeType });
          
          if (blob.size === 0) {
            console.warn('Recording blob is empty');
            return;
          }

          // Upload the recording using the correct endpoint and format
          const formData = new FormData();
          formData.append('recording', blob, 'recording.webm');
          if (recordingId) {
            formData.append('recordingId', recordingId);
          }

          console.log('Uploading recording blob of size:', blob.size);

          const uploadRes = await axios.post(
            `http://localhost:3026/api/matches/${createdMatch._id}/uploadRecording`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`Upload progress: ${progress}%`);
              },
            }
          );

          console.log('Upload response:', uploadRes.data);
          
          // Refresh match data to show the uploaded recording
          await refreshMatch(createdMatch._id);
          
        } catch (error) {
          console.error('Error uploading recording:', error);
          // Still try to stop the stream even if upload fails
          try {
            await axios.post(
              `${BASE_URL}/${createdMatch._id}/stop-stream`,
              { recordingUrl: null },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await refreshMatch(createdMatch._id);
          } catch (stopError) {
            console.error('Error stopping stream:', stopError);
          }
        }
      };

      // Start recording
      mediaRecorder.current.start(1000); // Record in 1-second chunks
      console.log('Recording started');

      // Notify backend that stream has started
      const startResponse = await axios.post(
        `${BASE_URL}/${createdMatch._id}/start-stream`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store the recording ID for later use
      if (startResponse.data.recordingId) {
        setRecordingId(startResponse.data.recordingId);
      }

      console.log('Stream started:', startResponse.data);
      await refreshMatch(createdMatch._id);

    } catch (err) {
      console.error("Error starting stream:", err);
      alert("Failed to start streaming. Please check your camera and microphone permissions.");
      setIsStreaming(false);
    }
  };

  // FIXED Streaming stop
  const stopStreaming = async () => {
    try {
      console.log('Stopping stream...');

      // Stop local video preview
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        localVideoRef.current.srcObject = null;
      }

      // Close peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      setIsStreaming(false);

      // Stop recording - this will trigger the upload process
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
        console.log('MediaRecorder stopped');
      } else {
        // Fallback: no recording available, just stop the stream
        console.log('No active recording, stopping stream without recording');
        await axios.post(
          `${BASE_URL}/${createdMatch._id}/stop-stream`,
          { recordingUrl: null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await refreshMatch(createdMatch._id);
      }

      // Clear recording ID
      setRecordingId(null);

    } catch (err) {
      console.error("Error stopping stream:", err);
      alert("Failed to stop streaming.");
    }
  };

  // Helper function to compute match result
  const computeResult = (match) => {
    if (!match.inningsScores || match.inningsScores.length < 2) {
      return match.result || "Result pending";
    }
    
    const firstInnings = match.inningsScores.find(s => s.innings === 1);
    const secondInnings = match.inningsScores.find(s => s.innings === 2);
    
    if (!firstInnings || !secondInnings) {
      return match.result || "Result pending";
    }
    
    const team1Name = getTeamName(match, firstInnings.team);
    const team2Name = getTeamName(match, secondInnings.team);
    
    if (firstInnings.runs > secondInnings.runs) {
      const margin = firstInnings.runs - secondInnings.runs;
      return `${team1Name} won by ${margin} runs`;
    } else if (secondInnings.runs > firstInnings.runs) {
      const maxWickets = (match.teams?.[secondInnings.team]?.players?.length || 11) - 1;
      const remainingWickets = maxWickets - secondInnings.wickets;
      return `${team2Name} won by ${remainingWickets} wickets`;
    } else {
      return "Match tied";
    }
  };

  // Helper functions
  const formatOvers = (overs, balls) => {
    if (!balls || balls === 0) return `${overs}.0`;
    return `${overs}.${balls}`;
  };

  const getTeamName = (match, teamIndex) => {
    return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
  };

  // Filter matches
  const completedMatches = matches.filter((m) => m.status === "Completed");
  const liveMatches = matches.filter(
    (m) => m.status === "Live" && m._id !== createdMatch?._id
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      {/* Create Match Button */}
      {!createdMatch && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Create New Match
          </button>
        </div>
      )}

      {/* Match Form Modal */}
      {showForm && !createdMatch && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Create New Match</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <MatchForm onMatchCreated={handleMatchCreated} />
          </div>
        </div>
      )}

      {/* Your Created Match */}
      {createdMatch && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 mb-6">
            {createdMatch.title}
          </h3>

          {/* Match Status */}
          <div className="mb-6">
            <span className="text-sm text-gray-600 font-medium">Status: </span>
            <span
              className={`font-semibold px-3 py-1 rounded-full text-sm ${
                matchStatus === "Completed"
                  ? "bg-green-100 text-green-700"
                  : matchStatus === "Live"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {matchStatus === "Completed" ? "Match Over" : matchStatus}
            </span>
          </div>

          {/* Streaming Section */}
          <div className="my-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Streaming</h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-2xl border-2 border-gray-200 rounded-lg shadow-sm"
              style={{ maxHeight: '400px' }}
            />
            <div className="mt-4 flex gap-4">
              {!isStreaming ? (
                <button
                  onClick={startStreaming}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
                >
                  Start Streaming
                </button>
              ) : (
                <>
                  <button
                    onClick={stopStreaming}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300"
                  >
                    Stop Streaming
                  </button>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-gray-600">Recording...</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Past Streams with improved display */}
          {createdMatch?.pastStreams?.length > 0 && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Past Streams & Highlights
              </h4>
              {createdMatch.pastStreams.map((stream, index) => (
                <div key={stream.recordingId || index} className="mb-6 p-4 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Started: {new Date(stream.startedAt).toLocaleString()}
                  </p>
                  {stream.endedAt && (
                    <p className="text-sm text-gray-600">
                      Ended: {new Date(stream.endedAt).toLocaleString()}
                    </p>
                  )}
                  
                  {/* Show upload status */}
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      stream.uploadStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      stream.uploadStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      stream.uploadStatus === 'pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {stream.uploadStatus || 'Unknown'}
                    </span>
                    {stream.uploadProgress !== undefined && stream.uploadProgress < 100 && (
                      <span className="ml-2 text-sm text-gray-600">
                        {stream.uploadProgress}%
                      </span>
                    )}
                  </div>

                  {/* Video player or status message */}
                  {stream.recordingUrl && stream.processed ? (
                    <div className="mt-3">
                      <video
                        src={stream.recordingUrl}
                        controls
                        preload="metadata"
                        className="w-full max-w-2xl rounded-lg shadow-md"
                        style={{ maxHeight: '300px' }}
                      />
                      {stream.fileSize && (
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {(stream.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      )}
                    </div>
                  ) : stream.uploadStatus === "pending" || stream.uploadStatus === "processing" ? (
                    <p className="text-yellow-600 text-sm mt-2">
                      Processing... {stream.uploadProgress || 0}%
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-2">
                      Recording not available
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Current Score / Result Display */}
          {matchStatus !== "Completed" && createdMatch.currentScore ? (
            <div className="mt-6 p-6 bg-indigo-50 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-indigo-800 mb-3">
                Current Innings:
              </h4>
              <p className="text-gray-700 font-medium">
                <span className="font-semibold">
                  {getTeamName(createdMatch, createdMatch.currentScore.team)}
                </span>{" "}
                batting
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {createdMatch.currentScore.runs}/{createdMatch.currentScore.wickets}
              </p>
              <p className="text-sm text-gray-600">
                Overs:{" "}
                {formatOvers(
                  createdMatch.currentScore.overs,
                  createdMatch.currentScore.balls
                )}
              </p>
            </div>
          ) : matchStatus === "Completed" ? (
            <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-semibold text-green-800 mb-2">Match Result</h4>
              <p className="text-xl font-bold text-green-700">
                {createdMatch.result || computeResult(createdMatch)}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-gray-500">Waiting for match to start...</p>
          )}

          {/* Score Updater */}
          {matchStatus !== "Completed" && createdMatch.currentScore && (
            <ScoreUpdater
              match={createdMatch}
              onScoreUpdated={handleScoreUpdated}
            />
          )}

          {/* Live Updates Feed */}
          {liveUpdates.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Live Updates:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {liveUpdates.slice(-5).map((update, index) => (
                  <p key={index} className="text-sm text-gray-600 bg-white p-2 rounded">
                    {JSON.stringify(update)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Live Matches
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <div
                key={match._id}
                className="p-6 bg-white rounded-xl shadow-lg border border-red-100"
              >
                <h3 className="text-lg font-bold text-red-600">{match.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Status: {match.status}
                </p>
                {match.currentScore && (
                  <div className="text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        {getTeamName(match, match.currentScore.team)}
                      </span>{" "}
                      batting: {match.currentScore.runs}/{match.currentScore.wickets} (
                      {formatOvers(match.currentScore.overs, match.currentScore.balls)} overs)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Matches List */}
      {completedMatches.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Completed Matches
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedMatches.map((match) => (
              <div
                key={match._id}
                className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold text-indigo-600">{match.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Result: {match.result || "Match completed"}
                </p>

                {/* Highlights / Past Streams */}
                {match.pastStreams?.length > 0 ? (
                  <div className="space-y-3">
                    {match.pastStreams.map((stream, index) => (
                      <div key={stream.recordingId || index} className="border-t pt-3">
                        <p className="text-xs text-gray-500">
                          Stream: {new Date(stream.startedAt).toLocaleString()}
                        </p>
                        {stream.recordingUrl && stream.processed ? (
                          <video
                            src={stream.recordingUrl}
                            controls
                            preload="metadata"
                            className="w-full rounded-lg shadow-md mt-2"
                            style={{ maxHeight: '200px' }}
                          />
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            {stream.uploadStatus === 'pending' ? 'Processing...' : 'No recording available'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No highlights available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <p className="text-gray-500 mt-6 text-center text-lg font-medium">
          Loading matches...
        </p>
      )}
    </div>
  );
};

export default Matches;
