import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";
import { aiService } from "../services/aiService";
import fs from "fs";

export const uploadAndAnalyzeResume = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Please upload a resume PDF file" });
  }

  try {
    const fileBuffer = fs.readFileSync(file.path);
    const analysis = await aiService.analyzeResume(file.originalname, fileBuffer);

    // Save file reference and analysis metrics
    const resumeUrl = `/uploads/${file.filename}`;
    
    let profile: any = null;
    let user: any = null;

    if (checkFallback()) {
      // JSON db
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
      if (profile) {
        profile = fallbackDb.findByIdAndUpdate("profiles", profile._id, {
          resumeUrl,
          resumeScore: analysis.resumeScore,
          atsScore: analysis.atsScore,
          formatScore: analysis.formatScore,
          keywordScore: analysis.keywordScore,
          skillsScore: analysis.skillsScore,
          projectScore: analysis.projectScore
        });
      }

      // Sync skills to User record
      user = fallbackDb.findById("users", userId!);
      if (user) {
        const mergedSkills = Array.from(new Set([...(user.skills || []), ...(analysis.skills || [])]));
        user = fallbackDb.findByIdAndUpdate("users", userId!, { skills: mergedSkills });
      }
    } else {
      // MongoDB
      profile = await Profile.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            resumeUrl,
            resumeScore: analysis.resumeScore,
            atsScore: analysis.atsScore,
            formatScore: analysis.formatScore,
            keywordScore: analysis.keywordScore,
            skillsScore: analysis.skillsScore,
            projectScore: analysis.projectScore
          }
        },
        { new: true, upsert: true }
      );

      // Sync skills to User record
      user = await User.findById(userId);
      if (user) {
        const mergedSkills = Array.from(new Set([...(user.skills || []), ...(analysis.skills || [])]));
        user.skills = mergedSkills;
        await user.save();
      }
    }

    res.json({
      message: "Resume uploaded and analyzed successfully",
      resumeUrl,
      analysis
    });
  } catch (error: any) {
    console.error("Resume upload/analyze error:", error);
    res.status(500).json({ message: "Failed to upload and analyze resume", error: error.message });
  }
};
