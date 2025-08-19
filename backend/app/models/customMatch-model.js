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
    balls: { type: Number, default: 0 }
  },
  status: { type: String, default: "Upcoming" }, // Live, Completed, etc.
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin / team owner
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const CustomMatch = mongoose.model("CustomMatch", customMatchSchema);
module.exports = CustomMatch;
