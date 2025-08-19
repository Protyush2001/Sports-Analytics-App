import React from 'react';

const Players = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Players
        </h1>
        <form action="">
          <input
            type="text"
            placeholder="Search players..."
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <div>
            <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
              Search
            </button>
          </div>
        </form>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          Discover player profiles, statistics, and performance metrics.
        </p>

        {/* Example Card Grid (for player list) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Player 1</h2>
            <p className="text-sm text-gray-500 mt-2">
              Batsman • Avg: 45.2 • SR: 135.6
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Player 2</h2>
            <p className="text-sm text-gray-500 mt-2">
              Bowler • Wickets: 75 • Economy: 6.8
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Player 3</h2>
            <p className="text-sm text-gray-500 mt-2">
              All-Rounder • Runs: 1200 • Wickets: 55
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;

