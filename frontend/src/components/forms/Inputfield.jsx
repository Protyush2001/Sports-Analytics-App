// import React from "react";

// const Inputfield = ({ label, type, id, name, required, onChange }) => {
//   return (
//     <div className="flex flex-col">
//       <label htmlFor={id} className="mb-1 font-medium text-gray-700">
//         {label}:
//       </label>
//       <input
//         type={type}
//         id={id}
//         name={name}
//         required={required}
//         onChange={onChange}
//         className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// };

// export default Inputfield;

import React from "react";

const Inputfield = ({ label, type, id, name, value, onChange, required }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-2">
        {label}:
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value} // ✅ controlled
        onChange={onChange} // ✅ controlled
        required={required}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default Inputfield;



