const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const customMatch = require('../models/customMatch-model'); // Adjust the path as necessary
const cors = require('cors');

const customMatchValidationSchema = require('../validations/customMatch-validation');

const customMatchController = {}

// customMatchController.createMatches = async (req, res) => {
//   try {
//     const { error } = customMatchValidationSchema.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const match = new customMatch(req.body);
//     await match.save();
//     res.status(201).send(match);
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// }

customMatchController.createMatches = async (req, res) => {
  try {
    const { error } = customMatchValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const match = new customMatch({ ...req.body, createdBy: req.user._id });
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    console.error("Error creating match:", err.message); // log actual error
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// customMatchController.createMatches = async (req, res) => {
//   try {
//     // Validate request body with Joi
//     const { error } = customMatchValidationSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ msg: error.details[0].message });
//     }

//     // Include createdBy field from the logged-in user (token)
//     const matchData = {
//       ...req.body,
//       createdBy: req.userId // ✅ comes from auth middleware
//     };

//     // Create and save the custom match
//     const match = new customMatch(matchData);
//     await match.save();

//     res.status(201).json({
//       msg: "Match created successfully",
//       match
//     });
//   } catch (err) {
//     console.error("Error creating match:", err.message);
//     res.status(500).json({
//       msg: "Internal Server Error",
//       error: err.message
//     });
//   }
// };



// customMatchController.updateBall =  async (req, res) => {
//   try {
//     const { id } = req.params; // match ID
//     const { runs, isWicket } = req.body;

//     let match = await customMatch.findById(id);
//     if (!match) return res.status(404).json({ msg: "Match not found" });

//     // Update score
//     match.currentScore.runs += runs;
//     // fix the wickets as per number of players in the team suppose there is 10 wickets available so when the wicket reaches 10 then wicket should not be updated and the next team batting score should be displayed from scratch so that we can update 0/0.
//     // if (match.currentScore.wickets < match.teams[match.currentScore.team].players.length) {
//     //   if (isWicket) match.currentScore.wickets += 1;
//     // }

    
// // Total wickets possible = players.length - 1
// const maxWickets = match.teams[match.currentScore.team].players.length - 1;

// // Handle wicket update
// if (isWicket) {
//   if (match.currentScore.wickets < maxWickets) {
//     match.currentScore.wickets += 1;
//   } else {
//     // Innings over -> switch to next team
//     match.currentScore.team = (match.currentScore.team + 1) % match.teams.length;
//     match.currentScore.runs = 0;
//     match.currentScore.wickets = 0;
//     match.currentScore.overs = 0; // optional: reset overs for new innings
//   }
// }

//     // Ball counting
//     match.currentScore.balls += 1;
//     if (match.currentScore.balls === 6) {
//       match.currentScore.overs += 1;
//       match.currentScore.balls = 0;
//     }

//     // Save
//     await match.save();
//     res.json(match);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

customMatchController.updateBall = async (req, res) => {
  try {
    const { id } = req.params; // match ID
    const { runs, isWicket } = req.body;

    let match = await customMatch.findById(id);
    if (!match) return res.status(404).json({ msg: "Match not found" });

    // Ensure teams exist
    if (!match.teams || match.teams.length === 0) {
      return res.status(400).json({ msg: "Teams are not set for this match" });
    }

    // Ensure currentScore.team is valid
    if (match.currentScore.team >= match.teams.length) {
      match.currentScore.team = 0;
    }

    // Update score
    if (runs && Number.isInteger(runs)) {
      match.currentScore.runs += runs;
    }

    // Total wickets possible = players.length - 1
    const currentTeam = match.teams[match.currentScore.team];
    const maxWickets = currentTeam?.players?.length
      ? currentTeam.players.length - 1
      : 10; // default 10 wickets if no players list

    // Handle wicket
    if (isWicket) {
      if (match.currentScore.wickets < maxWickets) {
        match.currentScore.wickets += 1;
      } else {
        // All out => switch innings
        if (match.currentScore.team + 1 < match.teams.length) {
          match.currentScore.team += 1;
          match.currentScore.runs = 0;
          match.currentScore.wickets = 0;
          match.currentScore.overs = 0;
          match.currentScore.balls = 0;
        } else {
          return res.json({ msg: "Match completed", match });
        }
      }
    }

    // Ball counting
    match.currentScore.balls += 1;
    if (match.currentScore.balls === 6) {
      match.currentScore.overs += 1;
      match.currentScore.balls = 0;
    }

    // Save
    await match.save();
    res.json(match);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


module.exports = customMatchController;
