import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "ai_career_guide_secret_token_123456";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, college, course, branch, graduationYear, skills, careerGoal } = req.body;

  try {
    if (!name || !email || !password || !college || !course || !branch || !graduationYear) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user exists
    let existingUser = null;
    if (checkFallback()) {
      existingUser = fallbackDb.findOne("users", u => u.email === emailLower);
    } else {
      existingUser = await User.findOne({ email: emailLower });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let savedUser: any = null;
    const skillsArray = typeof skills === "string" ? skills.split(",").map((s: string) => s.trim()) : skills || [];

    if (checkFallback()) {
      // JSON File Fallback
      savedUser = fallbackDb.insert("users", {
        name,
        email: emailLower,
        password: hashedPassword,
        college,
        course,
        branch,
        graduationYear: Number(graduationYear),
        skills: skillsArray,
        careerGoal: careerGoal || ""
      });

      // Create a profile in fallback
      fallbackDb.insert("profiles", {
        user: savedUser._id,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        bio: `Student at ${college}`,
        projects: [],
        achievements: [],
        resumeScore: 0,
        interviewScore: 0,
        communicationScore: 0,
        skillsCompleted: 0,
        mockInterviewsCompleted: 0,
        communityContributions: 0
      });
    } else {
      // MongoDB
      const newUser = new User({
        name,
        email: emailLower,
        password: hashedPassword,
        college,
        course,
        branch,
        graduationYear: Number(graduationYear),
        skills: skillsArray,
        careerGoal: careerGoal || ""
      });
      savedUser = await newUser.save();

      // Create a profile
      const newProfile = new Profile({
        user: savedUser._id,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        bio: `Student at ${college}`,
        projects: [],
        achievements: [],
        resumeScore: 0,
        interviewScore: 0,
        communicationScore: 0,
        skillsCompleted: 0,
        mockInterviewsCompleted: 0,
        communityContributions: 0
      });
      await newProfile.save();
    }

    // Sign JWT
    const token = jwt.sign({ userId: savedUser._id, email: savedUser.email }, JWT_SECRET, {
      expiresIn: "24h"
    });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        college: savedUser.college,
        course: savedUser.course,
        branch: savedUser.branch,
        graduationYear: savedUser.graduationYear,
        skills: savedUser.skills,
        careerGoal: savedUser.careerGoal
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const emailLower = email.toLowerCase().trim();

    // Check user
    let user: any = null;
    if (checkFallback()) {
      user = fallbackDb.findOne("users", u => u.email === emailLower);
    } else {
      user = await User.findOne({ email: emailLower });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Sign JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h"
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills,
        careerGoal: user.careerGoal
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;

    let user: any = null;
    let profile: any = null;

    if (checkFallback()) {
      user = fallbackDb.findById("users", userId!);
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
    } else {
      user = await User.findById(userId).select("-password");
      profile = await Profile.findOne({ user: userId });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills,
        careerGoal: user.careerGoal
      },
      profile
    });
  } catch (error: any) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
