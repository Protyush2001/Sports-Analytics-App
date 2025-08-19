const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Live", "Upcoming", "Completed"];
  return (
    <div className="flex justify-center mb-4 space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;

