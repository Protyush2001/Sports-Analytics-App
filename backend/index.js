const express = require('express');
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./app/models/user-model');
const Match = require('./app/models/match-model');
const matchRoutes = require('./app/routes/matchRoutes.js'); 
const cors = require('cors');
const connectDB = require('./config/db.js'); 
const authenticateUser = require('./app/middlewares/authenticateUser')
const app = express();
const port = 3026;
const userController = require('./app/controllers/user-controller'); 
const matchController = require('./app/controllers/match-controller');
const customMatchController = require('./app/controllers/customMatch-controller');
app.use(express.json());
app.use(cors());

connectDB();

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// },{ timestamps: true });

// const User = mongoose.model('User', userSchema);

app.post('/register', userController.register);
app.post('/login',userController.login);
app.post('/matches', customMatchController.createMatches);

app.use('/api/matches', matchRoutes);

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})
