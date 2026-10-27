import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { aiService } from "../services/aiService";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const sendChatMessage = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { message, history, profile: profileData } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message content is required" });
  }

  try {
    let studentProfile = profileData;

    // If profile was not passed from client, look up user context
    if (!studentProfile && userId) {
      if (checkFallback()) {
        const u = fallbackDb.findById("users", userId);
        const p = fallbackDb.findOne("profiles", (item: any) => item.user === userId);
        studentProfile = {
          college: u?.college,
          course: u?.course,
          branch: u?.branch,
          skills: u?.skills || [],
          careerGoal: u?.careerGoal
        };
      } else {
        const u = await User.findById(userId);
        const p = await Profile.findOne({ user: userId });
        studentProfile = {
          college: u?.college,
          course: u?.course,
          branch: u?.branch,
          skills: u?.skills || [],
          careerGoal: u?.careerGoal
        };
      }
    }

    const reply = await aiService.generateCareerAdvice(
      message,
      Array.isArray(history) ? history : [],
      studentProfile
    );

    res.json({ reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      message: "Failed to generate AI career advice",
      error: error.message
    });
  }
};
