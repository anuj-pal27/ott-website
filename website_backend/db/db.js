const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1); // Exit process on database connection failure
    }
};

module.exports = connectDB;
