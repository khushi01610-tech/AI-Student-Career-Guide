import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isFallbackMode = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-student-career-guide";
  
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Timeout fast so we can switch to fallback mode
    });
    console.log("🚀 MongoDB connected successfully!");
    isFallbackMode = false;
  } catch (error: any) {
    console.warn("⚠️ MongoDB connection failed. Switching to Local JSON File Fallback Mode!");
    console.warn(`Reason: ${error.message}`);
    isFallbackMode = true;
  }
};

export const getDBStatus = () => {
  return {
    isFallbackMode,
    connectionState: isFallbackMode ? "FALLBACK_JSON" : mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED"
  };
};

export const checkFallback = () => isFallbackMode;
