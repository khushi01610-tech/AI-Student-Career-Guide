import { Response } from "express";
import mongoose from "mongoose";
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
    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId || "");
    
    // 1. Get student's registered degree preference
    let user: any = null;
    if (checkFallback()) {
      user = fallbackDb.findById("users", userId!);
      if (!user) {
        user = fallbackDb.findOne("users", u => u.email === (req.userEmail || "khushi01610@gmail.com"));
      }
    } else {
      if (isValidObjectId) {
        user = await User.findById(userId);
      }
      if (!user) {
        user = await User.findOne({ email: req.userEmail || "khushi01610@gmail.com" });
      }
    }

    const preferredDegree = user?.degree || "CSE";

    // 2. Extract plain text from PDF using pdf-parse (supporting both v1 and v2 API)
    let extractedText = "";
    try {
      const pdfParsePkg = require("pdf-parse");
      if (pdfParsePkg && pdfParsePkg.PDFParse) {
        const parser = new pdfParsePkg.PDFParse({ data: fileBuffer });
        const resParsed = await parser.getText();
        extractedText = resParsed?.text || "";
        if (typeof parser.destroy === "function") {
          await parser.destroy();
        }
      } else if (typeof pdfParsePkg === "function") {
        const pdfData = await pdfParsePkg(fileBuffer);
        extractedText = pdfData.text || "";
      } else if (pdfParsePkg?.default && typeof pdfParsePkg.default === "function") {
        const pdfData = await pdfParsePkg.default(fileBuffer);
        extractedText = pdfData.text || "";
      }
    } catch (parseErr) {
      console.warn("pdf-parse encountered error, falling back to buffer decoding:", parseErr);
    }

    if (!extractedText) {
      extractedText = fileBuffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, " ");
    }

    // 3. Analyze resume text with deterministic rubric & domain matching
    const analysis = await aiService.analyzeResume(file.originalname, fileBuffer, extractedText, preferredDegree);

    // 4. Save file reference and analysis metrics
    const resumeUrl = `/uploads/${file.filename}`;
    const resumeFileName = file.originalname;
    
    let profile: any = null;
    const updates = {
      resumeUrl,
      resumeFileName,
      extractedResumeText: extractedText,
      rubricBreakdown: analysis,
      resumeScore: analysis.resumeScore,
      atsScore: analysis.atsScore,
      formatScore: analysis.formatScore,
      keywordScore: analysis.keywordScore,
      skillsScore: analysis.skillsScore,
      projectScore: analysis.projectScore
    };

    if (checkFallback()) {
      // JSON db
      profile = fallbackDb.findOne("profiles", p => p.user === userId || p.user === user?._id);

      if (profile) {
        profile = fallbackDb.findByIdAndUpdate("profiles", profile._id, updates);
      } else {
        profile = fallbackDb.insert("profiles", { user: user?._id || userId || "demo_student_id", ...updates });
      }

      // Sync skills to User record
      if (user) {
        const mergedSkills = Array.from(new Set([...(user.skills || []), ...(analysis.skills || [])]));
        user = fallbackDb.findByIdAndUpdate("users", user._id, { skills: mergedSkills });
      }
    } else {
      // MongoDB
      const userRef = user?._id || (isValidObjectId ? userId : undefined);
      if (userRef) {
        profile = await Profile.findOneAndUpdate(
          { user: userRef },
          { $set: updates },
          { new: true, upsert: true }
        );
      }

      // Sync skills to User record
      if (user) {
        const mergedSkills = Array.from(new Set([...(user.skills || []), ...(analysis.skills || [])]));
        user.skills = mergedSkills;
        await user.save();
      }
    }

    res.json({
      message: "Resume uploaded and analyzed successfully",
      resumeUrl,
      resumeFileName,
      analysis,
      extractedText,
      // Mirror top-level fields for universal frontend compatibility
      atsScore: analysis.atsScore,
      resumeScore: analysis.resumeScore,
      formatScore: analysis.formatScore,
      keywordScore: analysis.keywordScore,
      skillsScore: analysis.skillsScore,
      projectScore: analysis.projectScore,
      stream: analysis.stream,
      skills: analysis.skills
    });
  } catch (error: any) {
    console.error("Resume upload/analyze error:", error);
    res.status(500).json({ message: "Failed to upload and analyze resume", error: error.message });
  }
};
