// import { Link } from "react-router-dom";
// import React from "react";

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Logo / Brand */}
//         <Link to="/" className="text-xl font-bold text-blue-600">
//           Cricket Analytics 🏏
//         </Link>

//         {/* Navigation Links */}
//         <div className="flex space-x-6">
//           <Link to="/" className="hover:text-blue-600">Home</Link>
//           <Link to="/matches" className="hover:text-blue-600">Matches</Link>
//           <Link to="/players" className="hover:text-blue-600">Players</Link>
//           <Link to="/teams" className="hover:text-blue-600">Teams</Link>
//           <Link to="/analytics" className="hover:text-blue-600">Analytics</Link>
//         </div>

//         {/* Auth Buttons */}
//         <div className="flex space-x-4">
//           <Link
//             to="/login"
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Signup
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import React from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // const getInitials = (username) => {
  //   if (!username) return "";
  //   const parts = username.trim().split(" ");
  //   return parts.map((p) => p[0].toUpperCase()).join("").slice(0, 2);
  // };
    const getInitials = (username) => {
    if (!username || typeof username !== "string") return "U";
    const parts = username.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };


  return (
    // <nav className="bg-white shadow-md sticky top-0 z-50">
    //   <div className="container mx-auto px-4 py-3 flex justify-between items-center">
    //     {/* Logo / Brand */}
    //     <Link to="/" className="text-xl font-bold text-blue-600">
    //       Cricket Analytics 🏏
    //     </Link>

    //     {/* Navigation Links */}
    //     <div className="flex space-x-6">
    //       <Link to="/" className="hover:text-blue-600">Home</Link>
    //       <Link to="/matches" className="hover:text-blue-600">Matches</Link>
    //       <Link to="/players" className="hover:text-blue-600">Players</Link>
    //       <Link to="/teams" className="hover:text-blue-600">Teams</Link>
    //       <Link to="/analytics" className="hover:text-blue-600">Analytics</Link>
    //     </div>

    //     {/* Auth Section */}
    //     <div className="flex items-center space-x-4">
    //       {!token ? (
    //         <>
    //           <Link
    //             to="/login"
    //             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    //           >
    //             Login
    //           </Link>
    //           <Link
    //             to="/signup"
    //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //           >
    //             Signup
    //           </Link>
    //         </>
    //       ) : (
    //         <>
    //           <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-600">
    //             {getInitials(user?.username)}
    //           </div>
    //           <button
    //             onClick={handleLogout}
    //             className="px-4 py-2  bg-blue-500 text-white rounded hover:bg-red-600"
    //           >
    //             <FaSignOutAlt />
    //           </button>
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </nav>
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link to="/" className="text-2xl font-bold text-blue-700 tracking-tight">
            Cricket Analytics 🏏
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/matches" className="hover:text-blue-600 transition">Matches</Link>
            <Link to="/players" className="hover:text-blue-600 transition">Players</Link>
            <Link to="/teams" className="hover:text-blue-600 transition">Teams</Link>
            <Link to="/analytics" className="hover:text-blue-600 transition">Analytics</Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-gray-100 text-sm rounded-md hover:bg-gray-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                >
                  Signup
                         </Link>
              </>
            ) : (
              <>
                <div
                  className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition"
                  title={user?.username}
                >
                  {getInitials(user?.username)}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 text-xl transition"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  
  );
};

export default Navbar;
