import React from "react";
import Body from "../components/Body";
import ReviewCarousel from "../components/ReviewCarousel";



const Home = () => {




  return (
    <div className="p-6">
      {/* Hero Section */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">
          🏏 Cricket Analytics App
        </h1>
        <p className="text-gray-600 mt-2">
          Track Live, Upcoming & Completed Matches in real-time
        </p>
      </header>
      <Body />
      <div className="p-4 mt-8 bg-gray-100 flex items-center justify-center">
        <ReviewCarousel />
    </div>



    </div>
  );
};

export default Home;
