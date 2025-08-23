import React from "react";

const PlayerCard = ({ player, onUpdate, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition">
      <img
        src={player.image}
        alt={player.name}
        className="w-32 h-32 object-cover rounded-full mb-4"
      />
      <h2 className="text-xl font-bold text-gray-800">{player.name}</h2>
      <p className="text-sm text-gray-500 mb-1">({player.role})</p>
      <p className="text-gray-600">
        <strong>Total Runs:</strong> {player.runs}
      </p>
      <p className="text-gray-600">
        <strong>Matches Played:</strong> {player.matches}
      </p>
      <p className="text-gray-600">
        <strong>Batting Avg:</strong> {player.average}
      </p>
      {player.wickets !== undefined && (
        <p className="text-gray-600">
          <strong>Wickets:</strong> {player.wickets}
        </p>
      )}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onUpdate(player)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(player._id)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
