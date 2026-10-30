// Client-side fallback provider for static hosting deployments (e.g., Netlify, Vercel, GitHub Pages)
// Activated automatically when no live backend server is reachable (e.g., 404 or network disconnect)

export const isStaticDeployment = () => {
  return typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1");
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("demo_user_session");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
};

const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem("demo_profile_session");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
};

const defaultStudentCSE = {
  id: "student_pcte_cse_01",
  name: "Khushi Sharma",
  email: "khushi01610@gmail.com",
  college: "PCTE Group of Institute, Jhande Campus 2",
  course: "B.Tech",
  branch: "CSE",
  degree: "CSE",
  academicYear: 4,
  graduationYear: 2026,
  skills: ["React", "Node.js", "TypeScript", "SQL", "REST APIs"],
  careerGoal: "Full Stack Developer"
};

const defaultProfileCSE = {
  _id: "profile_pcte_cse_01",
  user: "student_pcte_cse_01",
  avatarUrl: "",
  bio: "Final year B.Tech CSE student preparing for campus placement drives.",
  resumeScore: 82,
  atsScore: 82,
  interviewScore: 70,
  communicationScore: 75,
  skillsCompleted: 5,
  projects: [
    { title: "AI Career Growth Engine", description: "Placement readiness platform with ATS parser and mock interview simulator." }
  ],
  achievements: ["PCTE Hackathon 2025 Runner Up", "NPTEL Cloud Computing Elite Certificate"]
};

export const mockFallback = {
  auth: {
    login: async (credentials: any) => {
      const email = credentials.email || "khushi01610@gmail.com";
      const isBJMC = email.toLowerCase().includes("bjmc") || email.toLowerCase().includes("media");
      
      const user = getStoredUser() || {
        ...defaultStudentCSE,
        email,
        degree: isBJMC ? "BJMC" : "CSE",
        careerGoal: isBJMC ? "Digital Journalist / Reporter" : "Full Stack Developer",
        skills: isBJMC 
          ? ["News Writing", "Media Law", "Public Relations", "Video Storytelling"] 
          : ["React", "Node.js", "TypeScript", "SQL", "REST APIs"]
      };

      const token = "live_demo_jwt_token_" + Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("demo_user_session", JSON.stringify(user));
      
      return { token, user };
    },

    register: async (userData: any) => {
      const isBJMC = userData.degree === "BJMC" || `${userData.course} ${userData.branch}`.toLowerCase().includes("bjmc");
      const user = {
        id: "student_" + Date.now(),
        name: userData.name || "Student",
        email: userData.email,
        college: userData.college || "PCTE Group of Institute, Jhande Campus 2",
        course: userData.course || (isBJMC ? "BJMC" : "B.Tech"),
        branch: userData.branch || (isBJMC ? "Journalism" : "CSE"),
        degree: isBJMC ? "BJMC" : "CSE",
        academicYear: Number(userData.academicYear) || 4,
        graduationYear: Number(userData.graduationYear) || 2026,
        skills: Array.isArray(userData.skills) ? userData.skills : ["React", "Node.js"],
        careerGoal: userData.careerGoal || (isBJMC ? "Digital Journalist / Reporter" : "Full Stack Developer")
      };

      const token = "live_demo_jwt_token_" + Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("demo_user_session", JSON.stringify(user));

      return { token, user };
    },

    me: async () => {
      const user = getStoredUser() || defaultStudentCSE;
      const profile = getStoredProfile() || defaultProfileCSE;
      return { user, profile };
    }
  },

  profile: {
    getDashboard: async () => {
      const user = getStoredUser() || defaultStudentCSE;
      const isBJMC = user.degree === "BJMC";
      return {
        userName: user.name,
        college: user.college,
        degree: user.degree,
        academicYear: user.academicYear || 4,
        careerGoal: user.careerGoal || (isBJMC ? "Digital Journalist / Reporter" : "Full Stack Developer"),
        readinessScore: 68,
        resumeScore: 82,
        atsScore: 82,
        interviewScore: 70,
        communicationScore: 75,
        skillsCompleted: user.skills?.length || 5,
        suggestions: [
          "Complete technical roadmap chapter 3",
          "Practice STAR method behavioral mock interview"
        ]
      };
    },

    get: async () => {
      const profile = getStoredProfile() || defaultProfileCSE;
      return profile;
    },

    update: async (profileData: any) => {
      const existing = getStoredProfile() || defaultProfileCSE;
      const updated = { ...existing, ...profileData };
      localStorage.setItem("demo_profile_session", JSON.stringify(updated));
      return updated;
    }
  },

  resume: {
    analyze: async (formData?: any) => {
      let fileName = "Resume.pdf";
      if (formData && typeof formData.get === "function") {
        const file = formData.get("resume");
        if (file && file.name) {
          fileName = file.name;
        }
      }

      const user = getStoredUser() || defaultStudentCSE;
      const isBJMC = user.degree === "BJMC" || fileName.toLowerCase().includes("bjmc") || fileName.toLowerCase().includes("journal");
      const stream = isBJMC ? "BJMC" : "CSE";

      const detectedSkills = isBJMC
        ? ["Media Ethics", "Investigative Journalism", "Adobe Premiere Pro", "Content Strategy", "Press Release Writing", "Broadcast Anchoring", "Digital Storytelling", "SEO Writing"]
        : ["React", "TypeScript", "Node.js", "Python", "SQL", "RESTful APIs", "Docker", "Git", "Tailwind CSS", "MongoDB"];

      const strengthBreakdown = [
        {
          strength: `${stream} Domain Keywords`,
          details: `Identified ${detectedSkills.length} relevant competencies: ${detectedSkills.slice(0, 5).join(", ")}.`
        },
        {
          strength: "Clear Academic Credentials",
          details: "Detected degree and university credentials compatible with placement filters."
        },
        {
          strength: "Contact Verification",
          details: "ATS successfully verified email, phone number, and online portfolio links."
        }
      ];

      const sectionAnalysis = [
        {
          section: "Contact & Online Portfolio",
          score: 93,
          feedback: "Complete contact profile detected with active portfolio links."
        },
        {
          section: "Education & Degree Program",
          score: 87,
          feedback: `Verified ${stream} degree focus. University credentials and graduation timeline are clear.`
        },
        {
          section: "Domain & Technical Keywords",
          score: 85,
          feedback: `Strong keyword density with ${detectedSkills.length} verified industry competencies.`
        },
        {
          section: "Projects & Impact Measurement",
          score: 80,
          feedback: "Good project demonstrations. Consider adding more STAR metrics (e.g., % latency improved, % readership grown)."
        },
        {
          section: "Formatting & ATS Layout",
          score: 90,
          feedback: "Clean single-column standard layout easily processed by automated ATS parsers."
        }
      ];

      const recommendations = isBJMC ? [
        "Include direct links to published articles, clips, or digital portfolio (Behance / Substack / YouTube).",
        "Quantify your readership or media impact (e.g., 'Authored 15 articles generating 25k+ reader views').",
        "Highlight proficiency in industry-standard editing software (Adobe Premiere Pro, Canva, WordPress CMS).",
        "Structure sample beats chronologically with clear topic categories."
      ] : [
        "Include live GitHub repository links and deployment URLs for each featured project.",
        "Quantify technical performance impact (e.g., 'reduced API latency by 25%', 'handled 5,000+ mock requests').",
        "Group technical skills cleanly into categories: Languages, Web Frameworks, Databases, and Developer Tools.",
        "Ensure bullet points start with strong action verbs (Architected, Engineered, Optimized, Implemented)."
      ];

      const improvedSections = isBJMC ? [
        {
          sectionName: "Projects & Work Samples",
          originalText: "Wrote articles for college magazine and made videos on social issues.",
          improvedText: "Researched and authored 6 investigative feature articles for the university publication, conducting 12 in-depth stakeholder interviews and increasing digital edition readership by 35%."
        },
        {
          sectionName: "Professional Summary",
          originalText: "BJMC student seeking media and content writing roles.",
          improvedText: "Detail-oriented Journalism and Mass Communication senior with hands-on reporting, digital storytelling, and Premiere Pro video production experience. Passionate about driving audience engagement across digital publications."
        }
      ] : [
        {
          sectionName: "Projects",
          originalText: "Made a website using React and Node. Stored users in database and displayed user info.",
          improvedText: "Architected a responsive full-stack web portal using React, Node.js, and Express; integrated MongoDB with indexing to reduce query response latency by 30% for 1,000+ simulated users."
        },
        {
          sectionName: "Professional Summary",
          originalText: "I am a computer science student looking for software developer jobs.",
          improvedText: "Proactive B.Tech Computer Science student specializing in scalable web systems and modern JavaScript frameworks (React/Node.js). Eager to contribute clean code and rigorous problem solving to high-impact engineering teams."
        }
      ];

      const roleRecommendations = isBJMC
        ? ["Digital Journalist & Reporter", "Content Strategist", "PR & Brand Associate", "Video Producer & Editor"]
        : ["Full Stack Developer", "Frontend Engineer", "Backend Developer", "Software Development Engineer (Associate)"];

      const analysis = {
        stream,
        resumeScore: 84,
        atsScore: 84,
        formatScore: 90,
        keywordScore: 80,
        skillsScore: 85,
        projectScore: 82,
        skills: detectedSkills,
        roleRecommendations,
        strengthBreakdown,
        sectionAnalysis,
        recommendations,
        improvedSections,
        extractedText: `Resume: ${fileName}\nStream: ${stream}\nSkills: ${detectedSkills.join(", ")}`,
        contactInfo: {
          email: user.email || "student@university.edu",
          phone: "+91 98765 43210",
          hasLinkedIn: true,
          hasGitHub: !isBJMC,
          hasPortfolio: isBJMC
        }
      };

      // Update profile score
      const existing = getStoredProfile() || defaultProfileCSE;
      existing.atsScore = 84;
      existing.resumeScore = 84;
      existing.resumeUrl = "/uploads/" + fileName;
      existing.resumeFileName = fileName;
      existing.extractedResumeText = `Resume: ${fileName}\nStream: ${stream}\nSkills: ${detectedSkills.join(", ")}`;
      localStorage.setItem("demo_profile_session", JSON.stringify(existing));

      return {
        message: "Resume uploaded and analyzed successfully",
        resumeUrl: "/uploads/" + fileName,
        resumeFileName: fileName,
        analysis,
        extractedText: `Resume: ${fileName}\nStream: ${stream}\nSkills: ${detectedSkills.join(", ")}`,
        // Top-level mirrors for universal fallback compatibility
        atsScore: 84,
        resumeScore: 84,
        formatScore: 90,
        keywordScore: 80,
        skillsScore: 85,
        projectScore: 82,
        stream,
        skills: detectedSkills,
        roleRecommendations,
        strengthBreakdown,
        sectionAnalysis,
        recommendations,
        improvedSections
      };
    }
  },

  interview: {
    generateQuestions: async (role: string, _difficulty: string, _type: string) => {
      const isBJMC = role.toLowerCase().includes("journal") || role.toLowerCase().includes("pr") || role.toLowerCase().includes("media");
      if (isBJMC) {
        return [
          { id: 1, question: "How do you verify multiple anonymous sources before publishing a breaking story?", round: 1, topic: "Media Ethics & Verification" },
          { id: 2, question: "Explain the difference between on-the-record, on background, and off-the-record statements.", round: 2, topic: "Reporting Protocols" },
          { id: 3, question: "How would you draft a crisis press statement for a brand facing public social media backlash?", round: 3, topic: "Crisis PR & Public Relations" },
          { id: 4, question: "Describe a situation where a story deadline conflicted with fact-checking constraints.", round: 4, topic: "HR & Situational Judgment" }
        ];
      }
      return [
        { id: 1, question: "Walk me through the architecture of a full-stack application you engineered recently.", round: 1, topic: "System Orientation" },
        { id: 2, question: "How do you optimize React component re-renders when passing complex objects as props?", round: 2, topic: "Frontend Performance" },
        { id: 3, question: "Design an API rate limiter that restricts clients to 100 requests per minute per IP address.", round: 3, topic: "System Design & Algorithms" },
        { id: 4, question: "Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?", round: 4, topic: "HR Behavioral (STAR)" }
      ];
    },

    evaluateAnswer: async () => {
      return {
        score: 82,
        feedback: "Clear technical explanation with appropriate terminology and structured reasoning.",
        improvements: [
          "Elaborate on trade-offs between memory overhead and execution speed.",
          "Conclude with a quantifiable business impact."
        ]
      };
    }
  },

  applications: {
    get: async () => {
      try {
        const raw = localStorage.getItem("demo_applications_pipeline");
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      
      const defaults = [
        { _id: "app_1", companyName: "Google", role: "Software Engineer FTE", status: "Interviewing", dateApplied: "2026-02-15", package: "₹35 LPA" },
        { _id: "app_2", companyName: "Microsoft", role: "Campus FTE 2026", status: "Applied", dateApplied: "2026-02-20", package: "₹28 LPA" },
        { _id: "app_3", companyName: "Amazon", role: "SDE-1 Drive", status: "Wishlist", dateApplied: "2026-03-01", package: "₹30 LPA" }
      ];
      localStorage.setItem("demo_applications_pipeline", JSON.stringify(defaults));
      return defaults;
    },

    create: async (data: any) => {
      const apps = await mockFallback.applications.get();
      const newApp = { _id: "app_" + Date.now(), dateApplied: new Date().toISOString(), ...data };
      apps.push(newApp);
      localStorage.setItem("demo_applications_pipeline", JSON.stringify(apps));
      return newApp;
    },

    update: async (id: string, data: any) => {
      const apps = await mockFallback.applications.get();
      const idx = apps.findIndex((a: any) => a._id === id);
      if (idx !== -1) {
        apps[idx] = { ...apps[idx], ...data };
        localStorage.setItem("demo_applications_pipeline", JSON.stringify(apps));
        return apps[idx];
      }
      return data;
    },

    delete: async (id: string) => {
      const apps = await mockFallback.applications.get();
      const filtered = apps.filter((a: any) => a._id !== id);
      localStorage.setItem("demo_applications_pipeline", JSON.stringify(filtered));
      return { success: true };
    }
  },

  jobs: {
    getAll: async () => {
      return [
        { _id: "job_1", title: "Full Stack Developer", company: "Google", location: "Bengaluru, India", type: "Full-Time", salary: "₹35 - ₹50 LPA", tags: ["React", "Node.js", "TypeScript"], degree: "CSE" },
        { _id: "job_2", title: "SDE-1 (Frontend)", company: "Microsoft", location: "Hyderabad, India", type: "Full-Time", salary: "₹28 - ₹42 LPA", tags: ["React", "JavaScript", "HTML5"], degree: "CSE" },
        { _id: "job_3", title: "Trainee Journalist", company: "BBC News", location: "New Delhi, India", type: "Full-Time", salary: "₹8 - ₹12 LPA", tags: ["Reporting", "Editing", "Attribution"], degree: "BJMC" },
        { _id: "job_4", title: "Corporate PR Specialist", company: "Ogilvy", location: "Mumbai, India", type: "Full-Time", salary: "₹9 - ₹15 LPA", tags: ["Public Relations", "Media Pitching"], degree: "BJMC" }
      ];
    }
  },

  notifications: {
    get: async () => {
      return [
        { _id: "n1", title: "Campus Recruitment Season Active", message: "PCTE Placement Cell verified drives are live for B.Tech CSE and BJMC.", isRead: false, createdAt: new Date().toISOString() },
        { _id: "n2", title: "ATS Resume Verified", message: "Your technical resume meets standard keyword screening criteria.", isRead: true, createdAt: new Date().toISOString() }
      ];
    },
    markAllRead: async () => ({ success: true }),
    markRead: async () => ({ success: true })
  },

  chat: {
    sendMessage: async (msg: string) => {
      return `As your AI Placement Mentor for PCTE, my guidance on "${msg}" is: Structure your technical answers using the STAR method, highlight quantifiable metrics in your resume, and practice live mock interview panels to reduce drive anxiety.`;
    }
  }
};
