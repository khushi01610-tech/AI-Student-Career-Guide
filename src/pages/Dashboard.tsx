import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
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
  Users, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  BrainCircuit, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dbData, setDbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const data = await api.profile.getDashboard();
        setDbData(data);
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-2">
          <BrainCircuit className="h-10 w-10 animate-pulse text-primary mx-auto" />
          <p className="text-sm text-muted-foreground animate-pulse">Assembling career metrics...</p>
        </div>
      </div>
    );
  }

  const {
    careerGoal = "Set your career goal",
    readinessScore = 35,
    resumeScore = 0,
    atsScore = 0,
    interviewScore = 0,
    communicationScore = 0,
    skillsCompleted = 0,
    mockInterviewsCompleted = 0,
    communityContributions = 0,
    suggestions = [],
    upcomingSessions = [],
    recentPosts = []
  } = dbData || {};

  const scoreBreakdown = [
    { metric: "Resume Scan", score: resumeScore || 20 },
    { metric: "ATS Audit", score: atsScore || 20 },
    { metric: "Interview Prep", score: interviewScore || 20 },
    { metric: "Communication", score: communicationScore || 20 },
    { metric: "Roadmap Skills", score: Math.min(100, skillsCompleted * 10) },
    { metric: "Mock Complete", score: Math.min(100, mockInterviewsCompleted * 20) },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Student profile active at <span className="font-semibold text-foreground">{user?.college}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/resume")} className="glow-primary gap-1">
            <FileText className="h-4 w-4" /> Scan Resume
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/chat")} className="gap-1">
            <Sparkles className="h-4 w-4" /> Ask Career AI
          </Button>
        </div>
      </div>

      {/* Hero Stats Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Readiness Score Circular Widget */}
        <Card className="glass-card overflow-hidden border-primary/20 relative col-span-1 lg:col-span-2">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 filter blur-2xl pointer-events-none" />
          <CardContent className="p-6 h-full flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="absolute inset-0 transform -rotate-95 w-full h-full">
                  <circle cx="64" cy="64" r="50" className="stroke-muted" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="50" className="stroke-primary transition-all duration-1000" strokeWidth="10" fill="transparent"
                    strokeDasharray={2 * Math.PI * 50} strokeDashoffset={2 * Math.PI * 50 * (1 - readinessScore / 100)} strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <p className="text-3xl font-black">{readinessScore}%</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ready</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <Badge variant="secondary" className="gap-1 text-xs">
                <TrendingUp className="h-3.5 w-3.5" /> target: {careerGoal}
              </Badge>
              <h2 className="text-lg font-bold text-foreground">Your Career Readiness</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Calculated from resume parameters, technical skill roadmaps, completed practice mock panels, and communication test marks.
              </p>
              <div className="border-t border-border/40 pt-3">
                <p className="text-xs font-semibold text-accent flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Next Improvement Action:
                </p>
                <p className="text-xs text-foreground font-medium bg-accent/5 p-2 rounded border border-accent/10">
                  {suggestions[0] || "Review roadmap chapters to unlock new coding project ideas."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick summary stats */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-1.5"><Award className="h-4 w-4 text-accent" /> Score breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>ATS Resume Audit</span>
                <span className="font-semibold">{atsScore}%</span>
              </div>
              <Progress value={atsScore} className="h-1.5 bg-muted" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Speaking Communication</span>
                <span className="font-semibold">{communicationScore}%</span>
              </div>
              <Progress value={communicationScore} className="h-1.5 bg-muted" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Mock Interview Avg</span>
                <span className="font-semibold">{interviewScore}%</span>
              </div>
              <Progress value={interviewScore} className="h-1.5 bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts & Collab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Score representation */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-primary" /> Metrics Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={scoreBreakdown} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dynamic completed counts chart */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> completed portfolio milestones</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[
                { name: "Roadmap Skills", count: skillsCompleted, fill: "hsl(var(--primary))" },
                { name: "Mock Practices", count: mockInterviewsCompleted, fill: "hsl(var(--accent))" },
                { name: "Forum Posts", count: communityContributions, fill: "hsl(var(--chart-3))" }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peer meetings and posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled Collab sessions */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Peer mock sessions</CardTitle>
              <CardDescription className="text-xs">Join upcoming meets hosted by students</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/collaboration")} className="text-xs text-primary gap-1 h-7">
              Browse All <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground space-y-2">
                <p>No active mock meets scheduled.</p>
                <Button size="xs" variant="outline" onClick={() => navigate("/collaboration")}>Schedule a Meet</Button>
              </div>
            ) : (
              upcomingSessions.slice(0, 3).map((session: any) => (
                <div key={session._id} className="p-3 rounded-lg border border-border/40 flex items-center justify-between gap-3 bg-muted/20">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{session.role}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <span>Host: {session.creatorName} ({session.creatorCollege})</span>
                    </p>
                  </div>
                  <Button size="xs" onClick={() => navigate("/collaboration")} className="h-7 text-[10px]">Join</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recently shared placement tips */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-accent" /> Community boards</CardTitle>
              <CardDescription className="text-xs">Placement threads from peer colleges</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/community")} className="text-xs text-primary gap-1 h-7">
              View Feed <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPosts.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">No recent posts published.</p>
            ) : (
              recentPosts.slice(0, 3).map((post: any) => (
                <div key={post._id} className="p-3 rounded-lg border border-border/40 bg-muted/20">
                  <p className="text-xs font-medium text-foreground line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between mt-2 text-[9px] text-muted-foreground">
                    <span>By: {post.authorName} ({post.authorCollege})</span>
                    <span className="font-semibold text-primary">{post.tags?.[0] || "General"}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
