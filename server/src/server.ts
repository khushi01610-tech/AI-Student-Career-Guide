import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { connectDB, getDBStatus } from "./config/db";
import { seedData } from "./config/seedData";

// Import Routes
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import communicationRoutes from "./routes/communicationRoutes";
import roadmapRoutes from "./routes/roadmapRoutes";
import postRoutes from "./routes/postRoutes";
import videoRoutes from "./routes/videoRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import notificationRoutes from "./routes/notificationRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
const uploadsDir = path.join(__dirname, "../../uploads");
app.use("/uploads", express.static(uploadsDir));

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/collaboration", sessionRoutes);
app.use("/api/notifications", notificationRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: "Healthy",
    time: new Date(),
    database: dbStatus
  });
});

// Startup Function
const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Seed Database with Realistic Demo Data
  await seedData();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📂 Resumes static path: ${uploadsDir}`);
  });
};

startServer().catch(err => {
  console.error("Failed to start backend server:", err);
});
