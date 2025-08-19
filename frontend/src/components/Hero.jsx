const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 text-center rounded-xl shadow-lg mb-8">
      <h1 className="text-4xl font-bold mb-4">
        Analyze Cricket Like Never Before 🏏
      </h1>
      <p className="text-lg mb-6">
        Track live scores, explore player stats, and build your dream team in real-time.
      </p>
      <a
        href="/register"
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100"
      >
        Get Started
      </a>
    </section>
  );
};

export default Hero;
