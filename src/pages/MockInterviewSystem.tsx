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
  RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";

export default function MockInterviewSystem() {
  const { user, refreshProfile } = useAuth();
  const [role, setRole] = useState(user?.careerGoal || "Software Developer");
  const [difficulty, setDifficulty] = useState("Entry Level");
  const [type, setType] = useState("Technical");
  
  // Quiz Flow state
  const [status, setStatus] = useState<"setup" | "loading" | "active" | "submitting" | "results">("setup");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [finalScoreReport, setFinalScoreReport] = useState<any>(null);

  const { toast } = useToast();

  const handleStart = async () => {
    setStatus("loading");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    setEvaluations([]);
    setFinalScoreReport(null);

    try {
      const data = await api.interview.generateQuestions(role, difficulty, type);
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
          role,
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Mock Interview System</h1>
        <p className="text-sm text-muted-foreground">Practice real-time questions, submit answers, and receive structured grading sheets.</p>
      </div>

      {status === "setup" && (
        <Card className="glass-card">
          <CardHeader className="text-center pb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
              <Swords className="h-6 w-6" />
            </div>
            <CardTitle>Launch Live Mock Session</CardTitle>
            <CardDescription>Practice answering 4 sequential questions (Technical, HR, Behavioral, Situational)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mock-role">Job Role</Label>
                <Input id="mock-role" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Full Stack Developer" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mock-diff">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="mock-diff">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level (Junior)</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mock-type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="mock-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="HR / Behavioral">HR / Behavioral</SelectItem>
                    <SelectItem value="Mixed Board">Mixed Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleStart} className="w-full gap-2 glow-primary mt-4">
              <Brain className="h-4 w-4" /> Start Mock Interview
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "loading" && (
        <Card className="glass-card py-16 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground animate-pulse">AI is generating interview questions and loading answer sheets...</p>
        </Card>
      )}

      {(status === "active" || status === "submitting") && (
        <Card className="glass-card relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentIndex / questions.length) * 100}%` }}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 py-3 mt-1.5">
            <Badge variant="outline">Question {currentIndex + 1} of {questions.length}</Badge>
            <Badge variant="secondary" className="capitalize">{questions[currentIndex]?.category}</Badge>
          </CardHeader>
          
          <CardContent className="p-6 space-y-5">
            <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex gap-3">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="font-semibold text-foreground text-sm">{questions[currentIndex]?.question}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mock-student-answer" className="text-xs font-bold uppercase text-muted-foreground">Your Answer</Label>
              <Textarea 
                id="mock-student-answer"
                rows={5}
                placeholder="Formulate and draft your response here (try to use metrics, explain roadmaps, and details)..."
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                disabled={status === "submitting"}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-muted-foreground">Answers are evaluated for Quality, Clarity & Confidence.</span>
              <Button 
                onClick={handleAnswerSubmit} 
                disabled={status === "submitting" || !currentAnswer.trim()} 
                className="gap-2 glow-primary shrink-0"
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
          <Card className="glass-card bg-primary/5 border-primary/20 text-center py-8">
            <CardContent className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto text-3xl font-black">
                {finalScoreReport.overallScore}%
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Interview Board Assessment Complete!</CardTitle>
                <CardDescription className="text-xs">Your completed scorecard is stored in your student portfolio dashboard</CardDescription>
              </div>
              <Button size="sm" onClick={() => setStatus("setup")} className="gap-2 mt-2">
                <RotateCcw className="h-4 w-4" /> Practice Another Role
              </Button>
            </CardContent>
          </Card>

          {/* Question Breakdown List */}
          <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-accent" /> Section-by-Section Assessment Scorecard
          </h2>

          <div className="space-y-4">
            {finalScoreReport.questions?.map((item: any, idx: number) => (
              <Card key={idx} className="glass-card border-border/40 overflow-hidden">
                <CardHeader className="p-4 bg-muted/20 border-b border-border/10 flex flex-row items-center justify-between py-2.5">
                  <span className="text-xs font-bold">Q{idx + 1}: {item.category}</span>
                  <Badge variant={item.feedback?.score >= 70 ? "default" : "destructive"}>
                    Score: {item.feedback?.score}%
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase">Question:</span>
                    <p className="text-foreground font-medium">{item.question}</p>
                  </div>
                  
                  <div className="space-y-1 bg-muted/10 p-2.5 rounded border border-border/10">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase">Your Answer:</span>
                    <p className="text-muted-foreground italic">{item.studentAnswer}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/10 pt-3">
                    <div className="space-y-2">
                      <p><strong className="text-[10px] uppercase text-accent block">Clarity & Accuracy:</strong> {item.feedback?.clarity}</p>
                      <p><strong className="text-[10px] uppercase text-accent block">Relevance Feedback:</strong> {item.feedback?.relevance}</p>
                      <p><strong className="text-[10px] uppercase text-accent block">Improvement Tip:</strong> {item.feedback?.suggestions}</p>
                    </div>
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/10 pt-2.5 md:pt-0 md:pl-4 bg-primary/5 p-2.5 rounded">
                      <strong className="text-[10px] text-primary uppercase block mb-1">AI Improved Pitch:</strong>
                      <p className="text-foreground leading-relaxed">{item.feedback?.improvedAnswer}</p>
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
