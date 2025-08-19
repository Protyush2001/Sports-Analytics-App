const axios = require("axios");

const fetchLiveMatchesFromAPI = async () => {
  try {
    const { data } = await axios.get(
      "https://api.cricapi.com/v1/cricScore?apikey=8f2ec94d-ea72-4796-b962-87697cb1c728"
    );

    console.log("🟢 CricAPI Response:", data); // Debug here

    return data.data || []; // this should now return the correct matches array
  } catch (err) {
    console.error("❌ CricAPI fetch error:", err.message);
    return [];
  }
};

module.exports = { fetchLiveMatchesFromAPI };

