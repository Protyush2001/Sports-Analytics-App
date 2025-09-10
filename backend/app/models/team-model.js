const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: String,
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    coach: String
});

const Team = mongoose.model('Team',teamSchema);
module.exports = Team;