// models/UserMatch.js
// const mongoose = require('mongoose');

// const customMatchSchema = new mongoose.Schema({
//   title: { type: String, required: true }, // match name
//   teams: [
//     {
//       name: { type: String, required: true },
//       players: [{ type: String }] // optional player names
//     }
//   ],
//   overs: { type: Number, default: 20 }, // T20 default, can be changed
//   currentScore: {
//     team: String,
//     runs: { type: Number, default: 0 },
//     wickets: { type: Number, default: 0 },
//     overs: { type: Number, default: 0 },
//     balls: { type: Number, default: 0 },
//     team: { type: Number, default: 0 }, // 0 or 1
//     innings: { type: Number, default: 1 }
//   },
//   inningsScores: [
//   {
//     team: Number,
//     runs: Number,
//     wickets: Number,
//     overs: Number,
//     balls: Number
//   }
// ],

//     stream: {
//     isLive: { type: Boolean, default: false },
//     roomId: { type: String, default: null },   // use match _id
//     startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//     startedAt: { type: Date, default: null },
//   },
//   status: { type: String, default: "Upcoming" }, // Live, Completed, etc.
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin / team owner
//   date: { type: Date, default: Date.now }
// }, { timestamps: true });

// const CustomMatch = mongoose.model("CustomMatch", customMatchSchema);
// module.exports = CustomMatch;

///////////////////////////////////////////////////////////////////////////////////

// const mongoose = require('mongoose');

// const customMatchSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   teams: [
//     {
//       name: { type: String, required: true },
//       players: [{ type: String }] // player names or IDs
//     }
//   ],
//   overs: { type: Number, default: 20 },
//   currentScore: {
//     runs: { type: Number, default: 0 },
//     wickets: { type: Number, default: 0 },
//     overs: { type: Number, default: 0 },
//     balls: { type: Number, default: 0 },
//     team: { type: Number, default: 0 }, // 0 or 1 (removed duplicate)
//     innings: { type: Number, default: 1 }
//   },
//   inningsScores: [
//     {
//       team: { type: Number, required: true },
//       runs: { type: Number, required: true },
//       wickets: { type: Number, required: true },
//       overs: { type: Number, required: true },
//       balls: { type: Number, required: true },
//       innings: { type: Number, required: true }
//     }
//   ],
//   stream: {
//     isLive: { type: Boolean, default: false },
//     roomId: { type: String, default: null },
//     startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//     startedAt: { type: Date, default: null },
//   },
//   status: { type: String, default: "Upcoming" }, // Upcoming, Live, Completed
//   result: { type: String, default: null }, // Final match result
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   date: { type: Date, default: Date.now }
// }, { timestamps: true });

// const CustomMatch = mongoose.model("CustomMatch", customMatchSchema);
// module.exports = CustomMatch;

// models/customMatch-model.js (Updated with AI features)
const mongoose = require('mongoose');

const commentarySchema = new mongoose.Schema({
  commentary: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ballNumber: { type: String, required: true },
  ballData: {
    runs: Number,
    isWicket: Boolean,
    striker: { name: String, id: String },
    bowler: { name: String, id: String },
    extras: String
  }
});

const predictionSchema = new mongoose.Schema({
  type: { type: String, enum: ['player', 'match', 'momentum'], required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, min: 0, max: 100 },
  timestamp: { type: Date, default: Date.now },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  winProbability: {
    team1: { type: Number, min: 0, max: 100 },
    team2: { type: Number, min: 0, max: 100 }
  }
});

const customMatchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teams: [
    {
      name: { type: String, required: true },
      players: [{ type: String }]
    }
  ],
  overs: { type: Number, default: 20 },
  currentScore: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    team: { type: Number, default: 0 },
    innings: { type: Number, default: 1 }
  },
  inningsScores: [
    {
      team: { type: Number, required: true },
      runs: { type: Number, required: true },
      wickets: { type: Number, required: true },
      overs: { type: Number, required: true },
      balls: { type: Number, required: true },
      innings: { type: Number, required: true }
    }
  ],
  
  // AI Commentary Features
  commentary: [commentarySchema],
  predictions: [predictionSchema],
  aiInsights: {
    momentum: {
      status: { type: String, enum: ['Strong Positive', 'Positive', 'Neutral', 'Negative', 'Strong Negative'] },
      recentRunRate: Number,
      requiredRunRate: Number,
      lastUpdated: { type: Date, default: Date.now }
    },
    keyPlayers: {
      keyBatsman: String,
      keyBowler: String,
      impact: String,
      lastUpdated: { type: Date, default: Date.now }
    },
    winProbability: {
      team1: { type: Number, min: 0, max: 100, default: 50 },
      team2: { type: Number, min: 0, max: 100, default: 50 },
      lastUpdated: { type: Date, default: Date.now }
    }
  },
  
  stream: {
    isLive: { type: Boolean, default: false },
    roomId: { type: String, default: null },
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    startedAt: { type: Date, default: null },
  },
    pastStreams: [
    {
      roomId: String,
      startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startedAt: Date,
      endedAt: Date,
      recordingUrl: String
    }
  ],
  status: { type: String, default: "Upcoming" },
  result: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  
  // AI Settings
  aiEnabled: { type: Boolean, default: true },
  commentaryFrequency: { type: String, enum: ['every_ball', 'key_moments', 'overs'], default: 'every_ball' }
  
}, { timestamps: true });

// Index for performance
customMatchSchema.index({ status: 1, createdBy: 1 });
customMatchSchema.index({ 'commentary.timestamp': -1 });
customMatchSchema.index({ 'predictions.timestamp': -1 });

const CustomMatch = mongoose.model("CustomMatch", customMatchSchema);
module.exports = CustomMatch;