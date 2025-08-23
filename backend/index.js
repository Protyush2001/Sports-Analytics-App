const express = require('express');
// require("dotenv").config();
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./app/models/user-model');
const Match = require('./app/models/match-model');
const matchRoutes = require('./app/routes/matchRoutes.js'); 
const cors = require('cors');
const authorizeRoles = require("./app/middlewares/checkRole");
const connectDB = require('./config/db.js'); 
const authenticateUser = require('./app/middlewares/authenticateUser')
const app = express();
const port = 3026;
const userController = require('./app/controllers/user-controller'); 
const matchController = require('./app/controllers/match-controller');
const customMatchController = require('./app/controllers/customMatch-controller');
const playerRoutes = require('./app/routes/playerRoutes');
const matchStreamRoutes = require('./app/routes/matchStreamRoutes');
connectDB();
app.use(express.json());
app.use(cors());



// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// },{ timestamps: true });

// const User = mongoose.model('User', userSchema);

app.post('/register', userController.register);
app.post('/login',userController.login);
app.post('/matches',authenticateUser, customMatchController.createMatches);
app.patch('/matches/:id/ball',customMatchController.updateBall);

app.use('/api/players', playerRoutes);
app.use('/uploads', express.static( 'uploads'));

app.use('/api/matches', matchRoutes);
app.use('/api/matches', matchStreamRoutes);

// only players, team owners, admins can access
app.get("/players", authenticateUser, authorizeRoles("player", "teamOwner", "admin"), (req, res) => {
    res.send("Welcome to Players page 🚀");
});

// only admin can access
app.get("/admin", authenticateUser, authorizeRoles("admin"), (req, res) => {
    res.send("Admin dashboard");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
