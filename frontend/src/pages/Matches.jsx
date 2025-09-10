

// update kore dekhchi kaj kore kina ----


// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import MatchCard from "../components/MatchCard";
// import MatchForm from "../components/MatchForm";
// import ScoreUpdater from "../components/ScoreUpdater";

// const tabs = ["Live", "Upcoming", "Completed"];
// const BASE_URL = "http://localhost:3026/api/matches";

// const Matches = () => {
//   const [createdMatch, setCreatedMatch] = useState(null);
//   const [score, setScore] = useState(null);
//   const [matchStatus, setMatchStatus] = useState("Live");
//   const [inningsScores, setInningsScores] = useState([]);
//   const [currentInnings, setCurrentInnings] = useState(1);

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
// const [liveUpdates, setLiveUpdates] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const matchesPerPage = 6;
//   const indexOfLastMatch = currentPage * matchesPerPage;
//   const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
//   const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
//   const totalPages = Math.ceil(matches.length / matchesPerPage);

//   // 1️⃣ Socket connection setup
// useEffect(() => {
//   socket.current = io("http://localhost:3026");

//   return () => {
//     if (socket.current) {
//       socket.current.disconnect();
//     }
//   };
// }, []);


//   const fetchMatches = async (tab) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { createdBy: userId },
//       });
//       setMatches(res.data.matches || []);
//     } catch (err) {
//       console.error("Failed to fetch:", err);
//       setMatches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   fetchMatches(activeTab);
//   // }, [activeTab, token, userId, role]);



// // 3️⃣ Match-specific listener
// useEffect(() => {
//   if (createdMatch && socket.current) {
//     const matchId = createdMatch._id;

//     socket.current.off(`match-${matchId}-ballUpdate`);
//     socket.current.on(`match-${matchId}-ballUpdate`, (data) => {
//       setLiveUpdates((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.current.off(`match-${matchId}-ballUpdate`);
//     };
//   }
// }, [createdMatch]);

//   useEffect(() => {
//   fetchMatches(activeTab);

//   // Optional: reset live updates when switching tabs
//   setLiveUpdates([]);
// }, [activeTab, token, userId, role]);

//   const handleMatchCreated = (match) => {
//     setCreatedMatch(match);
//     setScore(match.currentScore);
//     setMatchStatus(match.status);
//     setInningsScores([]);
//     setCurrentInnings(1);
//     setShowForm(false);
//   };

//   // change korchi
//   // const handleScoreUpdated = (updatedMatch) => {
//   //   if (updatedMatch.msg === "Match completed") {
//   //     if (score) setInningsScores((prev) => [...prev, score]);
//   //     setScore(null);
//   //     setMatchStatus("Completed");
//   //   } else {
//   //     if (score && score.team !== updatedMatch.currentScore.team) {
//   //       setInningsScores((prev) => [...prev, score]);
//   //       setCurrentInnings((prev) => prev + 1);
//   //       setScore({
//   //         team: updatedMatch.currentScore.team,
//   //         runs: 0,
//   //         wickets: 0,
//   //         overs: 0,
//   //         balls: 0,
//   //       });
//   //     } else {
//   //       setScore(updatedMatch.currentScore);
//   //     }
//   //   }
//   //   setCreatedMatch(updatedMatch);
//   // };

//   const handleScoreUpdated = (updatedMatch) => {
//   setCreatedMatch(updatedMatch);
//   setMatchStatus(updatedMatch.status); // ✅ Always sync status

//   if (updatedMatch.status === "Completed") {
//     if (score) setInningsScores((prev) => [...prev, score]);
//     setScore(null);
//   } else {
//     if (score && score.team !== updatedMatch.currentScore.team) {
//       setInningsScores((prev) => [...prev, score]);
//       setCurrentInnings((prev) => prev + 1);
//     }
//     setScore(updatedMatch.currentScore); // ✅ Trust backend
//   }
// };

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
//       console.log("✅ Streaming started. Setup signaling now.");
//     } catch (err) {
//       console.error("Error starting stream:", err);
//       alert("Failed to start streaming");
//     }
//   };

//   const stopStreaming = () => {
//     if (localVideoRef.current?.srcObject) {
//       localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//     }
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }
//     setIsStreaming(false);
//     console.log("✅ Streaming stopped");
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
//           <div className="mt-0 text-center ml-112">
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
//           {currentMatches.map((match, index) => (
//             <MatchCard key={index} match={match} />
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
//         <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50">
//           <MatchForm onMatchCreated={handleMatchCreated} />
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

//               {/* 🏆 Result Display */}
//     {matchStatus === "Completed" && createdMatch.result && (
//       <div className="mt-2 p-2 border rounded bg-green-100 text-green-800 font-semibold">
//         🏆 Result: {createdMatch.result}
//       </div>
//     )}


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

// {matchStatus === "Completed" ? (
//   <p className="mt-4 text-green-700 font-semibold">✅ Match Completed</p>
// ) : score ? (
//   <div className="mt-4">
//     <p>
//       Batting:{" "}
//       <span className="font-semibold">
//         {createdMatch.teams[score.team]?.name || "TBD"}
//       </span>
//     </p>
//     <p>
//       Score:{" "}
//       <span className="font-semibold">
//         {score.runs}/{score.wickets}
//       </span>{" "}
//       in {score.overs}.{score.balls} overs
//     </p>
//   </div>
// ) : (
//   <p>Waiting for score update...</p>
// )}

//           {/* ✅ Score Updater */}
//           {matchStatus !== "Completed" && score && (
//             <ScoreUpdater match={createdMatch} onScoreUpdated={handleScoreUpdated} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matches;

////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import MatchCard from "../components/MatchCard";
import MatchForm from "../components/MatchForm";
import ScoreUpdater from "../components/ScoreUpdater";
import StreamBroadcaster from "../components/StreamBroadcaster";
import StreamViewer from "../components/StreamViewer";

const tabs = ["Live", "Upcoming", "Completed"];
const BASE_URL = "http://localhost:3026/api/matches";


const Matches = () => {
  const [createdMatch, setCreatedMatch] = useState(null);
  const [matchStatus, setMatchStatus] = useState("Live");
  const [showForm, setShowForm] = useState(false);
  
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [activeTab, setActiveTab] = useState("Live");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [liveUpdates, setLiveUpdates] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 6;
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  // Socket connection setup
  useEffect(() => {
    socket.current = io("http://localhost:3026");

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const fetchMatches = async (tab) => {
    setLoading(true);
    try {
      // Updated API endpoint to match backend
      const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      

      
      // setMatches(filteredMatches);
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Match-specific socket listener
  useEffect(() => {
    if (createdMatch && socket.current) {
      const matchId = createdMatch._id;

      socket.current.off(`match-${matchId}-ballUpdate`);
      socket.current.on(`match-${matchId}-ballUpdate`, (data) => {
        setLiveUpdates((prev) => [...prev, data]);
        // Auto-refresh match data when receiving updates
        refreshMatch(matchId);
      });

      return () => {
        socket.current.off(`match-${matchId}-ballUpdate`);
      };
    }
  }, [createdMatch]);

  useEffect(() => {
    fetchMatches(activeTab);
    setLiveUpdates([]);
  }, [activeTab, token, userId, role]);

  // Helper function to refresh single match data
  const refreshMatch = async (matchId) => {
    try {
      const res = await axios.get(`http://localhost:3026/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreatedMatch(res.data);
      setMatchStatus(res.data.status);
    } catch (err) {
      console.error("Failed to refresh match:", err);
    }
  };

  const handleMatchCreated = (match) => {
    setCreatedMatch(match);
    setMatchStatus(match.status);
    setShowForm(false);
  };

  const handleScoreUpdated = (updatedMatch) => {
    setCreatedMatch(updatedMatch);
    setMatchStatus(updatedMatch.status);
    
    // Refresh the matches list if status changed
    if (updatedMatch.status !== matchStatus) {
      fetchMatches(activeTab);
    }
  };


  // const stopStreaming = () => {
  //   if (localVideoRef.current?.srcObject) {
  //     localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  //   }
  //   if (peerConnection.current) {
  //     peerConnection.current.close();
  //     peerConnection.current = null;
  //   }
  //   setIsStreaming(false);
  //   console.log("✅ Streaming stopped");
  // };

  // Helper function to format overs display
  
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
    peerConnection.current = new RTCPeerConnection();
    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });
    console.log("✅ Streaming started locally");

    // 🔹 call backend to mark stream started
    await axios.post(
      `${BASE_URL}/${createdMatch._id}/start-stream`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔹 refresh match data
    await refreshMatch(createdMatch._id);
  } catch (err) {
    console.error("Error starting stream:", err);
    alert("Failed to start streaming");
  }
};

  const stopStreaming = async () => {
  try {
    // Stop local tracks
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsStreaming(false);
    console.log("✅ Streaming stopped locally");

    // 🔹 here you’d get the URL of the recorded stream 
    // (for now you can hardcode or leave blank until you integrate recording)
    const recordingUrl = "https://your-storage.com/recordings/stream.mp4"; // placeholder

    // 🔹 call backend to mark stream ended and save recording
    await axios.post(
      `${BASE_URL}/${createdMatch._id}/stop-stream`,
      { recordingUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔹 refresh the match to show updated pastStreams
    await refreshMatch(createdMatch._id);

    console.log("✅ Stop-stream API called");
  } catch (err) {
    console.error("Error stopping stream:", err);
    alert("Failed to stop streaming");
  }
};

  const formatOvers = (overs, balls) => {
    if (!balls || balls === 0) return `${overs}.0`;
    return `${overs}.${balls}`;
  };

  // Helper function to get team name
  const getTeamName = (match, teamIndex) => {
    return match?.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`;
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex space-x-6 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        {!createdMatch && (
          <div className="mt-0 text-center ml-auto">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              Create Match
            </button>
          </div>
        )}
      </div>

      {/* Streaming */}
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

      {/* Match List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : currentMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMatches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No matches found for {activeTab}.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Match Form Modal */}
      {showForm && !createdMatch && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <MatchForm onMatchCreated={handleMatchCreated} />
        </div>
      )}

      {/* Created Match View */}
      {createdMatch && (
        <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
          <h3 className="text-xl font-bold mb-4 text-blue-700">{createdMatch.title}</h3>
          
          {/* Match Status */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">Status: </span>
            <span className={`font-semibold px-2 py-1 rounded text-sm ${
              matchStatus === "Completed" ? "bg-green-100 text-green-800" :
              matchStatus === "Live" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {matchStatus === "Completed" ? "Match Over" : matchStatus}
            </span>
          </div>

              {/* ✅ STREAM SECTION */}
    {matchStatus === "Live" && (
      <div className="mb-6">
        <h4 className="text-lg font-bold mb-2">🎥 Live Stream</h4>

        {/* If logged-in user is admin or team_owner → show broadcaster */}
        {(role === "admin" || role === "team_owner") ? (
          <StreamBroadcaster match={createdMatch} />
        ) : (
          <StreamViewer match={createdMatch} />
        )}
      </div>
    )}

          {/* Result Display */}
          {matchStatus === "Completed" && createdMatch.result && (
            <div className="mt-2 p-3 border rounded-lg bg-green-50 border-green-200">
              <h4 className="text-green-800 font-bold text-lg">🏆 Match Result</h4>
              <p className="text-green-700 font-semibold">{createdMatch.result}</p>
            </div>
          )}

          {/* Recording Playback for Completed Matches */}
{matchStatus === "Completed" && createdMatch.recordingUrl && (
  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
    <h4 className="text-lg font-bold text-gray-800 mb-2">📺 Watch Previous Stream</h4>
    <video
      src={createdMatch.recordingUrl}
      controls
      className="w-full max-w-2xl rounded shadow"
    />
  </div>
)}


          {/* Innings Scores Display */}
          {createdMatch.inningsScores && createdMatch.inningsScores.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-gray-800">Innings Summary:</h4>
              {createdMatch.inningsScores.map((innings, index) => (
                <div key={index} className="p-3 border rounded bg-gray-50">
                  <h5 className="font-semibold text-blue-600">
                    Innings {innings.innings}: {getTeamName(createdMatch, innings.team)}
                  </h5>
                  <p className="text-gray-700">
                    Score: <span className="font-bold">{innings.runs}/{innings.wickets}</span> in{' '}
                    <span className="font-bold">{formatOvers(innings.overs, innings.balls)}</span> overs
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Current Score Display */}
          {matchStatus !== "Completed" && createdMatch.currentScore ? (
            <div className="mt-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Current Innings:</h4>
              <p className="text-gray-700">
                <span className="font-semibold">
                  {getTeamName(createdMatch, createdMatch.currentScore.team)}
                </span>{' '}
                batting
              </p>
              <p className="text-xl font-bold text-blue-600">
                {createdMatch.currentScore.runs}/{createdMatch.currentScore.wickets}
              </p>
              <p className="text-sm text-gray-600">
                Overs: {formatOvers(createdMatch.currentScore.overs, createdMatch.currentScore.balls)}
              </p>
            </div>
          ) : matchStatus === "Completed" ? (
            <div className="mt-4 p-3 text-center text-green-700 font-semibold bg-green-50 rounded">
              ✅ Match Completed
            </div>
          ) : (
            <p className="mt-4 text-gray-500">Waiting for match to start...</p>
          )}

          {/* Score Updater */}
          {matchStatus !== "Completed" && createdMatch.currentScore && (
            <ScoreUpdater match={createdMatch} onScoreUpdated={handleScoreUpdated} />
          )}

          {/* Live Updates Feed */}
          {liveUpdates.length > 0 && (
            <div className="mt-4 p-3 border rounded bg-gray-50">
              <h4 className="font-semibold mb-2">📡 Live Updates:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {liveUpdates.slice(-5).map((update, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {JSON.stringify(update)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Matches;
