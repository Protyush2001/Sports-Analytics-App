// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import React from "react";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Players from "./pages/Players";
// import Teams from "./pages/Teams";
// import Analytics from "./pages/Analytics";
// import Matches from "./pages/Matches";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Footer from "./components/Footer";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <Routes>
//           <Route path="/" element={<Home />} />
          
//           <Route path="/matches" element={<Matches />} />
//           <Route path="/players" element={<Players />} />
//           <Route path="/teams" element={<Teams />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//         </Routes>
//       </div>
//       <Footer />
//     </Router>
    
//   );
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import React from "react";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Players from "./pages/Players";
// import Teams from "./pages/Teams";
// import Analytics from "./pages/Analytics";
// import Matches from "./pages/Matches";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <Routes>
//           <Route path="/" element={<Home />} />
          
//           {/* Matches → any logged-in user */}
//           <Route
//             path="/matches"
//             element={
//               <ProtectedRoute>
//                 <Matches />
//               </ProtectedRoute>
//             }
//           />

//           {/* Players → Only Admin, Player, Team Owner */}
//           <Route
//             path="/players"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "player", "team_owner"]}>
//                 <Players />
//               </ProtectedRoute>
//             }
//           />

//           {/* Teams → Only Admin & Team Owner */}
//           <Route
//             path="/teams"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "team_owner"]}>
//                 <Teams />
//               </ProtectedRoute>
//             }
//           />

//           {/* Analytics → any logged-in user */}
//           <Route
//             path="/analytics"
//             element={
//               <ProtectedRoute>
//                 <Analytics />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
//           <Route path="/signup" element={<ProtectedRoute><Signup /></ProtectedRoute>} />
//         </Routes>
//       </div>
//       <Footer />
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Analytics from "./pages/Analytics";
import Matches from "./pages/Matches";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
// import AuthProvider from "./context/AuthProvider";

function App() {
  return (
  
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />

          <Route
            path="/players"
            element={
              <ProtectedRoute allowedRoles={["admin", "player", "team_owner"]}>
                <Players />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teams"
            element={
              <ProtectedRoute allowedRoles={["admin", "team_owner"]}>
                <Teams />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin", "player", "team_owner"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />
                        {/* ✅ Admin route with role protection */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
        </Routes>


      </div>
      <Footer />
    </Router>

  );
}

export default App;

