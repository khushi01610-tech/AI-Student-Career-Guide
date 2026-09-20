import { Router } from "express";
import { getMentors, bookMentorSession } from "../controllers/mentorController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getMentors);
router.post("/:id/book", authenticateToken, bookMentorSession);

export default router;
