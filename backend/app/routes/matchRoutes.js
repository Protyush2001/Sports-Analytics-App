// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match-controller");

router.get("/", matchController.getMatches);

module.exports = router;