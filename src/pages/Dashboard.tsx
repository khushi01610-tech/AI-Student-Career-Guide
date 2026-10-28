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
  ExternalLink,
  MapPin,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Clock
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
          <p className="text-xs text-muted-foreground animate-pulse font-medium">Loading placement metrics...</p>
        </div>
      </div>
    );
  }

  const {
    careerGoal = user?.careerGoal || (isBJMC ? "Digital Journalist / Reporter" : "Full Stack Developer"),
    readinessScore = 60,
    resumeScore = profile?.resumeScore || 0,
    atsScore = profile?.atsScore || 0,
    interviewScore = profile?.interviewScore || 0,
    communicationScore = profile?.communicationScore || 0,
    skillsCompleted = profile?.skillsCompleted || 0,
    suggestions = []
  } = dbData || {};

  const userSkillsCount = user?.skills?.length || 0;
  const hasResume = !!profile?.resumeUrl || atsScore > 0;

  const scoreChartData = [
    { metric: "Resume ATS", score: atsScore || 20, fill: "hsl(var(--primary))" },
    { metric: "Domain Skills", score: Math.min(100, Math.max(25, userSkillsCount * 12)), fill: "hsl(var(--chart-2))" },
    { metric: "Interview Prep", score: interviewScore || 30, fill: "hsl(var(--chart-3))" },
    { metric: "Communication", score: communicationScore || 25, fill: "hsl(var(--chart-4))" },
    { metric: "Roadmap Milestones", score: Math.min(100, Math.max(20, skillsCompleted * 15)), fill: "hsl(var(--chart-5))" },
  ];

  // Benchmark recommendation previews
  const csePreviews = [
    { title: "Full Stack Developer", match: Math.min(95, Math.max(50, userSkillsCount * 10)), ctc: "₹10.0 - ₹20.0 LPA", skills: ["React", "Node.js", "SQL", "REST APIs"] },
    { title: "Frontend Developer", match: Math.min(95, Math.max(55, userSkillsCount * 11)), ctc: "₹8.0 - ₹16.0 LPA", skills: ["JavaScript", "React", "HTML5/CSS", "TypeScript"] },
    { title: "Data Analyst", match: Math.min(95, Math.max(40, userSkillsCount * 8)), ctc: "₹7.0 - ₹14.0 LPA", skills: ["Python", "SQL", "Pandas", "PowerBI"] }
  ];

  const bjmcPreviews = [
    { title: "Digital Journalist / Reporter", match: Math.min(95, Math.max(50, userSkillsCount * 10)), ctc: "₹5.0 - ₹11.0 LPA", skills: ["News Writing", "Reporting", "Copy Editing", "Attribution"] },
    { title: "Content Writer & Strategist", match: Math.min(95, Math.max(55, userSkillsCount * 11)), ctc: "₹6.0 - ₹13.0 LPA", skills: ["Content Writing", "SEO", "Copywriting", "Analytics"] },
    { title: "PR & Brand Specialist", match: Math.min(95, Math.max(45, userSkillsCount * 9)), ctc: "₹7.0 - ₹15.0 LPA", skills: ["Public Relations", "Press Releases", "Media Pitching", "Crisis PR"] }
  ];

  const activePreviews = isBJMC ? bjmcPreviews : csePreviews;

  // Active verified drives - only clean official logos, without redundant text repetition
  const activeRecruiters = isBJMC ? [
    { name: "BBC News", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC.svg", role: "Trainee Journalist" },
    { name: "NDTV 24x7", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/NDTV_logo.svg", role: "Assistant Producer" },
    { name: "The Hindu", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/The_Hindu_logo.svg", role: "Beat Sub-Editor" },
    { name: "Ogilvy", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ogilvy_logo_2018.svg", role: "Corporate PR" },
    { name: "Vox Media", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vox_Media_logo.svg", role: "Video Storyteller" }
  ] : [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", role: "STEP & FTE 2026" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", role: "Campus FTE" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", role: "SDE-1 Drive" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg", role: "Backend Engineer" },
    { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", role: "Frontend Platform" }
  ];

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const clean = name.trim().replace(/[^a-zA-Z\s]/g, "");
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase() || "ST";
  };

  const userInitials = getInitials(user?.name || "Student");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Executive Student Banner */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={user?.name || "Student"} 
                className="h-14 w-14 rounded-full object-cover border-2 border-border shrink-0 shadow-xs"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary font-black text-lg flex items-center justify-center shrink-0 border border-primary/20 shadow-xs font-heading">
                {userInitials}
              </div>
            )}

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {isBJMC ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <Radio className="h-3 w-3" /> BJMC • Journalism & Mass Comm
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <Code2 className="h-3 w-3" /> B.Tech CSE • Computer Science & Eng
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                  Batch of {user?.graduationYear || 2025}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
                Welcome back, {user?.name || "Student"}!
              </h1>

              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                {user?.college && (
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{user.college}</span>
                  </span>
                )}
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Target Role: <strong className="text-foreground">{careerGoal}</strong></span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            <Button 
              size="sm" 
              onClick={() => navigate("/resume")} 
              className="text-xs h-9 px-4 font-semibold gap-1.5 shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Scan Resume
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate("/recommendations")} 
              className="text-xs h-9 px-4 font-semibold gap-1.5 border-border hover:bg-muted"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Career Matches
            </Button>
          </div>
        </div>
      </div>

      {/* Recruiter Active Campus Drives Strip */}
      <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="status-dot-active" />
          <span className="text-xs font-bold text-foreground">
            Active Verified Drives:
          </span>
        </div>

        {/* Clean Logo Badges */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto py-0.5">
          {activeRecruiters.map(r => (
            <div 
              key={r.name}
              title={`${r.name} • ${r.role}`}
              className="h-8 px-3 rounded-lg bg-background border border-border/80 hover:border-primary/40 flex items-center justify-center shrink-0 transition-colors shadow-2xs group"
            >
              <img 
                src={r.logo} 
                alt={r.name} 
                className="h-4 w-auto max-w-[70px] object-contain opacity-85 group-hover:opacity-100 transition-opacity" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        <Button 
          variant="link" 
          size="sm" 
          onClick={() => navigate("/jobs")} 
          className="text-xs text-primary font-bold h-auto p-0 shrink-0 gap-1 hover:underline"
        >
          View Job Board <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {/* 4 Core Placement Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Readiness Score */}
        <Card className="border border-border bg-card shadow-sm rounded-xl">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Placement Readiness
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="h-3 w-3" /> Good
              </span>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-foreground font-heading">
                {readinessScore}%
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Composite campus evaluation score
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <Progress value={readinessScore} className="h-2 bg-muted" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Passing bar: 50%</span>
                <span>Target: 80%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Resume ATS Score */}
        <Card 
          onClick={() => navigate("/resume")}
          className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all group"
        >
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Resume ATS Audit
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>

            <div>
              {atsScore > 0 ? (
                <>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                    {atsScore}<span className="text-base text-muted-foreground font-normal">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ATS keyword density verified
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-heading">
                    Needs PDF Scan
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload your resume to check filters
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
              <span>{atsScore > 0 ? "Review Rubric" : "Upload Resume PDF"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Verified Skills Count */}
        <Card 
          onClick={() => navigate("/profile")}
          className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all group"
        >
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Verified Skills
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <Award className="h-3.5 w-3.5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-foreground font-heading">
                {userSkillsCount} <span className="text-base text-muted-foreground font-normal">Skills</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Technical competencies verified
              </p>
            </div>

            <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
              <span>Manage Competencies</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Active Applications */}
        <Card 
          onClick={() => navigate("/applications")}
          className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 transition-all group"
        >
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Active Job Pipeline
              </span>
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-foreground font-heading">
                {applicationsCount} <span className="text-base text-muted-foreground font-normal">Drives</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Saved & tracked campus drives
              </p>
            </div>

            <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
              <span>View Kanban Board</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Compact Onboarding Stepper */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Placement Cell Action Plan
            </h2>
            <p className="text-xs text-muted-foreground">
              Complete the verification milestones below to qualify for campus shortlists.
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {hasResume ? "Step 2 of 4 Complete" : "Step 1 of 4 Complete"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Step 1 */}
          <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="font-bold text-foreground">1. Degree Profile</p>
              <p className="text-[10px] text-muted-foreground">{degree} Stream Active</p>
            </div>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => navigate("/resume")}
            className={`p-3 rounded-lg border text-xs flex items-center gap-3 cursor-pointer transition-colors ${
              hasResume 
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 text-foreground" 
                : "border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-100/50"
            }`}
          >
            <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
              hasResume ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
            }`}>
              {hasResume ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground">2. Scan Resume</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {hasResume ? "ATS Scored" : "PDF Upload Required"}
              </p>
            </div>
            {!hasResume && <ArrowRight className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => navigate("/recommendations")}
            className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-xs flex items-center gap-3 cursor-pointer transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 font-bold text-[11px]">
              3
            </div>
            <div>
              <p className="font-bold text-foreground">3. Skill Verification</p>
              <p className="text-[10px] text-muted-foreground">Check Branch Gaps</p>
            </div>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => navigate("/mock-interview")}
            className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-xs flex items-center gap-3 cursor-pointer transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 font-bold text-[11px]">
              4
            </div>
            <div>
              <p className="font-bold text-foreground">4. Mock Panel</p>
              <p className="text-[10px] text-muted-foreground">4-Round Interview Grader</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Recommendations & Career Matches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Curated Roles for Your Stream
            </h2>
            <p className="text-xs text-muted-foreground">
              Based on your {userSkillsCount} verified skills and academic requirements.
            </p>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => navigate("/recommendations")}
            className="text-xs text-primary font-bold gap-1 h-7 hover:bg-primary/5"
          >
            View All Roles <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePreviews.map((role) => (
            <Card 
              key={role.title}
              onClick={() => navigate(`/roadmap?goal=${encodeURIComponent(role.title)}`)}
              className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold">
                    {degree} Track
                  </Badge>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {role.match}% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground font-heading group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Campus Package: <strong className="text-foreground">{role.ctc}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-medium border border-border/60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                <span>View Career Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Preparation Modules Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground font-heading">
          Career Engine Prep Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            onClick={() => navigate("/resume")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all p-4 space-y-2 group"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
              Resume Studio & ATS Audit
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Test your CV against strict recruitment filters and get STAR sentence rewrites.
            </p>
          </Card>

          <Card 
            onClick={() => navigate("/roadmap")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all p-4 space-y-2 group"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors">
              Technical Roadmaps
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Step-by-step milestone chapters for {isBJMC ? "Journalism & PR" : "Full Stack & Backend"}.
            </p>
          </Card>

          <Card 
            onClick={() => navigate("/mock-interview")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all p-4 space-y-2 group"
          >
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center border border-violet-500/20">
              <Swords className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-violet-600 transition-colors">
              AI Mock Interview Panels
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Practice 4-round technical & HR interviews with stream-specific grading rubrics.
            </p>
          </Card>

          <Card 
            onClick={() => navigate("/jobs")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all p-4 space-y-2 group"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-blue-600 transition-colors">
              Live Placement Job Board
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Curated off-campus drives and internships synced with LinkedIn and Indeed.
            </p>
          </Card>
        </div>
      </div>

      {/* Analytics Competency Chart */}
      <Card className="border border-border bg-card shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 font-heading">
            <TrendingUp className="h-4 w-4 text-primary" /> Placement Competency Distribution
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Current performance across all core placement readiness pillars.
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
