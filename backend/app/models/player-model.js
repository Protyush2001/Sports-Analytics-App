


const mongoose = require("mongoose");
const { type } = require("../validations/customMatch-validation");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String, // e.g., Batsman, Bowler, All-Rounder, Wicket-Keeper
      required: true,
    },
    battingStyle: {
      type: String, // Right-hand, Left-hand
    },
    bowlingStyle: {
      type: String, // Right-arm, Left-arm
    },
    image: {
      type: String,
      default:"https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", // base64 string or URL
      required: true,
      validate: {
        validator: (v) =>
          typeof v === "string" &&
          (v.startsWith("data:image") || v.startsWith("http")),
        message: "Image must be a valid base64 string or URL",
      },
      // createdBy:{
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "User",
      //   required: true
      // }
    },
          createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      teamId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Team",
  default: null,
},


    matches: {
      type: Number,
      default: 0,
    },
    average:{
        type: Number,
        default: 0,
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;


///////////////////////////////////////////////////////////////////

// const mongoose = require("mongoose");
// const playerSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       required: true,
//     },
//     battingStyle: {
//       type: String,
//     },
//     bowlingStyle: {
//       type: String,
//     },
//     image: {
//       type: String,
//       default: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
//       required: true,
//       validate: {
//         validator: (v) =>
//           typeof v === "string" &&
//           (v.startsWith("data:image") || v.startsWith("http")),
//         message: "Image must be a valid base64 string or URL",
//       },
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     teamId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Team",
//       default: null,
//     },
    
//     // Aggregate stats (keep existing)
//     matches: {
//       type: Number,
//       default: 0,
//     },
//     average: {
//       type: Number,
//       default: 0,
//     },
//     runs: {
//       type: Number,
//       default: 0,
//     },
//     wickets: {
//       type: Number,
//       default: 0,
//     },
    
//     // ADD MATCH-BY-MATCH PERFORMANCE TRACKING
//     matchPerformances: [{
//       matchId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'CustomMatch',
//         required: true
//       },
//       matchTitle: String,
//       matchDate: Date,
//       opponent: String,
//       result: {
//         type: String,
//         enum: ['won', 'lost', 'draw', 'no_result'],
//         default: null
//       },
      
//       // Batting performance for this match
//       batting: {
//         runs: { type: Number, default: 0 },
//         balls: { type: Number, default: 0 },
//         fours: { type: Number, default: 0 },
//         sixes: { type: Number, default: 0 },
//         strikeRate: { type: Number, default: 0 },
//         isOut: { type: Boolean, default: false },
//         dismissalType: {
//           type: String,
//           enum: ['bowled', 'caught', 'lbw', 'runout', 'stumped', 'hitwicket', 'not_out', null],
//           default: null
//         }
//       },
      
//       // Bowling performance for this match
//       bowling: {
//         overs: { type: Number, default: 0 },
//         maidens: { type: Number, default: 0 },
//         runs: { type: Number, default: 0 },
//         wickets: { type: Number, default: 0 },
//         economy: { type: Number, default: 0 },
//         wides: { type: Number, default: 0 },
//         noBalls: { type: Number, default: 0 }
//       },
      
//       // Fielding performance for this match
//       fielding: {
//         catches: { type: Number, default: 0 },
//         runOuts: { type: Number, default: 0 },
//         stumpings: { type: Number, default: 0 }
//       },
      
//       // Player's team in this match
//       playingFor: String,
      
//       timestamp: { type: Date, default: Date.now }
//     }],
    
//     // ADDITIONAL AGGREGATE STATS FOR BETTER ANALYTICS
//     highestScore: {
//       runs: { type: Number, default: 0 },
//       matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomMatch' }
//     },
//     bestBowling: {
//       wickets: { type: Number, default: 0 },
//       runs: { type: Number, default: 0 },
//       matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomMatch' }
//     },
//     totalFours: { type: Number, default: 0 },
//     totalSixes: { type: Number, default: 0 },
//     totalCatches: { type: Number, default: 0 },
//     totalRunOuts: { type: Number, default: 0 }
//   },
//   { timestamps: true }
// );

// // Index for better performance
// playerSchema.index({ 'matchPerformances.matchId': 1 });
// playerSchema.index({ 'matchPerformances.matchDate': -1 });