// import React from "react";
// import Body from "../components/Body";
// import ReviewCarousel from "../components/ReviewCarousel";



// const Home = () => {




//   return (
//     <div className="p-6">
//       {/* Hero Section */}
//       <header className="text-center mb-8">
//         <h1 className="text-3xl font-extrabold text-gray-800">
//           🏏 Cricket Analytics App
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Track Live, Upcoming & Completed Matches in real-time
//         </p>
//       </header>
//       <Body />
//       <div className="p-4 mt-8 bg-gray-100 flex items-center justify-center">
//         <ReviewCarousel />
//     </div>



//     </div>
//   );
// };

// export default Home;

import React from "react";
import Body from "../components/Body";
import ReviewCarousel from "../components/ReviewCarousel";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold">🏏 Cricket Analytics App</h1>
        <p className="text-lg mt-3 max-w-2xl mx-auto">
          Track Live, Upcoming & Completed Matches in Real-Time
        </p>
      </header>

      {/* Main Body */}
      <Body />

      {/* Review Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            What Our Users Say
          </h2>
          <ReviewCarousel />
        </div>
      </section>
    </div>
  );
};

export default Home;

