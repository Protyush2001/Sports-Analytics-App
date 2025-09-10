// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Teams = () => {
//   const [teams, setTeams] = useState([]);
//   const [players, setPlayers] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     coach: "",
//     selectedPlayers: [],
//   });

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const navigate = useNavigate();

//   // Initial fetch of teams
//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const res = await axios.get("http://localhost:3026/api/teams", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTeams(res.data);
//       } catch (err) {
//         console.error("Error fetching teams:", err.message);
//       }
//     };

//     fetchTeams();
//   }, [token]);

//   // Fetch players when modal opens
// const fetchPlayers = async () => {
//   try {
//     const teamRes = await axios.get("http://localhost:3026/api/teams", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const playerRes = await axios.get("http://localhost:3026/api/players/unassigned", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const allPlayers = Array.isArray(playerRes.data)
//       ? playerRes.data
//       : playerRes.data.players || [];

//     const assignedPlayerIds = teamRes.data.flatMap((team) =>
//       team.players.map((p) => String(p._id))
//     );

//     const availablePlayers = allPlayers.filter((player) => {
//       const id = String(player._id);
//       return id && !assignedPlayerIds.includes(id);
//     });

//     setPlayers(availablePlayers);
//   } catch (err) {
//     console.error("Error fetching players:", err.message);
//     setPlayers([]); // fallback to empty array
//   }
// };
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handlePlayerSelect = (e) => {
//     const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
//     if (selected.length <= 20) {
//       setFormData((prev) => ({ ...prev, selectedPlayers: selected }));
//     } else {
//       alert("Maximum 20 players allowed per team.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.selectedPlayers.length > 20) {
//       alert("You can only select up to 20 players.");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://localhost:3026/api/teams",
//         {
//           name: formData.name,
//           coach: formData.coach,
//           players: formData.selectedPlayers,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Team created successfully!");
//       setShowModal(false);
//       window.location.reload();
//     } catch (err) {
//       console.error("Error creating team:", err.message);
//     }
//   };

// //   const handleDelete = async (teamId) => {
// //     if(window.confirm("Are you sure you want to delete this team?")) {
// //       try{
// //         await axios.delete(`http://localhost:3026/api/teams/${teamId}`,{
// //           headers: { Authorization: `Bearer ${token}`}
// //         })
// //       }catch(err){
// //         console.log(err);
// //       }
// //   }
// // }

// // const handleRemovePlayer = async (playerId) => {
// //   if(window.confirm("Are you sure you want to remove this player from the team?")){
// //     try{
// //       setSelectedTeam((prevTeam) =>{
// //         const updatedPlayers = prevTeam.players.filter((p) => p._id !== playerId);
// //         return { players: updatedPlayers };
// //       })
// //     }catch(err){
// //       console.log(err)
// //     }
// //   }
// // }

// const refreshSelectedTeam = async (teamId) => {
//   try {
//     const res = await axios.get(`http://localhost:3026/api/teams/${teamId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setSelectedTeam(res.data); // ✅ This ensures fresh data
//   } catch (err) {
//     console.error("Error refreshing team:", err.message);
//   }
// };

// const refreshTeams = async () => {
//   try {
//     const res = await axios.get("http://localhost:3026/api/teams", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setTeams(res.data);
//   } catch (err) {
//     console.error("Error refreshing teams:", err.message);
//   }
// };

// // const handleRemovePlayer = async (playerId) => {
// //   if (window.confirm("Are you sure you want to remove this player from the team?")) {
// //     try {
// //       const res = await axios.patch(
// //         `http://localhost:3026/api/teams/${selectedTeam._id}/remove-player/${playerId}`,
// //         {},
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       setSelectedTeam(res.data); // ✅ Update modal with new team data
// //     } catch (err) {
// //       console.error("Error removing player:", err.message);
// //     }
// //   }
// // };

// const handleRemovePlayer = async (playerId) => {
//   if (window.confirm("Are you sure you want to remove this player from the team?")) {
//     try {
//       const res = await axios.patch(
//         `http://localhost:3026/api/teams/${selectedTeam._id}/remove-player/${playerId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSelectedTeam({ ...res.data }); // ✅ update modal
//       refreshTeams(); // ✅ update team cards
//     } catch (err) {
//       console.error("Error removing player:", err.message);
//     }
//   }
// };

// const handleDelete = async (teamId) => {
//   if (window.confirm("Are you sure you want to delete this team?")) {
//     try {
//       await axios.delete(`http://localhost:3026/api/teams/${teamId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // ✅ Remove team from local state
//       setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));
//     } catch (err) {
//       console.error("Error deleting team:", err.message);
//     }
//   }
// };
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">🏏 Teams</h1>

//       {(role === "team_owner" || role === "admin") && (
//         <div className="text-center mb-6">
//           <button
//             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//             onClick={() => {
//               fetchPlayers();
//               setShowModal(true);
//             }}
//           >
//             ➕ Create Team
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {teams.map((team) => (
//           <div key={team._id} className="bg-white shadow-md rounded-xl p-6">
//             <h2 className="text-xl font-semibold text-indigo-600 mb-2">{team.name}</h2>
//             <p className="text-gray-700 mb-1">Coach: {team.coach || "Not Assigned"}</p>
//             <p className="text-gray-600 mb-4">Players: {team.players.length}</p>
//             <button
//               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//               onClick={() => setSelectedTeam(team)}
//             >
//               View Details
//             </button>
//             <button onClick={()=>{handleDelete(team._id)}}>
//               Delete Team
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Create Team Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-xl">
//             <h2 className="text-2xl font-bold text-blue-700 mb-4">Create New Team</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Team Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-4 py-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="coach"
//                 placeholder="Coach Name"
//                 value={formData.coach}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-4 py-2 rounded"
//               />
//               {players.length === 0 ? (
//                 <p className="text-sm text-red-500">All players are already assigned to teams.</p>
//               ) : (
//                 <select
//                   multiple
//                   value={formData.selectedPlayers}
//                   onChange={handlePlayerSelect}
//                   className="w-full border px-4 py-2 rounded h-48"
//                 >
//                   {players.map((player) => (
//                     <option key={player._id} value={player._id}>
//                       {player.name} — {player.role}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//               >
//                 Submit
//               </button>
//               <button
//                 type="button"
//                 className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Team Details Modal */}
//       {selectedTeam && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
//             <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedTeam.name}</h2>
//             <p className="text-gray-700 mb-2">Coach: {selectedTeam.coach}</p>
//             <h3 className="text-lg font-semibold mb-2">Players:</h3>
//             <ul className="space-y-3">
//               {selectedTeam.players.map((player) => (
//                 <li key={player._id} className="flex items-center gap-4">
//                   <img
//                     src={player.image}
//                     alt={player.name}
//                     className="w-12 h-12 rounded-full object-cover border"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/48?text=No+Image";
//                     }}
//                   />
//                   <div>
//                     <p className="font-medium">{player.name}</p>
//                     <p className="text-sm text-gray-500">{player.role}</p>
//                   </div>
//                   <div>
//                     <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Edit Player</button>
//                     <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" onClick={() => handleRemovePlayer(player._id)}>Remove Player</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <button
//               className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//               onClick={() => setSelectedTeam(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Teams;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Teams = () => {
//   const [teams, setTeams] = useState([]);
//   const [players, setPlayers] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ name: "", coach: "", selectedPlayers: [] });
//   const [searchQuery, setSearchQuery] = useState("");

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const userId = localStorage.getItem("userId");
//   const navigate = useNavigate();

//   const fetchTeams = async () => {
//     try {
//       const res = await axios.get("http://localhost:3026/api/teams", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTeams(res.data);
//     } catch (err) {
//       console.error("Error fetching teams:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchTeams();
//   }, [token]);

// // const fetchPlayers = async () => {
// //   try {
// //     const allPlayersRes = await axios.get("http://localhost:3026/api/players", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });

// //     const teamsRes = await axios.get("http://localhost:3026/api/teams", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });

// //     const assignedIds = teamsRes.data.flatMap((team) =>
// //       team.players.map((p) => String(p._id))
// //     );

// //     const availablePlayers = allPlayersRes.data.filter(
// //       (player) => !assignedIds.includes(String(player._id))
// //     );

// //     setPlayers(availablePlayers);
// //   } catch (err) {
// //     console.error("Error fetching players:", err.message);
// //     setPlayers([]);
// //   }
// // };

// const fetchPlayers = async () => {
//   try {
//     const res = await axios.get("http://localhost:3026/api/players/unassigned", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(res.data);
//     setPlayers(res.data);
    
//   } catch (err) {
//     console.error("Error fetching unassigned players:", err.message);
//     setPlayers([]);
//   }
// };
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handlePlayerSelect = (e) => {
//     const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
//     if (selected.length <= 20) {
//       setFormData((prev) => ({ ...prev, selectedPlayers: selected }));
//     } else {
//       alert("Maximum 20 players allowed per team.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.selectedPlayers.length > 20) {
//       alert("You can only select up to 20 players.");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://localhost:3026/api/teams",
//         {
//           name: formData.name,
//           coach: formData.coach,
//           players: formData.selectedPlayers,
//           createdBy: userId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Team created successfully!");
//       setShowModal(false);
//       fetchTeams();
//     } catch (err) {
//       console.error("Error creating team:", err.message);
//     }
//   };

//   const handleDelete = async (teamId) => {
//     if (window.confirm("Are you sure you want to delete this team?")) {
//       try {
//         await axios.delete(`http://localhost:3026/api/teams/${teamId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTeams((prev) => prev.filter((team) => team._id !== teamId));
//       } catch (err) {
//         console.error("Error deleting team:", err.message);
//       }
//     }
//   };

//   const handleRemovePlayer = async (playerId) => {
//     if (window.confirm("Remove this player from the team?")) {
//       try {
//         const res = await axios.patch(
//           `http://localhost:3026/api/teams/${selectedTeam._id}/remove-player/${playerId}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setSelectedTeam({ ...res.data });
//         fetchTeams();
//       } catch (err) {
//         console.error("Error removing player:", err.message);
//       }
//     }
//   };

//   const filteredTeams = teams.filter((team) =>
//     team.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🏏 Teams</h1>

//       <div className="text-center mb-6">
//         <input
//           type="text"
//           placeholder="Search teams..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="px-4 py-2 border rounded w-full max-w-md"
//         />
//       </div>

//       {(role === "team_owner" || role === "admin") && (
//         <div className="text-center mb-6">
//           <button
//             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//             onClick={() => {
//               fetchPlayers();
//               setShowModal(true);
//             }}
//           >
//             ➕ Create Team
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTeams.map((team) => (
//           <div key={team._id} className="bg-white shadow-md rounded-xl p-6">
//             <h2 className="text-xl font-semibold text-indigo-600 mb-2">{team.name}</h2>
//             <p className="text-gray-700 mb-1">Coach: {team.coach || "Not Assigned"}</p>
//             <p className="text-gray-600 mb-4">Players: {team.players.length}</p>
//             <button
//               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//               onClick={() => setSelectedTeam(team)}
//             >
//               View Details
//             </button>
//             {(role === "admin" || team.createdBy === userId) && (
//               <button
//                 className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//                 onClick={() => handleDelete(team._id)}
//               >
//                 Delete Team
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Create Team Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-xl">
//             <h2 className="text-2xl font-bold text-blue-700 mb-4">Create New Team</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Team Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-4 py-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="coach"
//                 placeholder="Coach Name"
//                 value={formData.coach}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-4 py-2 rounded"
//               />
//               {Array.isArray(players) && players.length > 0 ? (
//                 <select
//                   multiple
//                   value={formData.selectedPlayers}
//                   onChange={handlePlayerSelect}
//                   className="w-full border px-4 py-2 rounded h-48"
//                 >
//                   {players.map((player) => (
//                     <option key={player._id} value={player._id}>
//                       {player.name} — {player.role}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <p className="text-sm text-red-500">All players are already assigned to teams.</p>
//               )}
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//               >
//                 Submit
//               </button>
//               <button
//                 type="button"
//                 className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Team Details Modal */}
//       {selectedTeam && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
//             <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedTeam.name}</h2>
//                         <p className="text-gray-700 mb-2">Coach: {selectedTeam.coach}</p>
//             <h3 className="text-lg font-semibold mb-2">Players:</h3>
//             <ul className="space-y-3">
//               {selectedTeam.players.map((player) => (
//                 <li key={player._id} className="flex items-center gap-4">
//                   <img
//                     src={player.image}
//                     alt={player.name}
//                     className="w-12 h-12 rounded-full object-cover border"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/48?text=No+Image";
//                     }}
//                   />
//                   <div>
//                     <p className="font-medium">{player.name}</p>
//                     <p className="text-sm text-gray-500">{player.role}</p>
//                   </div>
//                   {(role === "admin" || selectedTeam.createdBy === userId) && (
//                     <button
//                       className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                       onClick={() => handleRemovePlayer(player._id)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </li>
//               ))}
//             </ul>
//             <button
//               className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
//               onClick={() => setSelectedTeam(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Teams;

//////////////////////////////////////////////////////////////////////////


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", coach: "", selectedPlayers: [] });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:3026/api/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    } catch (err) {
      console.error("Error fetching teams:", err.message);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [token]);

  // const fetchPlayers = async () => {
  //   setLoadingPlayers(true);
  //   try {
  //     const res = await axios.get("http://localhost:3026/api/players/unassigned", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setPlayers(res.data);
  //   } catch (err) {
  //     console.error("Error fetching unassigned players:", err.message);
  //     setPlayers([]);
  //   } finally {
  //     setLoadingPlayers(false);
  //   }
  // };

  const fetchPlayers = async () => {
  try {
    const teamRes = await axios.get("http://localhost:3026/api/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const playerRes = await axios.get("http://localhost:3026/api/players/unassigned", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allPlayers = Array.isArray(playerRes.data)
      ? playerRes.data
      : playerRes.data.players || [];

    const assignedPlayerIds = teamRes.data.flatMap((team) =>
      team.players.map((p) => String(p._id))
    );

    const availablePlayers = allPlayers.filter((player) => {
      const id = String(player._id);
      return id && !assignedPlayerIds.includes(id);
    });

    setPlayers(availablePlayers);
  } catch (err) {
    console.error("Error fetching players:", err.message);
    setPlayers([]); // fallback to empty array
  }
};

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlayerSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    if (selected.length <= 20) {
      setFormData((prev) => ({ ...prev, selectedPlayers: selected }));
    } else {
      alert("Maximum 20 players allowed per team.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedPlayers.length > 20) {
      alert("You can only select up to 20 players.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3026/api/teams",
        {
          name: formData.name,
          coach: formData.coach,
          players: formData.selectedPlayers,
          createdBy: userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Team created successfully!");
      setShowModal(false);
      setFormData({ name: "", coach: "", selectedPlayers: [] });
      fetchTeams();
    } catch (err) {
      console.error("Error creating team:", err.message);
    }
  };

  const handleDelete = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await axios.delete(`http://localhost:3026/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams((prev) => prev.filter((team) => team._id !== teamId));
      } catch (err) {
        console.error("Error deleting team:", err.message);
      }
    }
  };
const handleAddPlayerToTeam = async (teamId, playerId) => {
  try {
    const res = await axios.patch(
      `http://localhost:3026/api/teams/${teamId}/add-player/${playerId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Player added successfully!");
    fetchTeams(); // Refresh team data
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || err.message || "Unknown error";
    console.error("Error adding player:", errorMessage);
    alert(`Failed to add player: ${errorMessage}`);
  }
};


  const handleRemovePlayer = async (playerId) => {
    if (window.confirm("Remove this player from the team?")) {
      try {
        const res = await axios.patch(
          `http://localhost:3026/api/teams/${selectedTeam._id}/remove-player/${playerId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedTeam({ ...res.data });
        fetchTeams();
      } catch (err) {
        console.error("Error removing player:", err.message);
      }
    }
  };

const handleAddPlayers = async (e, teamId) => {
  e.preventDefault();
  try {
    await axios.patch(
      `http://localhost:3026/api/teams/${teamId}/add-players`,
      { players: formData.selectedPlayers },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Players added successfully!");
    setAddModal(false);
    setFormData((prev) => ({ ...prev, selectedPlayers: [] }));

    // ✅ Fetch updated team details with populated players
    const updatedTeam = await axios.get(`http://localhost:3026/api/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSelectedTeam(updatedTeam.data);
    fetchTeams(); // refresh team list
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    console.error("Error adding players:", errorMessage);
    alert(`Failed to add players: ${errorMessage}`);
  }
};


// const handleEditPlayer = async (playerId) => {
//   const player = players.find((p) => p._id === playerId);

//   if (!player) {
//     console.error("Player not found:", playerId);
//     alert("Player not found.");
//     return;
//   }

//   console.log("Editing player:", player);
//   alert(`Editing player: ${player.name}`);

//   setFormData({
//     name: player.name || "",
//     role: player.role || "",
//     image: player.image || "",
//     selectedPlayers: [playerId],
//   });

//   setShowModal(true);
// };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🏏 Teams</h1>

      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-md"
        />
      </div>

      {(role === "team_owner" || role === "admin") && (
        <div className="text-center mb-6">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={async () => {
              await fetchPlayers();
              setShowModal(true);
            }}
          >
            ➕ Create Team
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team._id} className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">{team.name}</h2>
            <p className="text-gray-700 mb-1">Coach: {team.coach || "Not Assigned"}</p>
            <p className="text-gray-600 mb-4">Players: {team.players.length}</p>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              onClick={() => setSelectedTeam(team)}
            >
              View Details
            </button>
            {(role === "admin" || team.createdBy === userId) && (
              <button
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(team._id)}
              >
                Delete Team
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Create New Team</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Team Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="text"
                name="coach"
                placeholder="Coach Name"
                value={formData.coach}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              />
              {loadingPlayers ? (
                <p className="text-sm text-gray-500">Loading players...</p>
              ) : Array.isArray(players) && players.length > 0 ? (
                <select
                  multiple
                  value={formData.selectedPlayers}
                  onChange={handlePlayerSelect}
                  className="w-full border px-4 py-2 rounded h-48"
                >
                  {players.map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.name} — {player.role}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-red-500">All players are already assigned to teams.</p>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Players Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Players to Team</h2>
            <form onSubmit={(e) => handleAddPlayers(e, selectedTeam._id)} className="space-y-4">
              <select
                multiple
                value={formData.selectedPlayers}
                onChange={handlePlayerSelect}
                className="w-full border px-4 py-2 rounded h-48"
              >
                {players.map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.name} — {player.role}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                
              >
                Add Players
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setAddModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedTeam.name}</h2>
            <p className="text-gray-700 mb-2">Coach: {selectedTeam.coach}</p>
            <h3 className="text-lg font-semibold mb-2">Players:</h3>
            <ul className="space-y-3">
              {selectedTeam.players.map((player) => (
                <li key={player._id} className="flex items-center gap-4">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover border"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/48?text=No+Image";
                    }}
                  />
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-gray-500">{player.role}</p>
                  </div>
      {(role === "admin" || selectedTeam.createdBy === userId) && (
        <div className="ml-auto flex gap-2">

          <button
            title="Remove player from team"
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() => handleRemovePlayer(player._id)}
          >
            🗑️ Remove
          </button>
        </div>
      )}

                </li>
              ))}
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={() => setSelectedTeam(null)}
            >
              Close
            </button>
            {(role == 'admin' || selectedTeam.createdBy === userId) && (
<button
  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
   onClick={async () => {
              await fetchPlayers();
              setAddModal(true);
              setFormData((prev) => ({ ...prev, selectedPlayers: [] }));
           }}
>
  ➕ Add new Player 
</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;