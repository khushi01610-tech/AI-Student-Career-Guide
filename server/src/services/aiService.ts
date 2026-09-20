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

    // Mock Questions calibrated to Tier / Difficulty
    await new Promise(resolve => setTimeout(resolve, 800));

    const diffLower = (difficulty || "").toLowerCase();

    // 🔴 1. GOOGLE / FAANG TIER (Hard / Advanced)
    if (diffLower.includes("google") || diffLower.includes("faang") || diffLower.includes("hard") || diffLower.includes("senior")) {
      return {
        questions: [
          {
            question: "Given a massive stream of integers coming from millions of client devices, design an algorithm to find the Median in O(1) time and O(N) space. How would you handle distributed workers?",
            category: "Advanced Algorithms & DSA",
            difficulty: "Google / FAANG Level",
            companyTag: "Google",
            sampleAnswer: "For a single machine, we use a Two-Heap approach: a Max-Heap for the smaller half and a Min-Heap for the larger half, maintaining a balance where heaps differ in size by at most 1. Inserting takes O(log N) and finding median is O(1). In a distributed environment with millions of streams, an exact median requires distributed histogram bucketing or Count-Min Sketch / Q-Digest quantile approximations across worker nodes.",
            tips: ["Explain the Two-Heap balancing invariant", "Analyze space complexity and re-balancing time", "Discuss approximate distributed medians (t-digest / HyperLogLog)"]
          },
          {
            question: "Design a Distributed Rate Limiter capable of handling 500,000 requests per second across multi-region data centers. Explain race condition handling and algorithm trade-offs.",
            category: "System Design & Architecture",
            difficulty: "Google / FAANG Level",
            companyTag: "Google / Meta",
            sampleAnswer: "We evaluate Token Bucket vs Sliding Window Counter. Sliding Window Counter offers higher accuracy without sudden token bursts. We store counter buckets in a Redis Cluster with Lua scripts to guarantee atomic read-modify-write operations, preventing race conditions. To avoid global cross-region latency, we deploy local Redis instances with periodic asynchronous synchronization to a central cluster using eventual consistency.",
            tips: ["Compare Token Bucket vs Sliding Window Log vs Counter", "Mention Redis Lua scripts for atomic operations", "Address multi-datacenter clock drift and latency"]
          },
          {
            question: "How does the Go/Java runtime detect and handle deadlocks, and how does the Linux Kernel prevent priority inversion in real-time preemptive scheduling?",
            category: "Concurrency & OS Internals",
            difficulty: "Google / FAANG Level",
            companyTag: "Google / Netflix",
            sampleAnswer: "Operating systems detect deadlocks via Resource Allocation Graphs and cycle-finding algorithms (Tarjan's or Banker's Algorithm). Priority inversion occurs when a low-priority thread holds a lock needed by a high-priority thread while a medium-priority thread starves it. Linux resolves this via Priority Inheritance (e.g., rt_mutex in real-time kernel), temporarily elevating the low-priority thread's priority to that of the highest waiting thread.",
            tips: ["Define Priority Inversion clearly", "Explain Priority Inheritance Protocol (PIP) and Ceiling Protocol", "Discuss lock-free data structures (CAS)"]
          },
          {
            question: "Tell me about a time you identified an architectural bottleneck that others missed, or when you had to advocate for a non-trivial refactoring against tight product deadlines (Googleyness & Leadership).",
            category: "Behavioral & Googleyness",
            difficulty: "Google / FAANG Level",
            companyTag: "Google",
            sampleAnswer: "In our university distributed lab project, our microservices experienced 4-second latency spikes under load. The team blamed network bandwidth. Profiling with OpenTelemetry revealed N+1 query loops in our ORM and unindexed foreign keys. I presented benchmark data comparing response times (4s vs 110ms with batching) and convinced the team to spend 2 days adding DataLoader patterns and compound indexes before launching.",
            tips: ["Use data and benchmarks to justify engineering decisions", "Show humility and collaboration", "Tie results back to user experience and system reliability"]
          }
        ],
        generalTips: [
          "State your assumptions and verify scale constraints (QPS, read/write ratio, latency SLA) before coding.",
          "Think out loud: interviewers assess your thought process and problem decomposition more than memorized code.",
          "Analyze Big-O time and space complexity proactively without being asked."
        ],
        commonMistakes: [
          "Jumping straight to coding without discussing edge cases (null inputs, integer overflows, cycles).",
          "Being defensive when an interviewer gives a counterexample or suggests a hint.",
          "Ignoring memory/space limits in high-scale scenarios."
        ],
        bodyLanguageTips: [
          "Actively use a virtual whiteboard or structured bullet points to sketch your approach.",
          "Maintain a steady, deliberate pace instead of rushing words."
        ]
      };
    }

    // 🟡 2. PRODUCT MEDIUM TIER (Unicorns: Swiggy, Razorpay, Flipkart, Uber, Atlassian)
    if (diffLower.includes("medium") || diffLower.includes("product") || diffLower.includes("mid")) {
      return {
        questions: [
          {
            question: "Given a Binary Tree, find the Lowest Common Ancestor (LCA) of two given nodes without storing parent pointers. What is the optimal time and space complexity?",
            category: "Data Structures & Algorithms",
            difficulty: "Product Medium Level",
            companyTag: "Swiggy / Flipkart",
            sampleAnswer: "We use a recursive post-order traversal. If the current root is null or matches either node p or q, return root. Recurse for left and right subtrees. If both left and right return non-null, the current node is the LCA. If only one returns non-null, propagate that node upward. Time complexity is O(N) as each node is visited once, and space complexity is O(H) for recursion stack.",
            tips: ["Highlight post-order DFS logic", "Distinguish between BST (O(H)) and normal Binary Tree (O(N))", "Handle cases where node does not exist"]
          },
          {
            question: "Explain how database indexing works under the hood (B+ Tree vs Hash Index). Why are B+ Trees favored for relational databases, and when does an index cause performance degradation?",
            category: "Databases & Backend Engineering",
            difficulty: "Product Medium Level",
            companyTag: "Razorpay / Uber",
            sampleAnswer: "B+ Trees store all actual data pointers in leaf nodes linked sequentially, making range queries (BETWEEN, >, <) extremely fast in O(log N). Internal nodes only store keys and routing pointers. Hash indexes offer O(1) lookups but cannot support range scans or sorting. Indexes degrade performance during heavy WRITE/INSERT operations because the database must rebalance the tree and update index pages on every mutation.",
            tips: ["Explain leaf node linked list pointers for range scans", "Discuss write amplification and maintenance overhead", "Mention composite indexes and leftmost prefix rule"]
          },
          {
            question: "How do you prevent race conditions when updating student wallet balances or inventory stock in an e-commerce microservices architecture?",
            category: "Concurrency & Microservices",
            difficulty: "Product Medium Level",
            companyTag: "Razorpay / Swiggy",
            sampleAnswer: "At the database level, we can use Pessimistic Locking (SELECT ... FOR UPDATE) or Optimistic Locking with a version column (UPDATE items SET stock = stock - 1, version = version + 1 WHERE id = 1 AND version = current_version). In distributed services, we use Redis Distributed Locks (Redlock algorithm) or database-level idempotent operations with unique transaction IDs.",
            tips: ["Contrast Optimistic vs Pessimistic locking trade-offs", "Explain idempotency keys for payment APIs", "Discuss distributed lock expiration safety"]
          },
          {
            question: "Describe a project where you had to balance feature delivery speed against code quality or technical debt. How did you decide what trade-offs to make?",
            category: "Behavioral & Engineering Ownership",
            difficulty: "Product Medium Level",
            companyTag: "Atlassian / Flipkart",
            sampleAnswer: "During a hackathon campus project, we needed a notification system ready in 48 hours. Instead of setting up a dedicated Kafka broker and worker fleet, we implemented an in-memory queue with SQLite persistence for MVP delivery, while documenting the exact Redis/Kafka migration plan. Once the initial release stabilized, we scheduled a sprint to refactor it to Pub/Sub without affecting user functionality.",
            tips: ["Highlight deliberate trade-offs rather than accidental tech debt", "Show business empathy and awareness of shipping deadlines", "Explain follow-up remediation steps"]
          }
        ],
        generalTips: [
          "Relate technical answers to production scenarios (e.g., latency, caching, database connection pooling).",
          "Focus on clean code, modular functions, and meaningful variable names."
        ],
        commonMistakes: [
          "Assuming database queries are free and ignoring indexing or N+1 queries.",
          "Neglecting error handling and HTTP status codes in API discussions."
        ],
        bodyLanguageTips: [
          "Speak with enthusiasm when discussing projects you built from scratch."
        ]
      };
    }

    // 🟢 3. COLLEGE / CAMPUS PLACEMENT TIER (Foundational - TCS Digital, Infosys, Wipro, College Drives)
    return {
      questions: [
        {
          question: "Explain the Four Pillars of Object-Oriented Programming (OOP) with real-world examples in Java or C++. How does runtime polymorphism differ from compile-time polymorphism?",
          category: "Core CS Fundamentals (OOPs)",
          difficulty: "College Placement Level",
          companyTag: "TCS Digital / Infosys / Wipro",
          sampleAnswer: "The four pillars are Encapsulation (wrapping data and methods into a single class with access specifiers), Abstraction (hiding internal implementation details using interfaces/abstract classes), Inheritance (reusing parent class properties in child classes), and Polymorphism (ability to take multiple forms). Compile-time polymorphism is achieved via Method Overloading (same method name with different parameter signatures resolved at compile time), whereas Runtime Polymorphism is achieved via Method Overriding using virtual functions or @Override annotations resolved dynamically via vtables.",
          tips: ["Give a clear Real-world example (e.g., Vehicle class with Car child)", "Explain the role of 'private' vs 'public' for Encapsulation", "State the difference between Overloading and Overriding"]
        },
        {
          question: "What are ACID properties in DBMS? Explain 1NF, 2NF, and 3NF normalization with a student table example.",
          category: "Databases (DBMS & SQL)",
          difficulty: "College Placement Level",
          companyTag: "Cognizant / Accenture / Deloitte",
          sampleAnswer: "ACID stands for Atomicity (all or nothing), Consistency (preserves database constraints), Isolation (concurrent transactions don't interfere), and Durability (committed changes survive system crashes). Normalization reduces data redundancy: 1NF requires atomic values in every column (no comma-separated lists); 2NF requires 1NF and no partial dependencies (every non-prime attribute fully depends on the primary key); 3NF requires 2NF and no transitive dependencies (non-prime attributes depend only on the primary key, not on another non-prime attribute).",
          tips: ["Break down each letter of ACID with 1 line explanation", "Show how a Student table with multiple phone numbers violates 1NF", "Explain why normalization is preferred over denormalization in OLTP"]
        },
        {
          question: "What is the difference between a Process and a Thread? What are the 4 necessary conditions for a Deadlock to occur?",
          category: "Operating Systems (OS)",
          difficulty: "College Placement Level",
          companyTag: "TCS / Infosys",
          sampleAnswer: "A Process is an executing program with its own dedicated memory address space (Heap, Stack, Code, Data). A Thread is a lightweight unit of execution within a process that shares the heap, global variables, and open files, but has its own call stack and program counter. The 4 Coffman conditions for a deadlock are: 1. Mutual Exclusion (non-shareable resources), 2. Hold and Wait (process holds one resource while waiting for another), 3. No Preemption (resources cannot be forcibly confiscated), 4. Circular Wait (a closed loop chain of processes waiting on each other).",
          tips: ["Mention that context switching between threads is faster than processes", "Name the 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait", "Provide the Dining Philosophers analogy if asked"]
        },
        {
          question: "Walk me through your resume and final-year capstone project. What was your personal contribution, and what was the biggest technical challenge you resolved?",
          category: "Placement HR & Capstone Presentation",
          difficulty: "College Placement Level",
          companyTag: "Campus HR Round",
          sampleAnswer: "I am a final-year student passionate about full-stack engineering. For our capstone project, our team built an AI-assisted Student Career Guide. My primary role was architecting the backend Express API and database models, as well as integrating responsive UI dashboards in React. Our biggest challenge was handling asynchronous resume parsing latency; I resolved this by introducing optimistic UI updates and background task queues, reducing perceived user waiting time by 40%.",
          tips: ["Keep your introduction under 90 seconds", "Highlight what YOU specifically coded, not just what the team did", "Mention technologies used and end with the outcome or impact"]
        }
      ],
      generalTips: [
        "Be crystal clear on your basic definitions (OOPs, DBMS, OS, Data Structures).",
        "Practice writing syntactically correct code on paper or a plain text editor without auto-complete.",
        "Be honest about your resume: only list technologies you can confidently explain."
      ],
      commonMistakes: [
        "Memorizing definitions without being able to write a 5-line code snippet demonstrating it.",
        "Saying 'we did this' for the entire project without clarifying your individual role.",
        "Giving up immediately when asked an unfamiliar question instead of reasoning through the basics."
      ],
      bodyLanguageTips: [
        "Sit straight, smile, and speak audibly.",
        "Acknowledge questions politely with 'Thank you, sir/ma'am, let me explain...'"
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
