const { fetchLiveMatchesFromAPI } = require("../utils/fetchCricApi");

const matchController = {};

matchController.getMatches = async (req, res) => {
  const category = req.query.category; // live, upcoming, completed
  try {
    const allMatches = await fetchLiveMatchesFromAPI();

    let filteredMatches = [];

    if (category === "live") {
      filteredMatches = allMatches.filter(
        (match) =>
        (
          match.status.includes("need")
        )
      ); 
    } else if (category === "upcoming") {
      filteredMatches = allMatches.filter(
        (match) =>
          
          
          (
            match.status === "Match not started"
            
          )
      );
    } else if (category === "completed") {
      filteredMatches = allMatches.filter(
        (match) =>
          
          (
            match.status.includes("won") ||
            match.status.includes("abandoned") ||
            match.status.includes("tied")
          )
      );
    } else {
      // no category passed, send everything
      filteredMatches = allMatches;
    }

    res.json({
      success: true,
      count: filteredMatches.length,
      matches: filteredMatches
    });
  } catch (err) {
    console.error("Get matches error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }

};
matchController.createMatches = async (req,res) =>{
  const { name, t1, t2, t1s, t2s, status, dateTimeGMT } = req.body;

  // Basic validation
  if (!name || !t1 || !t2 || !dateTimeGMT) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Here you would typically save the match to your database
    // For this example, we'll just return the match data
    const newMatch = {
      name,
      t1,
      t2,
      t1s,
      t2s,
      status,
      dateTimeGMT
    };

    res.status(201).json({
      success: true,
      match: newMatch
    });
  } catch (err) {
    console.error("Create match error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = matchController;
