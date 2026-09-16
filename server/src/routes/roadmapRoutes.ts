import express from "express";
import { getRoadmap, toggleSkill } from "../controllers/roadmapController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/roadmap
// @desc    Get roadmap for target career
// @access  Private
router.get("/", authMiddleware, getRoadmap);

// @route   POST api/roadmap/toggle
// @desc    Toggle skill completed status
// @access  Private
router.post("/toggle", authMiddleware, toggleSkill);

export default router;
