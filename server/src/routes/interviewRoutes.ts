import express from "express";
import { generateQuestions, evaluateSingleAnswer, saveAttempt, getAttempts } from "../controllers/interviewController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   POST api/interview/generate
// @desc    Generate a set of interview questions
// @access  Private
router.post("/generate", authMiddleware, generateQuestions);

// @route   POST api/interview/evaluate
// @desc    Evaluate a single mock interview response
// @access  Private
router.post("/evaluate", authMiddleware, evaluateSingleAnswer);

// @route   POST api/interview/attempt
// @desc    Save a completed mock interview attempt
// @access  Private
router.post("/attempt", authMiddleware, saveAttempt);

// @route   GET api/interview/history
// @desc    Get all past interview attempts
// @access  Private
router.get("/history", authMiddleware, getAttempts);

export default router;
