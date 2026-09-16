import express from "express";
import { getVideos, createVideo, likeVideo, viewVideo } from "../controllers/videoController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/videos
// @desc    Get career tips videos
// @access  Private
router.get("/", authMiddleware, getVideos);

// @route   POST api/videos
// @desc    Post a video description
// @access  Private
router.post("/", authMiddleware, createVideo);

// @route   POST api/videos/:id/like
// @desc    Like/Unlike video
// @access  Private
router.post("/:id/like", authMiddleware, likeVideo);

// @route   POST api/videos/:id/view
// @desc    Increment video views
// @access  Private
router.post("/:id/view", authMiddleware, viewVideo);

export default router;
