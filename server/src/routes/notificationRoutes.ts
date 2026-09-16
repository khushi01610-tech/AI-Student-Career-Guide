import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", authMiddleware, getNotifications);

// @route   PUT api/notifications/:id
// @desc    Mark specific notification as read
// @access  Private
router.put("/:id", authMiddleware, markAsRead);

// @route   PUT api/notifications
// @desc    Mark all user notifications as read
// @access  Private
router.put("/", authMiddleware, markAllAsRead);

export default router;
