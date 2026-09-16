import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Session } from "../models/Session";
import { Post } from "../models/Post";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

// Calculate Career Readiness Score dynamically
export const calculateReadinessScore = (profile: any, userSkillsCount: number) => {
  const resume = profile.resumeScore || 0;
  const interview = profile.interviewScore || 0;
  const communication = profile.communicationScore || 0;
  const skillsComp = Math.min(100, (profile.skillsCompleted || 0) * 10);
  const interviewsComp = Math.min(100, (profile.mockInterviewsCompleted || 0) * 20);

  // Weighted formula: Resume (30%), Interview Prep (30%), Comms (20%), Roadmap Skills (10%), Mock Completed (10%)
  const score = Math.round(
    resume * 0.3 + 
    interview * 0.3 + 
    communication * 0.2 + 
    skillsComp * 0.1 + 
    interviewsComp * 0.1
  );

  // If score is 0 and they haven't uploaded anything, default to 35% basic registration readiness, capped at 100%
  return Math.max(25, Math.min(100, score || Math.min(60, userSkillsCount * 8 + 20)));
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = id || req.userId;

  try {
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

    if (!profile) {
      // Create profile if missing
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
      if (checkFallback()) {
        profile = fallbackDb.insert("profiles", {
          user: userId,
          avatarUrl,
          bio: `Student at ${user.college}`,
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
        const newProfile = new Profile({
          user: userId,
          avatarUrl,
          bio: `Student at ${user.college}`,
          projects: [],
          achievements: [],
          resumeScore: 0,
          interviewScore: 0,
          communicationScore: 0,
          skillsCompleted: 0,
          mockInterviewsCompleted: 0,
          communityContributions: 0
        });
        profile = await newProfile.save();
      }
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
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Server error fetching profile", error: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { bio, projects, achievements, avatarUrl, skills, careerGoal } = req.body;

  try {
    let user: any = null;
    let profile: any = null;

    // 1. Update user credentials (skills, careerGoal) if provided
    const userUpdates: any = {};
    if (skills !== undefined) userUpdates.skills = Array.isArray(skills) ? skills : typeof skills === "string" ? skills.split(",").map((s: string) => s.trim()) : [];
    if (careerGoal !== undefined) userUpdates.careerGoal = careerGoal;

    if (checkFallback()) {
      user = fallbackDb.findByIdAndUpdate("users", userId!, userUpdates);
      
      const profileUpdates: any = {};
      if (bio !== undefined) profileUpdates.bio = bio;
      if (projects !== undefined) profileUpdates.projects = projects;
      if (achievements !== undefined) profileUpdates.achievements = achievements;
      if (avatarUrl !== undefined) profileUpdates.avatarUrl = avatarUrl;
      
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
      if (profile) {
        profile = fallbackDb.findByIdAndUpdate("profiles", profile._id, profileUpdates);
      }
    } else {
      if (Object.keys(userUpdates).length > 0) {
        user = await User.findByIdAndUpdate(userId, { $set: userUpdates }, { new: true });
      } else {
        user = await User.findById(userId);
      }

      const profileUpdates: any = {};
      if (bio !== undefined) profileUpdates.bio = bio;
      if (projects !== undefined) profileUpdates.projects = projects;
      if (achievements !== undefined) profileUpdates.achievements = achievements;
      if (avatarUrl !== undefined) profileUpdates.avatarUrl = avatarUrl;

      profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: profileUpdates },
        { new: true, upsert: true }
      );
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
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error updating profile", error: error.message });
  }
};

export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    let user: any = null;
    let profile: any = null;
    let upcomingSessions: any[] = [];
    let recentPosts: any[] = [];

    if (checkFallback()) {
      user = fallbackDb.findById("users", userId!);
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
      
      const nowStr = new Date().toISOString();
      upcomingSessions = fallbackDb.find("sessions", s => 
        s.status === "upcoming" && 
        (s.creator === userId || s.participants.includes(userId!))
      );
      
      recentPosts = fallbackDb.getCollection("posts").slice(-4).reverse();
    } else {
      user = await User.findById(userId);
      profile = await Profile.findOne({ user: userId });
      upcomingSessions = await Session.find({
        status: "upcoming",
        $or: [{ creator: userId }, { participants: userId }]
      }).limit(5);
      
      recentPosts = await Post.find().sort({ createdAt: -1 }).limit(4);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!profile) {
      // default mock profile
      profile = {
        resumeScore: 0,
        atsScore: 0,
        interviewScore: 0,
        communicationScore: 0,
        skillsCompleted: 0,
        mockInterviewsCompleted: 0,
        communityContributions: 0,
        projects: [],
        achievements: []
      };
    }

    const readinessScore = calculateReadinessScore(profile, user.skills?.length || 0);

    // Formulate suggestions
    const suggestions: string[] = [];
    if (!profile.resumeUrl) {
      suggestions.push("Upload your resume to perform AI Resume Scan.");
    } else if ((profile.resumeScore || 0) < 75) {
      suggestions.push("Add measurable achievements and missing technical keywords to improve ATS score.");
    }
    if ((profile.skillsCompleted || 0) < 5) {
      suggestions.push("Mark completed topics in your Career Roadmap to update your progress.");
    }
    if ((profile.mockInterviewsCompleted || 0) === 0) {
      suggestions.push("Attempt a mock interview session to evaluate your technical and HR answers.");
    }
    if ((profile.communicationScore || 0) < 70) {
      suggestions.push("Record your speaking introduction to refine grammar, clarity, and articulation confidence.");
    }
    if (suggestions.length === 0) {
      suggestions.push("Explore the peer mock sessions or write a placement tip thread for the community!");
    }

    res.json({
      userName: user.name,
      college: user.college,
      careerGoal: user.careerGoal || "Set your Career Goal",
      readinessScore,
      resumeScore: profile.resumeScore || 0,
      atsScore: profile.atsScore || 0,
      interviewScore: profile.interviewScore || 0,
      communicationScore: profile.communicationScore || 0,
      skillsCompleted: profile.skillsCompleted || 0,
      mockInterviewsCompleted: profile.mockInterviewsCompleted || 0,
      communityContributions: profile.communityContributions || 0,
      suggestions,
      upcomingSessions,
      recentPosts
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error fetching dashboard", error: error.message });
  }
};
