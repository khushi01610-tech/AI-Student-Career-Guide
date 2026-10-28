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
            {profile?.avatarUrl && !profile.avatarUrl.includes("dicebear") ? (
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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                  Batch of {user?.graduationYear || 2026}
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
                  <span>Target Career Goal: <strong className="text-foreground">{careerGoal}</strong></span>
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
            Campus Placement Drives Live:
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

      {/* 4 Core Placement Analytics Cards with Distinct SaaS Anatomy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Readiness Index */}
        <Card className="border border-border bg-card shadow-sm rounded-xl p-5 flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Placement Readiness
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="h-3 w-3" /> {readinessScore >= 60 ? "Tier-1 Ready" : "Preparing"}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                {readinessScore}%
              </span>
              <span className="text-xs text-muted-foreground font-medium">overall score</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Composite campus benchmark across 5 pillars
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${readinessScore}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
              <span>Threshold: 50%</span>
              <span className="text-primary font-semibold">Campus Avg: 65%</span>
              <span>Target: 80%</span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Resume ATS Audit */}
        <Card 
          onClick={() => navigate("/resume")}
          className="border border-border bg-card shadow-sm rounded-xl p-5 flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Resume ATS Audit
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>

            {atsScore > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-heading">
                    {atsScore}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ATS keyword parser passed with valid headings
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-heading">
                  PDF Required
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your CV to pass campus ATS screening
                </p>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
            <span>{atsScore > 0 ? "Inspect ATS Rubric" : "Upload Resume PDF"}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>

        {/* Metric 3: Verified Domain Competencies */}
        <Card 
          onClick={() => navigate("/profile")}
          className="border border-border bg-card shadow-sm rounded-xl p-5 flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Verified Competencies
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <Award className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                {userSkillsCount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">Domain Skills</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2.5">
              {(user?.skills && user.skills.length > 0 
                ? user.skills.slice(0, 3) 
                : (isBJMC ? ["Reporting", "Editing", "PR"] : ["React", "Node.js", "SQL"])
              ).map((skill: string) => (
                <span key={skill} className="px-2 py-0.5 text-[10px] font-semibold rounded bg-muted text-muted-foreground border border-border">
                  {skill}
                </span>
              ))}
              {userSkillsCount > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-primary/10 text-primary border border-primary/20">
                  +{userSkillsCount - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
            <span>Manage Skill Profile</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>

        {/* Metric 4: Campus Job Pipeline */}
        <Card 
          onClick={() => navigate("/applications")}
          className="border border-border bg-card shadow-sm rounded-xl p-5 flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Campus Drives Pipeline
              </span>
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                {applicationsCount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">Active Drives</span>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-2.5 text-center">
              <div className="p-1 rounded bg-muted/60 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Tracked</span>
                <span className="text-xs font-bold text-foreground">{applicationsCount}</span>
              </div>
              <div className="p-1 rounded bg-muted/60 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Applied</span>
                <span className="text-xs font-bold text-foreground">{applicationsCount > 0 ? 1 : 0}</span>
              </div>
              <div className="p-1 rounded bg-muted/60 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Interview</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">0</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
            <span>Open Kanban Tracker</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>
      </div>

      {/* Corporate Placement Cell Action Plan / Verification Milestones */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Placement Cell Verification Milestones
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete these 4 verification stages to qualify for campus drive shortlists & corporate referrals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-muted text-foreground border border-border">
              {hasResume ? "2 of 4 Steps Complete" : "1 of 4 Steps Complete"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Milestone 1 */}
          <div className="p-3.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Check className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground font-heading">1. Stream Profile</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{degree} Track Verified</p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                Completed
              </span>
            </div>
          </div>

          {/* Milestone 2 */}
          <div 
            onClick={() => navigate("/resume")}
            className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
              hasResume 
                ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-400" 
                : "border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-400 hover:shadow-xs"
            }`}
          >
            <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
              hasResume ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
            }`}>
              {hasResume ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground font-heading">2. Resume ATS Audit</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {hasResume ? `Parsed score: ${atsScore}/100` : "Upload PDF to scan filters"}
              </p>
              <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold ${
                hasResume ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
              }`}>
                {hasResume ? "Audit Passed" : "Action Required →"}
              </span>
            </div>
          </div>

          {/* Milestone 3 */}
          <div 
            onClick={() => navigate("/recommendations")}
            className="p-3.5 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/40 flex items-start gap-3 cursor-pointer transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-border">
              3
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground font-heading">3. Skill Verification</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{userSkillsCount} of 8 core skills added</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-primary">
                Review Branch Gaps →
              </span>
            </div>
          </div>

          {/* Milestone 4 */}
          <div 
            onClick={() => navigate("/mock-interview")}
            className="p-3.5 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/40 flex items-start gap-3 cursor-pointer transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-border">
              4
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground font-heading">4. Mock Interview Panel</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Simulate 4-round campus drive</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-primary">
                Start Mock Panel →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Recommendations & Career Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" /> Curated Roles for Your Stream
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target campus job profiles matched to your {degree} curriculum and {userSkillsCount} verified skills.
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate("/recommendations")}
            className="text-xs font-semibold gap-1.5 h-8 border-border hover:bg-muted"
          >
            All Recommendations <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePreviews.map((role) => (
            <Card 
              key={role.title}
              onClick={() => navigate(`/roadmap?goal=${encodeURIComponent(role.title)}`)}
              className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {degree} Track
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {role.match}% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground font-heading group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">Campus Package:</span>
                    <span className="text-xs font-extrabold text-foreground bg-primary/10 px-2 py-0.5 rounded text-primary">
                      {role.ctc}
                    </span>
                  </div>
                </div>

                {/* Progress bar matching */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${role.match}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">Profile match percentile</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-muted/80 text-muted-foreground font-medium border border-border/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between text-xs text-primary font-bold group-hover:underline">
                <span>View Career Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Preparation Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground font-heading">
          Career Engine Prep Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            onClick={() => navigate("/resume")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all p-5 space-y-2.5 group"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors font-heading">
              Resume Studio & ATS Audit
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Test your CV against strict recruitment filters and get STAR sentence rewrites.
            </p>
          </Card>

          <Card 
            onClick={() => navigate("/roadmap")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all p-5 space-y-2.5 group"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors font-heading">
              Technical Roadmaps
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Step-by-step milestone chapters for {isBJMC ? "Journalism & PR" : "Full Stack & Backend"}.
            </p>
          </Card>

          <Card 
            onClick={() => navigate("/mock-interview")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all p-5 space-y-2.5 group"
          >
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center border border-violet-500/20">
              <Swords className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-violet-600 transition-colors font-heading">
              AI Mock Interview Panels
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Practice 4-round technical & HR interviews with stream-specific grading rubrics.
            </p>
          </Card>

          <Card 
            onClick={() => navigate("/jobs")}
            className="border border-border bg-card shadow-sm rounded-xl cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all p-5 space-y-2.5 group"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-blue-600 transition-colors font-heading">
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
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
