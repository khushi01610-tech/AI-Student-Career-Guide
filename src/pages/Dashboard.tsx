import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { 
  Briefcase, 
  Award, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  GraduationCap,
  Code2,
  Newspaper,
  Compass,
  Swords,
  Mic,
  Globe,
  Check,
  AlertCircle,
  Building2,
  Radio,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dbData, setDbData] = useState<any>(null);
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const degree = user?.degree === "BJMC" ? "BJMC" : "CSE";
  const isBJMC = degree === "BJMC";

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const [dashData, appsData] = await Promise.all([
          api.profile.getDashboard(),
          api.applications.get().catch(() => [])
        ]);
        setDbData(dashData);
        setApplicationsCount(Array.isArray(appsData) ? appsData.length : 0);
      } catch (e) {
        console.error("Dashboard data error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDb();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <GraduationCap className="h-8 w-8 animate-pulse text-primary mx-auto" />
          <p className="text-xs text-muted-foreground animate-pulse">Loading placement metrics...</p>
        </div>
      </div>
    );
  }

  const {
    careerGoal = user?.careerGoal || (isBJMC ? "Digital Journalist / Reporter" : "Full Stack Developer"),
    readinessScore = 40,
    resumeScore = profile?.resumeScore || 0,
    atsScore = profile?.atsScore || 0,
    interviewScore = profile?.interviewScore || 0,
    communicationScore = profile?.communicationScore || 0,
    skillsCompleted = profile?.skillsCompleted || 0,
    suggestions = []
  } = dbData || {};

  const userSkillsCount = user?.skills?.length || 0;
  const hasResume = !!profile?.resumeUrl;

  const scoreChartData = [
    { metric: "Resume ATS", score: atsScore || 20, fill: "hsl(var(--primary))" },
    { metric: "Domain Skills", score: Math.min(100, userSkillsCount * 10), fill: "hsl(var(--chart-2))" },
    { metric: "Interview Prep", score: interviewScore || 20, fill: "hsl(var(--chart-3))" },
    { metric: "Communication", score: communicationScore || 20, fill: "hsl(var(--chart-4))" },
    { metric: "Roadmap Milestones", score: Math.min(100, skillsCompleted * 15), fill: "hsl(var(--chart-5))" },
  ];

  // Benchmark recommendation previews
  const csePreviews = [
    { title: "Full Stack Developer", match: Math.min(95, Math.max(50, userSkillsCount * 9)), ctc: "10 - 20 LPA", skills: ["React", "Node.js", "SQL"] },
    { title: "Frontend Developer", match: Math.min(95, Math.max(45, userSkillsCount * 11)), ctc: "8 - 16 LPA", skills: ["JavaScript", "React", "HTML5"] },
    { title: "Data Analyst", match: Math.min(95, Math.max(40, userSkillsCount * 8)), ctc: "7 - 14 LPA", skills: ["Python", "SQL", "Pandas"] }
  ];

  const bjmcPreviews = [
    { title: "Digital Journalist / Reporter", match: Math.min(95, Math.max(50, userSkillsCount * 10)), ctc: "5 - 11 LPA", skills: ["News Writing", "Reporting", "Copy Editing"] },
    { title: "Content Writer & Strategist", match: Math.min(95, Math.max(55, userSkillsCount * 11)), ctc: "6 - 13 LPA", skills: ["Content Writing", "SEO", "Storytelling"] },
    { title: "PR & Brand Specialist", match: Math.min(95, Math.max(45, userSkillsCount * 9)), ctc: "7 - 15 LPA", skills: ["Public Relations", "Press Releases", "Media"] }
  ];

  const activePreviews = isBJMC ? bjmcPreviews : csePreviews;

  const activeRecruiters = isBJMC ? [
    { name: "BBC News", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC.svg" },
    { name: "NDTV 24x7", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/NDTV_logo.svg" },
    { name: "The Hindu", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/The_Hindu_logo.svg" },
    { name: "Ogilvy", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ogilvy_logo_2018.svg" },
    { name: "Vox Media", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vox_Media_logo.svg" }
  ] : [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" },
    { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" }
  ];

  const studentAvatar = profile?.avatarUrl || (isBJMC 
    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Student Welcome Header Banner with Avatar & Stream Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <img 
            src={studentAvatar} 
            alt={user?.name || "Student"} 
            className="h-14 w-14 rounded-full object-cover border-2 border-primary/20 shrink-0 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isBJMC ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Radio className="h-3 w-3" /> BJMC • Journalism & Mass Comm
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Code2 className="h-3 w-3" /> CSE • Computer Science & Eng
                </span>
              )}
              <Badge variant="outline" className="text-[11px] font-mono">
                Batch of {user?.graduationYear || 2026}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-heading">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-xs text-muted-foreground">
              Candidate profile registered at <span className="font-semibold text-foreground">{user?.college}</span> • Target Career: <span className="font-bold text-primary">{careerGoal}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={() => navigate("/resume")} className="text-xs h-9 font-semibold gap-1.5 shadow-sm">
            <FileText className="h-3.5 w-3.5" /> Scan Resume
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/recommendations")} className="text-xs h-9 font-semibold gap-1.5 border-border">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Career Matches
          </Button>
        </div>
      </div>

      {/* Recruiter Active Campus Feed Ticker */}
      <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between gap-4 overflow-x-auto">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1.5">
          <span className="status-dot-active" /> Active {isBJMC ? "Media & Newsroom" : "Corporate & Tech"} Drives:
        </span>
        <div className="flex items-center gap-4 shrink-0">
          {activeRecruiters.map(r => (
            <div key={r.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border/80 text-[11px] font-bold">
              <img 
                src={r.logo} 
                alt={r.name} 
                className="h-3.5 w-auto max-w-[60px] object-contain" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-foreground">{r.name}</span>
            </div>
          ))}
        </div>
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => navigate("/jobs")} 
          className="text-xs text-primary font-semibold h-auto p-0 shrink-0 gap-1"
        >
          View Job Board <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {/* 4 Core Metric Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Readiness Score */}
        <Card className="border border-border bg-card shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Career Readiness</p>
              <p className="text-2xl font-black text-foreground mt-1 font-heading">{readinessScore}%</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Composite Placement Gauge</p>
            </div>
            <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="22" className="stroke-muted" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="22" 
                  className="stroke-primary transition-all duration-700" 
                  strokeWidth="4" 
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 22} 
                  strokeDashoffset={2 * Math.PI * 22 * (1 - readinessScore / 100)} 
                  strokeLinecap="round" 
                />
              </svg>
              <TrendingUp className="h-4 w-4 text-primary absolute" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Resume ATS Score */}
        <Card 
          onClick={() => navigate("/resume")}
          className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all"
        >
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resume ATS Score</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-heading">
                {atsScore > 0 ? `${atsScore}/100` : "Needs Scan"}
              </p>
              <p className="text-[11px] text-primary hover:underline font-semibold mt-0.5 flex items-center gap-0.5">
                {hasResume ? "View ATS Rubric" : "Upload Resume PDF"} <ArrowRight className="h-3 w-3" />
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Skills Count */}
        <Card 
          onClick={() => navigate("/profile")}
          className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all"
        >
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verified Skills</p>
              <p className="text-2xl font-black text-foreground mt-1 font-heading">{userSkillsCount}</p>
              <p className="text-[11px] text-primary hover:underline font-semibold mt-0.5 flex items-center gap-0.5">
                Manage Competencies <ArrowRight className="h-3 w-3" />
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Active Applications */}
        <Card 
          onClick={() => navigate("/applications")}
          className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all"
        >
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Pipeline</p>
              <p className="text-2xl font-black text-foreground mt-1 font-heading">{applicationsCount}</p>
              <p className="text-[11px] text-primary hover:underline font-semibold mt-0.5 flex items-center gap-0.5">
                View Kanban Tracker <ArrowRight className="h-3 w-3" />
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Checklist for Students */}
      {(!hasResume || userSkillsCount < 4 || readinessScore < 50) && (
        <Card className="border border-primary/30 bg-primary/[0.02] shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Placement Cell Onboarding Checklist
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Complete these steps to optimize your profile for on-campus drives.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">1. Stream Chosen</p>
                <p className="text-[10px] text-muted-foreground">{degree} Stream Active</p>
              </div>
            </div>

            <div 
              onClick={() => navigate("/resume")}
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                hasResume ? "border-emerald-200 bg-emerald-50/50 text-foreground" : "border-border hover:bg-muted/40"
              }`}
            >
              {hasResume ? <Check className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
              <div>
                <p className="font-semibold text-foreground">2. Upload Resume</p>
                <p className="text-[10px] text-muted-foreground">{hasResume ? "ATS Scored" : "PDF Scan Required"}</p>
              </div>
            </div>

            <div 
              onClick={() => navigate("/recommendations")}
              className="p-3 rounded-lg border border-border hover:bg-muted/40 text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Compass className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">3. Check Matches</p>
                <p className="text-[10px] text-muted-foreground">Skill-Gap Engine</p>
              </div>
            </div>

            <div 
              onClick={() => navigate("/roadmap")}
              className="p-3 rounded-lg border border-border hover:bg-muted/40 text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">4. Start Roadmap</p>
                <p className="text-[10px] text-muted-foreground">Technical Milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Recommendations & Career Matches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Top Career Recommendations for Your Stream
            </h2>
            <p className="text-xs text-muted-foreground">
              Calculated from your {userSkillsCount} verified skills and {degree} degree requirements.
            </p>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => navigate("/recommendations")}
            className="text-xs text-primary font-semibold gap-1 h-7"
          >
            View All Roles <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePreviews.map((role) => (
            <Card 
              key={role.title}
              onClick={() => navigate(`/roadmap?goal=${encodeURIComponent(role.title)}`)}
              className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {degree}
                  </Badge>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {role.match}% Match
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground font-heading">{role.title}</h3>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  CTC: <span className="text-foreground font-bold">{role.ctc}</span>
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {role.skills.map(s => (
                    <span key={s} className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-primary font-semibold">
                <span>View Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Placement Preparation Modules Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Career Growth & Placement Prep Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: Resume Studio */}
          <Card 
            onClick={() => navigate("/resume")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all p-4 space-y-2"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground">Resume Studio & ATS</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Upload CV, test against university placement filters, and get STAR rewrites.
            </p>
          </Card>

          {/* Module 2: Career Roadmaps */}
          <Card 
            onClick={() => navigate("/roadmap")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all p-4 space-y-2"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground">Technical Roadmaps</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Milestone chapters for {isBJMC ? "Journalism & Content Strategy" : "Frontend, Backend & Full Stack"}.
            </p>
          </Card>

          {/* Module 3: Mock Interview System */}
          <Card 
            onClick={() => navigate("/mock-interview")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-violet-500/50 transition-all p-4 space-y-2"
          >
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <Swords className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground">AI Mock Interviews</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Practice real technical and HR questions with immediate scoring feedback.
            </p>
          </Card>

          {/* Module 4: Live Jobs Search */}
          <Card 
            onClick={() => navigate("/jobs")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-blue-500/50 transition-all p-4 space-y-2"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground">Live Placement Board</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Browse curated on-campus & off-campus opportunities and track applications.
            </p>
          </Card>
        </div>
      </div>

      {/* Analytics Chart */}
      <Card className="border border-border bg-card shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Placement Competency Distribution
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Current performance across all core placement pillars.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "11px"
                }} 
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
