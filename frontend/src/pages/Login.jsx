

// import React, { useState } from "react";
// import axios from "axios";
// import Inputfield from "../components/forms/Inputfield";
// import Button from "../components/forms/Button";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
 

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:3026/login", {
//         email,
//         password,
//       });

//       setMessage(res.data.message);

//       // ✅ clear inputs after success
//       if (res.status === 200) {
//         alert("Login successful 🎉");
//         setEmail("");
//         setPassword("");
//         return
//       }else if(res.status === 400) {
//         alert("Login failed ❌");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Login failed");
//       alert("Login failed ❌");
     
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//           Login
//         </h2>

//         <Inputfield
//           label="Email"
//           type="email"
//           id="email"
//           name="email"
//           value={email} // ✅ controlled
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <Inputfield
//           label="Password"
//           type="password"
//           id="password"
//           name="password"
//           value={password} // ✅ controlled
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <Button label="Login" type="submit" />

//         {message && (
//           <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import axios from "axios";
import Inputfield from "../components/forms/Inputfield";
import Button from "../components/forms/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const res = await axios.post("http://localhost:3026/login", {
  //       email,
  //       password,
  //     });

  //     if (res.status === 200) {
  //       const { token, message } = res.data;

  //       // ✅ Save token in localStorage for protected routes
  //       localStorage.setItem("token", token);

  //       setMessage(message || "Login successful 🎉");

  //       // ✅ Redirect to protected route
  //       setTimeout(() => {
  //         navigate("/players"); // Replace with your protected route
  //       }, 1000);

  //       // ✅ Clear input fields
  //       setEmail("");
  //       setPassword("");
  //     } else {
  //       setMessage("Invalid credentials ❌");
  //     }
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "Login failed ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const res = await axios.post("http://localhost:3026/login", {
      email,
      password,
    });

    if (res.status === 200) {
      const { token, role, userId, message } = res.data;

      // ✅ Save token & role in localStorage for later use
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      setMessage(message || "Login successful 🎉");

      // ✅ Redirect based on role
      setTimeout(() => {
        if (role === "player") {
          navigate("/players");
        } else if (role === "teamOwner") {
          navigate("/teams");
        } else if (role === "admin") {
          navigate("/admin");
        } else if(role==="general user"){
          navigate("/"); // Default page
        }
      }, 1000);

      // ✅ Clear input fields
      setEmail("");
      setPassword("");
    } else {
      setMessage("Invalid credentials ❌");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>

        <Inputfield
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Inputfield
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button label={loading ? "Logging in..." : "Login"} type="submit" />

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;


