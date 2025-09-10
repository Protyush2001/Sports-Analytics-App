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

//POST /api/players/bulk

router.post("/bulk", authenticateUser, async (req, res) => {
  try {
    const { ids } = req.body;
    const players = await Player.find({ _id: { $in: ids } });
    res.json({ players });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players" });
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

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { createdBy } = req.query;
    const query = createdBy ? { createdBy } : {};
    console.log("Fetching players with query:", query);
    const players = await Player.find(query).lean();
    console.log("Sending players:", players);
    res.json({ players });  // changes made here
  } catch (err) {
    console.error("Error fetching players:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});



// routes/playerRoutes.js


router.get("/players/unassigned", authenticateUser, async (req, res) => {
  try {
    const unassignedPlayers = await Player.find({ teamId: null });
    res.status(200).json(unassignedPlayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/players/all",authenticateUser, async (req,res)=>{
//   try{
//     const players = await Player.find();
//     res.status(200).json(players);
//   }catch(err){
//     res.status(500).json({ error: err.message });
//   }
// })

// GET /api/players/all

router.get("/all", authenticateUser, async (req, res) => {
  try {
    const { teamId } = req.query;

    let query = {};
    if (teamId) {
      query.teamId = teamId; // ✅ only fetch players for that team
    }

    const players = await Player.find(query).populate("teamId", "name");
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

//last ata work koreche -----
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

// Add this improved select-team endpoint to your playerRoutes.js

// router.get("/select-team", authenticateUser, async (req, res) => {
//   try {
//     console.log("🏏 Starting team selection process...");
//     console.log("👤 User ID:", req.user._id);

//     // Step 1: Fetch players
//     const players = await Player.find({ createdBy: req.user._id }).lean();
//     console.log(`📊 Found ${players.length} players in database`);

//     if (players.length < 11) {
//       console.log("❌ Not enough players for a team");
//       return res.status(400).json({ 
//         error: `Not enough players to form a team. You have ${players.length} players, need at least 11.`,
//         playerCount: players.length,
//         requiredCount: 11
//       });
//     }

//     // Step 2: Check Gemini API key
//     if (!process.env.GEMINI_API_KEY) {
//       console.error("❌ GEMINI_API_KEY not found in environment variables");
//       return res.status(500).json({ error: "Gemini API key not configured" });
//     }

//     // Step 3: Prepare player data
//     const playerData = players.map(p => ({
//       name: p.name,
//       role: p.role,
//       runs: p.runs || 0,
//       wickets: p.wickets || 0,
//       average: p.average || 0,
//       matches: p.matches || 0,
//     }));

//     console.log("📋 Player roles distribution:");
//     const roleCount = playerData.reduce((acc, p) => {
//       acc[p.role] = (acc[p.role] || 0) + 1;
//       return acc;
//     }, {});
//     console.log(roleCount);

//     // Step 4: Enhanced prompt for better results
//     const prompt = `
// You are a cricket team selector. Select exactly 11 players from the following list to form the best possible playing XI.

// STRICT REQUIREMENTS:
// 1. Exactly 11 players total
// 2. At least 1 wicket-keeper (role: keeper)
// 3. 4-6 batsmen (role: batsman or allrounder)
// 4. 4-6 bowlers (role: bowler or allrounder)
// 5. Consider player statistics: runs, wickets, average, matches played

// IMPORTANT: Return ONLY valid JSON in this exact format:
// {
//   "bestTeam": [
//     {"name": "Player Name", "role": "batsman", "reason": "Good average"},
//     {"name": "Player Name", "role": "bowler", "reason": "High wickets"}
//   ]
// }

// Available Players:
// ${JSON.stringify(playerData, null, 2)}

// Select exactly 11 players and return only the JSON response, no explanations or markdown.`;

//     console.log("🤖 Calling Gemini AI...");

//     // Step 5: Call Gemini with timeout
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
//     const result = await Promise.race([
//       model.generateContent(prompt),
//       new Promise((_, reject) => 
//         setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
//       )
//     ]);

//     const response = await result.response;
//     let responseText = response.text().trim();
    
//     console.log("🤖 Raw Gemini response:", responseText.substring(0, 200) + "...");

//     // Step 6: Clean and parse response
//     responseText = responseText.replace(/```json|```/g, '').trim();
    
//     // Remove any leading/trailing text that's not JSON
//     const jsonStart = responseText.indexOf('{');
//     const jsonEnd = responseText.lastIndexOf('}') + 1;
    
//     if (jsonStart !== -1 && jsonEnd !== -1) {
//       responseText = responseText.substring(jsonStart, jsonEnd);
//     }

//     let bestTeam;
//     try {
//       const parsed = JSON.parse(responseText);
//       bestTeam = parsed.bestTeam || parsed;
      
//       if (!Array.isArray(bestTeam)) {
//         throw new Error("Response is not an array");
//       }
      
//       if (bestTeam.length !== 11) {
//         console.warn(`⚠️ Gemini returned ${bestTeam.length} players instead of 11`);
//         // If we got close but not exactly 11, we can still return it
//         if (bestTeam.length >= 9 && bestTeam.length <= 13) {
//           console.log("📝 Adjusting team size...");
//           bestTeam = bestTeam.slice(0, 11); // Take first 11
//         } else {
//           throw new Error(`Invalid team size: ${bestTeam.length}`);
//         }
//       }

//       console.log("✅ Successfully parsed Gemini response");
//       console.log(`🏏 Selected team of ${bestTeam.length} players`);

//     } catch (parseError) {
//       console.error("❌ Failed to parse Gemini response:", parseError.message);
//       console.error("📄 Raw response:", responseText);
      
//       // Fallback: Create a simple team selection
//       console.log("🔄 Using fallback team selection...");
//       bestTeam = createFallbackTeam(players);
//     }

//     res.json({ 
//       bestTeam,
//       totalPlayersAvailable: players.length,
//       selectedCount: bestTeam.length
//     });

//   } catch (err) {
//     console.error("❌ Error in team selection:", err.message);
//     console.error("Stack:", err.stack);
    
//     if (err.message.includes('timeout')) {
//       return res.status(408).json({ 
//         error: "AI service timeout. Please try again.",
//         details: "The AI took too long to respond"
//       });
//     }
    
//     if (err.message.includes('API key')) {
//       return res.status(500).json({ 
//         error: "AI service configuration error",
//         details: "Please check server configuration"
//       });
//     }
    
//     res.status(500).json({ 
//       error: "Failed to select team", 
//       details: err.message,
//       suggestion: "Please try again or contact support"
//     });
//   }
// });

// Fallback team selection function
function createFallbackTeam(players) {
  console.log("🔄 Creating fallback team selection...");
  
  const team = [];
  
  // Group players by role
  const keepers = players.filter(p => p.role === 'keeper');
  const batsmen = players.filter(p => p.role === 'batsman');
  const bowlers = players.filter(p => p.role === 'bowler');
  const allrounders = players.filter(p => p.role === 'allrounder');
  
  // Select 1 keeper
  if (keepers.length > 0) {
    team.push({
      name: keepers[0].name,
      role: keepers[0].role,
      reason: "Wicket-keeper"
    });
  }
  
  // Select 4-5 batsmen
  const topBatsmen = batsmen
    .sort((a, b) => (b.runs || 0) - (a.runs || 0))
    .slice(0, Math.min(4, batsmen.length));
  
  topBatsmen.forEach(p => {
    team.push({
      name: p.name,
      role: p.role,
      reason: `${p.runs || 0} runs`
    });
  });
  
  // Select bowlers
  const topBowlers = bowlers
    .sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
    .slice(0, Math.min(4, bowlers.length));
  
  topBowlers.forEach(p => {
    team.push({
      name: p.name,
      role: p.role,
      reason: `${p.wickets || 0} wickets`
    });
  });
  
  // Fill remaining slots with all-rounders or best remaining players
  const remaining = 11 - team.length;
  const availableAllrounders = allrounders.slice(0, remaining);
  
  availableAllrounders.forEach(p => {
    team.push({
      name: p.name,
      role: p.role,
      reason: "All-rounder balance"
    });
  });
  
  // If still need more players, add remaining players
  if (team.length < 11) {
    const usedNames = new Set(team.map(p => p.name));
    const remainingPlayers = players.filter(p => !usedNames.has(p.name));
    
    remainingPlayers.slice(0, 11 - team.length).forEach(p => {
      team.push({
        name: p.name,
        role: p.role,
        reason: "Squad balance"
      });
    });
  }
  
  console.log(`✅ Fallback team created with ${team.length} players`);
  return team.slice(0, 11); // Ensure exactly 11 players
}

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