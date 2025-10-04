// // // components/TeamSelect.jsx
// // import React from "react";

// // export default function TeamSelect({ teams, selectedTeamId, onChange }) {
// //   // Guard against non-array
// //   const safeTeams = Array.isArray(teams) ? teams : [];

// //   return (
// //     <select
// //       value={selectedTeamId}
// //       onChange={(e) => onChange(e.target.value)}
// //       className="border rounded-md px-3 py-2 mb-4 w-full"
// //     >
// //       <option value="">Select a Team</option>
// //       {safeTeams.map((team) => (
// //         <option key={team._id} value={team._id}>
// //           {team.name}
// //         </option>
// //       ))}
// //     </select>
// //   );
// // }

// //////////////////////////////////////////////////////////////////

// import React from "react";

// export default function TeamSelect({ teams, selectedTeamId, onChange }) {
//   const safeTeams = Array.isArray(teams) ? teams : [];

//   return (
//     <select
//       value={selectedTeamId}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
//     >
//       <option value="">All Teams</option>
//       {safeTeams.map((team) => (
//         <option key={team._id} value={team._id}>
//           {team.name}
//         </option>
//       ))}
//     </select>
//   );
// }
