import { Router } from "express";
import { sendChatMessage } from "../controllers/chatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// @route   POST /api/chat
// @desc    Send question to CareerGuide AI coach
// @access  Private
router.post("/", authMiddleware, sendChatMessage);

export default router;
