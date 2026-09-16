import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

interface RoadmapSkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  resources: string[];
  tasks: string[];
  projectIdeas: string[];
  questions: string[];
}

const ROADMAPS: Record<string, RoadmapSkill[]> = {
  "frontend developer": [
    {
      name: "HTML & Semantic Markup",
      level: "Beginner",
      resources: ["MDN Web Docs: HTML", "freeCodeCamp HTML Tutorial"],
      tasks: ["Build a personal resume page", "Create a form with diverse input validation"],
      projectIdeas: ["Static Portfolio Page", "Recipe Directory Book"],
      questions: ["What are semantic tags, and why use them?", "Explain the difference between block and inline elements."]
    },
    {
      name: "CSS Layouts & Responsive Web Design",
      level: "Beginner",
      resources: ["CSS Tricks: Flexbox Guide", "Kevin Powell YouTube channel"],
      tasks: ["Design a responsive pricing grid", "Build a navigation header using CSS Flexbox"],
      projectIdeas: ["SaaS Product Landing Page", "CSS Art Gallery Card"],
      questions: ["What is the difference between Flexbox and Grid?", "Explain mobile-first design and media queries."]
    },
    {
      name: "Modern JavaScript (ES6+)",
      level: "Beginner",
      resources: ["JavaScript.info", "Eloquent JavaScript Book"],
      tasks: ["Write fetch API async requests", "Manipulate array values using map, filter, and reduce"],
      projectIdeas: ["Dynamic Calculator", "Crypto Pricing Dashboard widget"],
      questions: ["Explain Promises, async/await, and event loops.", "What is closures in JS, and how are they used?"]
    },
    {
      name: "Git & GitHub Version Control",
      level: "Beginner",
      resources: ["GitHub Flight School", "Git branching visual game"],
      tasks: ["Create and merge a git branch", "Resolve a merge conflict locally"],
      projectIdeas: ["Contribute a readme edit to an open source repo", "Host a website using GitHub Pages"],
      questions: ["What is the difference between git fetch and git pull?", "How do you undo the last commit?"]
    },
    {
      name: "React.js Component Framework",
      level: "Intermediate",
      resources: ["Official React Docs", "Scrimba React Course"],
      tasks: ["Manage components state using hooks", "Pass props and utilize context APIs for theme toggle"],
      projectIdeas: ["Student Task Board Tracker", "Weather Dashboard App"],
      questions: ["What is the virtual DOM?", "Describe the purpose of useEffect hook and dependency array."]
    },
    {
      name: "Tailwind CSS Utility Styling",
      level: "Intermediate",
      resources: ["TailwindCSS official docs", "Tailwind CSS components cheatsheet"],
      tasks: ["Refactor a raw CSS module page to Tailwind classes", "Build a dark-mode toggle layout"],
      projectIdeas: ["Responsive Dashboard Layout", "Messaging Chat Interface mockup"],
      questions: ["What are utility classes?", "How do you customize standard theme values in tailwind.config.ts?"]
    },
    {
      name: "API Integration & Async Operations",
      level: "Intermediate",
      resources: ["Axios docs", "REST API Tutorial"],
      tasks: ["Create wrapper requests with headers", "Implement search queries with debouncing"],
      projectIdeas: ["GitHub User Finder", "Movie Catalog browser"],
      questions: ["What is CORS, and how do you resolve it?", "Explain GET vs POST request headers."]
    },
    {
      name: "Testing & Deployment",
      level: "Advanced",
      resources: ["Jest Docs", "Vercel / Netlify manuals"],
      tasks: ["Write a unit test for a utility function", "Deploy a React app to production"],
      projectIdeas: ["E-commerce storefront template", "Fully tested utility npm package"],
      questions: ["What is integration testing?", "Explain continuous deployment (CI/CD) pipelines."]
    }
  ],
  "backend developer": [
    {
      name: "Programming Foundation (Node.js/Python)",
      level: "Beginner",
      resources: ["Node.js Docs", "Python for Everybody Course"],
      tasks: ["Read/Write files asynchronously", "Build a command-line script parser"],
      projectIdeas: ["File Organizer Script", "CLI Quiz Program"],
      questions: ["Is JavaScript single-threaded? Explain Node.js event loop.", "Explain list comprehensions in Python."]
    },
    {
      name: "API Server Framework (Express/Django)",
      level: "Beginner",
      resources: ["ExpressJS guide", "Django Girls Tutorial"],
      tasks: ["Setup a basic HTTP server", "Implement routing and middleware logging"],
      projectIdeas: ["To-Do API Server", "Product Catalog Backend"],
      questions: ["What is Express middleware?", "Explain Model-View-Template pattern in Django."]
    },
    {
      name: "Relational & Non-Relational Databases (SQL/NoSQL)",
      level: "Intermediate",
      resources: ["SQL Bolt", "MongoDB University"],
      tasks: ["Write join queries across tables", "Setup database connection index constraints"],
      projectIdeas: ["Database Schema for Blogging Portal", "E-commerce Database Design"],
      questions: ["Compare SQL vs NoSQL database architectures.", "What are index keys, and how do they speed up lookups?"]
    },
    {
      name: "Auth & Security (JWT/Bcrypt)",
      level: "Intermediate",
      resources: ["JWT.io", "OWASP Security top 10"],
      tasks: ["Implement signup password hashing", "Validate requests with JWT headers"],
      projectIdeas: ["Secure User Authentication API", "Roles Management Dashboard"],
      questions: ["How does JWT token exchange work?", "What is salting in cryptography?"]
    },
    {
      name: "Docker Containerization",
      level: "Advanced",
      resources: ["Docker Curriculum", "Docker Hub quickstarts"],
      tasks: ["Write a Dockerfile for an Express server", "Compose a multi-container database environment"],
      projectIdeas: ["Dockerized Dev Environment", "Multi-stage Build Container"],
      questions: ["What is the difference between an image and a container?", "Why use Docker Compose?"]
    }
  ]
};

// Fallback default roadmap
const DEFAULT_ROADMAP = [
  {
    name: "General Programming Foundations",
    level: "Beginner",
    resources: ["CS50 Computer Science", "freeCodeCamp Algorithms"],
    tasks: ["Learn git basics", "Write basic logic functions"],
    projectIdeas: ["Calculator", "Markdown resume file"],
    questions: ["What is an algorithm?", "Explain array lists vs linked lists."]
  },
  {
    name: "Web Basics (HTML/CSS)",
    level: "Beginner",
    resources: ["MDN Web Docs"],
    tasks: ["Design a personal profile card"],
    projectIdeas: ["Student Profile portfolio"],
    questions: ["What does HTML stand for?", "What are selector weights in CSS?"]
  },
  {
    name: "Version Control (Git)",
    level: "Intermediate",
    resources: ["Git Cheat Sheet"],
    tasks: ["Commit your first project code"],
    projectIdeas: ["GitHub repository sync"],
    questions: ["What is git push?", "How do you create a fork repository?"]
  }
];

export const getRoadmap = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { goal } = req.query;

  try {
    let user: any = null;
    let profile: any = null;

    if (checkFallback()) {
      user = fallbackDb.findById("users", userId!);
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
    } else {
      user = await User.findById(userId);
      profile = await Profile.findOne({ user: userId });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const careerGoal = (goal as string || user.careerGoal || "").toLowerCase().trim();
    
    // Find matching roadmap or return default
    let skillsList = DEFAULT_ROADMAP;
    let activeGoalName = "Career Prep Fundamentals";

    if (careerGoal.includes("front")) {
      skillsList = ROADMAPS["frontend developer"];
      activeGoalName = "Frontend Developer";
    } else if (careerGoal.includes("back") || careerGoal.includes("python") || careerGoal.includes("node")) {
      skillsList = ROADMAPS["backend developer"];
      activeGoalName = "Backend Developer";
    } else if (careerGoal.includes("data") || careerGoal.includes("analyst")) {
      skillsList = ROADMAPS["data analyst"] || ROADMAPS["frontend developer"]; // fallback helper
      activeGoalName = "Data Analyst";
    }

    const completedSkills = profile?.completedSkillsList || [];
    const totalSkills = skillsList.length;
    const completedCount = skillsList.filter(s => completedSkills.includes(s.name)).length;
    const progressPercent = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

    res.json({
      careerGoal: activeGoalName,
      skills: skillsList,
      completedSkills,
      progressPercent
    });
  } catch (error: any) {
    console.error("Get roadmap error:", error);
    res.status(500).json({ message: "Failed to load roadmap", error: error.message });
  }
};

export const toggleSkill = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { skillName } = req.body;

  if (!skillName) {
    return res.status(400).json({ message: "Skill name is required" });
  }

  try {
    let profile: any = null;

    if (checkFallback()) {
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
      if (!profile) {
        profile = fallbackDb.insert("profiles", { user: userId, completedSkillsList: [], skillsCompleted: 0 });
      }

      const list = profile.completedSkillsList || [];
      const index = list.indexOf(skillName);
      
      if (index > -1) {
        list.splice(index, 1); // remove
      } else {
        list.push(skillName); // add
      }

      profile = fallbackDb.findByIdAndUpdate("profiles", profile._id, {
        completedSkillsList: list,
        skillsCompleted: list.length
      });
    } else {
      profile = await Profile.findOne({ user: userId });
      if (!profile) {
        const newProfile = new Profile({ user: userId, completedSkillsList: [], skillsCompleted: 0 });
        profile = await newProfile.save();
      }

      // Check Mongoose model completedSkillsList schema support (we fallback/inject dynamically)
      const list = (profile as any).completedSkillsList || [];
      const index = list.indexOf(skillName);
      
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(skillName);
      }

      profile.completedSkillsList = list;
      profile.skillsCompleted = list.length;
      
      // Force change tracking for nested arrays in mongoose
      profile.markModified("completedSkillsList");
      await profile.save();
    }

    res.json({
      message: "Skill status updated successfully",
      completedSkills: profile.completedSkillsList || [],
      skillsCompleted: profile.skillsCompleted || 0
    });
  } catch (error: any) {
    console.error("Toggle skill error:", error);
    res.status(500).json({ message: "Failed to update skill status", error: error.message });
  }
};
