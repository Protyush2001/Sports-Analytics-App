// const express = require('express');
// const router = express.Router();
// const Player = require('../models/player-model');
// const authenticateUser = require('../middlewares/authenticateUser');
// const authorizeRoles = require('../middlewares/checkRole');

// // ✅ Get all players
// router.get('/', authenticateUser, authorizeRoles("player", "team_owner", "admin"), async (req, res) => {
//   try {
//     const players = await Player.find();
//     res.json(players);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /// x /////

// // ✅ Create player
// // router.post('/', authenticateUser, authorizeRoles("admin", "team_owner","player"), async (req, res) => {
// //   try {
// //     const newPlayer = new Player(req.body);
// //     await newPlayer.save();
// //     res.status(201).json(newPlayer);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });
// //x///

// router.post('/', authenticateUser, authorizeRoles("admin", "team_owner", "player"), async (req, res) => {
//   try {
//     const newPlayer = new Player({
//       ...req.body,
//       userId: req.user._id // ✅ Attach logged-in user's ID
//     });

//     await newPlayer.save();
//     res.status(201).json(newPlayer);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // x////
// // ✅ Update player
// // router.put('/:id', authenticateUser, authorizeRoles("admin", "team_owner","player"), async (req, res) => {
// //   try {
// //     const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(updatedPlayer);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });
// ////x////

// router.put('/:id', authenticateUser, authorizeRoles("admin", "team_owner", "player"), async (req, res) => {
//   try {
//     const player = await Player.findById(req.params.id);

//     if (!player) {
//       return res.status(404).json({ error: "Player not found" });
//     }

//     // ✅ Optional: Ensure player belongs to the logged-in user if they are a player
//     if (req.user.role === "player" && player.userId !== req.user._id) {
//       return res.status(403).json({ error: "Not authorized to update this player" });
//     }

//     const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedPlayer);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // ✅ Delete player
// router.delete('/:id', authenticateUser, authorizeRoles("admin"), async (req, res) => {
//   try {
//     await Player.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Player deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const Player = require('../models/player-model');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authenticateUser = require('../middlewares/authenticateUser');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /api/players
router.post("/", authenticateUser, upload.single('image'), async (req, res) => {
  try {
        // Build the image URL if a file was uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const playerData = {
      ...req.body,
      // createdBy: req.userId, // Set from JWT token
      createdBy: req.user._id,
      image: imageUrl,
    };
    console.log("Received player data:", playerData); // Debug
    const player = new Player(playerData);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    console.error("Error creating player:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/players/:id
router.put("/:id", authenticateUser,upload.single('image'), async (req, res) => {
  try {
    const playerData = {
      ...req.body,
      createdBy: req.user._id, // Ensure createdBy is preserved
      image: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined,
    };
    console.log("Updating player with data:", playerData); // Debug
    const player = await Player.findByIdAndUpdate(req.params.id, playerData, {
      new: true,
      runValidators: true,
    });
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    console.error("Error updating player:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/players
// router.get("/", authenticateUser, async (req, res) => {
//   try {
//     const players = await Player.find();
//     res.json(players);
//   } catch (err) {
//     console.error("Error fetching players:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { createdBy } = req.query;
    const query = createdBy ? { createdBy } : {};
    console.log("Fetching players with query:", query);
    const players = await Player.find(query).lean();
    console.log("Sending players:", players);
    res.json(players);
  } catch (err) {
    console.error("Error fetching players:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.get("/select-team", authenticateUser, async (req, res) => {
//   try {
//     const players = await Player.find({ createdBy: req.userId }).lean();
//     if (players.length < 11) {
//       return res.status(400).json({ error: "Not enough players to form a team (need at least 11)" });
//     }

//     // Prepare player data for Gemini
//     const playerData = players.map(p => ({
//       name: p.name,
//       role: p.role,
//       runs: p.runs || 0,
//       wickets: p.wickets || 0,
//       average: p.average || 0,
//       matches: p.matches || 0,
//     }));

//     // Construct prompt
// const prompt = `
// Select the best possible cricket playing 11 from the following players.
// Requirements:
// - 4-5 batsmen (role: batsman or allrounder)
// - 4-5 bowlers (role: bowler or allrounder)
// - 1 wicket-keeper (role: keeper)
// - 1-2 all-rounders (role: allrounder)
// Prioritize players with high runs and batting average for batsmen, high wickets for bowlers, and balance for all-rounders.

// Return ONLY a valid JSON object with a "bestTeam" array, no explanation, no markdown, and NO code fences. 
// Example:
// {
//   "bestTeam": [
//     { "name": "Player 1", "role": "batsman", "reason": "High average" },
//     { "name": "Player 2", "role": "bowler", "reason": "Most wickets" }
//     // ...total 11 players
//   ]
// }

// Player data: ${JSON.stringify(playerData, null, 2)}
// `;

//     // Call Gemini AI
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const bestTeam = JSON.parse(response.text());

//     res.json({ bestTeam: [...bestTeam] });
//   } catch (err) {
//     console.error("Error selecting team:", err.message);
//     res.status(500).json({ error: "Failed to select team" });
//   }
// });

// DELETE /api/players/:id

router.get("/select-team", authenticateUser, async (req, res) => {
  try {
    // Use req.user._id, not req.userId
    const players = await Player.find({ createdBy: req.user._id }).lean();
    if (players.length < 11) {
      return res.status(400).json({ error: "Not enough players to form a team (need at least 11)" });
    }

    // Prepare player data for Gemini
    const playerData = players.map(p => ({
      name: p.name,
      role: p.role,
      runs: p.runs || 0,
      wickets: p.wickets || 0,
      average: p.average || 0,
      matches: p.matches || 0,
    }));

    // Strict prompt
    const prompt = `
Select the best possible cricket playing 11 from the following players.
Requirements:
- 4-5 batsmen (role: batsman or allrounder)
- 4-5 bowlers (role: bowler or allrounder)
- 1 wicket-keeper (role: keeper)
- 1-2 all-rounders (role: allrounder)
Prioritize players with high runs and batting average for batsmen, high wickets for bowlers, and balance for all-rounders.

Return ONLY a valid JSON object with a "bestTeam" array, no explanation, no markdown, and NO code fences.
Example:
{
  "bestTeam": [
    { "name": "Player 1", "role": "batsman", "reason": "High average" },
    { "name": "Player 2", "role": "bowler", "reason": "Most wickets" }
    // ...total 11 players
  ]
}

Player data: ${JSON.stringify(playerData, null, 2)}
`;

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    // Remove markdown code fences if present
    responseText = responseText.replace(/```json|```/g, '').trim();

    let bestTeam;
    try {
      const parsed = JSON.parse(responseText);
      bestTeam = parsed.bestTeam || parsed;
    } catch (err) {
      console.error("Gemini response parse error:", err, responseText);
      return res.status(500).json({ error: "Gemini response parse error" });
    }

    res.json({ bestTeam });
  } catch (err) {
    console.error("Error selecting team:", err.message);
    res.status(500).json({ error: "Failed to select team" });
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json({ message: "Player deleted" });
  } catch (err) {
    console.error("Error deleting player:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;