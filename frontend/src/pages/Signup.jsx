// import React, { useState } from "react";
// import Inputfield from "../components/forms/Inputfield";
// import Button from "../components/forms/Button";
// import axios from "axios";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:3026/register", formData);
//       alert("Signup successful 🎉");
//       console.log(res.data);
//     } catch (err) {
//       alert("Signup failed ❌");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

//         {/* Username */}
//         <div className="mb-4">
//           <Inputfield
//             label="Username"
//             type="text"
//             id="username"
//             name="username"
//             required
//             onChange={handleChange}
//           />
//         </div>


//         {/* Email */}
//         <div className="mb-4">
//           <Inputfield
//             label="Email"
//             type="email"
//             id="email"
//             name="email"
//             required
//             onChange={handleChange}
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-4">
//           <Inputfield
//             label="Password"
//             type="password"
//             id="password"
//             name="password"
//             required
//             onChange={handleChange}
//           />
//         </div>

//         {/* Submit */}
//         <Button label="Sign Up" type="submit" />
//       </form>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from "react";
import Inputfield from "../components/forms/Inputfield";
import Button from "../components/forms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "general_user", // default role
  });

    const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3026/register", formData);
      alert("Signup successful 🎉");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "general_user",
      });
      setTimeout(()=>{
        navigate("/login");
      },1000)
      console.log(res.data);
    } catch (err) {
      alert("Signup failed ❌");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Username */}
        <div className="mb-4">
          <Inputfield
            label="Username"
            type="text"
            id="username"
            name="username"
            required
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Inputfield
            label="Email"
            type="email"
            id="email"
            name="email"
            required
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Inputfield
            label="Password"
            type="password"
            id="password"
            name="password"
            required
            onChange={handleChange}
          />
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-2"
          >
            Select Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="general_user">General User</option>
            <option value="player">Player</option>
            <option value="team_owner">Team Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit */}
        <Button label="Sign Up" type="submit" />
      </form>
    </div>
  );
};

export default Signup;

