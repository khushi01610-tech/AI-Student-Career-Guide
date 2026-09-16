# AI Student Career Guide

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![TypeScript](https://img.shields.io/badge/Code-TypeScript-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![Tailwind](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🧠 Overview

**AI Student Career Guide** is a modern, responsive, full-stack career acceleration platform designed to help university and college students prepare for placements and interviews, improve communication skills, optimize resumes, discover job opportunities, and practice mock interviews.

Students from multiple universities can collaborate, conduct peer mock interviews, exchange placement experiences, and access AI-powered diagnostic feedback.

---

## ⚡ Key Features

- 📄 **AI Resume Analyzer & ATS Scoring:** Extract skills, scan for keyword matches, and receive targeted resume bullet improvements.
- 🎯 **Interactive Mock Interviews:** Simulated technical and HR question-by-question interview rounds with detailed performance scorecards.
- 🎙️ **Communication & Speaking Coach:** Speech practice with microphone voice recording, grammar evaluation, articulation feedback, and vocabulary building.
- 🛤️ **Personalized Career Roadmaps:** Step-by-step role roadmaps (Frontend, Backend, Full Stack, Data Science, AI Engineer) with interactive checklists.
- 👥 **Student Community & Discussions:** University-wide feeds to share placement experiences, coding tips, and interview questions.
- 🎥 **Video Learning Hub:** Curated video guides, interview tips, and placement vlogs from seniors.
- 🤝 **Peer Collaboration Panels:** Schedule or join live peer mock interview sessions via Google Meet / Zoom with student rating cards.
- 📊 **Dynamic Career Readiness Score:** Weighted formula combining resume score, mock interviews, speech practice, and roadmap milestones.
- 🗄️ **Dual Database Architecture:** Seamlessly connects to MongoDB or uses the built-in local JSON file fallback if MongoDB is not running.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS & shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Server:** Node.js & Express (TypeScript)
- **Database:** MongoDB & Mongoose (with automated Local JSON File Fallback)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **File Uploads:** Multer (PDF resume processing)
- **AI Integration:** Google Gemini 1.5 Flash (with structured mock fallback)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/khushi01610-tech/AI-Student-Career-Guide.git
cd AI-Student-Career-Guide
```

### 2. Install Dependencies

Install root (frontend) dependencies:
```bash
npm install
```

Install backend server dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration (Optional)
Create a `.env` file in the root directory if you want to connect to a custom MongoDB database or Gemini API key:
```env
MONGODB_URI=mongodb://localhost:27017/ai-student-career-guide
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here
```
*(Note: If left unconfigured, the application runs out-of-the-box using local JSON file storage and modular mock AI fallback!)*

### 4. Run the Full-Stack Application
Start both the React frontend and Express backend concurrently:
```bash
npm run dev
```

- **Frontend Application:** http://localhost:8080
- **Backend API:** http://localhost:5000/api
