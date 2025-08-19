const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const customMatch = require('../models/customMatch-model'); // Adjust the path as necessary
const cors = require('cors');

const customMatchValidationSchema = require('../validations/customMatch-validation');

const customMatchController = {}

customMatchController.createMatches = async (req, res) => {
  try {
    const { error } = customMatchValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const match = new customMatch(req.body);
    await match.save();
    res.status(201).send(match);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}
module.exports = customMatchController;
