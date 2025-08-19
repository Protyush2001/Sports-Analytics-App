import React from "react";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Visualize player performance, match statistics, and more.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Player Stats
          </h2>
          <p className="text-gray-600 text-sm">
            Track runs, wickets, and strike rates of players across matches.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Match Insights
          </h2>
          <p className="text-gray-600 text-sm">
            Analyze match performance with win/loss ratios and key highlights.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Team Comparisons
          </h2>
          <p className="text-gray-600 text-sm">
            Compare teams based on batting, bowling, and overall efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

