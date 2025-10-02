const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/iwingmobile",
      {
        // Remove deprecated options as they're now defaults in Mongoose 6+
      }
    );

    console.log(`📄 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("📄 MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("📄 MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

module.exports = connectDB;
