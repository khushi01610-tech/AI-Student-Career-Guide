import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Swords, 
  Brain, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ChevronRight,
  RotateCcw,
  Laptop,
  Radio,
  BookOpen,
  Scale,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const STREAM_ROLES = {
  CSE: [
    "Full Stack Developer",
    "Backend Engineer (Node/Java/Python)",
    "Frontend Specialist (React/TS)",
    "DevOps & Cloud Engineer",
    "Data Analyst / ML Associate",
    "Software Development Engineer (Associate)"
  ],
  BJMC: [
    "Digital Journalist / Reporter",
    "News Anchor & Broadcast Producer",
    "Corporate PR & Communications Specialist",
    "Content Strategist & Copywriter",
    "Investigative Media Researcher",
    "Social Media Editor & Audience Strategist"
  ]
};

const STREAM_TYPES = {
  CSE: [
    { value: "Technical Coding & DSA", label: "Technical Coding & DSA" },
    { value: "Core CS (OOPs, DBMS, OS)", label: "Core CS (OOPs, DBMS, OS)" },
    { value: "System Architecture & Design", label: "System Architecture & Design" },
    { value: "Engineering HR & Behavioral", label: "Engineering HR & Behavioral" },
    { value: "Comprehensive Placement Board", label: "Comprehensive Placement Board (Mixed)" }
  ],
  BJMC: [
    { value: "Media Law & Ethical Standards", label: "Media Law & Ethical Standards" },
    { value: "Live Broadcast & Crisis Anchoring", label: "Live Broadcast & Crisis Anchoring" },
    { value: "Public Relations & Crisis Comms", label: "Public Relations & Crisis Comms" },
    { value: "Fact Checking & OSINT Verification", label: "Fact Checking & OSINT Verification" },
    { value: "Comprehensive Editorial Board", label: "Comprehensive Editorial Board (Mixed)" }
  ]
};

const STREAM_DIFFICULTIES = {
  CSE: [
    { value: "Campus Placement Level", label: "Campus Placement Level (TCS / Infosys / Wipro)" },
    { value: "Product Unicorn Level", label: "Product Medium Level (Swiggy / Razorpay / Flipkart)" },
    { value: "Google / FAANG Advanced Level", label: "Google / FAANG Advanced Level" }
  ],
  BJMC: [
    { value: "Campus Media Placement Level", label: "Campus Media Trainee (Print & Digital Drives)" },
    { value: "Digital Media & PR Agency Level", label: "Digital Media & PR Agency (Quint / Vox / Ogilvy)" },
    { value: "National Broadcaster Level", label: "National Broadcaster Level (BBC News / NDTV)" }
  ]
};

export default function MockInterviewSystem() {
  const { user, refreshProfile } = useAuth();
  
  // Stream state (CSE vs BJMC)
  const initialStream = user?.degree === "BJMC" ? "BJMC" : "CSE";
  const [stream, setStream] = useState<"CSE" | "BJMC">(initialStream);
  
  const [role, setRole] = useState(
    user?.careerGoal || (initialStream === "BJMC" ? "Digital Journalist / Reporter" : "Full Stack Developer")
  );
  const [difficulty, setDifficulty] = useState(
    initialStream === "BJMC" ? "Campus Media Placement Level" : "Campus Placement Level"
  );
  const [type, setType] = useState(
    initialStream === "BJMC" ? "Comprehensive Editorial Board" : "Comprehensive Placement Board"
  );
  
  // Quiz Flow state
  const [status, setStatus] = useState<"setup" | "loading" | "active" | "submitting" | "results">("setup");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [finalScoreReport, setFinalScoreReport] = useState<any>(null);

  const { toast } = useToast();

  const handleStreamChange = (newStream: "CSE" | "BJMC") => {
    setStream(newStream);
    if (newStream === "BJMC") {
      setRole("Digital Journalist / Reporter");
      setDifficulty("Campus Media Placement Level");
      setType("Comprehensive Editorial Board");
    } else {
      setRole("Full Stack Developer");
      setDifficulty("Campus Placement Level");
      setType("Comprehensive Placement Board");
    }
  };

  const handleStart = async () => {
    setStatus("loading");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    setEvaluations([]);
    setFinalScoreReport(null);

    try {
      // Pass stream tag into role or difficulty to ensure exact backend matching
      const contextualRole = `${role} (${stream})`;
      const data = await api.interview.generateQuestions(contextualRole, difficulty, type);
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions returned by the AI Coach");
      }
      setQuestions(data.questions);
      setStatus("active");
    } catch (e: any) {
      toast({ title: "Start Failed", description: e.message || "Failed to load mock interview board.", variant: "destructive" });
      setStatus("setup");
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;

    setStatus("submitting");
    const activeQuestion = questions[currentIndex];
    
    try {
      // Evaluate current answer
      const evalRes = await api.interview.evaluateAnswer(activeQuestion.question, currentAnswer);
      
      const newEvaluations = [...evaluations, {
        question: activeQuestion.question,
        category: activeQuestion.category,
        studentAnswer: currentAnswer,
        sampleAnswer: activeQuestion.sampleAnswer,
        feedback: evalRes
      }];
      setEvaluations(newEvaluations);

      const newAnswers = [...answers, currentAnswer];
      setAnswers(newAnswers);

      setCurrentAnswer("");

      // Proceed to next question or complete
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setStatus("active");
      } else {
        // Complete mock interview and calculate average score
        const totalScore = newEvaluations.reduce((sum, item) => sum + (item.feedback?.score || 0), 0);
        const overallScore = Math.round(totalScore / questions.length);

        // Save entire attempt to backend
        const savedAttempt = await api.interview.saveAttempt({
          role: `${role} (${stream})`,
          type,
          difficulty,
          questions: newEvaluations,
          overallScore
        });

        setFinalScoreReport(savedAttempt);
        await refreshProfile(); // Refresh overall readiness dashboard scores
        setStatus("results");
        toast({ title: "Interview Complete! 🎖️", description: `You achieved an overall score of ${overallScore}%.` });
      }
    } catch (e: any) {
      toast({ title: "Submission Failed", description: e.message || "Could not save response.", variant: "destructive" });
      setStatus("active");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-primary/30 text-primary">
            AI Placement Simulator
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {stream === "CSE" ? "B.Tech CSE" : "BJMC Journalism & Media"}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
          Mock Interview System
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Simulate real campus recruitment panels. Get evaluated across technical depth, domain accuracy, communication clarity, and confidence.
        </p>
      </div>

      {status === "setup" && (
        <Card className="border border-border/80 shadow-sm bg-card">
          <CardHeader className="border-b border-border/60 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Swords className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Launch Live Interview Board</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Configure your discipline, target role, and interview tier
                  </CardDescription>
                </div>
              </div>

              {/* Stream Switcher Tab */}
              <div className="flex items-center p-1 bg-muted rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => handleStreamChange("CSE")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    stream === "CSE"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Laptop className="h-3.5 w-3.5" /> B.Tech CSE
                </button>
                <button
                  type="button"
                  onClick={() => handleStreamChange("BJMC")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    stream === "BJMC"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" /> BJMC Media
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job Role Input / Preset */}
              <div className="space-y-1.5">
                <Label htmlFor="mock-role" className="text-xs font-semibold">Target Job Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="mock-role" className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAM_ROLES[stream].map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Or enter custom role..." 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="h-8 text-xs mt-1"
                />
              </div>

              {/* Difficulty Level */}
              <div className="space-y-1.5">
                <Label htmlFor="mock-diff" className="text-xs font-semibold">Evaluation Tier</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="mock-diff" className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAM_DIFFICULTIES[stream].map((d) => (
                      <SelectItem key={d.value} value={d.value} className="text-xs">
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  {stream === "BJMC" ? "Calibrated for media editorial boards." : "Calibrated for tech coding & architecture."}
                </p>
              </div>

              {/* Interview Category / Type */}
              <div className="space-y-1.5">
                <Label htmlFor="mock-type" className="text-xs font-semibold">Panel Specialization</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="mock-type" className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAM_TYPES[stream].map((t) => (
                      <SelectItem key={t.value} value={t.value} className="text-xs">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  4 sequential round questions with scoring.
                </p>
              </div>
            </div>

            {/* Stream info callout banner */}
            <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 flex items-start gap-3">
              {stream === "BJMC" ? (
                <>
                  <Radio className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground block mb-0.5">BJMC Media & Journalism Evaluation Rubric</strong>
                    Questions cover Section 499 Defamation legal defenses, Press Council guidelines, confidential source protection under subpoena, unscripted live broadcast teleprompter failures, and multi-platform digital repurposing.
                  </div>
                </>
              ) : (
                <>
                  <Laptop className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground block mb-0.5">B.Tech Computer Science Evaluation Rubric</strong>
                    Questions cover Data Structures & Algorithms, distributed systems, database indexing (B+ Tree vs Hash), operating system concurrency/deadlocks, and engineering STAR behavioral situations.
                  </div>
                </>
              )}
            </div>

            <Button onClick={handleStart} className="w-full gap-2 h-10 text-xs font-semibold">
              <Brain className="h-4 w-4" /> Launch {stream} Mock Interview Board
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "loading" && (
        <Card className="border border-border p-16 text-center space-y-4 bg-card shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <div>
            <p className="font-semibold text-foreground text-sm">
              Preparing {stream} Interview Panel...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Generating 4 sequential round questions tailored for {role} ({difficulty}).
            </p>
          </div>
        </Card>
      )}

      {(status === "active" || status === "submitting") && (
        <Card className="border border-border bg-card shadow-sm relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between border-b border-border/80 py-3 mt-1 px-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Question {currentIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {questions[currentIndex]?.companyTag || stream}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary font-semibold">
              {questions[currentIndex]?.category}
            </Badge>
          </CardHeader>
          
          <CardContent className="p-6 space-y-5">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-3.5">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                  Panel Question
                </span>
                <p className="font-semibold text-foreground text-sm sm:text-base leading-relaxed">
                  {questions[currentIndex]?.question}
                </p>
              </div>
            </div>

            {/* Answer Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mock-student-answer" className="text-xs font-bold uppercase text-muted-foreground tracking-wide">
                  Your Answer
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <Textarea 
                id="mock-student-answer"
                rows={6}
                placeholder={
                  stream === "BJMC"
                    ? "Formulate your journalistic response here (cite legal exceptions, primary sources, right of reply, broadcast protocol)..."
                    : "Formulate your technical response here (explain Big-O complexity, architectural trade-offs, edge cases, system bottlenecks)..."
                }
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                disabled={status === "submitting"}
                className="text-xs leading-relaxed"
              />
            </div>

            {/* Candidate Tips */}
            {questions[currentIndex]?.tips && (
              <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground text-[11px] block">Panel Evaluation Focus:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {questions[currentIndex].tips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-muted-foreground">
                Graded for Domain Accuracy, Clarity & Communication.
              </span>
              <Button 
                onClick={handleAnswerSubmit} 
                disabled={status === "submitting" || !currentAnswer.trim()} 
                className="gap-2 shrink-0 font-semibold text-xs"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Answer...
                  </>
                ) : (
                  <>
                    Submit Answer & Next <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "results" && finalScoreReport && (
        <div className="space-y-6">
          {/* Main Results Card */}
          <Card className="border border-border bg-card text-center py-8 shadow-sm">
            <CardContent className="space-y-4">
              <div className="h-18 w-18 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary mx-auto text-3xl font-black">
                {finalScoreReport.overallScore}%
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-extrabold text-foreground font-heading">
                  {stream} Interview Board Assessment Complete!
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Assessed for: {role} • {difficulty}
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setStatus("setup")} className="gap-2 mt-2 text-xs font-semibold">
                <RotateCcw className="h-3.5 w-3.5" /> Practice Another Role
              </Button>
            </CardContent>
          </Card>

          {/* Question Breakdown List */}
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 font-heading">
            <Award className="h-4.5 w-4.5 text-primary" /> Section-by-Section Assessment Scorecard
          </h2>

          <div className="space-y-4">
            {finalScoreReport.questions?.map((item: any, idx: number) => (
              <Card key={idx} className="border border-border/80 shadow-sm bg-card overflow-hidden">
                <CardHeader className="p-4 bg-muted/30 border-b border-border/60 flex flex-row items-center justify-between py-2.5">
                  <span className="text-xs font-bold text-foreground">Round {idx + 1}: {item.category}</span>
                  <Badge variant={item.feedback?.score >= 70 ? "default" : "destructive"} className="text-xs">
                    Score: {item.feedback?.score}%
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Question Asked:</span>
                    <p className="text-foreground font-medium leading-relaxed">{item.question}</p>
                  </div>
                  
                  <div className="space-y-1 bg-muted/20 p-3 rounded-lg border border-border/60">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Your Recorded Answer:</span>
                    <p className="text-muted-foreground italic leading-relaxed">{item.studentAnswer}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/60 pt-3">
                    <div className="space-y-2">
                      <p><strong className="text-[10px] uppercase text-muted-foreground block font-bold">Clarity & Accuracy:</strong> {item.feedback?.clarity}</p>
                      <p><strong className="text-[10px] uppercase text-muted-foreground block font-bold">Relevance Feedback:</strong> {item.feedback?.relevance}</p>
                      <p><strong className="text-[10px] uppercase text-muted-foreground block font-bold">Actionable Tip:</strong> {item.feedback?.suggestions}</p>
                    </div>
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/60 pt-2.5 md:pt-0 md:pl-4 bg-primary/5 p-3 rounded-lg">
                      <strong className="text-[10px] text-primary uppercase font-bold block mb-1">
                        Model Answer Pitch:
                      </strong>
                      <p className="text-foreground leading-relaxed text-xs">{item.feedback?.improvedAnswer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
