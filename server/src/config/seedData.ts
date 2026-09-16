import { fallbackDb } from "./fallbackDb";
import { checkFallback } from "./db";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Post } from "../models/Post";
import { Video } from "../models/Video";
import { Session } from "../models/Session";
import { LearningResource } from "../models/LearningResource";
import bcrypt from "bcryptjs";

export const seedData = async () => {
  console.log("Checking if seed data is needed...");

  try {
    // 1. Check if users are seeded
    let usersCount = 0;
    if (checkFallback()) {
      usersCount = fallbackDb.getCollection("users").length;
    } else {
      usersCount = await User.countDocuments();
    }

    if (usersCount > 0) {
      console.log("Database already populated. Skipping seeding.");
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
