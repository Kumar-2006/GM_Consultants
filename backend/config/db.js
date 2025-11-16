const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is not defined. Provide the Atlas connection string in your environment.",
    );
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    cachedConnection = conn;
    const { host, name } = conn.connection;
    console.log(`[DB] MongoDB connected: ${host}/${name}`);
    return conn;
  } catch (error) {
    console.error("[DB] Database connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
