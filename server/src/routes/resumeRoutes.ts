import express from "express";
import { uploadAndAnalyzeResume } from "../controllers/resumeController";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = express.Router();

// @route   POST api/resume/analyze
// @desc    Upload a PDF resume and trigger AI parsing
// @access  Private
router.post("/analyze", authMiddleware, upload.single("resume"), uploadAndAnalyzeResume);

export default router;
