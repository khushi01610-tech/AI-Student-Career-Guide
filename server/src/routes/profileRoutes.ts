import express from "express";
import { getProfile, updateProfile, getDashboardData } from "../controllers/profileController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/profile/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get("/dashboard", authMiddleware, getDashboardData);

// @route   GET api/profile/:id?
// @desc    Get profile by user id (or current logged-in user if empty)
// @access  Private
router.get("/:id?", authMiddleware, getProfile);

// @route   PUT api/profile
// @desc    Update student profile details
// @access  Private
router.put("/", authMiddleware, updateProfile);

export default router;
