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
  ],
  "full stack engineer": [
    {
      name: "Full Stack Architecture (MERN)",
      level: "Beginner",
      resources: ["Full Stack Open (University of Helsinki)", "freeCodeCamp MERN Tutorial"],
      tasks: ["Connect React frontend with Express backend", "Configure CORS and environment variables"],
      projectIdeas: ["Student Career Portal", "Task Board with Kanban Workflow"],
      questions: ["How does state synchronize between client and server?", "Explain RESTful API conventions."]
    },
    {
      name: "Authentication & Authorization (JWT & Role Guards)",
      level: "Intermediate",
      resources: ["Auth0 Documentation", "MDN HTTP Cookies and Sessions"],
      tasks: ["Implement JWT token refresh rotation", "Create ProtectedRoute component wrappers in React"],
      projectIdeas: ["Multi-Tenant SaaS Starter", "Secure File Vault"],
      questions: ["Compare Session-based vs Token-based authentication.", "What is Cross-Site Scripting (XSS) and CSRF?"]
    },
    {
      name: "Relational & NoSQL Database Optimization",
      level: "Intermediate",
      resources: ["MongoDB University", "Use The Index, Luke! (SQL indexing guide)"],
      tasks: ["Create compound database indexes", "Write aggregation pipeline queries"],
      projectIdeas: ["Analytics Dashboard API", "E-commerce Search Engine"],
      questions: ["What are ACID properties?", "When would you choose SQL over MongoDB?"]
    },
    {
      name: "Cloud Deployment & CI/CD Pipelines",
      level: "Advanced",
      resources: ["GitHub Actions Documentation", "AWS Elastic Beanstalk / Vercel Guides"],
      tasks: ["Write a GitHub Actions deployment workflow", "Configure SSL certificates and custom domains"],
      projectIdeas: ["Automated Deployment Pipeline", "Microservices Container on AWS"],
      questions: ["What is a reverse proxy?", "How does zero-downtime rolling deployment work?"]
    }
  ],
  "data analyst": [
    {
      name: "SQL & Relational Querying",
      level: "Beginner",
      resources: ["Mode Analytics SQL Tutorial", "SQLBolt"],
      tasks: ["Write multi-table INNER and LEFT JOINs", "Compute rolling averages with SQL window functions"],
      projectIdeas: ["Placement Statistics Query Suite", "Sales Funnel Analysis"],
      questions: ["Explain GROUP BY vs HAVING clauses.", "What are window functions like ROW_NUMBER() and RANK()?"]
    },
    {
      name: "Python for Data Analysis (Pandas & NumPy)",
      level: "Intermediate",
      resources: ["Python Data Science Handbook", "Kaggle Pandas Course"],
      tasks: ["Clean messy CSV data with missing values", "Perform exploratory data analysis (EDA)"],
      projectIdeas: ["University Placement Salary Predictor", "Customer Churn Analysis"],
      questions: ["What is the difference between loc and iloc in Pandas?", "How do you handle missing or duplicate values?"]
    },
    {
      name: "Data Visualization & BI Dashboards (PowerBI / Tableau)",
      level: "Intermediate",
      resources: ["Storytelling with Data (Book)", "Power BI Guided Learning"],
      tasks: ["Build an interactive multi-filter KPI dashboard", "Select appropriate charts for distributions vs time series"],
      projectIdeas: ["Executive Placement KPI Dashboard", "Campus Recruitment Insights Report"],
      questions: ["What is data storytelling?", "Explain DAX measures in Power BI."]
    }
  ],
  // BJMC STREAM ROADMAPS
  "digital journalism": [
    {
      name: "News Reporting & Beat Research",
      level: "Beginner",
      resources: ["Poynter Institute Reporting Tools", "Associated Press (AP) Stylebook Guide"],
      tasks: ["Cover a local campus event with multi-source quotes", "Pitch 3 investigative story angles with research outlines"],
      projectIdeas: ["Campus Newspaper Feature Story", "Digital Beat Coverage Blog"],
      questions: ["What is the inverted pyramid structure in news writing?", "How do you verify anonymous sources ethically?"]
    },
    {
      name: "Digital Copy Editing & Fact-Checking",
      level: "Intermediate",
      resources: ["First Draft News Verification Guide", "Columbia Journalism Review"],
      tasks: ["Fact-check a trending digital story using reverse image search", "Sub-edit a 1,000-word draft following AP style rules"],
      projectIdeas: ["Fact-Checking Dossier", "Curated Longform News Feature"],
      questions: ["What constitutes libel and defamation in digital media law?", "Explain the difference between primary and secondary sources."]
    },
    {
      name: "Multimedia Storytelling & Mobile Journalism (MoJo)",
      level: "Intermediate",
      resources: ["BBC Academy Mobile Journalism Guide", "Knight Center for Journalism"],
      tasks: ["Produce a 90-second video news package shot on a smartphone", "Record and edit a high-quality vox pop interview"],
      projectIdeas: ["Short Documentary Feature", "Interactive Web Story with Audio Bites"],
      questions: ["What is B-roll footage, and why is it crucial in video news?", "What are audio leveling standards in broadcast?"]
    },
    {
      name: "Data Journalism & Investigative Analytics",
      level: "Advanced",
      resources: ["Data Journalism Handbook", "Google News Initiative Training"],
      tasks: ["Extract government statistics into charts using Datawrapper", "Investigate public records for trend stories"],
      projectIdeas: ["Interactive Data Journalism Article", "Public Spending Investigation Report"],
      questions: ["How do you evaluate statistical bias in corporate press releases?", "What is the Freedom of Information (RTI) process?"]
    }
  ],
  "content strategy": [
    {
      name: "Content Writing & Editorial Planning",
      level: "Beginner",
      resources: ["HubSpot Content Marketing Certification", "Copyblogger Masterclass"],
      tasks: ["Write a 1,200-word editorial article targeting student careers", "Create a 30-day editorial content calendar"],
      projectIdeas: ["Branded Career Guide Publication", "Niche Educational Substack Newsletter"],
      questions: ["What is search intent, and how does it drive content ideation?", "Explain the difference between editorial and promotional tone."]
    },
    {
      name: "SEO Optimization & Keyword Strategy",
      level: "Intermediate",
      resources: ["Ahrefs SEO Beginners Guide", "Google Search Central Docs"],
      tasks: ["Perform keyword research identifying low-competition terms", "Optimize headings, meta descriptions, and alt tags for an article"],
      projectIdeas: ["SEO Pillar Page & Cluster Strategy", "Content Audit of a Live Website"],
      questions: ["What is the difference between On-Page and Off-Page SEO?", "Explain Google's E-E-A-T quality guidelines."]
    },
    {
      name: "Social Media Distribution & Engagement Analytics",
      level: "Advanced",
      resources: ["Buffer Social Media Library", "Sprout Social Index"],
      tasks: ["Repurpose a longform article into a 5-part LinkedIn carousel", "Analyze audience drop-off rates and engagement metrics"],
      projectIdeas: ["Multi-Channel Content Distribution Campaign", "Brand Tone-of-Voice Style Guide"],
      questions: ["What metrics measure true engagement vs vanity impressions?", "How do you calculate ROI on content marketing?"]
    }
  ],
  "pr & brand communication": [
    {
      name: "Public Relations Foundations & Press Releases",
      level: "Beginner",
      resources: ["Public Relations Society of America (PRSA) Guide", "Cision PR Best Practices"],
      tasks: ["Draft a standard AP-style corporate press release", "Build a targeted media contact list across 15 publications"],
      projectIdeas: ["Product Launch PR Kit", "Executive Announcement Dossier"],
      questions: ["What is the difference between earned, owned, and paid media?", "What is an embargo in press distribution?"]
    },
    {
      name: "Crisis Communication & Reputation Management",
      level: "Intermediate",
      resources: ["Harvard Business Review Crisis Communication", "Institute for PR Studies"],
      tasks: ["Draft a rapid crisis statement responding to a brand issue", "Create a stakeholder communication decision tree"],
      projectIdeas: ["Brand Crisis Simulation Playbook", "Executive Media Training Prep Sheet"],
      questions: ["What are the 3 Golden Rules of crisis management?", "How do you address hostile media interview questions?"]
    },
    {
      name: "Brand Storytelling & Influencer Campaigns",
      level: "Advanced",
      resources: ["WARC Brand Strategy Case Studies", "Contently Guide"],
      tasks: ["Structure a strategic brand partnership pitch deck", "Design a CSR (Corporate Social Responsibility) narrative campaign"],
      projectIdeas: ["Comprehensive 360-Degree PR Campaign", "Brand Ambassador Strategy"],
      questions: ["What is brand equity?", "How do you evaluate media sentiment during a brand campaign?"]
    }
  ],
  "video production & editing": [
    {
      name: "Pre-Production, Storyboarding & Scripting",
      level: "Beginner",
      resources: ["StudioBinder Filmmaking Guides", "MasterClass Scriptwriting Notes"],
      tasks: ["Write a two-column audio/video broadcast script", "Draw a visual storyboard for a 60-second public service announcement"],
      projectIdeas: ["Short Documentary Treatment", "Social Video Storyboard Deck"],
      questions: ["What is the 180-degree rule in cinematography?", "Explain the difference between A-Roll and B-Roll."]
    },
    {
      name: "Non-Linear Video Editing (Adobe Premiere Pro / DaVinci Resolve)",
      level: "Intermediate",
      resources: ["Adobe Premiere Pro User Guide", "Blackmagic DaVinci Training"],
      tasks: ["Assemble a multi-cam interview cut with L-cuts and J-cuts", "Perform three-way color grading and audio leveling"],
      projectIdeas: ["3-Minute Mini-Documentary", "Broadcast News Reel with Lower Thirds"],
      questions: ["What are J-cuts and L-cuts, and why do they enhance pacing?", "Explain video codecs and bitrate settings for web export."]
    },
    {
      name: "Audio Production & Podcast Engineering (Audacity)",
      level: "Intermediate",
      resources: ["NPR Training: Audio Production", "Transom Sound School"],
      tasks: ["Record and clean interview voice track eliminating room noise", "Mix background music ducking under voiceover speech"],
      projectIdeas: ["15-Minute Narrative Podcast Episode", "Audio Drama Showcase"],
      questions: ["What is room tone, and why must you record it on location?", "Explain audio normalization vs compression."]
    }
  ]
};

// Fallback default roadmap
const DEFAULT_ROADMAP = [
  {
    name: "General Career & Placement Foundations",
    level: "Beginner",
    resources: ["Campus Placement Cell Prep Manual", "Harvard Career Services Resume Guide"],
    tasks: ["Format a 1-page standard ATS resume", "Build a complete professional LinkedIn profile"],
    projectIdeas: ["Personal Portfolio Website / Profile", "Target Employers Research Spreadsheet"],
    questions: ["What are university placement eligibility criteria?", "How do ATS keyword scanners rank candidate resumes?"]
  },
  {
    name: "Core Technical & Domain Fundamentals",
    level: "Intermediate",
    resources: ["Domain Practice Documentation", "Interview Prep Guides"],
    tasks: ["Complete 5 core domain projects", "Present work samples during peer reviews"],
    projectIdeas: ["Domain Case Study", "Live Portfolio Work Sample"],
    questions: ["How do you showcase measurable results on projects?", "Explain how to answer using the STAR method."]
  },
  {
    name: "Interview Readiness & Mock Evaluation",
    level: "Advanced",
    resources: ["STAR Method Cheatsheet", "Mock Interview System"],
    tasks: ["Complete 2 AI mock interviews", "Refine answers to 'Tell me about yourself' and behavioral questions"],
    projectIdeas: ["Mock Interview Recording Review", "Elevator Pitch Video"],
    questions: ["How do you handle difficult technical questions gracefully?", "What questions should you ask the interviewer at the end?"]
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

    const isBJMC = user.degree === "BJMC" || (user.course && (user.course.toLowerCase().includes("bjmc") || user.course.toLowerCase().includes("journalism")));
    const careerGoal = (goal as string || user.careerGoal || "").toLowerCase().trim();
    
    // Find matching roadmap or return stream-appropriate default
    let skillsList = DEFAULT_ROADMAP;
    let activeGoalName = isBJMC ? "Digital Journalism" : "Full Stack Engineer";

    if (careerGoal.includes("front")) {
      skillsList = ROADMAPS["frontend developer"];
      activeGoalName = "Frontend Developer";
    } else if (careerGoal.includes("back") || careerGoal.includes("node") || (careerGoal.includes("python") && !careerGoal.includes("data"))) {
      skillsList = ROADMAPS["backend developer"];
      activeGoalName = "Backend Developer";
    } else if (careerGoal.includes("data") || careerGoal.includes("analyst")) {
      skillsList = ROADMAPS["data analyst"];
      activeGoalName = "Data Analyst";
    } else if (careerGoal.includes("journalism") || careerGoal.includes("news") || careerGoal.includes("reporter")) {
      skillsList = ROADMAPS["digital journalism"];
      activeGoalName = "Digital Journalism";
    } else if (careerGoal.includes("content") || careerGoal.includes("writer") || careerGoal.includes("strategy")) {
      skillsList = ROADMAPS["content strategy"];
      activeGoalName = "Content Strategy";
    } else if (careerGoal.includes("pr") || careerGoal.includes("public relations") || careerGoal.includes("brand") || careerGoal.includes("corporate")) {
      skillsList = ROADMAPS["pr & brand communication"];
      activeGoalName = "PR & Brand Communication";
    } else if (careerGoal.includes("video") || careerGoal.includes("editor") || careerGoal.includes("film") || careerGoal.includes("production")) {
      skillsList = ROADMAPS["video production & editing"];
      activeGoalName = "Video Production & Editing";
    } else if (careerGoal.includes("stack") || careerGoal.includes("software") || careerGoal.includes("developer")) {
      skillsList = ROADMAPS["full stack engineer"];
      activeGoalName = "Full Stack Engineer";
    } else if (isBJMC) {
      skillsList = ROADMAPS["digital journalism"];
      activeGoalName = "Digital Journalism";
    } else {
      skillsList = ROADMAPS["full stack engineer"];
      activeGoalName = "Full Stack Engineer";
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
