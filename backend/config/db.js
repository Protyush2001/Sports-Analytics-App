const mongoose = require('mongoose');
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/myapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected to:",mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

module.exports = connectDB;