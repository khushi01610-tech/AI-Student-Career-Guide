import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Compass, 
  BookmarkCheck, 
  Briefcase, 
  DollarSign,
  GraduationCap,
  Layers,
  Code2,
  Newspaper
} from "lucide-react";
import { motion } from "framer-motion";

interface RoleBenchmark {
  title: string;
  stream: "CSE" | "BJMC";
  demand: "Very High" | "High" | "Moderate";
  avgCtc: string;
  description: string;
  requiredSkills: string[];
}

const BENCHMARKS: RoleBenchmark[] = [
  // CSE Roles
  {
    title: "Full Stack Developer",
    stream: "CSE",
    demand: "Very High",
    avgCtc: "10 - 20 LPA",
    description: "Architects and maintains end-to-end web applications across front-end UI, backend services, and database layers.",
    requiredSkills: ["React", "Node.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Express", "MongoDB", "SQL", "Git"]
  },
  {
    title: "Frontend Developer",
    stream: "CSE",
    demand: "Very High",
    avgCtc: "8 - 16 LPA",
    description: "Builds high-performance, accessible, and responsive user interfaces with modern client frameworks.",
    requiredSkills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "REST APIs", "Git"]
  },
  {
    title: "Backend Developer",
    stream: "CSE",
    demand: "High",
    avgCtc: "9 - 18 LPA",
    description: "Engineers high-throughput server APIs, microservices, authentication security, and database indexing.",
    requiredSkills: ["Python", "Node.js", "Express", "SQL", "PostgreSQL", "MongoDB", "REST APIs", "Docker", "Git"]
  },
  {
    title: "Data Analyst",
    stream: "CSE",
    demand: "High",
    avgCtc: "7 - 14 LPA",
    description: "Extracts business insights from raw data using relational querying, statistical analysis, and interactive dashboards.",
    requiredSkills: ["Python", "SQL", "Pandas", "NumPy", "PowerBI", "Excel", "Data Analytics", "Statistics"]
  },
  {
    title: "Machine Learning Engineer",
    stream: "CSE",
    demand: "Very High",
    avgCtc: "12 - 24 LPA",
    description: "Designs, trains, and deploys predictive machine learning and deep learning models for production applications.",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "SQL", "Git", "Algorithms"]
  },

  // BJMC Roles
  {
    title: "Digital Journalist / Reporter",
    stream: "BJMC",
    demand: "High",
    avgCtc: "5 - 11 LPA",
    description: "Conducts investigative reporting, interviews sources, fact-checks stories, and produces real-time digital news packages.",
    requiredSkills: ["News Writing", "Reporting", "Investigative Journalism", "Copy Editing", "Fact-Checking", "Beat Reporting", "Digital Storytelling"]
  },
  {
    title: "Content Writer & Strategist",
    stream: "BJMC",
    demand: "Very High",
    avgCtc: "6 - 13 LPA",
    description: "Plans, drafts, and distributes SEO-optimized long-form content, educational articles, and multi-channel campaigns.",
    requiredSkills: ["Content Writing", "Copywriting", "SEO", "Blogging", "Social Media", "Content Strategy", "WordPress"]
  },
  {
    title: "PR & Brand Specialist",
    stream: "BJMC",
    demand: "High",
    avgCtc: "7 - 15 LPA",
    description: "Manages public relations, drafts press releases, fosters media partnerships, and leads crisis communication strategies.",
    requiredSkills: ["Public Relations", "Press Release", "Brand Communication", "Crisis Management", "Media Relations", "Corporate Communication"]
  },
  {
    title: "Video Producer & Editor",
    stream: "BJMC",
    demand: "Very High",
    avgCtc: "6 - 14 LPA",
    description: "Produces, directs, and edits broadcast-grade video reels, news packages, and documentary multimedia stories.",
    requiredSkills: ["Video Editing", "Adobe Premiere", "Final Cut Pro", "Audio Editing", "Storyboarding", "Canva", "Audacity"]
  },
  {
    title: "Social Media Manager",
    stream: "BJMC",
    demand: "High",
    avgCtc: "5 - 12 LPA",
    description: "Grows institutional and brand social channels through content creation, community engagement, and performance analytics.",
    requiredSkills: ["Social Media", "Content Writing", "Graphic Design", "Canva", "Digital Storytelling", "Copywriting", "SEO"]
  }
];

export default function CareerRecommendations() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [updatingGoal, setUpdatingGoal] = useState<string | null>(null);

  const studentDegree = user?.degree === "BJMC" ? "BJMC" : "CSE";
  const [filterStream, setFilterStream] = useState<"ALL" | "CSE" | "BJMC">(studentDegree);

  // Normalize user skills for case-insensitive matching
  const userSkills = (user?.skills || []).map(s => s.toLowerCase().trim());

  // Filter benchmarks according to current stream selection
  const visibleRoles = filterStream === "ALL" 
    ? BENCHMARKS 
    : BENCHMARKS.filter(b => b.stream === filterStream);

  // Calculate matching metrics for each role
  const evaluatedRoles = visibleRoles.map(role => {
    const matched: string[] = [];
    const missing: string[] = [];

    role.requiredSkills.forEach(req => {
      const reqLower = req.toLowerCase();
      const isMatched = userSkills.some(us => us.includes(reqLower) || reqLower.includes(us));
      if (isMatched) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const matchScore = role.requiredSkills.length > 0 
      ? Math.round((matched.length / role.requiredSkills.length) * 100) 
      : 0;

    return {
      ...role,
      matched,
      missing,
      matchScore
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const handleSetTargetGoal = async (roleTitle: string) => {
    setUpdatingGoal(roleTitle);
    try {
      await api.profile.update({ careerGoal: roleTitle });
      await refreshProfile();
      toast({
        title: "Target Goal Updated!",
        description: `Set your active target role to ${roleTitle}. Your roadmaps and dashboard are now customized.`
      });
    } catch (err: any) {
      toast({
        title: "Failed to update target role",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setUpdatingGoal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 font-semibold text-xs">
              <Sparkles className="h-3 w-3 mr-1 inline" /> AI Skill-Gap Engine
            </Badge>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {studentDegree} Stream Active
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Career Recommendations & Skill Match
          </h1>
          <p className="text-xs text-muted-foreground">
            We analyzed your {user?.skills?.length || 0} registered skills against industry placement benchmarks to calculate your match percentages and missing competency gaps.
          </p>
        </div>

        {/* Stream Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border">
          <Button
            size="sm"
            variant={filterStream === studentDegree ? "default" : "ghost"}
            onClick={() => setFilterStream(studentDegree)}
            className="text-xs h-7 px-3 font-semibold"
          >
            {studentDegree === "CSE" ? <Code2 className="h-3.5 w-3.5 mr-1" /> : <Newspaper className="h-3.5 w-3.5 mr-1" />}
            My Stream ({studentDegree})
          </Button>
          <Button
            size="sm"
            variant={filterStream === "ALL" ? "default" : "ghost"}
            onClick={() => setFilterStream("ALL")}
            className="text-xs h-7 px-3 font-semibold"
          >
            <Layers className="h-3.5 w-3.5 mr-1" /> All Roles
          </Button>
        </div>
      </div>

      {/* Role Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evaluatedRoles.map((role, idx) => {
          const isCurrentGoal = (user?.careerGoal || "").toLowerCase() === role.title.toLowerCase();
          const matchColor = role.matchScore >= 70 
            ? "text-emerald-600 dark:text-emerald-400" 
            : role.matchScore >= 40 
              ? "text-amber-600 dark:text-amber-400" 
              : "text-muted-foreground";

          const progressColor = role.matchScore >= 70
            ? "bg-emerald-500"
            : role.matchScore >= 40
              ? "bg-amber-500"
              : "bg-primary";

          return (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <Card className={`border transition-all h-full flex flex-col ${
                isCurrentGoal 
                  ? "border-primary/50 shadow-md ring-1 ring-primary/20 bg-card" 
                  : "border-border hover:border-border/80 shadow-sm bg-card"
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                          {role.stream}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                          Demand: {role.demand}
                        </Badge>
                        {isCurrentGoal && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 font-bold">
                            <BookmarkCheck className="h-3 w-3 mr-0.5 inline" /> Current Target
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base font-bold text-foreground">
                        {role.title}
                      </CardTitle>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xl font-black ${matchColor}`}>
                        {role.matchScore}%
                      </div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Match Score
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${role.matchScore}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {role.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3.5 flex-1 flex flex-col justify-between pt-0">
                  <div className="space-y-3">
                    {/* Placement CTC Estimate */}
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40 border border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1 font-medium text-[11px]">
                        <DollarSign className="h-3.5 w-3.5 text-primary" /> Projected Placement CTC:
                      </span>
                      <span className="font-bold text-foreground">{role.avgCtc}</span>
                    </div>

                    {/* Matched Skills */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills ({role.matched.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.matched.length > 0 ? (
                          role.matched.map(skill => (
                            <span 
                              key={skill} 
                              className="px-2 py-0.5 text-[11px] rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                            >
                              ✓ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            None matched yet from your profile.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills (Skill-Gap) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Missing Skills to Master ({role.missing.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.missing.length > 0 ? (
                          role.missing.map(skill => (
                            <span 
                              key={skill} 
                              className="px-2 py-0.5 text-[11px] rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                            >
                              + {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium">
                            🎉 Complete skill coverage for this role!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-border flex items-center gap-2">
                    {!isCurrentGoal && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetTargetGoal(role.title)}
                        disabled={updatingGoal === role.title}
                        className="text-xs h-8 flex-1 font-semibold"
                      >
                        {updatingGoal === role.title ? "Setting..." : "Set as Target Goal"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => navigate(`/roadmap?goal=${encodeURIComponent(role.title)}`)}
                      className={`text-xs h-8 font-semibold gap-1.5 ${isCurrentGoal ? "w-full" : "flex-1"}`}
                    >
                      <Compass className="h-3.5 w-3.5" /> View Roadmap <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
