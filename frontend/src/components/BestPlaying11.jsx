
// import PlayerDot from "./PlayerDot";

// export default function BestPlaying11({ bestTeam, fieldPositions }) {
//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         Best Playing 11 on Field
//       </h2>
//       <div className="relative w-full max-w-4xl mx-auto h-96 bg-green-200 rounded-xl overflow-hidden">
//         <img
//           src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Cricket_field_parts.svg"
//           alt="Cricket Ground"
//           className="absolute inset-0 w-full h-full object-contain bg-black"
//         />
//         {bestTeam.map((player, index) => {
//           const pos = fieldPositions[index] || { top: "50%", left: "50%" };
//           return <PlayerDot key={player._id || index} player={player} position={pos} />;
//         })}
//       </div>
//     </div>
//   );
// }
//////////////////////////////////////////////////////////////////////////////////////////////////

// import React from "react";
// import PlayerDot from "./PlayerDot";

// export default function BestPlaying11({ bestTeam, fieldPositions, onGenerateTeam, isGenerating }) {
//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Best Playing 11 on Field</h2>

//       <button
//         onClick={onGenerateTeam}
//         disabled={isGenerating}
//         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:scale-105 transition mb-6 disabled:opacity-50"
//       >
//         {isGenerating ? "Generating..." : "Generate Best Team"}
//       </button>

//       {bestTeam.length > 0 ? (
//         <div className="relative w-full aspect-[4/3] bg-green-700 rounded-2xl overflow-hidden shadow-xl">
//           <img
//             src="https://www.shutterstock.com/image-photo/cricket-field-top-view-pitch-600nw-2593340443.jpg"
//             alt="Cricket Ground"
//             className="absolute inset-0 w-full h-full object-contain bg-black"
//           />
//           <div className="absolute inset-0 bg-black/10" />
//           {bestTeam.map((player, index) => {
//             const pos = fieldPositions[index] || { top: "50%", left: "50%" };
//             return <PlayerDot key={player._id || index} player={player} position={pos} />;
//           })}
//         </div>
//       ) : (
//         <div className="text-center text-gray-500 mt-4">
//           <p>Click the button to generate the best playing 11.</p>
//           <p className="text-sm mt-1">Based on performance, role balance, and match conditions.</p>
//         </div>
//       )}
//     </div>
//   );
// }