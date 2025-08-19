import React from 'react'

const Teams = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏏 Teams</h1>
        <p className="text-lg text-gray-600">
          Explore team statistics, player rosters, and match histories.
        </p>
      </div>

      {/* Teams Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Example Team Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Mumbai Indians</h2>
          <p className="text-gray-600 mb-4">
            5x IPL Champions. Strong batting lineup and fast bowlers.
          </p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            View Details
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Chennai Super Kings</h2>
          <p className="text-gray-600 mb-4">
            4x IPL Champions. Known for consistency and leadership.
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            View Details
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Royal Challengers Bangalore</h2>
          <p className="text-gray-600 mb-4">
            Iconic batting legends, aiming for their first title.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default Teams
