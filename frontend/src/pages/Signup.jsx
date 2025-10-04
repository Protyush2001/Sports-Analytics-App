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



// import React, { useState } from "react";
// import Inputfield from "../components/forms/Inputfield";
// import Button from "../components/forms/Button";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "general_user", // default role
//   });
//   const [showPayment, setShowPayment] = useState(false);

//     const navigate = useNavigate();

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
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//         role: "general_user",
//       });
//       setTimeout(()=>{
//         navigate("/login");
//       },1000)
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

//         {/* Role Selection */}
//         <div className="mb-4">
//           <label
//             htmlFor="role"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Select Role
//           </label>
//           <select
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//           >
//             <option value="general_user">General User</option>
//             <option value="player">Player</option>
//             <option value="team_owner">Team Owner</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {/* Submit */}
//         <Button label="Sign Up" type="submit" />
//       </form>
//     </div>
//   );
// };

// export default Signup;




// import React, { useState } from "react";
// import Inputfield from "../components/forms/Inputfield";
// import Button from "../components/forms/Button";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import PaymentForm from "../components/PaymentForm"; // Adjust path if needed
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51S4mqxCTAL2OsiupdEnFuDrML5hlecmBRSYj6urlyGvL8P2YRc9wEkRsvXZWqTuJEfGoVdZzuYhy12F9FNIo2U0D00KQZDdWRv');


// const Signup = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "general_user", // default role
//   });

//   const [showPayment, setShowPayment] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (["team_owner", "admin"].includes(formData.role)) {
//       setShowPayment(true); // Show Stripe form
//     } else {
//       await registerUser(); // Free signup
//     }
//   };

//   const registerUser = async () => {
//     try {
//       const res = await axios.post("http://localhost:3026/register", formData);
//       alert("Signup successful 🎉");
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//         role: "general_user",
//       });
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       console.log(res.data);
//     } catch (err) {
//       alert("Signup failed ❌");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

//         <form onSubmit={handleSubmit}>
//           {/* Username */}
//           <div className="mb-4">
//             <Inputfield
//               label="Username"
//               type="text"
//               id="username"
//               name="username"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           {/* Email */}
//           <div className="mb-4">
//             <Inputfield
//               label="Email"
//               type="email"
//               id="email"
//               name="email"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-4">
//             <Inputfield
//               label="Password"
//               type="password"
//               id="password"
//               name="password"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           {/* Role Selection */}
//           <div className="mb-4">
//             <label
//               htmlFor="role"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Select Role
//             </label>
//             <select
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//             >
//               <option value="general_user">General User</option>
//               <option value="player">Player</option>
//               <option value="team_owner">Team Owner</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <div className="flex flex-col items-center">
//             <Button label="Sign Up" type="submit" disabled={showPayment} />
//           <a className="mt-4 text-center text-sm text-blue-600" href="/login">
//             Already have an account? Login
//           </a>
//           </div>

//         </form>

//         {/* Stripe Payment Form */}
//         {showPayment && (
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold mb-2 text-center">
//               Complete Payment to Register as {formData.role}
//             </h3>
//     <Elements stripe={stripePromise}>
//       <PaymentForm
//         role={formData.role}
//         onPaymentSuccess={registerUser}
//       />
//     </Elements>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signup;

/////////////////////////////////////////////////////////////////////




import React, { useState } from "react";
import Inputfield from "../components/forms/Inputfield";
import Button from "../components/forms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm"; // Adjust path if needed
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51S4mqxCTAL2OsiupdEnFuDrML5hlecmBRSYj6urlyGvL8P2YRc9wEkRsvXZWqTuJEfGoVdZzuYhy12F9FNIo2U0D00KQZDdWRv');


const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "general_user", // default role
  });

  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (["team_owner", "admin"].includes(formData.role)) {
      setShowPayment(true); // Show Stripe form
    } else {
      await registerUser(); // Free signup
    }
  };

  const registerUser = async () => {
    try {
      const res = await axios.post("http://localhost:3026/register", formData);
      alert("Signup successful 🎉");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "general_user",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      console.log(res.data);
    } catch (err) {
      alert("Signup failed ❌");
      console.error(err);
    }
  };

  return (
 <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 flex items-center justify-center px-4">
  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-lg transition-all duration-300 hover:shadow-indigo-200/50">
    {/* Logo / Icon */}
    <div className="flex justify-center mb-4">
      <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6l4 2"
          />
        </svg>
      </div>
    </div>

    <h2 className="text-3xl font-extrabold text-center text-indigo-800 mb-2">
      Create Your Account
    </h2>
    <p className="text-sm text-gray-500 text-center mb-8">
      Join the cricket analytics platform and unlock premium insights.
    </p>

    <form onSubmit={handleSubmit} className="space-y-6">
      <Inputfield
        label="Username"
        type="text"
        name="username"
        required
        onChange={handleChange}
      />
      <Inputfield
        label="Email"
        type="email"
        name="email"
        required
        onChange={handleChange}
      />
      <Inputfield
        label="Password"
        type="password"
        name="password"
        required
        onChange={handleChange}
      />

      {/* Role Select */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="general_user">General User</option>
          <option value="player">Player</option>
          <option value="team_owner">Team Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button
        label="Sign Up"
        type="submit"
        disabled={showPayment}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-transform transform hover:scale-[1.02]"
      />
      <p className="text-center text-sm mt-4 text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Login
        </a>
      </p>
    </form>

    {showPayment && (
      <div className="mt-10 bg-indigo-50 rounded-xl p-6 shadow-inner">
        <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">
          Complete Payment to Register as{" "}
          <span className="text-indigo-600">{formData.role}</span>
        </h3>

        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">🔒 Secure Payment Powered by Stripe</span>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm role={formData.role} onPaymentSuccess={registerUser} />
        </Elements>
      </div>
    )}
  </div>
</div>

  );
};

export default Signup;