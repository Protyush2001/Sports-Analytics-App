const teamOwnerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamName: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }]
}, { timestamps: true });

const TeamOwner = mongoose.model("TeamOwner", teamOwnerSchema);
module.exports = TeamOwner;
