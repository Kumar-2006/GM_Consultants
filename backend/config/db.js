const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not defined. Set the Atlas connection string in your environment.",
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { host, name } = conn.connection;
    console.log(`MongoDB Connected: ${host}/${name}`);
    return conn;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
