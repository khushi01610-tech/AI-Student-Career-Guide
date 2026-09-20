import { fallbackDb } from "./fallbackDb";
import { checkFallback } from "./db";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Post } from "../models/Post";
import { Video } from "../models/Video";
import { Session } from "../models/Session";
import { LearningResource } from "../models/LearningResource";
import { Company } from "../models/Company";
import { Mentor } from "../models/Mentor";
import bcrypt from "bcryptjs";

export const seedData = async () => {
  console.log("Checking if seed data is needed...");

  try {
    // Check and seed Companies
    const companiesCount = checkFallback() 
      ? fallbackDb.getCollection("companies").length 
      : await Company.countDocuments();

    if (companiesCount === 0) {
      console.log("Seeding company placement archives...");
      const mockCompanies = [
        {
          name: "Google",
          slug: "google",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
          industry: "Internet & Cloud Technology",
          headquarters: "Mountain View, CA (Offices: Bengaluru, Hyderabad)",
          rolesHiring: ["Software Engineer (L3)", "Associate Product Manager", "Site Reliability Engineer"],
          packageRange: "₹35 - ₹55 LPA",
          cgpaCutoff: 7.5,
          eligibleBranches: ["Computer Science", "Information Technology", "Electronics & Comm", "Maths & Computing"],
          hiringSeason: "July - November (Campus & Off-Campus)",
          alumniHiredCount: 42,
          selectionRounds: [
            {
              roundNumber: 1,
              name: "Online Assessment (OA)",
              type: "Online Assessment",
              duration: "90 Mins",
              description: "2 algorithmic coding challenges testing advanced graph theory, dynamic programming, or bit manipulation.",
              focusTopics: ["Graphs", "Dynamic Programming", "Sliding Window", "Recursion"]
            },
            {
              roundNumber: 2,
              name: "Technical Round 1: Data Structures",
              type: "Technical Interview",
              duration: "45 Mins",
              description: "Live coding on Google Docs / CoderPad. Strong focus on time/space complexity analysis and edge-case handling.",
              focusTopics: ["Trees & Tries", "Heaps", "Hash Tables", "O(N) Optimizations"]
            },
            {
              roundNumber: 3,
              name: "Technical Round 2: Algorithms & Design",
              type: "Technical Interview",
              duration: "45 Mins",
              description: "Open-ended algorithmic problem with scaling constraints, modular design, and clean code principles.",
              focusTopics: ["Divide and Conquer", "BFS/DFS", "Greedy Algorithms", "Code Cleanliness"]
            },
            {
              roundNumber: 4,
              name: "Googliness & Leadership",
              type: "Managerial / HR",
              duration: "45 Mins",
              description: "Behavioral interview testing intellectual humility, navigating ambiguity, ethical problem-solving, and team collaboration.",
              focusTopics: ["Handling Ambiguity", "Disagree and Commit", "Ethical Decision Making", "Diversity"]
            }
          ],
          pastQuestions: [
            {
              question: "Given a directed dependency graph of package builds, find if a deadlock cycle exists and output the build order.",
              topic: "Topological Sort / Graphs",
              difficulty: "Medium",
              round: "Technical Round 1",
              frequency: "High"
            },
            {
              question: "Design a rate limiter for an API endpoint allowing maximum K requests per second per user IP.",
              topic: "System Design / Sliding Window",
              difficulty: "Hard",
              round: "Technical Round 2",
              frequency: "High"
            },
            {
              question: "Tell me about a technical project where requirements changed midway through. How did you adapt your architecture?",
              topic: "Behavioral",
              difficulty: "Medium",
              round: "Googliness",
              frequency: "High"
            }
          ],
          prepTips: [
            "Never start coding immediately. Clarify boundary conditions and input constraints with the interviewer first.",
            "Explain your brute-force logic in 2 minutes, then optimize to O(N) or O(log N) before writing code.",
            "Practice communicating your thought process out loud while writing syntax."
          ]
        },
        {
          name: "Amazon",
          slug: "amazon",
          logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
          industry: "E-Commerce & Cloud Infrastructure (AWS)",
          headquarters: "Seattle, WA (Offices: Bengaluru, Hyderabad, Chennai)",
          rolesHiring: ["SDE-1 (Software Development Engineer)", "Cloud Support Associate", "Data Engineer"],
          packageRange: "₹28 - ₹45 LPA",
          cgpaCutoff: 7.0,
          eligibleBranches: ["Computer Science", "Information Technology", "Electronics", "Electrical Engineering"],
          hiringSeason: "August - February",
          alumniHiredCount: 58,
          selectionRounds: [
            {
              roundNumber: 1,
              name: "Online Assessment (OA 1 & 2)",
              type: "Online Assessment",
              duration: "105 Mins",
              description: "Debugging section (7 code fixes), followed by 2 standard coding problems and Amazon Work Style Assessment.",
              focusTopics: ["Arrays & Strings", "Binary Search", "HashMaps", "Workstyle Survey"]
            },
            {
              roundNumber: 2,
              name: "Technical Round 1: Core DSA + Leadership",
              type: "Technical Interview",
              duration: "60 Mins",
              description: "20 minutes of Amazon Leadership Principles (Customer Obsession, Ownership) followed by 40 minutes of data structures.",
              focusTopics: ["Trees & BST", "LinkedLists", "Ownership Principle", "Customer Obsession"]
            },
            {
              roundNumber: 3,
              name: "Technical Round 2: Object-Oriented Design",
              type: "Technical Interview",
              duration: "60 Mins",
              description: "Low-level system design (LLD) using OOP patterns like Factory, Singleton, and Strategy.",
              focusTopics: ["OOP Principles", "Design Patterns", "Concurrency", "Bias for Action"]
            },
            {
              roundNumber: 4,
              name: "The Bar Raiser Round",
              type: "Technical Interview",
              duration: "60 Mins",
              description: "Conducted by an independent senior leader from another department evaluating cultural standards and deep technical problem solving.",
              focusTopics: ["Deliver Results", "Invent & Simplify", "Complex DSA", "Failure Recovery"]
            }
          ],
          pastQuestions: [
            {
              question: "Implement an LRU Cache supporting get and put operations in O(1) average time complexity.",
              topic: "Doubly Linked List + HashMap",
              difficulty: "Medium",
              round: "Technical Round 1",
              frequency: "High"
            },
            {
              question: "Design an Object-Oriented Parking Lot system with multiple spot types, billing rates, and ticketing.",
              topic: "Low Level Design (LLD)",
              difficulty: "Medium",
              round: "Technical Round 2",
              frequency: "High"
            },
            {
              question: "Tell me about a time you had to deliver a critical deadline with limited resources. What tradeoffs did you make?",
              topic: "Deliver Results / Bias for Action",
              difficulty: "Medium",
              round: "Bar Raiser",
              frequency: "High"
            }
          ],
          prepTips: [
            "Prepare 2 distinct STAR stories (Situation, Task, Action, Result) for each of the 16 Amazon Leadership Principles.",
            "Write modular, object-oriented code with meaningful variable and function names."
          ]
        },
        {
          name: "Deloitte",
          slug: "deloitte",
          logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
          industry: "Management & Technology Consulting",
          headquarters: "London / New York (Offices: Hyderabad, Gurugram, Mumbai)",
          rolesHiring: ["Analyst - Technology Consulting", "Cyber Risk Analyst", "Business Technology Analyst"],
          packageRange: "₹8.5 - ₹14.5 LPA",
          cgpaCutoff: 6.5,
          eligibleBranches: ["All Engineering Branches", "MCA", "Information Science"],
          hiringSeason: "July - October (Mass & Elite Drives)",
          alumniHiredCount: 84,
          selectionRounds: [
            {
              roundNumber: 1,
              name: "Cognitive & Aptitude Assessment",
              type: "Online Assessment",
              duration: "75 Mins",
              description: "Quantitative aptitude, logical reasoning, verbal comprehension, and fundamental computer science questions.",
              focusTopics: ["Quantitative Aptitude", "Logical Reasoning", "SQL Basics", "Networking Fundamentals"]
            },
            {
              roundNumber: 2,
              name: "Technical Interview & Case Study",
              type: "Technical Interview",
              duration: "45 Mins",
              description: "Evaluation of academic projects, relational database queries (SQL), OOP, and a short business technology case study.",
              focusTopics: ["SQL Queries (Joins, Aggregation)", "OOP Concepts", "Final Year Project", "Cloud Basics"]
            },
            {
              roundNumber: 3,
              name: "Partner & HR Fitment Round",
              type: "Managerial / HR",
              duration: "30 Mins",
              description: "Conversation with a Partner/Director on client interaction confidence, analytical mindset, and career goals.",
              focusTopics: ["Client Communication", "Problem Solving", "Work Under Pressure", "Why Consulting"]
            }
          ],
          pastQuestions: [
            {
              question: "Write an SQL query to retrieve the second highest salary from an Employee table without using the LIMIT clause.",
              topic: "SQL / Subqueries",
              difficulty: "Easy",
              round: "Technical Interview",
              frequency: "High"
            },
            {
              question: "Walk me through how you would help a retail client transition their physical store inventory to an automated digital system.",
              topic: "Business Technology Case",
              difficulty: "Medium",
              round: "Technical Interview",
              frequency: "Medium"
            },
            {
              question: "How do you handle a client who insists on an unfeasible deadline or contradictory project requirement?",
              topic: "Client Stakeholder Management",
              difficulty: "Medium",
              round: "Partner Round",
              frequency: "High"
            }
          ],
          prepTips: [
            "Thoroughly understand every single line of code and tool mentioned on your resume's project section.",
            "Demonstrate crisp verbal communication and structured problem decomposition."
          ]
        },
        {
          name: "Microsoft",
          slug: "microsoft",
          logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
          industry: "Cloud, AI & Productivity Platforms",
          headquarters: "Redmond, WA (Offices: Hyderabad, Bengaluru, Noida)",
          rolesHiring: ["Software Engineer", "Cloud Solutions Architect", "Support Engineer"],
          packageRange: "₹32 - ₹50 LPA",
          cgpaCutoff: 7.5,
          eligibleBranches: ["Computer Science", "Information Technology", "Electronics", "Electrical"],
          hiringSeason: "August - December",
          alumniHiredCount: 39,
          selectionRounds: [
            {
              roundNumber: 1,
              name: "Codility Online Challenge",
              type: "Online Assessment",
              duration: "90 Mins",
              description: "3 algorithmic coding tasks testing string parsing, array transformations, and greedy selection.",
              focusTopics: ["Codility Tests", "Strings & Arrays", "Prefix Sums", "Time Complexity"]
            },
            {
              roundNumber: 2,
              name: "Technical Round 1: DSA & Memory",
              type: "Technical Interview",
              duration: "45 Mins",
              description: "Writing error-free code on Whiteboard/Editor with emphasis on memory pointers, recursion, and recursion depth.",
              focusTopics: ["Recursion & Backtracking", "Linked Lists", "Stack/Queue", "Pointers"]
            },
            {
              roundNumber: 3,
              name: "Technical Round 2: System Architecture",
              type: "Technical Interview",
              duration: "45 Mins",
              description: "Real-time design problem considering concurrency, latency, caching, and scalable storage.",
              focusTopics: ["Concurrency", "Database Indexing", "System Architecture", "API Design"]
            },
            {
              roundNumber: 4,
              name: "AA / Executive Hiring Manager",
              type: "Managerial / HR",
              duration: "45 Mins",
              description: "As Appropriate (AA) round with a Principal Architect or Partner Director evaluating cultural growth mindset.",
              focusTopics: ["Growth Mindset", "Past Failures", "Technology Passions", "Cultural Values"]
            }
          ],
          pastQuestions: [
            {
              question: "Serialize and deserialize a Binary Tree efficiently so it can be transmitted over a network stream.",
              topic: "Binary Trees / String Parsing",
              difficulty: "Medium",
              round: "Technical Round 1",
              frequency: "High"
            },
            {
              question: "Design a collaborative document synchronization mechanism like Word Online or Google Docs.",
              topic: "System Design / Operational Transformation",
              difficulty: "Hard",
              round: "Technical Round 2",
              frequency: "Medium"
            },
            {
              question: "Give an example of a technology you taught yourself recently. What was challenging and how did you overcome it?",
              topic: "Growth Mindset",
              difficulty: "Easy",
              round: "AA Round",
              frequency: "High"
            }
          ],
          prepTips: [
            "Microsoft heavily values clean, readable code with defensive validation checks against null and boundary states.",
            "Highlight instances of your 'Growth Mindset'—how you learn from failures and mentor peers."
          ]
        },
        {
          name: "TCS Digital",
          slug: "tcs-digital",
          logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
          industry: "Global IT Services & Consulting",
          headquarters: "Mumbai, India",
          rolesHiring: ["Digital Cadre Engineer", "Innovator Cadre (Prime)", "Systems Engineer"],
          packageRange: "₹7.5 - ₹11.5 LPA",
          cgpaCutoff: 6.5,
          eligibleBranches: ["All Engineering Branches", "MCA"],
          hiringSeason: "July - September (National Qualifier Test)",
          alumniHiredCount: 120,
          selectionRounds: [
            {
              roundNumber: 1,
              name: "TCS NQT Advanced Cognitive & Coding",
              type: "Online Assessment",
              duration: "120 Mins",
              description: "Advanced quantitative section, logical reasoning, and 2 hands-on coding problems.",
              focusTopics: ["Advanced Quant", "Data Interpretation", "Matrix Operations", "Number Theory"]
            },
            {
              roundNumber: 2,
              name: "Technical & Project Interview",
              type: "Technical Interview",
              duration: "45 Mins",
              description: "Deep dive into DBMS, operating systems, networking, and the candidate's core stack.",
              focusTopics: ["DBMS Normalization", "OS Scheduling", "Project Architecture", "OOP Principles"]
            },
            {
              roundNumber: 3,
              name: "Managerial & HR Interview",
              type: "Managerial / HR",
              duration: "25 Mins",
              description: "Flexibility in technology stacks, relocation willingness, and general awareness of digital trends (Cloud, GenAI).",
              focusTopics: ["Willingness to Learn", "Shift Flexibility", "Digital Trends Awareness", "Team Fit"]
            }
          ],
          pastQuestions: [
            {
              question: "Explain the difference between B-Tree and B+ Tree indexing in Relational Databases.",
              topic: "DBMS / Indexing",
              difficulty: "Medium",
              round: "Technical Interview",
              frequency: "High"
            },
            {
              question: "Given an array of integers, find the maximum subarray sum in O(N) time (Kadane's Algorithm).",
              topic: "Algorithms / Arrays",
              difficulty: "Easy",
              round: "Technical Interview",
              frequency: "High"
            },
            {
              question: "Are you willing to work on modern cloud stacks outside of your college academic curriculum?",
              topic: "HR / Adaptability",
              difficulty: "Easy",
              round: "HR Interview",
              frequency: "High"
            }
          ],
          prepTips: [
            "Score highly in the Advanced Quantitative section of the NQT to be shortlisted for the higher Digital/Prime package.",
            "Be prepared to write code for basic algorithms (sorting, searching, reversal) without IDE auto-complete."
          ]
        }
      ];

      if (checkFallback()) {
        for (const comp of mockCompanies) {
          fallbackDb.insert("companies", comp);
        }
      } else {
        await Company.insertMany(mockCompanies);
      }
      console.log("Seeded companies.");
    }

    // Check and seed Mentors
    const mentorsCount = checkFallback()
      ? fallbackDb.getCollection("mentors").length
      : await Mentor.countDocuments();

    if (mentorsCount === 0) {
      console.log("Seeding alumni mentors...");
      const mockMentors = [
        {
          name: "Rohan Verma",
          college: "IIT Bombay",
          graduationYear: 2022,
          currentCompany: "Microsoft",
          currentRole: "Software Engineer II",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          domains: ["Software Engineering", "System Design", "DSA & Algorithms"],
          bio: "Alumni from IIT Bombay CSE batch of '22. Currently working on Microsoft 365 core services. Mentored 40+ students to crack Tier-1 product companies.",
          rating: 4.95,
          reviewsCount: 38,
          linkedinUrl: "https://linkedin.com/in/rohan-verma-mentor",
          availableSlots: ["Tomorrow 6:00 PM", "Saturday 11:00 AM", "Sunday 4:00 PM"]
        },
        {
          name: "Ananya Sen",
          college: "BITS Pilani",
          graduationYear: 2023,
          currentCompany: "Google",
          currentRole: "Associate Product Manager",
          avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
          domains: ["Product Management", "Resume Review", "Behavioral & STAR"],
          bio: "APM at Google Bengaluru. Passionate about helping students structure behavioral answers, design product cases, and clean up resume impact metrics.",
          rating: 4.98,
          reviewsCount: 45,
          linkedinUrl: "https://linkedin.com/in/ananya-sen-apm",
          availableSlots: ["Friday 7:30 PM", "Saturday 2:00 PM", "Sunday 11:00 AM"]
        },
        {
          name: "Karthik Nair",
          college: "NIT Trichy",
          graduationYear: 2021,
          currentCompany: "Deloitte",
          currentRole: "Senior Tech Consultant",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          domains: ["Consulting", "SQL & DBMS", "Case Studies", "Aptitude Strategy"],
          bio: "Consulting lead at Deloitte Advisory. Conducted 100+ campus screening interviews. Helping candidates ace case studies, business scenarios, and SQL tests.",
          rating: 4.91,
          reviewsCount: 52,
          linkedinUrl: "https://linkedin.com/in/karthik-nair-consultant",
          availableSlots: ["Thursday 8:00 PM", "Saturday 5:00 PM"]
        },
        {
          name: "Priya Deshmukh",
          college: "Stanford University",
          graduationYear: 2023,
          currentCompany: "Amazon",
          currentRole: "Applied Scientist / SDE",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
          domains: ["Data Science", "Machine Learning", "Python & DSA"],
          bio: "Working on AWS SageMaker personalization models. Happy to do mock coding rounds, review GitHub portfolios, and share Amazon interview secrets.",
          rating: 4.97,
          reviewsCount: 29,
          linkedinUrl: "https://linkedin.com/in/priya-deshmukh-amazon",
          availableSlots: ["Tomorrow 8:30 PM", "Sunday 6:00 PM"]
        }
      ];

      if (checkFallback()) {
        for (const m of mockMentors) {
          fallbackDb.insert("mentors", m);
        }
      } else {
        await Mentor.insertMany(mockMentors);
      }
      console.log("Seeded alumni mentors.");
    }

    // 1. Check if users are seeded
    let usersCount = 0;
    if (checkFallback()) {
      usersCount = fallbackDb.getCollection("users").length;
    } else {
      usersCount = await User.countDocuments();
    }

    if (usersCount > 0) {
      console.log("Users already populated. Skipping core user seeding.");
      return;
    }

    console.log("Seeding database...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("student123", salt);

    // Mock Users
    const mockUsers = [
      {
        name: "Aarav Sharma",
        email: "aarav@iit.edu",
        password: hashedPassword,
        college: "IIT Bombay",
        course: "B.Tech",
        branch: "Computer Science",
        graduationYear: 2027,
        skills: ["React", "TypeScript", "Node.js", "Python", "Data Structures"],
        careerGoal: "Full Stack Developer"
      },
      {
        name: "Sarah Jenkins",
        email: "sarah@stanford.edu",
        password: hashedPassword,
        college: "Stanford University",
        course: "M.S.",
        branch: "Data Science",
        graduationYear: 2026,
        skills: ["Python", "SQL", "Pandas", "PyTorch", "Statistics"],
        careerGoal: "Data Analyst"
      },
      {
        name: "Michael Chen",
        email: "mchen@mit.edu",
        password: hashedPassword,
        college: "MIT",
        course: "B.S.",
        branch: "Electrical Engineering",
        graduationYear: 2027,
        skills: ["C++", "Python", "Embedded Systems", "MATLAB"],
        careerGoal: "Embedded Software Engineer"
      }
    ];

    let createdUsers: any[] = [];
    if (checkFallback()) {
      for (const u of mockUsers) {
        const user = fallbackDb.insert("users", u);
        createdUsers.push(user);
        
        fallbackDb.insert("profiles", {
          user: user._id,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
          bio: `Student at ${user.college} | Aspiring ${user.careerGoal}`,
          projects: [
            { title: "AI Search Optimizer", description: "Improved search queries indexing speed by 15%", technologies: ["Python", "ElasticSearch"] }
          ],
          achievements: ["Winner of College Hackathon 2025", "Dean's List 2024"],
          resumeScore: 82,
          atsScore: 78,
          interviewScore: 85,
          communicationScore: 80,
          skillsCompleted: 3,
          mockInterviewsCompleted: 2,
          communityContributions: 5
        });
      }
    } else {
      for (const u of mockUsers) {
        const user = new User(u);
        const savedUser = await user.save();
        createdUsers.push(savedUser);

        const newProfile = new Profile({
          user: savedUser._id,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(savedUser.name)}`,
          bio: `Student at ${savedUser.college} | Aspiring ${savedUser.careerGoal}`,
          projects: [
            { title: "AI Search Optimizer", description: "Improved search queries indexing speed by 15%", technologies: ["Python", "ElasticSearch"] }
          ],
          achievements: ["Winner of College Hackathon 2025", "Dean's List 2024"],
          resumeScore: 82,
          atsScore: 78,
          interviewScore: 85,
          communicationScore: 80,
          skillsCompleted: 3,
          mockInterviewsCompleted: 2,
          communityContributions: 5
        });
        await newProfile.save();
      }
    }

    console.log(`Seeded ${createdUsers.length} users and profiles.`);

    // Mock Posts (Community & Career Hub)
    const mockPosts = [
      {
        authorName: "Aarav Sharma",
        authorCollege: "IIT Bombay",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav%20Sharma",
        content: "Just finished a backend internship interview at a mid-sized startup. They focused heavily on databases indexing and REST API constraints. Pro-tip: make sure you can explain why you choose MongoDB over PostgreSQL for nested document schemas!",
        tags: ["Interview", "Coding", "Placement"],
        likes: [createdUsers[1]._id.toString()],
        comments: [
          {
            user: createdUsers[1]._id.toString(),
            name: "Sarah Jenkins",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Jenkins",
            college: "Stanford University",
            content: "Agreed! Understanding schema trade-offs is a favorite question of recruiters.",
            createdAt: new Date()
          }
        ],
        savedBy: [],
        isHubResource: false
      },
      {
        authorName: "Sarah Jenkins",
        authorCollege: "Stanford University",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Jenkins",
        content: "To anyone preparing resumes: PLEASE remove formatting tables, complex graphics, and rating skills with stars (e.g. 'Java: ⭐⭐⭐⭐'). ATS scanners read them as complete gibberish and it drops your score immediately. Stick to a single-column clean markdown or Word layout.",
        tags: ["Resume", "Career", "General"],
        likes: [createdUsers[0]._id.toString(), createdUsers[2]._id.toString()],
        comments: [],
        savedBy: [createdUsers[0]._id.toString()],
        isHubResource: false
      },
      // Career Hub Curated Resources (Admin-like posts)
      {
        authorName: "CareerGuide AI",
        authorCollege: "System Coach",
        authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CareerGuide",
        content: "### Ultimate Placement Preparation Guide 🎓\n\nHere is a 3-step checklist to ensure you are placement ready:\n\n1. **Format Your Resume:** Ensure it contains active verbs and measurable outcomes. Use our AI Resume Analyzer to get your score.\n2. **Master Communication:** Speak slowly and clearly. Practice your 1-minute elevator pitch under our Communication Practise Tab.\n3. **Schedule Mock Panels:** Form group interview rooms with students in other colleges to practice live coding questions under the Collaboration panel.",
        tags: ["Placement", "Interview", "Career"],
        likes: [createdUsers[0]._id.toString(), createdUsers[1]._id.toString(), createdUsers[2]._id.toString()],
        comments: [],
        savedBy: [createdUsers[0]._id.toString(), createdUsers[1]._id.toString()],
        isHubResource: true,
        category: "Placement Preparation"
      },
      {
        authorName: "CareerGuide AI",
        authorCollege: "System Coach",
        authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CareerGuide",
        content: "### How to Master Soft Skills in Tech Interviews 🤝\n\nTechnical prowess is only half the battle. Recruiters look for behavioral attributes:\n\n* **Active Listening:** Always repeat or clarify a question before jumping into the solution.\n* **Humility:** If you get stuck on a coding challenge, explain your thoughts and ask for hints. Never stay completely silent.\n* **Growth Mindset:** Frame failures as valuable learning experiences when telling story prompts.",
        tags: ["Career", "General"],
        likes: [createdUsers[2]._id.toString()],
        comments: [],
        savedBy: [],
        isHubResource: true,
        category: "Soft Skills"
      }
    ];

    if (checkFallback()) {
      for (const p of mockPosts) {
        // Find creator or default to first created user
        const creatorId = p.authorName === "Aarav Sharma" ? createdUsers[0]._id : 
                          p.authorName === "Sarah Jenkins" ? createdUsers[1]._id : 
                          createdUsers[2]._id; // System coach is mock author

        fallbackDb.insert("posts", {
          ...p,
          author: creatorId
        });
      }
    } else {
      for (const p of mockPosts) {
        const creatorId = p.authorName === "Aarav Sharma" ? createdUsers[0]._id : 
                          p.authorName === "Sarah Jenkins" ? createdUsers[1]._id : 
                          createdUsers[2]._id;
        const post = new Post({
          ...p,
          author: creatorId
        });
        await post.save();
      }
    }
    console.log("Seeded posts.");

    // Seed mock videos
    const mockVideos = [
      {
        title: "5 Crucial Tips to Ace Technical Interviews",
        creatorName: "Aarav Sharma",
        creatorCollege: "IIT Bombay",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav%20Sharma",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder clip
        thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
        category: "Interview Tips",
        views: 124,
        likes: [createdUsers[1]._id.toString()]
      },
      {
        title: "How I Structured My Resume to Land a FAANG Interview",
        creatorName: "Sarah Jenkins",
        creatorCollege: "Stanford University",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Jenkins",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60",
        category: "Resume tips",
        views: 310,
        likes: [createdUsers[0]._id.toString(), createdUsers[2]._id.toString()]
      }
    ];

    if (checkFallback()) {
      for (const v of mockVideos) {
        const creatorId = v.creatorName === "Aarav Sharma" ? createdUsers[0]._id : createdUsers[1]._id;
        fallbackDb.insert("videos", {
          ...v,
          creator: creatorId
        });
      }
    } else {
      for (const v of mockVideos) {
        const creatorId = v.creatorName === "Aarav Sharma" ? createdUsers[0]._id : createdUsers[1]._id;
        const video = new Video({
          ...v,
          creator: creatorId
        });
        await video.save();
      }
    }
    console.log("Seeded videos.");

    // Seed mock collaboration sessions
    const mockSessions = [
      {
        role: "Frontend Developer Peer Mock",
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days later
        creatorName: "Aarav Sharma",
        creatorCollege: "IIT Bombay",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav%20Sharma",
        participants: [createdUsers[2]._id.toString()],
        maxParticipants: 3,
        meetingLink: "https://meet.google.com/abc-defg-hij",
        status: "upcoming"
      },
      {
        role: "Data Analyst Case Prep",
        dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days later
        creatorName: "Sarah Jenkins",
        creatorCollege: "Stanford University",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Jenkins",
        participants: [],
        maxParticipants: 2,
        meetingLink: "https://meet.google.com/xyz-uvwx-123",
        status: "upcoming"
      }
    ];

    if (checkFallback()) {
      for (const s of mockSessions) {
        const creatorId = s.creatorName === "Aarav Sharma" ? createdUsers[0]._id : createdUsers[1]._id;
        fallbackDb.insert("sessions", {
          ...s,
          creator: creatorId
        });
      }
    } else {
      for (const s of mockSessions) {
        const creatorId = s.creatorName === "Aarav Sharma" ? createdUsers[0]._id : createdUsers[1]._id;
        const session = new Session({
          ...s,
          creator: creatorId
        });
        await session.save();
      }
    }
    console.log("Seeded sessions.");

    console.log("✅ Seed database process completed successfully!");

  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};
