import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  TrendingUp, 
  Briefcase, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Compass,
  FileCheck,
  Check,
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzer() {
  const { user, profile, refreshProfile, updateUserSkills } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(profile?.resumeFileName || "");
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(profile?.rubricBreakdown || null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.rubricBreakdown && !analysisData) {
      setAnalysisData(profile.rubricBreakdown);
      if (profile.resumeFileName) {
        setFileName(profile.resumeFileName);
      }
    }
  }, [profile]);

  const handleFileAnalyze = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({ 
        title: "Invalid File Format", 
        description: "Only standard PDF resumes are supported.", 
        variant: "destructive" 
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ 
        title: "File Exceeds Limit", 
        description: "Resume must be under 10MB.", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsLoading(true);
    setFileName(file.name);
    setProgress(20);

    const timer = setInterval(() => {
      setProgress(p => Math.min(p + 15, 88));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.resume.analyze(formData);
      setProgress(100);
      
      const analysis = res?.analysis || res;
      setAnalysisData(analysis);
      
      await refreshProfile();
      if (analysis?.skills) {
        updateUserSkills(analysis.skills);
      }

      const score = analysis?.atsScore ?? analysis?.resumeScore ?? 80;
      const streamName = analysis?.stream ?? user?.degree ?? "Degree";

      toast({ 
        title: "ATS Audit Complete! 🚀", 
        description: `Scored ${score}/100 based on ${streamName} rubric criteria.` 
      });
    } catch (e: any) {
      toast({
        title: "Scanning Failed",
        description: e.message || "Failed to analyze resume PDF. Please verify the file is not password-protected.",
        variant: "destructive"
      });
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileAnalyze(file);
  };

  const {
    stream = user?.degree || "CSE",
    resumeScore = profile?.resumeScore || 0,
    atsScore = profile?.atsScore || 0,
    formatScore = profile?.formatScore || 0,
    keywordScore = profile?.keywordScore || 0,
    skillsScore = profile?.skillsScore || 0,
    projectScore = profile?.projectScore || 0,
    skills = [],
    roleRecommendations = [],
    strengthBreakdown = [],
    sectionAnalysis = [],
    recommendations = [],
    improvedSections = []
  } = analysisData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs">
              <FileCheck className="h-3.5 w-3.5 mr-1 inline" /> ATS Resume Scanner
            </Badge>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {stream} Rubric Applied
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Resume Studio & Transparent ATS Scoring
          </h1>
          <p className="text-xs text-muted-foreground">
            Scan your CV using our deterministic rubric evaluation checking contact info, degree keywords, project metrics, and ATS readability.
          </p>
        </div>

        {analysisData && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => navigate("/recommendations")}
              className="text-xs font-semibold gap-1.5 h-8"
            >
              <Sparkles className="h-3.5 w-3.5" /> View Career Matches <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Upload Drag Drop Area */}
      <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div
            onDragOver={onDragOver}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("file-upload-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input 
              id="file-upload-input" 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileAnalyze(f); }}
            />
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">Analyzing {fileName}...</p>
                  <p className="text-[11px] text-muted-foreground">Extracting keywords, section headers, and measuring placement impact</p>
                </div>
                <div className="w-56">
                  <Progress value={progress} className="h-1.5" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-foreground">
                  {fileName ? `Current Resume: ${fileName}` : "Drag and drop your PDF resume here"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Or click to browse from computer (PDF format only • Max 10MB)
                </p>
                {analysisData && (
                  <Badge variant="secondary" className="gap-1 mt-1 text-[11px]">
                    <RefreshCw className="h-3 w-3" /> Upload new version to re-scan
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results Display */}
      <AnimatePresence>
        {analysisData && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Main Score Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "Overall ATS Score", value: atsScore, max: 100, color: "text-primary" },
                { label: "Domain Keywords", value: keywordScore, max: 100, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Projects & Impact", value: projectScore, max: 100, color: "text-amber-600 dark:text-amber-400" },
                { label: "Skills Density", value: skillsScore, max: 100, color: "text-violet-600 dark:text-violet-400" },
                { label: "Layout & Formatting", value: formatScore, max: 100, color: "text-blue-600 dark:text-blue-400" },
              ].map((score, i) => (
                <Card key={i} className="border border-border bg-card shadow-sm rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{score.label}</p>
                    <p className={`text-2xl font-black mt-1 ${score.color}`}>
                      {score.value}<span className="text-xs text-muted-foreground font-normal">/{score.max}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rubric Section Audit & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Category Checklist */}
              <Card className="border border-border bg-card shadow-sm rounded-2xl lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" /> Transparent Section-by-Section Audit
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Rubric criteria applied for candidate placement evaluation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sectionAnalysis.map((item: any, idx: number) => {
                    const badgeVariant = item.score >= 75 ? "badge-emerald" : item.score >= 50 ? "badge-amber" : "badge-rose";
                    return (
                      <div key={idx} className="p-3 rounded-xl border border-border/70 space-y-1.5 bg-muted/20">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-foreground">{item.section}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeVariant}`}>
                            {item.score}% Scored
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.feedback}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Actionable Recommendations List */}
              <Card className="border border-border bg-card shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> Actionable Improvements
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Address these points to reach 90+ ATS score.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="flex gap-2 text-xs leading-relaxed">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <p className="text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Extracted Skills & Matching Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border bg-card shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified Domain Keywords ({skills.length})
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Recognized from your uploaded resume.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[11px] font-medium">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-border bg-card shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-primary" /> Target Role Recommendations
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    High-fit placements mapped to your extracted keywords.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {roleRecommendations.map((role: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-[11px] font-semibold border-primary/30 text-primary bg-primary/5">
                      {role}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* STAR Method Rewrites Comparison Side-by-Side */}
            <Card className="border border-border bg-card shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> STAR Method Bullet Point Enhancer
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Transform passive phrases into measurable achievements (Situation, Task, Action, Result).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {improvedSections.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border/70 bg-muted/20">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        Original ({item.sectionName})
                      </span>
                      <p className="text-xs text-muted-foreground italic">
                        "{item.originalText}"
                      </p>
                    </div>
                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Enhanced STAR Formulation
                      </span>
                      <p className="text-xs font-semibold text-foreground leading-relaxed">
                        "{item.improvedText}"
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
