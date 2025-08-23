// models/UserMatch.js
const mongoose = require('mongoose');

const customMatchSchema = new mongoose.Schema({
  title: { type: String, required: true }, // match name
  teams: [
    {
      name: { type: String, required: true },
      players: [{ type: String }] // optional player names
    }
  ],
  overs: { type: Number, default: 20 }, // T20 default, can be changed
  currentScore: {
    team: String,
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    team: { type: Number, default: 0 }, // 0 or 1
    innings: { type: Number, default: 1 }
  },
    stream: {
    isLive: { type: Boolean, default: false },
    roomId: { type: String, default: null },   // use match _id
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    startedAt: { type: Date, default: null },
  },
  status: { type: String, default: "Upcoming" }, // Live, Completed, etc.
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin / team owner
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const CustomMatch = mongoose.model("CustomMatch", customMatchSchema);
module.exports = CustomMatch;
