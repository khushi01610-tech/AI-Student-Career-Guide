import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { InterviewAttempt } from "../models/InterviewAttempt";
import { Profile } from "../models/Profile";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";
import { aiService } from "../services/aiService";

export const generateQuestions = async (req: AuthenticatedRequest, res: Response) => {
  const { role, difficulty, type } = req.body;

  try {
    const jobRole = role || "Software Developer";
    const expLevel = difficulty || "Entry Level";
    const qType = type || "Technical";

    const interviewData = await aiService.generateInterviewQuestions(jobRole, expLevel, qType);
    res.json(interviewData);
  } catch (error: any) {
    console.error("Generate questions error:", error);
    res.status(500).json({ message: "Failed to generate interview questions", error: error.message });
  }
};

export const evaluateSingleAnswer = async (req: AuthenticatedRequest, res: Response) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: "Please provide both question and student answer" });
  }

  try {
    const evaluation = await aiService.evaluateInterviewAnswer(question, answer);
    res.json(evaluation);
  } catch (error: any) {
    console.error("Evaluate answer error:", error);
    res.status(500).json({ message: "Failed to evaluate answer", error: error.message });
  }
};

export const saveAttempt = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { role, type, difficulty, questions, overallScore } = req.body;

  try {
    if (!role || !questions || overallScore === undefined) {
      return res.status(400).json({ message: "Missing required fields for saving attempt" });
    }

    let savedAttempt: any = null;

    if (checkFallback()) {
      // Save in fallback db
      savedAttempt = fallbackDb.insert("interviewAttempts", {
        user: userId,
        role,
        type,
        difficulty,
        questions,
        overallScore
      });

      // Update mock completion count and score
      let profile = fallbackDb.findOne("profiles", p => p.user === userId);
      if (profile) {
        const completed = (profile.mockInterviewsCompleted || 0) + 1;
        const currentAvg = profile.interviewScore || 0;
        const newAvg = Math.round((currentAvg * (completed - 1) + overallScore) / completed);
        
        fallbackDb.findByIdAndUpdate("profiles", profile._id, {
          mockInterviewsCompleted: completed,
          interviewScore: newAvg
        });
      }
    } else {
      // Save in MongoDB
      const attempt = new InterviewAttempt({
        user: userId,
        role,
        type,
        difficulty,
        questions,
        overallScore
      });
      savedAttempt = await attempt.save();

      // Update profile
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        const completed = (profile.mockInterviewsCompleted || 0) + 1;
        const currentAvg = profile.interviewScore || 0;
        const newAvg = Math.round((currentAvg * (completed - 1) + overallScore) / completed);
        
        profile.mockInterviewsCompleted = completed;
        profile.interviewScore = newAvg;
        await profile.save();
      }
    }

    res.status(201).json(savedAttempt);
  } catch (error: any) {
    console.error("Save attempt error:", error);
    res.status(500).json({ message: "Failed to save interview attempt", error: error.message });
  }
};

export const getAttempts = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    let attempts: any[] = [];

    if (checkFallback()) {
      attempts = fallbackDb.find("interviewAttempts", a => a.user === userId);
    } else {
      attempts = await InterviewAttempt.find({ user: userId }).sort({ createdAt: -1 });
    }

    res.json(attempts);
  } catch (error: any) {
    console.error("Fetch attempts error:", error);
    res.status(500).json({ message: "Failed to fetch interview history", error: error.message });
  }
};
