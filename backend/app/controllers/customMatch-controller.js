// const Joi = require("joi");
// const bcryptjs = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const customMatch = require("../models/customMatch-model"); // Adjust the path as necessary
// const cors = require("cors");

// const customMatchValidationSchema = require("../validations/customMatch-validation");

// const customMatchController = {};



// customMatchController.createMatches = async (req, res) => {
//   try {
    
//     const allowedRoles = ["admin", "team_owner", "player"];
//     if (!allowedRoles.includes(req.user.role)) {
//       return res
//         .status(403)
//         .json({ msg: "Access denied: insufficient permissions" });
//     }

//     const { error } = customMatchValidationSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ msg: error.details[0].message });
//     }

//     const match = new customMatch({
//       ...req.body,
//       createdBy: req.user._id,
//       inningsScores: [],
//     }); 
//     await match.save();
//     res.status(201).json(match);
//   } catch (err) {
//     console.error("Error creating match:", err.message); // log actual error
//     res.status(500).json({ msg: "Internal Server Error", error: err.message });
//   }
// };

// // controllers/customMatchController.js

// customMatchController.startStream = async (req, res) => {
//   try {
//     const match = await customMatch.findById(req.params.matchId);
//     if (!match) return res.status(404).json({ msg: "Match not found" });

//     // basic auth check (optional)
//     if (match.createdBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ msg: "Not authorized to start stream" });
//     }

//     // generate a roomId (could be random string)
//     const roomId = `match_${match._id}_${Date.now()}`;

//     match.stream = {
//       isLive: true,
//       roomId,
//       startedBy: req.user._id,
//       startedAt: Date.now()
//     };

//     await match.save();
//     res.status(200).json({ msg: "Stream started", match });
//   } catch (err) {
//     console.error("Error starting stream:", err);
//     res.status(500).json({ msg: "Internal Server Error", error: err.message });
//   }
// };

// customMatchController.stopStream = async (req, res) => {
//   try {
//     const match = await customMatch.findById(req.params.matchId);
//     if (!match) return res.status(404).json({ msg: "Match not found" });

//     if (!match.stream.isLive) {
//       return res.status(400).json({ msg: "No active stream to stop" });
//     }

//     // push the current stream into pastStreams
//     match.pastStreams.push({
//       roomId: match.stream.roomId,
//       startedBy: match.stream.startedBy,
//       startedAt: match.stream.startedAt,
//       endedAt: Date.now(),
//       recordingUrl: req.body.recordingUrl || null // optional
//     });

//     // clear current stream
//     match.stream = {
//       isLive: false,
//       roomId: null,
//       startedBy: null,
//       startedAt: null
//     };

//     await match.save();
//     res.status(200).json({ msg: "Stream stopped", match });
//   } catch (err) {
//     console.error("Error stopping stream:", err);
//     res.status(500).json({ msg: "Internal Server Error", error: err.message });
//   }
// };




// //updated one
// const Player = require("../models/player-model"); // adjust path if needed





// // customMatchController.updateBall = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { runs, isWicket, strikerId, nonStrikerId, bowlerId } = req.body;

// //     const match = await customMatch.findById(id);
// //     if (!match || match.status === "Completed") {
// //       return res.status(400).json({ msg: "Match is already completed or invalid" });
// //     }

// //     if (!match.currentScore) {
// //       match.currentScore = {
// //         team: 0,
// //         runs: 0,
// //         wickets: 0,
// //         overs: 0,
// //         balls: 0,
// //         innings: 1,
// //       };
// //     }

// //     const currentTeam = match.teams[match.currentScore.team];
// //     if (!currentTeam) {
// //       return res.status(400).json({ msg: "Invalid team index" });
// //     }

// //     const maxWickets = currentTeam.players?.length || 11;

// //     // ✅ Update runs
// //     if (Number.isInteger(runs)) {
// //       match.currentScore.runs += runs;
// //       if (strikerId) {
// //         await Player.findByIdAndUpdate(strikerId, { $inc: { runs } });
// //       }
// //     }

// //     // ✅ Handle wicket
// //     if (isWicket) {
// //       if (match.currentScore.wickets < maxWickets - 1) {
// //         match.currentScore.wickets += 1;
// //         if (bowlerId) {
// //           await Player.findByIdAndUpdate(bowlerId, { $inc: { wickets: 1 } });
// //         }
// //       } else if (match.currentScore.wickets === maxWickets - 1) {
// //         match.currentScore.wickets += 1;
// //         // Final wicket triggers innings end
// //       }
// //     }

// //     // ✅ Ball counting
// //     match.currentScore.balls += 1;
// //     if (match.currentScore.balls === 6) {
// //       match.currentScore.overs += 1;
// //       match.currentScore.balls = 0;
// //     }

// //     const oversLimitReached =
// //       match.currentScore.overs === match.overs - 1 &&
// //       match.currentScore.balls === 5;

// //     const allOut = match.currentScore.wickets >= maxWickets;
// //     const isSecondInnings = match.currentScore.innings === 2;
// //     const firstInnings = match.inningsScores[0];

// //     // ✅ Early win or tie detection
// //     if (isSecondInnings && firstInnings) {
// //       const chasingRuns = match.currentScore.runs;
// //       const targetRuns = firstInnings.runs;
// //       const remainingWickets = maxWickets - match.currentScore.wickets;
// //       const chasingTeam = match.teams[match.currentScore.team]?.name || "Team 2";

// //       const chasedInFewerBalls =
// //         chasingRuns === targetRuns &&
// //         !oversLimitReached &&
// //         !allOut;

// //       if (chasingRuns > targetRuns) {
// //         match.status = "Completed";
// //         match.result = `${chasingTeam} won by ${remainingWickets} wickets`;
// //       } else if (chasedInFewerBalls) {
// //         match.status = "Completed";
// //         match.result = `${chasingTeam} won (chased in fewer balls)`;
// //       } else if (chasingRuns === targetRuns && (oversLimitReached || allOut)) {
// //         match.status = "Completed";
// //         match.result = "Match tied";
// //       }
// // match.inningsScores = match.inningsScores.filter(
// //   (s) => s.innings !== match.currentScore.innings
// // );

// // match.inningsScores.push({
// //   team: match.currentScore.team,
// //   runs: match.currentScore.runs,
// //   wickets: match.currentScore.wickets,
// //   overs: match.currentScore.overs,
// //   balls: match.currentScore.balls,
// //   innings: match.currentScore.innings,
// // });

// //       await match.save();
// //       return res.json(match);
// //     }

// //     // ✅ End of innings logic
// //     if (oversLimitReached || allOut) {
// //       const alreadyPushed = match.inningsScores.some(
// //         (s) => s.innings === match.currentScore.innings
// //       );
// //       if (!alreadyPushed) {
// // match.inningsScores = match.inningsScores.filter(
// //   (s) => s.innings !== match.currentScore.innings
// // );

// // match.inningsScores.push({
// //   team: match.currentScore.team,
// //   runs: match.currentScore.runs,
// //   wickets: match.currentScore.wickets,
// //   overs: match.currentScore.overs,
// //   balls: match.currentScore.balls,
// //   innings: match.currentScore.innings,
// // });
// //       }

// //       const nextTeamIndex = match.currentScore.team + 1;

// //       if (nextTeamIndex < match.teams.length) {
// //         match.currentScore = {
// //           team: nextTeamIndex,
// //           runs: 0,
// //           wickets: 0,
// //           overs: 0,
// //           balls: 0,
// //           innings: match.currentScore.innings + 1,
// //         };
// //       } else {
// //         match.status = "Completed";

// //         const secondInnings = match.currentScore;
// //         const team1 = match.teams[firstInnings.team]?.name || "Team 1";
// //         const team2 = match.teams[secondInnings.team]?.name || "Team 2";

// //         if (firstInnings.runs > secondInnings.runs) {
// //           const margin = firstInnings.runs - secondInnings.runs;
// //           match.result = `${team1} won by ${margin} runs`;
// //         } else if (secondInnings.runs > firstInnings.runs) {
// //           const remainingWickets = maxWickets - secondInnings.wickets;
// //           match.result = `${team2} won by ${remainingWickets} wickets`;
// //         } else {
// //           match.result = "Match tied";
// //         }

// //         match.inningsScores.push({
// //           team: secondInnings.team,
// //           runs: secondInnings.runs,
// //           wickets: secondInnings.wickets,
// //           overs: secondInnings.overs,
// //           balls: secondInnings.balls,
// //           innings: secondInnings.innings,
// //         });

// //         await match.save();
// //         return res.json(match);
// //       }
// //     }

// //     await match.save();
// //     res.json(match);
// //   } catch (err) {
// //     console.error("Ball update error:", err.message);
// //     res.status(500).json({ msg: err.message });
// //   }
// // };

// customMatchController.updateBall = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { runs, isWicket, strikerId, nonStrikerId, bowlerId, extras } = req.body;

//     // Validate input
//     if (runs && (!Number.isInteger(runs) || runs < 0 || runs > 6)) {
//       return res.status(400).json({ msg: "Invalid runs value" });
//     }

//     const match = await customMatch.findById(id);
//     if (!match) {
//       return res.status(404).json({ msg: "Match not found" });
//     }

//     if (match.status === "Completed") {
//       return res.status(400).json({ msg: "Match is already completed" });
//     }

//     // Initialize currentScore if not exists
//     if (!match.currentScore) {
//       match.currentScore = {
//         team: 0,
//         runs: 0,
//         wickets: 0,
//         overs: 0,
//         balls: 0,
//         innings: 1,
//       };
//     }

//     // Validate team structure
//     if (!match.teams || match.teams.length < 2) {
//       return res.status(400).json({ msg: "Match must have at least 2 teams" });
//     }

//     const currentTeamIndex = match.currentScore.team;
//     const currentTeam = match.teams[currentTeamIndex];
//     if (!currentTeam) {
//       return res.status(400).json({ msg: "Invalid team index" });
//     }

//     // Calculate max wickets (typically 10 for 11 players)
//     const maxWickets = (currentTeam.players?.length || 11) - 1;

//     // Update runs
//     if (runs && Number.isInteger(runs)) {
//       match.currentScore.runs += runs;
      
//       // Update striker's stats if provided
//       if (strikerId) {
//         try {
//           await Player.findByIdAndUpdate(strikerId, { $inc: { runs } });
//         } catch (err) {
//           console.warn("Failed to update striker stats:", err.message);
//         }
//       }
//     }

//     // Handle wicket
//     if (isWicket) {
//       if (match.currentScore.wickets < maxWickets) {
//         match.currentScore.wickets += 1;
        
//         // Update bowler's stats if provided
//         if (bowlerId) {
//           try {
//             await Player.findByIdAndUpdate(bowlerId, { $inc: { wickets: 1 } });
//           } catch (err) {
//             console.warn("Failed to update bowler stats:", err.message);
//           }
//         }
//       }
//     }

//     // Update balls and overs (only for non-wide/no-ball deliveries)
//     const isLegalDelivery = !extras || (extras !== 'wide' && extras !== 'no-ball');
    
//     if (isLegalDelivery) {
//       match.currentScore.balls += 1;
//       if (match.currentScore.balls === 6) {
//         match.currentScore.overs += 1;
//         match.currentScore.balls = 0;
//       }
//     }

//     // Check innings completion conditions
//     const oversCompleted = match.currentScore.overs >= match.overs;
//     const allOut = match.currentScore.wickets >= maxWickets;
//     const isFirstInnings = match.currentScore.innings === 1;
//     const isSecondInnings = match.currentScore.innings === 2;

//     // Store current innings score before any transitions
//     const currentInningsScore = {
//       team: match.currentScore.team,
//       runs: match.currentScore.runs,
//       wickets: match.currentScore.wickets,
//       overs: match.currentScore.overs,
//       balls: match.currentScore.balls,
//       innings: match.currentScore.innings
//     };

//     // Check for early win in second innings
//     if (isSecondInnings && match.inningsScores.length > 0) {
//       const firstInningsScore = match.inningsScores[0];
//       const targetRuns = firstInningsScore.runs + 1; // runs to win
      
//       if (match.currentScore.runs >= targetRuns) {
//         // Chasing team wins
//         const remainingWickets = maxWickets - match.currentScore.wickets;
//         const chasingTeam = match.teams[match.currentScore.team]?.name || "Team 2";
        
//         match.status = "Completed";
//         match.result = `${chasingTeam} won by ${remainingWickets} wickets`;
        
//         // Add final innings score
//         const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
//         if (existingIndex !== -1) {
//           match.inningsScores[existingIndex] = currentInningsScore;
//         } else {
//           match.inningsScores.push(currentInningsScore);
//         }
        
//         await match.save();
//         return res.json(match);
//       }
//     }

//     // Handle innings completion
//     if (oversCompleted || allOut) {
//       // Update or add current innings score
//       const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
//       if (existingIndex !== -1) {
//         match.inningsScores[existingIndex] = currentInningsScore;
//       } else {
//         match.inningsScores.push(currentInningsScore);
//       }

//       if (isFirstInnings) {
//         // Start second innings
//         match.currentScore = {
//           team: match.currentScore.team === 0 ? 1 : 0, // Switch team
//           runs: 0,
//           wickets: 0,
//           overs: 0,
//           balls: 0,
//           innings: 2
//         };
//         match.status = "Live";
//       } else {
//         // Match completed - calculate result
//         match.status = "Completed";
        
//         const firstInnings = match.inningsScores.find(s => s.innings === 1);
//         const secondInnings = currentInningsScore;
        
//         if (!firstInnings) {
//           return res.status(500).json({ msg: "First innings data not found" });
//         }
        
//         const team1Name = match.teams[firstInnings.team]?.name || "Team 1";
//         const team2Name = match.teams[secondInnings.team]?.name || "Team 2";
        
//         if (firstInnings.runs > secondInnings.runs) {
//           const margin = firstInnings.runs - secondInnings.runs;
//           match.result = `${team1Name} won by ${margin} runs`;
//         } else if (secondInnings.runs > firstInnings.runs) {
//           const remainingWickets = maxWickets - secondInnings.wickets;
//           match.result = `${team2Name} won by ${remainingWickets} wickets`;
//         } else {
//           match.result = "Match tied";
//         }
//       }
//     } else {
//       // Innings still ongoing - update current innings score in array
//       const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
//       if (existingIndex !== -1) {
//         match.inningsScores[existingIndex] = currentInningsScore;
//       } else {
//         match.inningsScores.push(currentInningsScore);
//       }
//     }

//     await match.save();
//     res.json(match);

//   } catch (err) {
//     console.error("Ball update error:", err.message);
//     res.status(500).json({ msg: "Internal server error", error: err.message });
//   }
// };

// // Additional helper methods
// customMatchController.getMatch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const match = await customMatch.findById(id);
    
//     if (!match) {
//       return res.status(404).json({ msg: "Match not found" });
//     }
    
//     res.json(match);
//   } catch (err) {
//     console.error("Get match error:", err.message);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };

// customMatchController.getAllMatches = async (req, res) => {
//   try {
//     const matches = await customMatch.find().sort({ createdAt: -1 });
//     res.json(matches);
//   } catch (err) {
//     console.error("Get all matches error:", err.message);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };

// customMatchController.deleteMatch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const match = await customMatch.findByIdAndDelete(id);
    
//     if (!match) {
//       return res.status(404).json({ msg: "Match not found" });
//     }
    
//     res.json({ msg: "Match deleted successfully" });
//   } catch (err) {
//     console.error("Delete match error:", err.message);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };



// module.exports = customMatchController;

/////////////////////////////////////////////////////////////////////////////////////

const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const customMatch = require("../models/customMatch-model");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); // You'll need to install this: npm install uuid

const customMatchValidationSchema = require("../validations/customMatch-validation");

const customMatchController = {};

customMatchController.createMatches = async (req, res) => {
  try {
    const allowedRoles = ["admin", "team_owner", "player"];
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied: insufficient permissions" });
    }

    const { error } = customMatchValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const match = new customMatch({
      ...req.body,
      createdBy: req.user._id,
      inningsScores: [],
    }); 
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    console.error("Error creating match:", err.message);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};


// Enhanced startStream with recording support
// customMatchController.startStream = async (req, res) => {
//   try {
//     const match = await customMatch.findById(req.params.matchId);
//     if (!match) return res.status(404).json({ msg: "Match not found" });

//     // Basic auth check
//     if (match.createdBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ msg: "Not authorized to start stream" });
//     }

//     // Check if already streaming
//     if (match.stream.isLive) {
//       return res.status(400).json({ msg: "Stream is already active" });
//     }

//     // Generate unique identifiers
//     const roomId = `match_${match._id}_${Date.now()}`;
//     const recordingId = uuidv4(); // Generate unique recording ID

//     // Start recording using the new method
//     // match.startRecording(recordingId, roomId, req.user._id);
//     match.stream = {
//   isLive: true,
//   roomId: roomId,
//   startedBy: req.user._id,
//   startedAt: new Date(),
//   recordingStatus: 'recording',
//   activeRecordingId: recordingId
// };

//     await match.save();

//     console.log(`Stream started for match ${match._id} with recording ID: ${recordingId}`);

//     res.status(200).json({ 
//       msg: "Stream and recording started", 
//       match,
//       recordingId, // Send this back to frontend for tracking
//       roomId 
//     });
//   } catch (err) {
//     console.error("Error starting stream:", err);
//     res.status(500).json({ msg: "Internal Server Error", error: err.message });
//   }
// };





// Add a new endpoint to handle file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs')

// const uploadsDir = path.join(__dirname, 'uploads','Recordings');
// if (!require('fs').existsSync(uploadsDir)) {
//   require('fs').mkdirSync(uploadsDir, { recursive: true });
// }
// // Configure multer for video file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir) // Make sure this directory exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `recording_${req.params.matchId}_${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   }
// });
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'Recordings');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads/Recordings directory at:', uploadsDir);
}
// // Configure multer for video file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir) // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueName = `recording_${req.params.matchId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

customMatchController.startStream = async (req, res) => {
  try {
    const match = await customMatch.findById(req.params.matchId);
    if (!match) return res.status(404).json({ msg: "Match not found" });

    // Basic auth check
    if (match.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to start stream" });
    }

    // Initialize stream object if it doesn't exist
    if (!match.stream) {
      match.stream = {};
    }

    // Check if already streaming
    if (match.stream.isLive) {
      return res.status(400).json({ msg: "Stream is already active" });
    }

    // Generate unique identifiers
    const roomId = `match_${match._id}_${Date.now()}`;
    const recordingId = uuidv4();

    // Initialize pastStreams array if it doesn't exist
    if (!match.pastStreams) {
      match.pastStreams = [];
    }

    // Set stream status
    match.stream = {
      isLive: true,
      roomId: roomId,
      startedBy: req.user._id,
      startedAt: new Date(),
      recordingStatus: 'recording',
      activeRecordingId: recordingId
    };

    // Create initial pastStream entry
    match.pastStreams.push({
      roomId: roomId,
      startedBy: req.user._id,
      startedAt: new Date(),
      endedAt: null, // Will be set when stream stops
      recordingId: recordingId,
      recordingUrl: null, // Will be set when recording is uploaded
      processed: false,
      uploadStatus: 'pending',
      uploadProgress: 0,
      fileSize: null,
      mimeType: null,
      duration: null,
      errorMessage: null
    });

    // Mark as modified to ensure save works
    match.markModified('stream');
    match.markModified('pastStreams');

    await match.save();

    console.log(`Stream started for match ${match._id} with recording ID: ${recordingId}`);
    console.log(`PastStreams count: ${match.pastStreams.length}`);

    res.status(200).json({ 
      msg: "Stream and recording started", 
      match,
      recordingId,
      roomId,
      pastStreamsCount: match.pastStreams.length
    });
  } catch (err) {
    console.error("Error starting stream:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// FIXED stopStream method
customMatchController.stopStream = async (req, res) => {
  try {
    const match = await customMatch.findById(req.params.matchId);
    if (!match) return res.status(404).json({ msg: "Match not found" });

    if (match.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { recordingUrl } = req.body;

    // Initialize pastStreams array if it doesn't exist
    if (!match.pastStreams) {
      match.pastStreams = [];
    }

    let streamUpdated = false;

    if (match.stream && match.stream.isLive) {
      // Find existing stream entry by recordingId or roomId
      let existingStreamIndex = -1;
      
      if (match.stream.activeRecordingId) {
        existingStreamIndex = match.pastStreams.findIndex(
          stream => stream.recordingId === match.stream.activeRecordingId
        );
      }
      
      if (existingStreamIndex === -1 && match.stream.roomId) {
        existingStreamIndex = match.pastStreams.findIndex(
          stream => stream.roomId === match.stream.roomId
        );
      }

      if (existingStreamIndex !== -1) {
        // Update existing pastStream entry
        match.pastStreams[existingStreamIndex] = {
          ...match.pastStreams[existingStreamIndex],
          endedAt: new Date(),
          recordingUrl: recordingUrl || null,
          processed: !!recordingUrl,
          uploadStatus: recordingUrl ? 'completed' : 'pending',
          uploadProgress: recordingUrl ? 100 : 0
        };
        streamUpdated = true;
      } else {
        // Create new pastStream entry if none exists
        match.pastStreams.push({
          roomId: match.stream.roomId,
          startedBy: match.stream.startedBy,
          startedAt: match.stream.startedAt,
          endedAt: new Date(),
          recordingId: match.stream.activeRecordingId || uuidv4(),
          recordingUrl: recordingUrl || null,
          processed: !!recordingUrl,
          uploadStatus: recordingUrl ? 'completed' : 'pending',
          uploadProgress: recordingUrl ? 100 : 0,
          fileSize: null,
          mimeType: null,
          duration: null,
          errorMessage: null
        });
        streamUpdated = true;
      }
    }

    // Clear current stream status
    match.stream = {
      isLive: false,
      roomId: null,
      startedBy: null,
      startedAt: null,
      recordingStatus: recordingUrl ? 'completed' : 'pending',
      activeRecordingId: null
    };

    // Mark as modified to ensure save works
    match.markModified('stream');
    match.markModified('pastStreams');

    await match.save();

    console.log(`Stream stopped for match ${match._id}${recordingUrl ? ` with recording: ${recordingUrl}` : ''}`);
    console.log(`PastStreams count: ${match.pastStreams.length}`);

    res.status(200).json({
      msg: "Stream stopped",
      match,
      pastStreamsCount: match.pastStreams.length
    });
  } catch (err) {
    console.error("Error stopping stream:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// FIXED uploadRecording method
customMatchController.uploadRecording = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { recordingId } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No video file uploaded" });
    }

    const match = await customMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }

    // Basic auth check
    if (match.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to upload recording" });
    }

    // Generate the recording URL - FIXED PATH
    const recordingUrl = `${req.protocol}://${req.get('host')}/uploads/Recordings/${req.file.filename}`;

    // Initialize pastStreams array if it doesn't exist
    if (!match.pastStreams) {
      match.pastStreams = [];
    }

    let updatedExisting = false;
    
    // First try to find by recordingId if provided
    if (recordingId) {
      const streamIndex = match.pastStreams.findIndex(
        stream => stream.recordingId === recordingId
      );
      
      if (streamIndex !== -1) {
        match.pastStreams[streamIndex] = {
          ...match.pastStreams[streamIndex],
          recordingUrl,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          processed: true,
          uploadStatus: 'completed',
          uploadProgress: 100,
          endedAt: match.pastStreams[streamIndex].endedAt || new Date()
        };
        updatedExisting = true;
      }
    }
    
    // If not found by recordingId, look for an existing pastStream without recordingUrl
    if (!updatedExisting) {
      for (let i = match.pastStreams.length - 1; i >= 0; i--) {
        if (!match.pastStreams[i].recordingUrl) {
          match.pastStreams[i] = {
            ...match.pastStreams[i],
            recordingUrl,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            processed: true,
            uploadStatus: 'completed',
            uploadProgress: 100,
            endedAt: match.pastStreams[i].endedAt || new Date()
          };
          updatedExisting = true;
          break;
        }
      }
    }

    // If no existing pastStream found, create new one
    if (!updatedExisting) {
      match.pastStreams.push({
        roomId: match.stream?.roomId || `match_${matchId}_${Date.now()}`,
        startedBy: req.user._id,
        startedAt: new Date(Date.now() - 60000), // Assume started 1 minute ago
        endedAt: new Date(),
        recordingUrl,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        processed: true,
        uploadStatus: 'completed',
        uploadProgress: 100,
        recordingId: recordingId || uuidv4()
      });
    }

    // Clear current stream status if still active
    if (match.stream && match.stream.isLive) {
      match.stream = {
        isLive: false,
        roomId: null,
        startedBy: null,
        startedAt: null,
        recordingStatus: 'completed',
        activeRecordingId: null
      };
    }

    // Mark as modified to ensure save works
    match.markModified('stream');
    match.markModified('pastStreams');

    await match.save();

    console.log(`Recording uploaded for match ${matchId}: ${recordingUrl}`);
    console.log(`PastStreams count after upload: ${match.pastStreams.length}`);

    res.status(200).json({
      msg: "Recording uploaded successfully",
      recordingUrl,
      fileSize: req.file.size,
      match,
      pastStreamsCount: match.pastStreams.length
    });

  } catch (err) {
    console.error("Error uploading recording:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// FIXED updateRecordingStatus method
customMatchController.updateRecordingStatus = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { recordingId, status, recordingUrl, fileSize, mimeType, duration, errorMessage, uploadProgress } = req.body;

    const match = await customMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }

    // Basic auth check
    if (match.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to update recording" });
    }

    // Initialize pastStreams array if it doesn't exist
    if (!match.pastStreams) {
      match.pastStreams = [];
    }

    // Find the pastStream with matching recordingId
    const streamIndex = match.pastStreams.findIndex(
      stream => stream.recordingId === recordingId
    );

    if (streamIndex === -1) {
      return res.status(404).json({ msg: "Recording not found in pastStreams" });
    }

    // Update the recording
    const updatedFields = {
      uploadStatus: status,
      uploadProgress: uploadProgress || (status === 'completed' ? 100 : 0),
      processed: status === 'completed' && !!recordingUrl
    };

    if (recordingUrl) updatedFields.recordingUrl = recordingUrl;
    if (fileSize) updatedFields.fileSize = fileSize;
    if (mimeType) updatedFields.mimeType = mimeType;
    if (duration) updatedFields.duration = duration;
    if (errorMessage) updatedFields.errorMessage = errorMessage;

    // Update the pastStream
    match.pastStreams[streamIndex] = {
      ...match.pastStreams[streamIndex],
      ...updatedFields
    };

    // Mark as modified to ensure save works
    match.markModified('pastStreams');

    await match.save();

    console.log(`Recording status updated for match ${matchId}, recordingId ${recordingId}: ${status}`);

    res.status(200).json({
      msg: "Recording status updated",
      match,
      recordingId,
      status,
      pastStreamsCount: match.pastStreams.length
    });

  } catch (err) {
    console.error("Error updating recording status:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};










// Your existing updateBall method (keeping as is)


customMatchController.updateBall = async (req, res) => {
  try {
    const { id } = req.params;
    const { runs, isWicket, strikerId, nonStrikerId, bowlerId, extras } = req.body;

    // Validate input
    if (runs && (!Number.isInteger(runs) || runs < 0 || runs > 6)) {
      return res.status(400).json({ msg: "Invalid runs value" });
    }

    const match = await customMatch.findById(id);
    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }

    if (match.status === "Completed") {
      return res.status(400).json({ msg: "Match is already completed" });
    }

    // Initialize currentScore if not exists
    if (!match.currentScore) {
      match.currentScore = {
        team: 0,
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        innings: 1,
      };
    }

    // Validate team structure
    if (!match.teams || match.teams.length < 2) {
      return res.status(400).json({ msg: "Match must have at least 2 teams" });
    }

    const currentTeamIndex = match.currentScore.team;
    const currentTeam = match.teams[currentTeamIndex];
    if (!currentTeam) {
      return res.status(400).json({ msg: "Invalid team index" });
    }

    // Calculate max wickets (typically 10 for 11 players)
    const maxWickets = (currentTeam.players?.length || 11) - 1;

    // Update runs
    if (runs && Number.isInteger(runs)) {
      match.currentScore.runs += runs;
      
      // Update striker's stats if provided
      if (strikerId) {
        try {
          const Player = require("../models/player-model");
          await Player.findByIdAndUpdate(strikerId, { $inc: { runs } });
        } catch (err) {
          console.warn("Failed to update striker stats:", err.message);
        }
      }
    }

    // Handle wicket
    if (isWicket) {
      if (match.currentScore.wickets < maxWickets) {
        match.currentScore.wickets += 1;
        
        // Update bowler's stats if provided
        if (bowlerId) {
          try {
            const Player = require("../models/player-model");
            await Player.findByIdAndUpdate(bowlerId, { $inc: { wickets: 1 } });
          } catch (err) {
            console.warn("Failed to update bowler stats:", err.message);
          }
        }
      }
    }

    // Update balls and overs (only for non-wide/no-ball deliveries)
    const isLegalDelivery = !extras || (extras !== 'wide' && extras !== 'no-ball');
    
    if (isLegalDelivery) {
      match.currentScore.balls += 1;
      if (match.currentScore.balls === 6) {
        match.currentScore.overs += 1;
        match.currentScore.balls = 0;
      }
    }

    // Check innings completion conditions
    const oversCompleted = match.currentScore.overs >= match.overs;
    const allOut = match.currentScore.wickets >= maxWickets;
    const isFirstInnings = match.currentScore.innings === 1;
    const isSecondInnings = match.currentScore.innings === 2;

    // Store current innings score before any transitions
    const currentInningsScore = {
      team: match.currentScore.team,
      runs: match.currentScore.runs,
      wickets: match.currentScore.wickets,
      overs: match.currentScore.overs,
      balls: match.currentScore.balls,
      innings: match.currentScore.innings
    };

    // Check for early win in second innings
    if (isSecondInnings && match.inningsScores.length > 0) {
      const firstInningsScore = match.inningsScores[0];
      const targetRuns = firstInningsScore.runs + 1; // runs to win
      
      if (match.currentScore.runs >= targetRuns) {
        // Chasing team wins
        const remainingWickets = maxWickets - match.currentScore.wickets;
        const chasingTeam = match.teams[match.currentScore.team]?.name || "Team 2";
        
        match.status = "Completed";
        match.result = `${chasingTeam} won by ${remainingWickets} wickets`;
        
        // Add final innings score
        const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
        if (existingIndex !== -1) {
          match.inningsScores[existingIndex] = currentInningsScore;
        } else {
          match.inningsScores.push(currentInningsScore);
        }
        
        await match.save();
        return res.json(match);
      }
    }

    // Handle innings completion
    if (oversCompleted || allOut) {
      // Update or add current innings score
      const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
      if (existingIndex !== -1) {
        match.inningsScores[existingIndex] = currentInningsScore;
      } else {
        match.inningsScores.push(currentInningsScore);
      }

      if (isFirstInnings) {
        // Start second innings
        match.currentScore = {
          team: match.currentScore.team === 0 ? 1 : 0, // Switch team
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          innings: 2
        };
        match.status = "Live";
      } else {
        // Match completed - calculate result
        match.status = "Completed";
        
        const firstInnings = match.inningsScores.find(s => s.innings === 1);
        const secondInnings = currentInningsScore;
        
        if (!firstInnings) {
          return res.status(500).json({ msg: "First innings data not found" });
        }
        
        const team1Name = match.teams[firstInnings.team]?.name || "Team 1";
        const team2Name = match.teams[secondInnings.team]?.name || "Team 2";
        
        if (firstInnings.runs > secondInnings.runs) {
          const margin = firstInnings.runs - secondInnings.runs;
          match.result = `${team1Name} won by ${margin} runs`;
        } else if (secondInnings.runs > firstInnings.runs) {
          const remainingWickets = maxWickets - secondInnings.wickets;
          match.result = `${team2Name} won by ${remainingWickets} wickets`;
        } else {
          match.result = "Match tied";
        }
      }
    } else {
      // Innings still ongoing - update current innings score in array
      const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
      if (existingIndex !== -1) {
        match.inningsScores[existingIndex] = currentInningsScore;
      } else {
        match.inningsScores.push(currentInningsScore);
      }
    }

    await match.save();
    res.json(match);

  } catch (err) {
    console.error("Ball update error:", err.message);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

// Additional helper methods
customMatchController.getMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await customMatch.findById(id);
    
    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }
    
    res.json(match);
  } catch (err) {
    console.error("Get match error:", err.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

customMatchController.getAllMatches = async (req, res) => {
  try {
    const matches = await customMatch.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    console.error("Get all matches error:", err.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

customMatchController.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await customMatch.findByIdAndDelete(id);
    
    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }
    
    res.json({ msg: "Match deleted successfully" });
  } catch (err) {
    console.error("Delete match error:", err.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// module.exports = customMatchController;
module.exports = {
  ...customMatchController,
  uploadMiddleware: upload
};
