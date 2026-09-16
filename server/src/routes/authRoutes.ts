import express from "express";
import { register, login, getMe } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a student user
// @access  Public
router.post("/register", register);

// @route   POST api/auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post("/login", login);

// @route   GET api/auth/me
// @desc    Get current user details
// @access  Private
router.get("/me", authMiddleware, getMe);

export default router;
