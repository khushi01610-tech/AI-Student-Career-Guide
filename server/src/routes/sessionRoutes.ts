import express from "express";
import { getSessions, createSession, joinSession, leaveSession } from "../controllers/sessionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/collaboration/sessions
// @desc    Get upcoming peer sessions
// @access  Private
router.get("/sessions", authMiddleware, getSessions);

// @route   POST api/collaboration/sessions
// @desc    Create a new session
// @access  Private
router.post("/sessions", authMiddleware, createSession);

// @route   POST api/collaboration/sessions/:id/join
// @desc    Join a session
// @access  Private
router.post("/sessions/:id/join", authMiddleware, joinSession);

// @route   POST api/collaboration/sessions/:id/leave
// @desc    Leave a session
// @access  Private
router.post("/sessions/:id/leave", authMiddleware, leaveSession);

export default router;
