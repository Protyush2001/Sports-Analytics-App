import React from 'react'
import { useState,useEffect } from 'react';
import axios from "axios";


const tabs = ["Live", "Upcoming", "Completed"];
const BASE_URL = "http://localhost:3026/api/matches";

const Matches = () => {
      const [activeTab, setActiveTab] = useState("Live");
      const [matches, setMatches] = useState([]);
      const [loading, setLoading] = useState(false);
    
      const fetchMatches = async (tab) => {
        setLoading(true);
        try {
          const res = await axios.get(`${BASE_URL}?category=${tab.toLowerCase()}`);
          setMatches(res.data.matches || []);
        } catch (err) {
          console.error("Failed to fetch:", err);
          setMatches([]);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchMatches(activeTab);
      }, [activeTab]);
  return (
    <div>
      
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>Create Match</button>

      {/* Matches */}
      {loading ? (
        <p className="text-center text-blue-500">Loading matches...</p>
      ) : matches.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {match.name}
              </h2>
              <p className="text-gray-700">
                {match.t1} <strong>vs</strong> {match.t2}
              </p>
              <p className="text-gray-600">
                Score: {match.t1}-{match.t1s}, {match.t2}-{match.t2s}
              </p>
              <p className="font-medium mt-2">
                Status:{" "}
                <span
                  className={`${
                    match.status.includes("Live")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {match.status}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Date: {new Date(match.dateTimeGMT).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No matches found for {activeTab}.
        </p>
      )}
    </div>
  )
}

export default Matches
