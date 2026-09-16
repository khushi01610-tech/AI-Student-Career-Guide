import { useState, useCallback } from "react";
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
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzer() {
  const { refreshProfile, updateUserSkills } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileAnalyze = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Only PDF resume formats are supported.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    setFileName(file.name);
    setProgress(15);

    const timer = setInterval(() => {
      setProgress(p => Math.min(p + Math.round(Math.random() * 10), 85));
    }, 400);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.resume.analyze(formData);
      setProgress(100);
      
      setAnalysisData(res.analysis);
      
      // Update global context profile stats
      await refreshProfile();
      if (res.analysis.skills) {
        updateUserSkills(res.analysis.skills);
      }

      toast({ title: "Analysis Complete! 🚀", description: "Resume processed with 10 ATS scoring metrics." });
    } catch (e: any) {
      toast({
        title: "Scanning Failed",
        description: e.message || "Failed to analyze resume PDF. Try again.",
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
    resumeScore = 0,
    atsScore = 0,
    formatScore = 0,
    keywordScore = 0,
    skillsScore = 0,
    projectScore = 0,
    skills = [],
    roleRecommendations = [],
    strengthBreakdown = [],
    sectionAnalysis = [],
    recommendations = [],
    improvedSections = []
  } = analysisData || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Resume Analyzer</h1>
        <p className="text-sm text-muted-foreground">Scan your CV against modern Applicant Tracking System checks.</p>
      </div>

      {/* Upload Drag Drop Area */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-8">
          <div
            onDragOver={onDragOver}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("file-upload-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragOver ? "border-primary bg-primary/5 glow-primary" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
          >
            <input 
              id="file-upload-input" 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileAnalyze(f); }}
            />
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Analyzing {fileName}...</p>
                  <p className="text-xs text-muted-foreground">Extracting keywords, projects, and formatting templates</p>
                </div>
                <div className="w-64">
                  <Progress value={progress} className="h-1.5" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-semibold">Drag & drop your PDF resume here</p>
                <p className="text-xs text-muted-foreground">Or click to browse files (PDF only • Max 10MB)</p>
                {analysisData && (
                  <Badge variant="secondary" className="gap-1 mt-2">
                    <RefreshCw className="h-3 w-3" /> Re-scan new resume
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Main Score Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Overall Score", value: resumeScore, color: "text-primary" },
                { label: "ATS Score", value: atsScore, color: "text-accent" },
                { label: "Formatting Score", value: formatScore, color: "text-chart-3" },
                { label: "Keyword Score", value: keywordScore, color: "text-chart-4" },
                { label: "Project Score", value: projectScore, color: "text-chart-5" },
              ].map((score, i) => (
                <Card key={i} className="glass-card hover:-translate-y-1 transition-all">
                  <CardContent className="p-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">{score.label}</p>
                    <p className={`text-2xl font-bold mt-1.5 ${score.color}`}>{score.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Category Checklist */}
              <Card className="glass-card lg:col-span-2">
                <CardHeader><CardTitle className="text-base flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-accent" /> Section Audit & Feedback</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {sectionAnalysis.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-border/40 space-y-2 bg-muted/15">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold">{item.section} Section</span>
                        <Badge variant={item.score > 75 ? "default" : "destructive"} className="text-[10px]">
                          {item.score}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.feedback}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations list */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-primary" /> Key Recommendations
                  </CardTitle>
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

            {/* Extracted skills and roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base"><FileText className="h-4 w-4 text-primary inline mr-1.5" /> Extracted Skills</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[10px]">{skill}</Badge>
                  ))}
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base"><Briefcase className="h-4 w-4 text-accent inline mr-1.5" /> Role Match Suggestions</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {roleRecommendations.map((role: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-[10px] text-accent border-accent/25">{role}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Line rewrites Comparison side-by-side */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Bullet Points Enhancer
                </CardTitle>
                <CardDescription className="text-xs">Compare your original descriptions against active keyword replacements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {improvedSections.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-border/40 bg-muted/20">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Original ({item.sectionName})</span>
                      <p className="text-xs italic text-muted-foreground">{item.originalText}</p>
                    </div>
                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-border/40 pt-3 md:pt-0 md:pl-4">
                      <span className="text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Improved Suggestion
                      </span>
                      <p className="text-xs font-medium text-foreground">{item.improvedText}</p>
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
