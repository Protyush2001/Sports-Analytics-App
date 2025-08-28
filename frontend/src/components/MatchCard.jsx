// const MatchCard = ({ match }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-4 mb-4 w-full">
//       <h2 className="text-lg font-semibold mb-1">{match.name}</h2>
//       <p className="text-sm text-gray-600 mb-1">{match.date}</p>
//       <p className="text-sm">{match.status}</p>
//     </div>
//   );
// };

// export default MatchCard;

// import React from "react";

// const statusColors = {
//   Live: "bg-green-100 text-green-700",
//   Completed: "bg-gray-100 text-gray-700",
//   Upcoming: "bg-blue-100 text-blue-700",
// };

// const MatchCard = ({ match }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
//       {/* Match Name */}
//       <h2 className="text-xl font-bold text-gray-800 mb-2">{match.name}</h2>

//       {/* Match Date */}
//       <p className="text-gray-500 text-sm mb-4">{match.date}</p>

//       {/* Teams */}
//       <div className="flex justify-between items-center mb-4">
//         <span className="font-semibold">{match.teamA}</span>
//         <span className="text-gray-400">vs</span>
//         <span className="font-semibold">{match.teamB}</span>
//       </div>

//       {/* Status Badge */}
//       <span
//         className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${statusColors[match.status]}`}
//       >
//         {match.status}
//       </span>
//     </div>
//   );
// };

// export default MatchCard;


import React from "react";

const statusColors = {
  Live: "bg-green-100 text-green-700 border border-green-300",
  Completed: "bg-gray-100 text-gray-700 border border-gray-300",
  Upcoming: "bg-blue-100 text-blue-700 border border-blue-300",
};

const MatchCard = ({ match }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 border border-gray-100">
      {/* Match Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-2">{match.name || match.title}</h2>

      {/* Date */}
      <p className="text-gray-500 text-sm mb-4">
        {match.dateTimeGMT ? new Date(match.dateTimeGMT).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
        minute: "2-digit",
        }) : "Date not available"}
      </p>


      {/* Teams */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-gray-800">{match.teamA || match.t1}</span>
        <span className="text-gray-400 font-medium">VS</span>
        <span className="font-semibold text-gray-800">{match.teamB || match.t2}</span>
      </div>

      {/* Score */}
      {(match.t1s || match.t2s) && (
        <div className="flex justify-between text-gray-600 text-sm mb-4">
          <span>{match.t1}: <strong>{match.t1s || 0}</strong></span>
          <span>{match.t2}: <strong>{match.t2s || 0}</strong></span>
        </div>
      )}

      {/* Status */}
      <span
        className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${statusColors[match.status] || "bg-gray-100 text-gray-700"}`}
      >
        {match.status}
      </span>
    </div>
  );
};

export default MatchCard;
