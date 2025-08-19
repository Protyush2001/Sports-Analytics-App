

import React, { useState } from "react";
import axios from "axios";
import Inputfield from "../components/forms/Inputfield";
import Button from "../components/forms/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3026/login", {
        email,
        password,
      });

      setMessage(res.data.message);

      // ✅ clear inputs after success
      if (res.status === 200) {
        alert("Login successful 🎉");
        setEmail("");
        setPassword("");
        return
      }else if(res.status === 400) {
        alert("Login failed ❌");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      alert("Login failed ❌");
     
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
          value={email} // ✅ controlled
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Inputfield
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password} // ✅ controlled
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button label="Login" type="submit" />

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Login;

