

// app/services/matchPoller.js
const axios = require("axios");

let previousMatchStates = {};

const pollLiveMatches = async (io) => {
  try {
    // Get io instance from main server
    const { io } = require("../../index");
    
    const { data } = await axios.get(
      "https://api.cricapi.com/v1/cricScore?apikey=8f2ec94d-ea72-4796-b962-87697cb1c728"
    );

    const matches = data.data || [];

    matches.forEach((match) => {
      const matchId = match.id;
      const currentStatus = match.status;

      if (match.status.includes("need")) {
        const previous = previousMatchStates[matchId];

        if (previous !== currentStatus) {
          previousMatchStates[matchId] = currentStatus;

          // Emit update via socket
          io.emit(`match-${matchId}-ballUpdate`, {
            matchId,
            status: currentStatus,
            score: match.score,
            teams: `${match.t1} vs ${match.t2}`,
            timestamp: new Date().toISOString()
          });

          console.log(`📢 Emitted update for match ${matchId}`);
        }
      }
    });
  } catch (err) {
    console.error("Polling error:", err.message);
  }
};

module.exports = { pollLiveMatches };