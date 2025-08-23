// import React from 'react';

// const Players = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-4xl mx-auto text-center">
//         {/* Heading */}
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
//           Players
//         </h1>
//         <form action="">
//           <input
//             type="text"
//             placeholder="Search players..."
//             className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
//           />
//           <div>
//             <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
//               Search
//             </button>
//           </div>
//         </form>

//         {/* Subtitle */}
//         <p className="text-lg text-gray-600 mb-8">
//           Discover player profiles, statistics, and performance metrics.
//         </p>

//         {/* Example Card Grid (for player list) */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 1</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Batsman • Avg: 45.2 • SR: 135.6
//             </p>
//           </div>

//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 2</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Bowler • Wickets: 75 • Economy: 6.8
//             </p>
//           </div>

//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 3</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               All-Rounder • Runs: 1200 • Wickets: 55
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Players;



// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Players = () => {
//   const navigate = useNavigate();

//   // Get user from localStorage (token + role)
//   const user = JSON.parse(localStorage.getItem("user")) || null;

//   useEffect(() => {
//     if (!user) {
//       alert("You need to log in first!");
//       navigate("/login");
//     } else if (!["player", "team-owner", "admin"].includes(user.role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//     }
//   }, [user, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-4xl mx-auto text-center">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Players</h1>
//         <form>
//           <input
//             type="text"
//             placeholder="Search players..."
//             className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
//           />
//           <div>
//             <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
//               Search
//             </button>
//           </div>
//         </form>
//         <p className="text-lg text-gray-600 mb-8">
//           Discover player profiles, statistics, and performance metrics.
//         </p>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 1</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Batsman • Avg: 45.2 • SR: 135.6
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 2</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Bowler • Wickets: 75 • Economy: 6.8
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 3</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               All-Rounder • Runs: 1200 • Wickets: 55
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Players;
////////////////////////////////////////

// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Players = () => {
//   const navigate = useNavigate();

//   // Get token and role from localStorage
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//     } else if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//     }
//   }, [token, role, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-4xl mx-auto text-center">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Players</h1>
//         <form>
//           <input
//             type="text"
//             placeholder="Search players..."
//             className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
//           />
//           <div>
//             <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
//               Search
//             </button>
//           </div>
//         </form>
//         <p className="text-lg text-gray-600 mb-8">
//           Discover player profiles, statistics, and performance metrics.
//         </p>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 1</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Batsman • Avg: 45.2 • SR: 135.6
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 2</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Bowler • Wickets: 75 • Economy: 6.8
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
//             <h2 className="text-xl font-semibold text-gray-700">Player 3</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               All-Rounder • Runs: 1200 • Wickets: 55
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Players;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PlayerCard from "../components/PlayerCard";

// const Players = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   const [players, setPlayers] = useState([
//     {
//       id: 1,
//       name: "MS Dhoni",
//       role: "Wicket-Keeper",
//       image: "https://example.com/dhoni.jpg",
//       runs: 2057,
//       matches: 54,
//       average: 38.09,
//     },
//     {
//       id: 2,
//       name: "Jasprit Bumrah",
//       role: "Bowler",
//       image: "https://example.com/bumrah.jpg",
//       runs: 1201,
//       matches: 42,
//       average: 28.6,
//       wickets: 200,
//     },
//     {
//       id: 3,
//       name: "Rishabh Pant",
//       role: "Wicket-Keeper",
//       image: "https://example.com/pant.jpg",
//       runs: 6201,
//       matches: 75,
//       average: 82.68,
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//     } else if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//     }
//   }, [token, role, navigate]);

//   const handleUpdate = (player) => {
//     alert(`Update player: ${player.name}`);
//     // You can open a modal here to update details
//   };

//   const handleDelete = (id) => {
//     setPlayers(players.filter((p) => p.id !== id));
//   };

//   const filteredPlayers = players.filter((player) =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-800">Players</h1>
//           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Add New Player
//           </button>
//         </div>
//         <input
//           type="text"
//           placeholder="Search players..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg p-2 mb-6"
//         />
//         <p className="text-lg text-gray-600 mb-8 text-center">
//           Discover player profiles, statistics, and performance metrics.
//         </p>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredPlayers.map((player) => (
//             <PlayerCard
//               key={player.id}
//               player={player}
//               onUpdate={handleUpdate}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Players;

///////////////////////////////

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PlayerCard from "../components/PlayerCard";

// const Players = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   const [players, setPlayers] = useState([
//     {
//       id: 1,
//       name: "MS Dhoni",
//       role: "Wicket-Keeper",
//       image: "https://example.com/dhoni.jpg",
//       runs: 2057,
//       matches: 54,
//       average: 38.09,
//     },
//     {
//       id: 2,
//       name: "Jasprit Bumrah",
//       role: "Bowler",
//       image: "https://example.com/bumrah.jpg",
//       runs: 1201,
//       matches: 42,
//       average: 28.6,
//       wickets: 200,
//     },
//     {
//       id: 3,
//       name: "Rishabh Pant",
//       role: "Wicket-Keeper",
//       image: "https://example.com/pant.jpg",
//       runs: 6201,
//       matches: 75,
//       average: 82.68,
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     runs: "",
//     matches: "",
//     average: "",
//     image: "",
//     wickets: "",
//   });

//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//     } else if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//     }
//   }, [token, role, navigate]);

//   const handleUpdate = (player) => {
//     setSelectedPlayer(player);
//     setFormData({
//       name: player.name,
//       role: player.role,
//       runs: player.runs,
//       matches: player.matches,
//       average: player.average,
//       image: player.image,
//       wickets: player.wickets || "",
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id) => {
//     setPlayers(players.filter((p) => p.id !== id));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     setPlayers(
//       players.map((p) =>
//         p.id === selectedPlayer.id ? { ...selectedPlayer, ...formData } : p
//       )
//     );
//     setIsModalOpen(false);
//     setSelectedPlayer(null);
//   };

//   const createPlayer = () => {
//     alert("Create Player");
//   }

//   const filteredPlayers = players.filter((player) =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-800">Players</h1>
//           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={createPlayer}>
//             Add New Player
//           </button>
//         </div>
//         <input
//           type="text"
//           placeholder="Search players..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg p-2 mb-6"
//         />
//         <p className="text-lg text-gray-600 mb-8 text-center">
//           Discover player profiles, statistics, and performance metrics.
//         </p>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredPlayers.map((player) => (
//             <PlayerCard
//               key={player.id}
//               player={player}
//               onUpdate={handleUpdate}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ✅ Update Player Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-2xl font-bold mb-4">Update Player</h2>
//             <div className="grid gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="role"
//                 placeholder="Role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="image"
//                 placeholder="Image URL"
//                 value={formData.image}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="number"
//                 name="runs"
//                 placeholder="Runs"
//                 value={formData.runs}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="number"
//                 name="matches"
//                 placeholder="Matches"
//                 value={formData.matches}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="number"
//                 name="average"
//                 placeholder="Average"
//                 value={formData.average}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               {formData.role.toLowerCase() === "bowler" && (
//                 <input
//                   type="number"
//                   name="wickets"
//                   placeholder="Wickets"
//                   value={formData.wickets}
//                   onChange={handleInputChange}
//                   className="border rounded p-2 w-full"
//                 />
//               )}
//             </div>
//             <div className="flex justify-end gap-4 mt-6">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Players;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PlayerCard from "../components/PlayerCard";

// const Players = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   const [players, setPlayers] = useState([
//     {
//       id: 1,
//       name: "MS Dhoni",
//       role: "Wicket-Keeper",
//       image: "https://example.com/dhoni.jpg",
//       runs: 2057,
//       matches: 54,
//       average: 38.09,
//     },
//     {
//       id: 2,
//       name: "Jasprit Bumrah",
//       role: "Bowler",
//       image: "https://example.com/bumrah.jpg",
//       runs: 1201,
//       matches: 42,
//       average: 28.6,
//       wickets: 200,
//     },
//     {
//       id: 3,
//       name: "Rishabh Pant",
//       role: "Wicket-Keeper",
//       image: "https://example.com/pant.jpg",
//       runs: 6201,
//       matches: 75,
//       average: 82.68,
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     runs: "",
//     matches: "",
//     average: "",
//     image: "",
//     wickets: "",
//   });

//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//     } else if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//     }
//   }, [token, role, navigate]);

//   // ✅ Open modal for editing
//   const handleUpdate = (player) => {
//     setSelectedPlayer(player);
//     setFormData({
//       name: player.name,
//       role: player.role,
//       runs: player.runs,
//       matches: player.matches,
//       average: player.average,
//       image: player.image,
//       wickets: player.wickets || "",
//     });
//     setIsEditMode(true);
//     setIsModalOpen(true);
//   };

//   // ✅ Delete player
//   const handleDelete = (id) => {
//     setPlayers(players.filter((p) => p.id !== id));
//   };

//   // ✅ Open modal for adding
//   const handleAddPlayer = () => {
//     setFormData({
//       name: "",
//       role: "",
//       runs: "",
//       matches: "",
//       average: "",
//       image: "",
//       wickets: "",
//     });
//     setSelectedPlayer(null);
//     setIsEditMode(false);
//     setIsModalOpen(true);
//   };

//   // ✅ Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // ✅ Save logic for Add or Update
//   const handleSave = () => {
//     if (isEditMode) {
//       // Update player
//       setPlayers(
//         players.map((p) =>
//           p.id === selectedPlayer.id ? { ...selectedPlayer, ...formData } : p
//         )
//       );
//     } else {
//       // Add new player
//       const newPlayer = {
//         ...formData,
//         id: players.length + 1, // Temporary ID logic
//       };
//       setPlayers([...players, newPlayer]);
//     }
//     setIsModalOpen(false);
//     setSelectedPlayer(null);
//   };

//   const filteredPlayers = players.filter((player) =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-800">Players</h1>
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={handleAddPlayer}
//           >
//             Add New Player
//           </button>
//         </div>
//         <input
//           type="text"
//           placeholder="Search players..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg p-2 mb-6"
//         />
//         <p className="text-lg text-gray-600 mb-8 text-center">
//           Discover player profiles, statistics, and performance metrics.
//         </p>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredPlayers.map((player) => (
//             <PlayerCard
//               key={player.id}
//               player={player}
//               onUpdate={handleUpdate}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ✅ Modal for Add & Update */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-2xl font-bold mb-4">
//               {isEditMode ? "Update Player" : "Add New Player"}
//             </h2>
//             <div className="grid gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="role"
//                 placeholder="Role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="image"
//                 placeholder="Image URL"
//                 value={formData.image}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="number"
//                 name="runs"
//                 placeholder="Runs"
//                 value={formData.runs}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="number"
//                 name="matches"
//                 placeholder="Matches"
//                 value={formData.matches}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="number"
//                 name="average"
//                 placeholder="Average"
//                 value={formData.average}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               <input
//                 type="wicket"
//                 name="wickets"
//                 placeholder="Wickets"
//                 value={formData.wickets}
//                 onChange={handleInputChange}
//                 className="border rounded p-2 w-full"
//               />
//               {formData.role.toLowerCase() === "bowler" && (
//                 <input
//                   type="number"
//                   name="wickets"
//                   placeholder="Wickets"
//                   value={formData.wickets}
//                   onChange={handleInputChange}
//                   className="border rounded p-2 w-full"
//                 />
//               )}
//             </div>
//             <div className="flex justify-end gap-4 mt-6">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {isEditMode ? "Save Changes" : "Add Player"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Players;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PlayerCard from "../components/PlayerCard";
// import axios from "axios";

// const API_BASE = "http://localhost:3026/api/players";

// const Players = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const userId = JSON.parse(localStorage.getItem("userId"));


//   const [players, setPlayers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     runs: 0,
//     matches: 0,
//     average: 0,
//     image: "",
//     wickets: 0,
//   });

//   // ✅ Fetch players from API
//   useEffect(() => {
//     if (!token) {
//       alert("You need to log in first!");
//       navigate("/login");
//     } else if (!["player", "team_owner", "admin"].includes(role)) {
//       alert("Access denied! Only players, team owners, and admins can view this page.");
//       navigate("/");
//     } else {
//       fetchPlayers();
//     }
//   }, [token, role, navigate]);

//   const fetchPlayers = async () => {
//     try {
//       const res = await axios.get(API_BASE, formData,{
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPlayers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Open modal for editing
//   const handleUpdate = (player) => {
//     setSelectedPlayer(player);
//     setFormData({
//       name: player.name,
//       role: player.role,
//       runs: player.runs,
//       matches: player.matches,
//       average: player.average,
//       image: player.image,
//       wickets: player.wickets || "",
//     });
//     setIsEditMode(true);
//     setIsModalOpen(true);
//   };

//   // ✅ Delete player from DB
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this player?")) return;
//     try {
//       await axios.delete(`${API_BASE}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPlayers(players.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Open modal for adding
//   const handleAddPlayer = () => {
//     setFormData({
//       name: "",
//       role: "",
//       runs: 0,
//       matches: 0,
//       average: 0,
//       image: "",
//       wickets: 0,
//     });
//     setSelectedPlayer(null);
//     setIsEditMode(false);
//     setIsModalOpen(true);
//     console.log(token);

//   };

//   const convertToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };


//   // ✅ Input change handler
// // const handleInputChange = async (e) => {
// //   const { name, value, files } = e.target;

// //   if (name === "image" && files[0]) {
// //     // const file = files[0];
// //     const base64 = await convertToBase64(files[0]);
// //     setFormData((prev) => ({
// //       ...prev,
// //       image: base64, // base64 string
// //     }));
// //   } else {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   }
// // };

// const handleInputChange = async (e) => {
//   const { name, value, files } = e.target;

//   if (name === "image" && files?.[0]) {
//     const file = files[0];

//     // ✅ Validate file type
//     if (!file.type.startsWith("image/")) {
//       alert("Please upload a valid image file.");
//       return;
//     }

//     // ✅ Optional: Validate file size (e.g., max 2MB)
//     const maxSizeMB = 2;
//     if (file.size > maxSizeMB * 1024 * 1024) {
//       alert(`Image size should be less than ${maxSizeMB}MB.`);
//       return;
//     }

//     try {
//       const base64 = await convertToBase64(file);
//       console.log("Base64 preview:", base64.slice(0, 100)); // 🧠 Debug

//       setFormData((prev) => ({
//         ...prev,
//         image: base64,
//       }));
//     } catch (err) {
//       console.error("Error converting image:", err);
//       alert("Failed to process image. Try a different file.");
//     }
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
// };

//   // const handleInputChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormData({ ...formData, [name]: value });
//   // };


//   // ✅ Save logic for Add or Update
//   // const handleSave = async () => {
//   //   try {
//   //     if (isEditMode) {
//   //       const res = await axios.put(`${API_BASE}/${selectedPlayer._id}`, formData, {
//   //         headers: { Authorization: `Bearer ${token}` }
//   //       });
//   //       setPlayers(players.map((p) => (p._id === selectedPlayer._id ? res.data : p)));
//   //     } else {
//   //       const res = await axios.post(API_BASE, formData, {
//   //         headers: { Authorization: `Bearer ${token}` }
//   //       });
//   //       setPlayers([...players, res.data]);
//   //     }
//   //     setIsModalOpen(false);
//   //     setSelectedPlayer(null);
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

// //asol
// //   const handleSave = async () => {
// //   try {
// //     // ✅ Prepare data as per Player schema
// //     const payload = {
// //       name: formData.name,
// //       age: Number(formData.age),  // Add input for age
// //       role: formData.role,
// //       battingStyle: formData.battingStyle || "",
// //       bowlingStyle: formData.bowlingStyle || "",
// //       image: formData.image || "https://via.placeholder.com/150",
// //       matchesPlayed: Number(formData.matches),
// //       runs: Number(formData.runs),
// //       wickets: Number(formData.wickets),
// //       userId: localStorage.getItem("userId"), // ✅ If required by schema
// //     };

// //     const config = {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         "Content-Type": "application/json",
// //       },
// //     };

// //     if (isEditMode) {
// //       const res = await axios.put(`${API_BASE}/${selectedPlayer._id}`, payload, config);
// //       setPlayers(players.map((p) => (p._id === selectedPlayer._id ? res.data : p)));
// //     } else {
// //       const res = await axios.post(API_BASE, payload, config);
// //       setPlayers([...players, res.data]);
// //     }

// //     setIsModalOpen(false);
// //     setSelectedPlayer(null);
// //   } catch (err) {
// //     console.error("Error saving player:", err.response?.data || err.message);
// //     alert(err.response?.data?.error || "Something went wrong!");
// //   }
// // };

// const handleSave = async () => {
//   try {
//     // 🧠 Validate image format
//     let imageString = formData.image;
// const isValidImage =
//   typeof imageString === "string" &&
//   imageString.trim() !== "" &&
//   (imageString.startsWith("data:image") || imageString.startsWith("http"));

// if (!isValidImage) {
//   console.warn("Invalid image detected, using fallback.");
//   imageString = "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
// }



//     // 🧠 Optional: Log image preview
//     console.log("Image type:", typeof imageString);
//     console.log("Image preview:", imageString?.slice(0, 100));

//     // ✅ Prepare payload
//     const payload = {
//       name: formData.name?.trim(),
//       age: Number(formData.age),
//       role: formData.role?.trim(),
//       battingStyle: formData.battingStyle?.trim() || "",
//       bowlingStyle: formData.bowlingStyle?.trim() || "",
//       image: imageString,
//       matches: Number(formData.matches),
//       average: Number(formData.average),
//       runs: Number(formData.runs),
//       wickets: Number(formData.wickets),
//       userId: userId,
//     };

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };

//     // 🔁 Save or update
//     const res = isEditMode
//       ? await axios.put(`${API_BASE}/${selectedPlayer._id}`, payload, config)
//       : await axios.post(API_BASE, payload, config);

//     // 🔄 Update local state
//     setPlayers((prev) =>
//       isEditMode
//         ? prev.map((p) => (p._id === selectedPlayer._id ? res.data : p))
//         : [...prev, res.data]
//     );

//     // ✅ Reset modal
//     setIsModalOpen(false);
//     setSelectedPlayer(null);
//   } catch (err) {
//     console.error("Error saving player:", err.response?.data || err.message);
//     alert(err.response?.data?.error || "Something went wrong!");
//   }
// };


//   const filteredPlayers = players.filter((player) =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-800">Players</h1>
//           {(role === "admin" || role === "team_owner"||role==="player") && (
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               onClick={handleAddPlayer}
//             >
//               Add New Player
//             </button>
//           )}
//         </div>
//         <input
//           type="text"
//           placeholder="Search players..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg p-2 mb-6"
//         />
//         <p className="text-lg text-gray-600 mb-8 text-center">
//           Discover player profiles, statistics, and performance metrics.
//         </p>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredPlayers.map((player) => (
//             <PlayerCard
//               key={player._id}
//               player={player}
//               onUpdate={handleUpdate}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ✅ Modal */}
//       {/* {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-2xl font-bold mb-4">
//               {isEditMode ? "Update Player" : "Add New Player"}
//             </h2>
//             <div className="grid gap-4">
//               {["name", "role", "image", "runs", "matches", "average", "wickets"].map((field) => (
//                 <input
//                   key={field}
//                   type={["name", "role", "image", "runs", "matches", "average", "wickets"].includes(field) ? "text" : "number"}
//                   name={field}
//                   placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//     value={formData[field] || ""}
//     onChange={handleInputChange}
//     className="border rounded p-2 w-full"
//   />
// ))}
//             </div>
//             <div className="flex justify-end gap-4 mt-6">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {isEditMode ? "Save Changes" : "Add Player"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {isModalOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//       <h2 className="text-2xl font-bold mb-4">
//         {isEditMode ? "Update Player" : "Add New Player"}
//       </h2>
//       <div className="grid gap-4">
//         {["name", "role", "runs", "matches", "average", "wickets"].map((field) => (
//           <input
//             key={field}
//             type="text"
//             name={field}
//             placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//             value={formData[field] || ""}
//             onChange={handleInputChange}
//             className="border rounded p-2 w-full"
//           />
//         ))}

//         {/* Image Upload Field */}
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files[0];
//             setFormData((prev) => ({
//               ...prev,
//               image: file,
//             }));
//           }}
//           className="border rounded p-2 w-full"
//         />
//       </div>

//       <div className="flex justify-end gap-4 mt-6">
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           {isEditMode ? "Save Changes" : "Add Player"}
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default Players;
////// Final 

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import axios from "axios";

const API_BASE = "http://localhost:3026/api/players";

const Players = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = JSON.parse(localStorage.getItem("userId"));

  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    runs: 0,
    matches: 0,
    average: 0,
    image: "",
    wickets: 0,
    battingStyle: "",
    bowlingStyle: "",
    age: 0,
  });

  // Convert File to base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Fetch players from API
  useEffect(() => {
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    } else if (!["player", "team_owner", "admin"].includes(role)) {
      alert("Access denied! Only players, team owners, and admins can view this page.");
      navigate("/");
    } else {
      fetchPlayers();
    }
  }, [token, role, navigate]);

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched players:", res.data); // Debug
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err.response?.data || err.message);
      setError("Failed to fetch players.");
    }
  };

  // Open modal for editing
  const handleUpdate = (player) => {
    setSelectedPlayer(player);
    setFormData({
      name: player.name || "",
      role: player.role || "",
      runs: player.runs || 0,
      matches: player.matches || 0,
      average: player.average || 0,
      image: player.image || "",
      wickets: player.wickets || 0,
      battingStyle: player.battingStyle || "",
      bowlingStyle: player.bowlingStyle || "",
      age: player.age || 0,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Delete player from DB
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this player?")) return;
  //   try {
  //     await axios.delete(`${API_BASE}/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setPlayers(players.filter((p) => p._id !== id));
  //   } catch (err) {
  //     console.error("Error deleting player:", err.response?.data || err.message);
  //     setError("Failed to delete player.");
  //   }
  // };

  const handleDelete = async (id) => {
  if (!id) {
    console.error("No player ID provided");
    setError("Invalid player ID");
    return;
  }
  console.log("Deleting player with ID:", id);
  console.log("Token:", token);
  if (!window.confirm("Are you sure you want to delete this player?")) return;
  try {
    const response = await axios.delete(`${API_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Delete response:", response.data); // Debug
    setPlayers((prev) => {
      const updatedPlayers = prev.filter((p) => p._id !== id);
      console.log("Updated players:", updatedPlayers); // Debug
      return updatedPlayers;
    });
    setError(""); // Clear any previous errors
  } catch (err) {
    console.error("Error deleting player:", err.response?.data || err.message);
    if (err.response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    } else if (err.response?.status === 404) {
      setError("Player not found.");
    } else {
      setError(`Failed to delete player: ${err.response?.data?.error || err.message}`);
    }
  }
};

  // Open modal for adding
  const handleAddPlayer = () => {
    setFormData({
      name: "",
      role: "",
      runs: 0,
      matches: 0,
      average: 0,
      image: "",
      wickets: 0,
      battingStyle: "",
      bowlingStyle: "",
      age: 0,
    });
    setSelectedPlayer(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Input change handler
  // const handleInputChange = async (e) => {
  //   const { name, value, files } = e.target;

  //   if (name === "image" && files?.[0]) {
  //     const file = files[0];

  //     // Validate file type
  //     if (!file.type.startsWith("image/")) {
  //       setError("Please upload a valid image file (e.g., JPEG, PNG).");
  //       return;
  //     }

  //     // Validate file size (max 2MB)
  //     const maxSizeMB = 2;
  //     if (file.size > maxSizeMB * 1024 * 1024) {
  //       setError(`Image size should be less than ${maxSizeMB}MB.`);
  //       return;
  //     }

  //     try {
  //       const base64 = await convertToBase64(file);
  //       console.log("Base64 image:", base64.slice(0, 50)); // Debug
  //       setFormData((prev) => ({
  //         ...prev,
  //         image: base64,
  //       }));
  //     } catch (err) {
  //       console.error("Error converting image to base64:", err);
  //       setError("Failed to process image. Try a different file.");
  //     }
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleInputChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "image" && files?.[0]) {
    setImageFile(files[0]);
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  // Save logic for Add or Update
  // const handleSave = async () => {
  //   try {
  //     // Validate required fields
  //     if (!formData.name?.trim() || !formData.role?.trim()) {
  //       setError("Name and role are required.");
  //       return;
  //     }

  //     // Prepare payload
  //     const payload = {
  //       name: formData.name.trim(),
  //       age: Number(formData.age) || 0,
  //       role: formData.role.trim(),
  //       battingStyle: formData.battingStyle?.trim() || "",
  //       bowlingStyle: formData.bowlingStyle?.trim() || "",
  //       image: formData.image || undefined, // Let schema handle default if undefined
  //       matches: Number(formData.matches) || 0,
  //       average: Number(formData.average) || 0,
  //       runs: Number(formData.runs) || 0,
  //       wickets: Number(formData.wickets) || 0,
  //       createdBy: userId,
  //     };

  //     // Debug payload
  //     console.log("Payload to send:", payload);

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     // Save or update
  //     const res = isEditMode
  //       ? await axios.put(`${API_BASE}/${selectedPlayer._id}`, payload, config)
  //       : await axios.post(API_BASE, payload, config);

  //     console.log("Server response:", res.data); // Debug

  //     // Update local state
  //     setPlayers((prev) =>
  //       isEditMode
  //         ? prev.map((p) => (p._id === selectedPlayer._id ? res.data : p))
  //         : [...prev, res.data]
  //     );

  //     // Reset modal
  //     setIsModalOpen(false);
  //     setSelectedPlayer(null);
  //     setError("");
  //   } catch (err) {
  //     console.error("Error saving player:", err.response?.data || err.message);
  //     setError(err.response?.data?.error || "Failed to save player. Please try again.");
  //   }
  // };

  const handleSave = async () => {
  try {
    if (!formData.name?.trim() || !formData.role?.trim()) {
      setError("Name and role are required.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("age", formData.age || 0);
    data.append("role", formData.role.trim());
    data.append("battingStyle", formData.battingStyle || "");
    data.append("bowlingStyle", formData.bowlingStyle || "");
    data.append("matches", formData.matches || 0);
    data.append("average", formData.average || 0);
    data.append("runs", formData.runs || 0);
    data.append("wickets", formData.wickets || 0);
    data.append("createdBy", userId);
    if (imageFile) {
      data.append("image", imageFile);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    let res;
    if (isEditMode) {
      res = await axios.put(`${API_BASE}/${selectedPlayer._id}`, data, config);
      setPlayers((prev) =>
        prev.map((p) => (p._id === selectedPlayer._id ? res.data : p))
      );
    } else {
      res = await axios.post(API_BASE, data, config);
      setPlayers((prev) => [...prev, res.data]);
    }

    setIsModalOpen(false);
    setSelectedPlayer(null);
    setError("");
    setImageFile(null);
  } catch (err) {
    setError(err.response?.data?.error || "Failed to save player. Please try again.");
  }
};

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Players</h1>
          {(role === "admin" || role === "team_owner" || role === "player") && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddPlayer}
            >
              Add New Player
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-6"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover player profiles, statistics, and performance metrics.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player._id}
              player={player}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6  rounded-lg shadow-lg max-w-screen max-h-screen overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Update Player" : "Add New Player"}
            </h2>
            <div className="grid gap-4">
              {["name", "role", "age", "battingStyle", "bowlingStyle", "runs", "matches", "average", "wickets"].map((field) => (
                <input
                  key={field}
                  type={["runs", "matches", "average", "wickets", "age"].includes(field) ? "number" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                />
              ))}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mt-2 max-w-[200px] rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditMode ? "Save Changes" : "Add Player"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;


