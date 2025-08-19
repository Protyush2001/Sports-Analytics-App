import { Link } from "react-router-dom";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Cricket Analytics 🏏
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/matches" className="hover:text-blue-600">Matches</Link>
          <Link to="/players" className="hover:text-blue-600">Players</Link>
          <Link to="/teams" className="hover:text-blue-600">Teams</Link>
          <Link to="/analytics" className="hover:text-blue-600">Analytics</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

