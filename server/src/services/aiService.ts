import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper to make API calls to Gemini
async function callGemini(prompt: string, schemaInstruction?: string): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemInstruction = schemaInstruction 
    ? `You are an expert AI Career Coach. Return responses ONLY in valid JSON format. Schema requirements: ${schemaInstruction}`
    : "You are an expert AI Career Coach. Provide structured advice.";

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: schemaInstruction ? {
      responseMimeType: "application/json"
    } : undefined
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned error: ${response.status} - ${errText}`);
    }

    const resJson = (await response.json()) as any;
    const outputText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (schemaInstruction) {
      return JSON.parse(outputText);
    }
    return outputText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export const aiService = {
  // 1. Analyze Resume PDF content
  analyzeResume: async (fileName: string, fileBuffer?: Buffer): Promise<any> => {
    console.log(`Analyzing resume: ${fileName} using ${GEMINI_API_KEY ? "Gemini API" : "Mock AI Service"}`);
    
    if (GEMINI_API_KEY && fileBuffer) {
      try {
        const textContent = fileBuffer.toString("utf-8").replace(/[^\x20-\x7E\n]/g, ""); // strip non-ascii
        const prompt = `Analyze this resume and provide a detailed ATS breakdown. Here is the text: \n\n${textContent}`;
        const schema = `{
          resumeScore: number,
          atsScore: number,
          formatScore: number,
          keywordScore: number,
          skillsScore: number,
          projectScore: number,
          skills: string[],
          roleRecommendations: string[],
          strengthBreakdown: { strength: string, details: string }[],
          sectionAnalysis: { section: string, score: number, feedback: string }[],
          recommendations: string[],
          improvedSections: { sectionName: string, originalText: string, improvedText: string }[]
        }`;
        return await callGemini(prompt, schema);
      } catch (e) {
        console.warn("Gemini resume analysis failed, falling back to mock resume analyser.");
      }
    }

    // Mock Resume Analysis Fallback
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI lag
    
    const matchedProfile = fileName.toLowerCase();
    let detectedRole = "Software Developer";
    let detectedSkills = ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git"];
    
    if (matchedProfile.includes("data")) {
      detectedRole = "Data Analyst";
      detectedSkills = ["Python", "SQL", "Pandas", "PowerBI", "Excel", "Statistics"];
    } else if (matchedProfile.includes("python") || matchedProfile.includes("backend")) {
      detectedRole = "Backend Developer";
      detectedSkills = ["Python", "Django", "PostgreSQL", "Node.js", "Express", "REST APIs", "Docker"];
    } else if (matchedProfile.includes("design") || matchedProfile.includes("ui")) {
      detectedRole = "UI/UX Designer";
      detectedSkills = ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Tailwind CSS"];
    }

    const baseScore = Math.floor(Math.random() * 15) + 70; // 70-85

    return {
      resumeScore: baseScore,
      atsScore: Math.floor(baseScore * 0.95),
      formatScore: Math.floor(baseScore * 1.02),
      keywordScore: Math.floor(baseScore * 0.91),
      skillsScore: Math.floor(baseScore * 0.98),
      projectScore: Math.floor(baseScore * 1.05),
      skills: detectedSkills,
      roleRecommendations: [detectedRole, "Full Stack Developer", "QA/SDET"],
      strengthBreakdown: [
        { strength: "Technical Skills Alignment", details: "Your resume clearly lists core libraries and environments matching modern web stacks." },
        { strength: "Education Format", details: "College, degree, and GPA are structured cleanly and are easy for ATS parsers to read." },
        { strength: "Project Descriptions", details: "Project sections explain technologies used and basic implementation steps." }
      ],
      sectionAnalysis: [
        { section: "Experience", score: baseScore - 5, feedback: "Highlight measurable outcomes. Use the STAR method to show impact." },
        { section: "Skills", score: baseScore + 8, feedback: "Excellent keyword mapping. Consider grouping by categories (Frontend, Backend, Tools)." },
        { section: "Projects", score: baseScore + 2, feedback: "Good technology demonstration. Add links to GitHub or live deployments." }
      ],
      recommendations: [
        "Add more measurable achievements (e.g., 'improved query load times by 30%')",
        "Include keywords like 'Agile Development', 'CI/CD pipeline', or target role terms",
        "Improve formatting consistency by removing icons or table layouts that can confuse ATS parsers",
        `Add missing technical skills relevant to your target ${detectedRole} role`
      ],
      improvedSections: [
        {
          sectionName: "Projects",
          originalText: "Made a website using React and Node. Stored users in database and displayed user info.",
          improvedText: "Designed and implemented a full-stack student portal utilizing React, Node.js, and Express, optimizing server response latency by 20% through efficient MongoDB indexing."
        },
        {
          sectionName: "Professional Summary",
          originalText: "I am a student looking for software developer jobs.",
          improvedText: "Goal-oriented computer science student with hands-on project experience in modern web stacks (React/Node.js). Eager to contribute technical skills and collaborate with cross-functional software teams."
        }
      ]
    };
  },

  // 2. AI Chatbot Career Guide
  generateCareerAdvice: async (message: string, history: any[], profile: any): Promise<string> => {
    console.log(`Generating career advice. API status: ${GEMINI_API_KEY ? "Active" : "Mock"}`);

    if (GEMINI_API_KEY) {
      try {
        const historyText = history.map(h => `${h.role === "user" ? "Student" : "Coach"}: ${h.text}`).join("\n");
        const profileText = profile 
          ? `Student Profile: College: ${profile.college}, Course: ${profile.course}, Major: ${profile.branch}, Skills: ${profile.skills.join(", ")}, Career Goal: ${profile.careerGoal || "Software Engineer"}` 
          : "Student Profile: Undefined";

        const prompt = `You are "CareerGuide AI", an encouraging career advisor coach. Context:\n${profileText}\n\nChat History:\n${historyText}\n\nStudent asks: ${message}\n\nAnswer cleanly, with clear markdown titles, bullet points, and roadmaps.`;
        return await callGemini(prompt);
      } catch (e) {
        console.warn("Gemini chat failed, falling back to Mock AI responses.");
      }
    }

    // Mock Chat Responses
    await new Promise(resolve => setTimeout(resolve, 800));
    const msg = message.toLowerCase();
    
    if (msg.includes("resume")) {
      return `### How to Improve Your Resume 📄

To optimize your resume for automated applicant tracking systems (ATS) and human recruiters:

1. **Highlight Metrics and Quantifiable Data:** Instead of saying *"Wrote SQL queries,"* say *"Optimized database SQL queries, reducing page load times by 15%."*
2. **Organize Cleanly:** Use a standard chronological format. Avoid using tables, multiple columns, progress bars, or graphic icons since many ATS scanners fail to read them properly.
3. **Keyword Matching:** Cross-reference your target job description. Ensure skills like **React**, **TypeScript**, or **Node.js** are present in the exact format shown in the posting.
4. **Action Verbs:** Start your project descriptions with strong action verbs like *Implemented*, *Optimized*, *Architected*, or *Collaborated*.`;
    }

    if (msg.includes("prepare") || msg.includes("interview")) {
      return `### Interview Preparation Roadmap 🎯

Here is a structured preparation plan for software engineering and technical roles:

* **Step 1: Core Algorithms & Data Structures**
  * Spend 2-3 weeks mastering Arrays, Hash Maps, Linked Lists, Trees, and Sorting.
  * Practice on LeetCode/HackerRank (start with easy, then medium problems).
* **Step 2: Object-Oriented Programming & Systems**
  * Brush up on OOP principles (Inheritance, Polymorphism, Encapsulation, Abstraction).
  * Learn basic System Design (APIs, Databases, Caching).
* **Step 3: Resume Deep-Dive**
  * Be ready to explain *every single line* of your resume projects.
  * Use the **STAR** method (Situation, Task, Action, Result) to talk about challenges.
* **Step 4: HR & Behavioral Questions**
  * Practice answers for: *"Tell me about yourself,"* *"What is your greatest weakness,"* and *"Describe a time you solved a conflict."*`;
    }

    if (msg.includes("frontend") || msg.includes("html") || msg.includes("react")) {
      return `### Frontend Developer Learning Roadmap 🛤️

For landing a frontend engineering role, master this stack sequentially:

1. **Fundamental Web Stacks:** HTML5 semantic tags, CSS3 layouts (Flexbox/Grid), and vanilla modern JavaScript (ES6+, Promises, Async/Await).
2. **Version Control:** Git & GitHub (creating branches, pull requests, resolving conflicts).
3. **Component Libraries:** React.js (hooks, state, context) or Vue/Angular.
4. **CSS Frameworks:** Tailwind CSS or Styled Components for rapid modern styling.
5. **Tooling & Building:** Vite, ESLint, TypeScript.
6. **Practice Project:** Build a responsive dashboard matching search APIs to test state and responsive layouts.`;
    }

    return `### Hello! I am CareerGuide AI 🧠

I'm here to guide you on your professional journey. Here are some things you can ask me:

* How can I improve my resume ATS score?
* What is a solid learning path for a **Frontend/Backend Developer**?
* How do I prepare for a **Technical or HR interview**?
* Give me a checklist to practice my **speaking and self-introductions**.

Tell me about your target role, and let's get you placement-ready!`;
  },

  // 3. Generate Interview Questions
  generateInterviewQuestions: async (role: string, difficulty: string, type: string): Promise<any> => {
    console.log(`Generating interview questions. API status: ${GEMINI_API_KEY ? "Active" : "Mock"}`);

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Generate 4 interview questions (1 Technical, 1 HR, 1 Behavioral, 1 Situational) for role: ${role}, experience: ${difficulty}, type: ${type}.`;
        const schema = `{
          questions: [
            {
              question: string,
              category: string,
              difficulty: string,
              sampleAnswer: string,
              tips: string[]
            }
          ],
          generalTips: string[],
          commonMistakes: string[],
          bodyLanguageTips: string[]
        }`;
        return await callGemini(prompt, schema);
      } catch (e) {
        console.warn("Gemini questions generation failed, using mock generator.");
      }
    }

    // Mock Questions
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      questions: [
        {
          question: `Can you explain the difference between virtual DOM and real DOM, and how React processes updates?`,
          category: "Technical",
          difficulty: difficulty,
          sampleAnswer: "The virtual DOM is an in-memory representation of the real HTML DOM. When a component's state changes, React updates the virtual DOM first. Then, it runs a diffing algorithm (reconciliation) to find the minimum changes and batches the updates to the real DOM, avoiding heavy re-renders.",
          tips: ["Mention the reconciliation process", "Discuss batching of state updates", "Explain why manipulation of real DOM is slow"]
        },
        {
          question: `Where do you see yourself in 5 years, and how does this role align with your goals?`,
          category: "HR",
          difficulty: difficulty,
          sampleAnswer: "In five years, I hope to grow into a senior technical lead role, driving architecture design. This junior developer role is a perfect start as it exposes me to production environments, structured mentoring, and advanced technologies where I can consolidate my skills.",
          tips: ["Keep it professional, not personal", "Connect the role directly to your trajectory", "Express willingness to stay and grow in the company"]
        },
        {
          question: `Tell me about a time you worked in a team and faced a major disagreement. How did you resolve it?`,
          category: "Behavioral",
          difficulty: difficulty,
          sampleAnswer: "During our graduation project, two team members disagreed on using SQL vs MongoDB. I set up a evaluation chart comparing read speed, schema flexibility, and query complexness. We reviewed the criteria objectively and agreed on PostgreSQL, satisfying both parties.",
          tips: ["Use the STAR method", "Focus on communication and logic, not emotions", "End with the positive outcome"]
        },
        {
          question: `If a production service goes down on a weekend and your manager is unreachable, what actions would you take?`,
          category: "Situational",
          difficulty: difficulty,
          sampleAnswer: "I would first check error logs and alert dashboards to identify the root issue. If it was a quick rollback, I would initiate it. If not, I would page our secondary standby engineer, document everything on Slack, and email a summary once resolved.",
          tips: ["Demonstrate responsibility and initiative", "Emphasize collaboration and safety procedures", "Highlight documenting actions"]
        }
      ],
      generalTips: [
        "Take a breath of 3 seconds before answering complex questions.",
        "Structure your technical answers using 'What', 'How', and 'Why'.",
        "It is completely fine to say 'I don't know the exact answer, but here is how I would approach it.'"
      ],
      commonMistakes: [
        "Rushing into coding answers without asking clarifying constraints.",
        "Speaking negatively about previous colleges, teammates, or projects.",
        "Answering with single-word replies without explaining your reasoning."
      ],
      bodyLanguageTips: [
        "Keep eye contact with the camera, not just the screen.",
        "Maintain a straight, confident posture to reflect calm energy.",
        "Nod periodically to demonstrate active listening during discussions."
      ]
    };
  },

  // 4. Mock Interview Answer Evaluation
  evaluateInterviewAnswer: async (question: string, answer: string): Promise<any> => {
    console.log(`Evaluating interview answer. API status: ${GEMINI_API_KEY ? "Active" : "Mock"}`);

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Question: ${question}\nStudent Answer: ${answer}\n\nEvaluate and give feedback.`;
        const schema = `{
          score: number,
          quality: string,
          relevance: string,
          confidence: string,
          communication: string,
          clarity: string,
          suggestions: string,
          improvedAnswer: string
        }`;
        return await callGemini(prompt, schema);
      } catch (e) {
        console.warn("Gemini evaluation failed, falling back to mock evaluation.");
      }
    }

    // Mock Evaluation
    await new Promise(resolve => setTimeout(resolve, 800));
    const wordCount = answer.trim().split(/\s+/).length;
    let score = 55;
    let quality = "Needs Improvement";
    let relevance = "Partial relevance. Answer lacks specific details or keywords.";
    let confidence = "Moderate. Tones feel slightly hesitant or short.";
    let communication = "Clear but too brief. Needs elaboration.";
    let clarity = "Grammar is correct, but the explanation is too simple.";
    let suggestions = "Explain key terms. Give a practical example from a project you completed.";
    let improvedAnswer = "I believe the Virtual DOM is a performance optimization layer. For example, in a React app I built, when a list item changes, React updates the virtual DOM list first and re-renders only that specific item in the browser, saving unnecessary renders.";

    if (wordCount > 30) {
      score = 82;
      quality = "Good Answer";
      relevance = "Highly relevant. Touches upon key concepts of virtual DOM and reconciliation.";
      confidence = "Strong and professional articulation.";
      communication = "Good structure and pace. Clear flow of ideas.";
      clarity = "Well explained. Easily understandable technical breakdown.";
      suggestions = "Flesh out details about reconciliation diffing algorithms and render cycles.";
      improvedAnswer = `Excellent structure. A slightly stronger version: "React utilizes an in-memory Virtual DOM cache. On state changes, it performs a diffing algorithm (reconciliation) and groups the modifications in a single update, improving UI responsiveness."`;
    }

    return {
      score,
      quality,
      relevance,
      confidence,
      communication,
      clarity,
      suggestions,
      improvedAnswer
    };
  },

  // 5. Self Introduction Practice Feedback
  evaluateSelfIntroduction: async (introductionText: string): Promise<any> => {
    console.log(`Evaluating self introduction. API status: ${GEMINI_API_KEY ? "Active" : "Mock"}`);

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Evaluate this student's self introduction:\n"${introductionText}"`;
        const schema = `{
          score: number,
          grammarSuggestions: string[],
          clarityFeedback: string,
          confidenceTips: string,
          betterVersion: string
        }`;
        return await callGemini(prompt, schema);
      } catch (e) {
        console.warn("Gemini intro evaluation failed, using mock feedback.");
      }
    }

    // Mock Evaluation
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const wordCount = introductionText.trim().split(/\s+/).length;
    const baseScore = wordCount < 20 ? 50 : Math.min(95, 65 + Math.floor(wordCount / 5));

    return {
      score: baseScore,
      grammarSuggestions: [
        "Replace 'I am having skills in' with 'I am skilled in' or 'My core skills include'.",
        "Capitalize technology names correctly, e.g., 'javascript' to 'JavaScript' and 'react' to 'React'."
      ],
      clarityFeedback: wordCount < 30 
        ? "Your introduction is too short. It should ideally be 1-2 minutes long (about 120-180 words) and cover your background, key projects, and career interests."
        : "Good structure, but could benefit from a clearer hook. Ensure you structure your narrative chronologically: Education -> Core Projects -> Goals.",
      confidenceTips: "Ensure you state your achievements directly without hesitating phrases like 'I think' or 'I just'. Speak at a moderate pace, about 130 words per minute.",
      betterVersion: `Hello, thank you for this opportunity. My name is [Name], and I am graduating with a degree in Computer Science from [College] in [Year]. My core technical interests lie in full-stack development, specifically using React, Node.js, and Express. Recently, I developed a collaborative student career platform that handles resume scanning and mock tests. I am eager to apply my development skills to your team and grow as a software engineer.`
    };
  }
};
