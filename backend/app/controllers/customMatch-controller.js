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
const CommentaryService = require('../services/commentaryService');
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


// Add a new endpoint to handle file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Team = require("../models/team-model");

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
//           const Player = require("../models/player-model");
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
//             const Player = require("../models/player-model");
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

//////////////////////////////////////////////////////////////////////

// Additional helper methods

// customMatchController.updateBall = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       runs, 
//       isWicket, 
//       strikerId, 
//       nonStrikerId, 
//       bowlerId, 
//       extras,
//       eventType,
//       wicketType,
//       batsman,
//       bowler
//     } = req.body;

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

//     // Store previous score for commentary calculation
//     const previousRuns = match.currentScore.runs;
//     const previousWickets = match.currentScore.wickets;

//     // Update runs
//     if (runs && Number.isInteger(runs)) {
//       match.currentScore.runs += runs;
      
//       // Update striker's stats if provided
//       if (strikerId) {
//         try {
//           const Player = require("../models/player-model");
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
//             const Player = require("../models/player-model");
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

//     // Generate match situation for commentary
//     const matchSituation = {
//       runs: match.currentScore.runs,
//       wickets: match.currentScore.wickets,
//       overs: match.currentScore.overs,
//       balls: match.currentScore.balls,
//       runRate: match.currentScore.overs > 0 ? 
//         parseFloat((match.currentScore.runs / (match.currentScore.overs + match.currentScore.balls/6)).toFixed(2)) : 0,
//       requiredRunRate: match.inningsScores.length > 0 && match.currentScore.innings === 2 ?
//         parseFloat(((match.inningsScores[0].runs + 1 - match.currentScore.runs) / 
//          (match.overs - (match.currentScore.overs + match.currentScore.balls/6))).toFixed(2)) : null
//     };

//     // Determine event type if not provided
//     const determinedEventType = eventType || this.determineEventType(runs, isWicket, extras);

//     // Prepare ball data for commentary
//     const ballData = {
//       eventType: determinedEventType,
//       runs: runs || 0,
//       isWicket: isWicket || false,
//       wicketType: isWicket ? (wicketType || 'bowled') : null,
//       extras: extras || null
//     };

//     // Generate commentary using the service
//     const commentaryText = CommentaryService.generateCommentary(ballData, matchSituation);

//     // Prepare batsman and bowler data
//     const batsmanData = {
//       id: strikerId,
//       name: batsman?.name || `Batsman ${match.currentScore.runs % 2 === 0 ? 'A' : 'B'}`,
//       runs: batsman?.runs || 0,
//       balls: batsman?.balls || 0
//     };

//     const bowlerData = {
//       id: bowlerId,
//       name: bowler?.name || `Bowler ${match.currentScore.overs % 2 === 0 ? 'X' : 'Y'}`,
//       overs: bowler?.overs || match.currentScore.overs,
//       balls: bowler?.balls || match.currentScore.balls
//     };

//     // Create commentary entry
//     const commentaryEntry = {
//       ballNumber: {
//         over: match.currentScore.overs,
//         ball: match.currentScore.balls
//       },
//       batsman: batsmanData,
//       bowler: bowlerData,
//       event: ballData,
//       commentary: commentaryText,
//       matchSituation: matchSituation,
//       timestamp: new Date()
//     };

//     // Initialize commentary array if not exists
//     if (!match.commentary) {
//       match.commentary = [];
//     }

//     // Add commentary to match
//     match.commentary.push(commentaryEntry);

//     // Generate AI insights for key moments
//     if (match.commentary.length % 6 === 0 || isWicket || runs >= 4) {
//       const aiInsights = CommentaryService.generateAIInsights(
//         match.commentary, 
//         matchSituation
//       );
      
//       if (aiInsights.length > 0) {
//         // Initialize AI insights if not exists
//         if (!match.aiInsights) {
//           match.aiInsights = {};
//         }
        
//         match.aiInsights = {
//           momentum: this.calculateMomentum(match.commentary),
//           keyPlayers: this.identifyKeyPlayers(match),
//           winProbability: this.calculateWinProbability(match),
//           lastUpdated: new Date(),
//           recentInsights: aiInsights
//         };
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

//         // Add match completion commentary
//         const completionCommentary = {
//           ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
//           batsman: batsmanData,
//           bowler: bowlerData,
//           event: { eventType: 'match_complete', runs: runs || 0, isWicket: false },
//           commentary: `🎉 MATCH OVER! ${match.result}`,
//           matchSituation: matchSituation,
//           timestamp: new Date()
//         };
//         match.commentary.push(completionCommentary);
        
//         await match.save();

//         // Emit real-time update
//         this.emitBallUpdate(match, commentaryEntry);
        
//         return res.json({
//           match,
//           commentary: commentaryEntry,
//           matchCompleted: true
//         });
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

//         // Add innings break commentary
//         const inningsBreakCommentary = {
//           ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
//           batsman: { name: "Innings Break", runs: 0, balls: 0 },
//           bowler: { name: "Innings Break", overs: 0, balls: 0 },
//           event: { eventType: 'innings_break', runs: 0, isWicket: false },
//           commentary: `🏏 END OF INNINGS! ${currentTeam.name} scored ${currentInningsScore.runs}/${currentInningsScore.wickets}. Target: ${currentInningsScore.runs + 1} runs.`,
//           matchSituation: matchSituation,
//           timestamp: new Date()
//         };
//         match.commentary.push(inningsBreakCommentary);
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

//         // Add match completion commentary
//         const completionCommentary = {
//           ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
//           batsman: { name: "Match Complete", runs: 0, balls: 0 },
//           bowler: { name: "Match Complete", overs: 0, balls: 0 },
//           event: { eventType: 'match_complete', runs: 0, isWicket: false },
//           commentary: `🎉 MATCH OVER! ${match.result}`,
//           matchSituation: matchSituation,
//           timestamp: new Date()
//         };
//         match.commentary.push(completionCommentary);
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

//     // Emit real-time update via Socket.IO
//     this.emitBallUpdate(match, commentaryEntry);

//     res.json({
//       match,
//       commentary: commentaryEntry,
//       aiInsights: match.aiInsights,
//       matchCompleted: match.status === "Completed"
//     });

//   } catch (err) {
//     console.error("Ball update error:", err.message);
//     res.status(500).json({ msg: "Internal server error", error: err.message });
//   }
// };

// // Helper method to determine event type
// customMatchController.determineEventType = (runs, isWicket, extras) => {
//   if (isWicket) return 'wicket';
//   if (extras) return 'extra';
//   if (runs === 0) return 'dot';
//   if (runs === 4) return 'boundary';
//   if (runs === 6) return 'six';
//   return 'run';
// };

// // Helper method to calculate momentum
// customMatchController.calculateMomentum = (commentary) => {
//   const last10Balls = commentary.slice(-10);
//   const runs = last10Balls.reduce((sum, ball) => sum + (ball.event.runs || 0), 0);
//   const wickets = last10Balls.filter(ball => ball.event.isWicket).length;

//   if (wickets >= 2) return 'Strong Negative';
//   if (runs >= 15) return 'Strong Positive';
//   if (runs >= 10) return 'Positive';
//   if (runs <= 5) return 'Negative';
//   return 'Neutral';
// };

// // Helper method to identify key players
// customMatchController.identifyKeyPlayers = (match) => {
//   // Simple implementation - you can enhance this with more complex logic
//   if (!match.commentary || match.commentary.length === 0) {
//     return {
//       keyBatsman: "To be determined",
//       keyBowler: "To be determined",
//       impact: "Analysis in progress"
//     };
//   }

//   const recentBalls = match.commentary.slice(-12); // Last 2 overs
//   const batsmenRuns = {};
//   const bowlersWickets = {};

//   recentBalls.forEach(ball => {
//     // Track batsman runs
//     if (ball.batsman.name && ball.event.runs > 0) {
//       batsmenRuns[ball.batsman.name] = (batsmenRuns[ball.batsman.name] || 0) + ball.event.runs;
//     }

//     // Track bowler wickets
//     if (ball.bowler.name && ball.event.isWicket) {
//       bowlersWickets[ball.bowler.name] = (bowlersWickets[ball.bowler.name] || 0) + 1;
//     }
//   });

//   const keyBatsman = Object.keys(batsmenRuns).reduce((a, b) => 
//     batsmenRuns[a] > batsmenRuns[b] ? a : b, Object.keys(batsmenRuns)[0] || "Batsman A"
//   );

//   const keyBowler = Object.keys(bowlersWickets).reduce((a, b) => 
//     bowlersWickets[a] > bowlersWickets[b] ? a : b, Object.keys(bowlersWickets)[0] || "Bowler X"
//   );

//   return {
//     keyBatsman: keyBatsman,
//     keyBowler: keyBowler,
//     impact: "Recent performance analysis"
//   };
// };

// // Helper method to calculate win probability
// customMatchController.calculateWinProbability = (match) => {
//   if (match.inningsScores.length < 2) {
//     return { team1: 50, team2: 50 };
//   }
  
//   const target = match.inningsScores[0].runs + 1;
//   const required = target - match.currentScore.runs;
//   const ballsRemaining = (match.overs * 6) - (match.currentScore.overs * 6 + match.currentScore.balls);
  
//   if (ballsRemaining <= 0) {
//     return match.currentScore.runs >= target ? 
//       { team1: 0, team2: 100 } : { team1: 100, team2: 0 };
//   }
  
//   const runsScored = match.currentScore.runs;
//   const ballsUsed = match.currentScore.overs * 6 + match.currentScore.balls;
//   const currentRunRate = ballsUsed > 0 ? (runsScored / ballsUsed) * 6 : 0;
//   const requiredRunRate = ballsRemaining > 0 ? (required / ballsRemaining) * 6 : 0;
  
//   // Simple probability calculation based on run rate comparison
//   let probability = 50;
//   if (currentRunRate > requiredRunRate) {
//     probability = Math.min(90, 50 + (currentRunRate - requiredRunRate) * 10);
//   } else {
//     probability = Math.max(10, 50 - (requiredRunRate - currentRunRate) * 10);
//   }
  
//   // Adjust for wickets
//   const wicketsLost = match.currentScore.wickets;
//   const wicketsFactor = (10 - wicketsLost) / 10; // More wickets = lower probability
//   probability *= wicketsFactor;
  
//   return { 
//     team1: Math.round(100 - probability), 
//     team2: Math.round(probability) 
//   };
// };

// // Helper method to emit real-time updates
// customMatchController.emitBallUpdate = (match, commentaryEntry) => {
//   try {
//     const io = require('../server').io;
//     if (io) {
//       io.to(`match_${match._id}`).emit('ball_update', {
//         matchId: match._id,
//         commentary: commentaryEntry,
//         currentScore: match.currentScore,
//         aiInsights: match.aiInsights,
//         matchStatus: match.status
//       });
//     }
//   } catch (error) {
//     console.error('Error emitting ball update:', error);
//   }
// };

///////////////////////////////////////////////////////////////////////

// customMatchController.updateBall = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       runs, 
//       isWicket, 
//       strikerId, 
//       nonStrikerId, 
//       bowlerId, 
//       extras,
//       eventType,
//       wicketType,
//       batsman,
//       bowler
//     } = req.body;

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

//     // Store previous score for commentary calculation
//     const previousRuns = match.currentScore.runs;
//     const previousWickets = match.currentScore.wickets;

//     // Update runs
//     if (runs && Number.isInteger(runs)) {
//       match.currentScore.runs += runs;
      
//       // Update striker's stats if provided
//       if (strikerId) {
//         try {
//           const Player = require("../models/player-model");
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
//             const Player = require("../models/player-model");
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

//     // Generate match situation for commentary
//     const matchSituation = {
//       runs: match.currentScore.runs,
//       wickets: match.currentScore.wickets,
//       overs: match.currentScore.overs,
//       balls: match.currentScore.balls,
//       runRate: match.currentScore.overs > 0 ? 
//         parseFloat((match.currentScore.runs / (match.currentScore.overs + match.currentScore.balls/6)).toFixed(2)) : 0,
//       requiredRunRate: match.inningsScores.length > 0 && match.currentScore.innings === 2 ?
//         parseFloat(((match.inningsScores[0].runs + 1 - match.currentScore.runs) / 
//          (match.overs - (match.currentScore.overs + match.currentScore.balls/6))).toFixed(2)) : null
//     };

//     // Determine event type if not provided - FIXED: Use helper function
//     const determineEventType = (runs, isWicket, extras) => {
//       if (isWicket) return 'wicket';
//       if (extras) return 'extra';
//       if (runs === 0) return 'dot';
//       if (runs === 4) return 'boundary';
//       if (runs === 6) return 'six';
//       return 'run';
//     };

//     const determinedEventType = eventType || determineEventType(runs, isWicket, extras);

//     // Prepare ball data for commentary
//     const ballData = {
//       eventType: determinedEventType,
//       runs: runs || 0,
//       isWicket: isWicket || false,
//       wicketType: isWicket ? (wicketType || 'bowled') : null,
//       extras: extras || null
//     };

//     // Generate commentary using the service
//     const commentaryText = CommentaryService.generateCommentary(ballData, matchSituation);

//     // Prepare batsman and bowler data
//     const batsmanData = {
//       id: strikerId,
//       name: batsman?.name || `Batsman ${match.currentScore.runs % 2 === 0 ? 'A' : 'B'}`,
//       runs: batsman?.runs || 0,
//       balls: batsman?.balls || 0
//     };

//     const bowlerData = {
//       id: bowlerId,
//       name: bowler?.name || `Bowler ${match.currentScore.overs % 2 === 0 ? 'X' : 'Y'}`,
//       overs: bowler?.overs || match.currentScore.overs,
//       balls: bowler?.balls || match.currentScore.balls
//     };

//     // Create commentary entry
//     const commentaryEntry = {
//       ballNumber: {
//         over: match.currentScore.overs,
//         ball: match.currentScore.balls
//       },
//       batsman: batsmanData,
//       bowler: bowlerData,
//       event: ballData,
//       commentary: commentaryText,
//       matchSituation: matchSituation,
//       timestamp: new Date()
//     };

//     // Initialize commentary array if not exists
//     if (!match.commentary) {
//       match.commentary = [];
//     }

//     // Add commentary to match
//     match.commentary.push(commentaryEntry);

//     // Helper function to calculate momentum
//     const calculateMomentum = (commentaryArray) => {
//       const last10Balls = commentaryArray.slice(-10);
//       const runsScored = last10Balls.reduce((sum, ball) => sum + (ball.event.runs || 0), 0);
//       const wicketsTaken = last10Balls.filter(ball => ball.event.isWicket).length;

//       if (wicketsTaken >= 2) return 'Strong Negative';
//       if (runsScored >= 15) return 'Strong Positive';
//       if (runsScored >= 10) return 'Positive';
//       if (runsScored <= 5) return 'Negative';
//       return 'Neutral';
//     };

//     // Helper function to identify key players
//     const identifyKeyPlayers = (matchData) => {
//       if (!matchData.commentary || matchData.commentary.length === 0) {
//         return {
//           keyBatsman: "To be determined",
//           keyBowler: "To be determined",
//           impact: "Analysis in progress"
//         };
//       }

//       const recentBalls = matchData.commentary.slice(-12);
//       const batsmenRuns = {};
//       const bowlersWickets = {};

//       recentBalls.forEach(ball => {
//         if (ball.batsman?.name && ball.event?.runs > 0) {
//           batsmenRuns[ball.batsman.name] = (batsmenRuns[ball.batsman.name] || 0) + ball.event.runs;
//         }

//         if (ball.bowler?.name && ball.event?.isWicket) {
//           bowlersWickets[ball.bowler.name] = (bowlersWickets[ball.bowler.name] || 0) + 1;
//         }
//       });

//       const keyBatsman = Object.keys(batsmenRuns).length > 0 
//         ? Object.keys(batsmenRuns).reduce((a, b) => batsmenRuns[a] > batsmenRuns[b] ? a : b)
//         : "Batsman A";

//       const keyBowler = Object.keys(bowlersWickets).length > 0
//         ? Object.keys(bowlersWickets).reduce((a, b) => bowlersWickets[a] > bowlersWickets[b] ? a : b)
//         : "Bowler X";

//       return {
//         keyBatsman: keyBatsman,
//         keyBowler: keyBowler,
//         impact: "Recent performance analysis"
//       };
//     };

//     // Helper function to calculate win probability
//     const calculateWinProbability = (matchData) => {
//       if (matchData.inningsScores.length < 2) {
//         return { team1: 50, team2: 50 };
//       }
      
//       const target = matchData.inningsScores[0].runs + 1;
//       const required = target - matchData.currentScore.runs;
//       const ballsRemaining = (matchData.overs * 6) - (matchData.currentScore.overs * 6 + matchData.currentScore.balls);
      
//       if (ballsRemaining <= 0) {
//         return matchData.currentScore.runs >= target ? 
//           { team1: 0, team2: 100 } : { team1: 100, team2: 0 };
//       }
      
//       const runsScored = matchData.currentScore.runs;
//       const ballsUsed = matchData.currentScore.overs * 6 + matchData.currentScore.balls;
//       const currentRunRate = ballsUsed > 0 ? (runsScored / ballsUsed) * 6 : 0;
//       const requiredRunRate = ballsRemaining > 0 ? (required / ballsRemaining) * 6 : 0;
      
//       let probability = 50;
//       if (currentRunRate > requiredRunRate) {
//         probability = Math.min(90, 50 + (currentRunRate - requiredRunRate) * 10);
//       } else {
//         probability = Math.max(10, 50 - (requiredRunRate - currentRunRate) * 10);
//       }
      
//       const wicketsLost = matchData.currentScore.wickets;
//       const wicketsFactor = (10 - wicketsLost) / 10;
//       probability *= wicketsFactor;
      
//       return { 
//         team1: Math.round(100 - probability), 
//         team2: Math.round(probability) 
//       };
//     };

//     // Generate AI insights for key moments
//     if (match.commentary.length % 6 === 0 || isWicket || runs >= 4) {
//       const aiInsights = CommentaryService.generateAIInsights ? 
//         CommentaryService.generateAIInsights(match.commentary, matchSituation) : [];
      
//       if (aiInsights.length > 0) {
//         if (!match.aiInsights) {
//           match.aiInsights = {};
//         }
        
//         // match.aiInsights = {
//         //   momentum: calculateMomentum(match.commentary),
//         //   keyPlayers: identifyKeyPlayers(match),
//         //   winProbability: calculateWinProbability(match),
//         //   lastUpdated: new Date(),
//         //   recentInsights: aiInsights
//         // };
//         // Use this:
// const momentumString = calculateMomentum(match.commentary);

// // Calculate required run rate for second innings
// let requiredRunRate = null;
// if (match.currentScore.innings === 2 && match.inningsScores.length > 0) {
//   const target = match.inningsScores[0].runs + 1;
//   const required = target - match.currentScore.runs;
//   const ballsRemaining = (match.overs * 6) - (match.currentScore.overs * 6 + match.currentScore.balls);
//   if (ballsRemaining > 0) {
//     requiredRunRate = parseFloat(((required / ballsRemaining) * 6).toFixed(2));
//   }
// }

// // Calculate recent run rate
// const last6Balls = match.commentary.slice(-6);
// const runsInLastOver = last6Balls.reduce((sum, ball) => sum + (ball.event.runs || 0), 0);
// const recentRunRate = runsInLastOver * 6;

// match.aiInsights = {
//   momentum: {
//     status: momentumString,
//     recentRunRate: recentRunRate,
//     requiredRunRate: requiredRunRate,
//     lastUpdated: new Date()
//   },
//   keyPlayers: {
//     ...identifyKeyPlayers(match),
//     lastUpdated: new Date()
//   },
//   winProbability: {
//     ...calculateWinProbability(match),
//     lastUpdated: new Date()
//   }
// };
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
//       const targetRuns = firstInningsScore.runs + 1;
      
//       if (match.currentScore.runs >= targetRuns) {
//         const remainingWickets = maxWickets - match.currentScore.wickets;
//         const chasingTeam = match.teams[match.currentScore.team]?.name || "Team 2";
        
//         match.status = "Completed";
//         match.result = `${chasingTeam} won by ${remainingWickets} wickets`;
        
//         const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
//         if (existingIndex !== -1) {
//           match.inningsScores[existingIndex] = currentInningsScore;
//         } else {
//           match.inningsScores.push(currentInningsScore);
//         }

//         // Add match completion commentary
//         const completionCommentary = {
//           ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
//           batsman: batsmanData,
//           bowler: bowlerData,
//           event: { eventType: 'match_complete', runs: runs || 0, isWicket: false },
//           commentary: `🎉 MATCH OVER! ${match.result}`,
//           matchSituation: matchSituation,
//           timestamp: new Date()
//         };
//         match.commentary.push(completionCommentary);
        
//         await match.save();

//         // Emit real-time update
//         emitBallUpdate(match, commentaryEntry);
        
//         return res.json({
//           match,
//           commentary: commentaryEntry,
//           matchCompleted: true
//         });
//       }
//     }

//     // Handle innings completion
//     if (oversCompleted || allOut) {
//       const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
//       if (existingIndex !== -1) {
//         match.inningsScores[existingIndex] = currentInningsScore;
//       } else {
//         match.inningsScores.push(currentInningsScore);
//       }

//       if (isFirstInnings) {
//         match.currentScore = {
//           team: match.currentScore.team === 0 ? 1 : 0,
//           runs: 0,
//           wickets: 0,
//           overs: 0,
//           balls: 0,
//           innings: 2
//         };
//         match.status = "Live";

//         const inningsBreakCommentary = {
//           ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
//           batsman: { name: "Innings Break", runs: 0, balls: 0 },
//           bowler: { name: "Innings Break", overs: 0, balls: 0 },
//           event: { eventType: 'innings_break', runs: 0, isWicket: false },
//           commentary: `🏏 END OF INNINGS! ${currentTeam.name} scored ${currentInningsScore.runs}/${currentInningsScore.wickets}. Target: ${currentInningsScore.runs + 1} runs.`,
//           matchSituation: matchSituation,
//           timestamp: new Date()
//         };
//         match.commentary.push(inningsBreakCommentary);
//       } else {
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

//         const completionCommentary = {
//           ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
//           batsman: { name: "Match Complete", runs: 0, balls: 0 },
//           bowler: { name: "Match Complete", overs: 0, balls: 0 },
//           event: { eventType: 'match_complete', runs: 0, isWicket: false },
//           commentary: `🎉 MATCH OVER! ${match.result}`,
//           matchSituation: matchSituation,
//           timestamp: new Date()
//         };
//         match.commentary.push(completionCommentary);
//       }
//     } else {
//       const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
//       if (existingIndex !== -1) {
//         match.inningsScores[existingIndex] = currentInningsScore;
//       } else {
//         match.inningsScores.push(currentInningsScore);
//       }
//     }

//     await match.save();

//     // Emit real-time update via Socket.IO
//     emitBallUpdate(match, commentaryEntry);

//     res.json({
//       match,
//       commentary: commentaryEntry,
//       aiInsights: match.aiInsights,
//       matchCompleted: match.status === "Completed"
//     });

//   } catch (err) {
//     console.error("Ball update error:", err.message);
//     res.status(500).json({ msg: "Internal server error", error: err.message });
//   }
// };

// // Helper function to emit real-time updates
// const emitBallUpdate = (match, commentaryEntry) => {
//   try {
//     const io = require('../server').io;
//     if (io) {
//       io.to(`match_${match._id}`).emit('ball_update', {
//         matchId: match._id,
//         commentary: commentaryEntry,
//         currentScore: match.currentScore,
//         aiInsights: match.aiInsights,
//         matchStatus: match.status
//       });
//     }
//   } catch (error) {
//     console.error('Error emitting ball update:', error);
//   }
// };
/////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
customMatchController.updateBall = async (req, res) => {
  try {
    const { id } = req.params;
    const { runs, isWicket, strikerId, nonStrikerId, bowlerId, extras } = req.body;

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

    if (!match.teams || match.teams.length < 2) {
      return res.status(400).json({ msg: "Match must have at least 2 teams" });
    }

    const currentTeamIndex = match.currentScore.team;
    const currentTeam = match.teams[currentTeamIndex];
    if (!currentTeam) {
      return res.status(400).json({ msg: "Invalid team index" });
    }

    const maxWickets = (currentTeam.players?.length || 11) - 1;

    // Store original score for comparison
    const originalRuns = match.currentScore.runs;
    const originalWickets = match.currentScore.wickets;
    const originalOvers = match.currentScore.overs;
    const originalBalls = match.currentScore.balls;

    // Update runs
    if (runs && Number.isInteger(runs)) {
      match.currentScore.runs += runs;

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

    const isLegalDelivery = !extras || (extras !== 'wide' && extras !== 'no-ball');

    if (isLegalDelivery) {
      match.currentScore.balls += 1;
      if (match.currentScore.balls === 6) {
        match.currentScore.overs += 1;
        match.currentScore.balls = 0;
      }
    }

    // Calculate run rate safely (required field)
    const calculateRunRate = (runs, overs, balls) => {
      const totalOvers = overs + (balls / 6);
      return totalOvers > 0 ? parseFloat((runs / totalOvers).toFixed(2)) : 0;
    };

    // Calculate required run rate safely (optional field)
    const calculateRequiredRunRate = (match) => {
      if (match.inningsScores.length > 0 && match.currentScore.innings === 2) {
        const target = match.inningsScores[0].runs + 1;
        const required = target - match.currentScore.runs;
        const remainingBalls = (match.overs * 6) - (match.currentScore.overs * 6 + match.currentScore.balls);
        
        if (remainingBalls > 0) {
          return parseFloat(((required / remainingBalls) * 6).toFixed(2));
        }
      }
      return null;
    };

    // Create commentary entry only if something changed
    const scoreChanged = originalRuns !== match.currentScore.runs || 
                        originalWickets !== match.currentScore.wickets ||
                        originalOvers !== match.currentScore.overs ||
                        originalBalls !== match.currentScore.balls;

    if (scoreChanged) {
      // Initialize commentary array if not exists
      if (!match.commentary) {
        match.commentary = [];
      }

      // Generate simple commentary
      const generateSimpleCommentary = () => {
        if (isWicket) {
          return `🎯 Wicket! Bowler strikes and takes a crucial wicket.`;
        } else if (runs === 4) {
          return `🔴 Beautiful boundary! The ball races to the fence.`;
        } else if (runs === 6) {
          return `💥 Massive six! That's gone all the way.`;
        } else if (runs > 0) {
          return `🏃 Good running! They take ${runs} run${runs > 1 ? 's' : ''}.`;
        } else if (extras === 'wide') {
          return `Wide delivery, extra run conceded.`;
        } else if (extras === 'no-ball') {
          return `No ball! Free hit coming up.`;
        } else {
          return `Dot ball. Well bowled.`;
        }
      };

      // Determine event type based on your schema enum - FIXED: Only use valid enum values
      const determineEventType = () => {
        if (isWicket) return 'wicket';
        if (extras === 'wide' || extras === 'noball' || extras === 'byes' || extras === 'legbyes') return 'extra';
        if (runs === 0) return 'dot';
        if (runs === 4) return 'boundary';
        if (runs === 6) return 'six';
        return 'run'; // Default to 'run' for other cases
      };

      // Determine wicket type based on your schema enum
      const determineWicketType = () => {
        if (!isWicket) return null;
        // Default to 'bowled' - you can enhance this based on actual data
        return 'bowled';
      };

      // Create matchSituation object with ALL REQUIRED FIELDS
      const matchSituation = {
        runs: match.currentScore.runs || 0,
        wickets: match.currentScore.wickets || 0,
        overs: match.currentScore.overs || 0,
        balls: match.currentScore.balls || 0,
        runRate: calculateRunRate(match.currentScore.runs, match.currentScore.overs, match.currentScore.balls), // REQUIRED
        requiredRunRate: calculateRequiredRunRate(match) // Can be null
      };

      // Create event object based on your ballEventSchema - FIXED: Only use valid enum values
      const event = {
        eventType: determineEventType(), // REQUIRED - must match enum: ['dot', 'run', 'boundary', 'six', 'wicket', 'extra', 'maiden']
        runs: runs || 0,
        isWicket: isWicket || false,
        wicketType: determineWicketType(), // Must match enum: ['bowled', 'caught', 'lbw', 'runout', 'stumped', 'hitwicket', null]
        extras: extras || null // Must match enum: ['wide', 'noball', 'byes', 'legbyes', null]
      };

      // Create commentary entry that exactly matches your schema
      const commentaryEntry = {
        ballNumber: {
          over: match.currentScore.overs || 0, // REQUIRED
          ball: match.currentScore.balls || 0  // REQUIRED
        },
        batsman: {
          id: strikerId || null,
          name: `Batsman ${strikerId ? 'A' : 'B'}`, // REQUIRED
          runs: match.currentScore.runs || 0, // Default value
          balls: 0 // Default value
        },
        bowler: {
          id: bowlerId || null,
          name: `Bowler ${bowlerId ? 'X' : 'Y'}`, // REQUIRED
          overs: match.currentScore.overs || 0, // Default value
          balls: match.currentScore.balls || 0 // Default value
        },
        event: event, // REQUIRED - must match ballEventSchema
        commentary: generateSimpleCommentary(), // REQUIRED
        matchSituation: matchSituation, // REQUIRED - must have all fields
        timestamp: new Date()
      };

      match.commentary.push(commentaryEntry);

      // FIXED: Socket.IO emission with correct path
      try {
        // Import io correctly based on your project structure
        let io;
        try {
          // Try relative path first
          io = require('../../server').io;
        } catch (relativeErr) {
          try {
            // Try absolute path
            io = require('../server').io;
          } catch (absoluteErr) {
            try {
              // Try different path
              io = require('../../index').io;
            } catch (finalErr) {
              console.log('Socket.IO not available for commentary updates');
              io = null;
            }
          }
        }
        
        if (io) {
          io.to(`match_${match._id}`).emit('ball_update', {
            matchId: match._id,
            commentary: commentaryEntry,
            currentScore: match.currentScore
          });
        }
      } catch (socketError) {
        console.error('Socket error (non-critical):', socketError);
        // Don't fail the entire request if socket fails
      }
    }

    // REST OF YOUR ORIGINAL LOGIC (unchanged)
    const oversCompleted = match.currentScore.overs >= match.overs;
    const allOut = match.currentScore.wickets >= maxWickets;
    const isFirstInnings = match.currentScore.innings === 1;
    const isSecondInnings = match.currentScore.innings === 2;

    const currentInningsScore = {
      team: match.currentScore.team,
      runs: match.currentScore.runs,
      wickets: match.currentScore.wickets,
      overs: match.currentScore.overs,
      balls: match.currentScore.balls,
      innings: match.currentScore.innings
    };

    if (isSecondInnings && match.inningsScores.length > 0) {
      const firstInningsScore = match.inningsScores[0];
      const targetRuns = firstInningsScore.runs + 1;

      if (match.currentScore.runs >= targetRuns) {
        const remainingWickets = maxWickets - match.currentScore.wickets;
        const chasingTeam = match.teams[match.currentScore.team]?.name || "Team 2";

        match.status = "Completed";
        match.result = `${chasingTeam} won by ${remainingWickets} wickets`;

        const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
        if (existingIndex !== -1) {
          match.inningsScores[existingIndex] = currentInningsScore;
        } else {
          match.inningsScores.push(currentInningsScore);
        }

        // Add match completion commentary - FIXED: Use valid eventType
        if (match.commentary) {
          const completionCommentary = {
            ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
            batsman: { name: "Match Complete", runs: 0, balls: 0 },
            bowler: { name: "Match Complete", overs: 0, balls: 0 },
            event: { 
              eventType: 'wicket', // Use valid enum value instead of 'match_complete'
              runs: 0, 
              isWicket: false,
              wicketType: null,
              extras: null
            },
            commentary: `🎉 MATCH OVER! ${match.result}`,
            matchSituation: {
              runs: match.currentScore.runs,
              wickets: match.currentScore.wickets,
              overs: match.currentScore.overs,
              balls: match.currentScore.balls,
              runRate: calculateRunRate(match.currentScore.runs, match.currentScore.overs, match.currentScore.balls),
              requiredRunRate: null
            },
            timestamp: new Date()
          };
          match.commentary.push(completionCommentary);
        }

        await match.save();
        return res.json(match);
      }
    }

    if (oversCompleted || allOut) {
      const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
      if (existingIndex !== -1) {
        match.inningsScores[existingIndex] = currentInningsScore;
      } else {
        match.inningsScores.push(currentInningsScore);
      }

      if (isFirstInnings) {
        match.currentScore = {
          team: match.currentScore.team === 0 ? 1 : 0,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          innings: 2
        };
        match.status = "Live";

        // Add innings break commentary - FIXED: Use valid eventType
        if (match.commentary) {
          const inningsBreakCommentary = {
            ballNumber: { over: 0, ball: 0 },
            batsman: { name: "Innings Break", runs: 0, balls: 0 },
            bowler: { name: "Innings Break", overs: 0, balls: 0 },
            event: { 
              eventType: 'dot', // Use valid enum value instead of 'innings_break'
              runs: 0, 
              isWicket: false,
              wicketType: null,
              extras: null
            },
            commentary: `🏏 END OF INNINGS! ${currentTeam.name} scored ${currentInningsScore.runs}/${currentInningsScore.wickets}. Target: ${currentInningsScore.runs + 1} runs.`,
            matchSituation: {
              runs: currentInningsScore.runs,
              wickets: currentInningsScore.wickets,
              overs: currentInningsScore.overs,
              balls: currentInningsScore.balls,
              runRate: calculateRunRate(currentInningsScore.runs, currentInningsScore.overs, currentInningsScore.balls),
              requiredRunRate: null
            },
            timestamp: new Date()
          };
          match.commentary.push(inningsBreakCommentary);
        }
      } else {
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

        // Add match completion commentary - FIXED: Use valid eventType
        if (match.commentary) {
          const completionCommentary = {
            ballNumber: { over: match.currentScore.overs, ball: match.currentScore.balls },
            batsman: { name: "Match Complete", runs: 0, balls: 0 },
            bowler: { name: "Match Complete", overs: 0, balls: 0 },
            event: { 
              eventType: 'wicket', // Use valid enum value instead of 'match_complete'
              runs: 0, 
              isWicket: false,
              wicketType: null,
              extras: null
            },
            commentary: `🎉 MATCH OVER! ${match.result}`,
            matchSituation: {
              runs: match.currentScore.runs,
              wickets: match.currentScore.wickets,
              overs: match.currentScore.overs,
              balls: match.currentScore.balls,
              runRate: calculateRunRate(match.currentScore.runs, match.currentScore.overs, match.currentScore.balls),
              requiredRunRate: null
            },
            timestamp: new Date()
          };
          match.commentary.push(completionCommentary);
        }
      }
    } else {
      const existingIndex = match.inningsScores.findIndex(s => s.innings === match.currentScore.innings);
      if (existingIndex !== -1) {
        match.inningsScores[existingIndex] = currentInningsScore;
      } else {
        match.inningsScores.push(currentInningsScore);
      }
    }

    await match.save();
    
    // Return match with commentary included
    res.json(match);

  } catch (err) {
    console.error("Ball update error:", err.message);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

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

// customMatchController.updateMatchResult = async(req,res) => {
//   const {matchId,winnerTeamName} = req.body;
//   try{
    
//     const match = await customMatch.findById(matchId);
//     if(!match){
//       return res.status(404).json({error:"Match not found"});
//     }
//     match.result = winnerTeamName,
//     match.status = "Completed",
//     await match.save();

//     //update teams stats --------
//     for(const team of match.teams){
//       const teamDoc = await Team.findOne({name: team.name})

//       teamDoc.matchesPlayed += 1;
//       if (team.name === winnerTeamName) {
//         teamDoc.wins += 1;
//         teamDoc.points += 2;
//       } else {
//         teamDoc.losses += 1;
//       }

//       await teamDoc.save();
//     }
//     res.status(200).json({ message: "Match finalized and team stats updated." });
//     }
//   catch(err){
//     return res.status(500).json("Internal Server error",err);
//   }
// }

// Fixed Custom Match Controller - updateMatchResult
customMatchController.updateMatchResult = async (req, res) => {
  try {
    const { matchId } = req.params; // Get from URL params
    const { winnerTeamName } = req.body;

    if (!matchId || !winnerTeamName) {
      return res.status(400).json({ error: "Match ID and winner team name are required" });
    }

    const match = await customMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Update match result
    match.result = `${winnerTeamName} won`;
    match.status = "Completed";
    await match.save();

    // Update team stats
    const updatePromises = match.teams.map(async (team) => {
      try {
        const teamDoc = await Team.findOne({ name: team.name });
        
        if (teamDoc) {
          teamDoc.matchesPlayed += 1;
          
          if (team.name === winnerTeamName) {
            teamDoc.wins += 1;
            teamDoc.points += 2; // 2 points for a win
          } else {
            teamDoc.losses += 1;
            // 0 points for a loss
          }
          
          await teamDoc.save();
          console.log(`Updated stats for ${team.name}`);
        } else {
          console.warn(`Team not found: ${team.name}`);
        }
      } catch (teamError) {
        console.error(`Error updating team ${team.name}:`, teamError);
      }
    });

    // Wait for all team updates to complete
    await Promise.all(updatePromises);

    res.status(200).json({ 
      message: "Match finalized and team stats updated successfully",
      match: match
    });
    
  } catch (err) {
    console.error('Error updating match result:', err);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  ...customMatchController,
  uploadMiddleware: upload
};
