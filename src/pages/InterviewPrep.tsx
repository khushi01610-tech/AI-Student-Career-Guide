import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Brain, 
  Target, 
  BookOpen, 
  Star, 
  Zap, 
  Award,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPrep() {
  const { user } = useAuth();
  const [role, setRole] = useState(user?.careerGoal || "Software Developer");
  const [difficulty, setDifficulty] = useState("Entry Level");
  const [type, setType] = useState("Technical");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  
  // Practice Mode state
  const [activePracticeIndex, setActivePracticeIndex] = useState<number | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<any>(null);

  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setInterviewData(null);
    setRevealedAnswers(new Set());
    setActivePracticeIndex(null);
    setEvaluationFeedback(null);
    
    try {
      const data = await api.interview.generateQuestions(role, difficulty, type);
      setInterviewData(data);
      toast({ title: "Questions Generated!", description: `Loaded ${data.questions?.length || 0} questions for ${role}.` });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not retrieve questions.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const startPractice = (idx: number) => {
    setActivePracticeIndex(idx);
    setStudentAnswer("");
    setEvaluationFeedback(null);
  };

  const submitPracticeAnswer = async (questionText: string) => {
    if (!studentAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluationFeedback(null);

    try {
      const evalData = await api.interview.evaluateAnswer(questionText, studentAnswer);
      setEvaluationFeedback(evalData);
      toast({ title: "Answer Evaluated!", description: `Score: ${evalData.score || 0}%` });
    } catch (e: any) {
      toast({ title: "Evaluation Failed", description: e.message || "Failed to analyze answer.", variant: "destructive" });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Interview Preparation</h1>
        <p className="text-sm text-muted-foreground">Select a role and difficulty level to review study guides and practice writing answers.</p>
      </div>

      {/* Settings Selection Card */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="role-select">Target Role</Label>
              <Input 
                id="role-select" 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                placeholder="e.g. Frontend Developer" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="difficulty-select">Experience Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty-select">
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
              <Label htmlFor="type-select">Interview Category</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical Questions</SelectItem>
                  <SelectItem value="HR / Behavioral">HR & Behavioral</SelectItem>
                  <SelectItem value="Mixed Board">Mixed Board</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={isLoading} className="glow-primary gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              Generate Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground animate-pulse">AI is compiling curated sample questions...</p>
        </div>
      )}

      {/* Main Q&A Display */}
      {interviewData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-primary" /> Curated Questions List
            </h2>
            
            {interviewData.questions?.map((q: any, idx: number) => {
              const isRevealed = revealedAnswers.has(idx);
              const isPracticing = activePracticeIndex === idx;

              return (
                <Card key={idx} className="glass-card hover:border-border transition-all">
                  <CardHeader className="p-4 flex flex-row items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider">{q.category}</Badge>
                        <Badge variant="secondary" className="text-[9px]">{q.difficulty || difficulty}</Badge>
                      </div>
                      <CardTitle className="text-sm font-semibold leading-snug">{q.question}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 border-t border-border/10 space-y-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleAnswer(idx)} className="h-8 text-xs font-semibold text-primary hover:bg-primary/5">
                        {isRevealed ? "Hide Sample Answer" : "View Sample Answer"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => startPractice(idx)} className="h-8 text-xs gap-1 border-accent/20 text-accent hover:bg-accent/5">
                        <Sparkles className="h-3 w-3" /> Practice Answer
                      </Button>
                    </div>

                    <AnimatePresence>
                      {isRevealed && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2 text-xs leading-relaxed space-y-2 border-t border-border/10">
                          <p className="font-semibold text-foreground">Sample Answer:</p>
                          <p className="text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/30">{q.sampleAnswer}</p>
                          
                          <div className="flex gap-1.5 mt-2">
                            <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="font-bold text-[10px] uppercase text-accent">Tips:</span>
                              <ul className="list-disc list-inside text-muted-foreground text-[11px] space-y-0.5 pl-1">
                                {q.tips?.map((t: string, i: number) => <li key={i}>{t}</li>)}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Practice Form Integration */}
                    {isPracticing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-3 border-t border-border/10 space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor={`practice-input-${idx}`} className="text-[10px] font-bold text-accent uppercase">Your Practice Answer</Label>
                          <Textarea 
                            id={`practice-input-${idx}`}
                            rows={3} 
                            placeholder="Type or copy-paste your response here to get AI feedback..." 
                            value={studentAnswer} 
                            onChange={e => setStudentAnswer(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Button size="xs" variant="ghost" onClick={() => setActivePracticeIndex(null)} className="h-7 text-[10px]">Cancel</Button>
                          <Button size="xs" onClick={() => submitPracticeAnswer(q.question)} disabled={isEvaluating || !studentAnswer.trim()} className="h-7 text-[10px] gap-1 glow-accent">
                            {isEvaluating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Award className="h-3 w-3" />}
                            Submit for Review
                          </Button>
                        </div>

                        {evaluationFeedback && (
                          <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 space-y-2 mt-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-foreground uppercase text-[10px]">AI Evaluation: {evaluationFeedback.quality}</span>
                              <Badge className="bg-primary text-[10px]">{evaluationFeedback.score || 0}% Score</Badge>
                            </div>
                            <p className="text-muted-foreground"><strong className="text-[10px] uppercase block">Clarity & Communication:</strong> {evaluationFeedback.clarity}</p>
                            <p className="text-muted-foreground"><strong className="text-[10px] uppercase block">Suggestions:</strong> {evaluationFeedback.suggestions}</p>
                            <div className="bg-card p-2 rounded border border-border/50">
                              <strong className="text-[10px] text-primary uppercase block mb-1">Better Version:</strong>
                              <p className="text-foreground">{evaluationFeedback.improvedAnswer}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tips and sidebar guidance */}
          <div className="space-y-6">
            <Card className="glass-card bg-primary/5 border-primary/20">
              <CardHeader><CardTitle className="text-base flex items-center gap-1.5"><Star className="h-4 w-4 text-primary" /> Expert Prep Tips</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-xs leading-relaxed">
                {interviewData.generalTips?.map((tip: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-destructive/20 bg-destructive/5">
              <CardHeader><CardTitle className="text-base flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-destructive" /> Common Mistakes</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-xs leading-relaxed">
                {interviewData.commonMistakes?.map((mistake: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-destructive font-bold text-sm leading-none shrink-0">•</span>
                    <p className="text-muted-foreground">{mistake}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
