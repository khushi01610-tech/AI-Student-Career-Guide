import { useCareer } from "@/context/CareerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Map, BookOpen, TrendingUp, Target, Calendar, Lightbulb, DollarSign, Clock, Rocket, ExternalLink, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function CareerPlanPage() {
  const { resumeAnalysis, careerPlan, setCareerPlan, isLoading, setIsLoading } = useCareer();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generatePlan = async () => {
    if (!resumeAnalysis) {
      toast({ title: "Upload Resume First", description: "Analyze your resume to generate a career plan.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("career-plan", {
        body: { skills: resumeAnalysis.skills, roles: resumeAnalysis.roleRecommendations, missingSkills: resumeAnalysis.missingSkills },
      });
      if (error) throw error;
      setCareerPlan(data);
      toast({ title: "🚀 Plan Generated!", description: "Your comprehensive 12-week career plan is ready!" });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message || "Could not generate plan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!resumeAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <Map className="h-20 w-20 text-muted-foreground/30" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Upload your resume first</p>
          <p className="text-sm text-muted-foreground">We need your resume data to generate a personalized career plan.</p>
        </motion.div>
        <Button onClick={() => navigate("/resume")} className="gap-2">
          <ArrowRight className="h-4 w-4" /> Go to Resume Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">Career Plan</h1>
        <Button onClick={generatePlan} disabled={isLoading} className="gap-2 glow-primary">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {careerPlan ? "Regenerate" : "Generate Plan"}
        </Button>
      </motion.div>

      {!careerPlan && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-12 text-center space-y-4">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <Rocket className="h-16 w-16 text-primary/30 mx-auto" />
              </motion.div>
              <p className="text-muted-foreground text-lg">Click "Generate Plan" to create your AI-powered career roadmap</p>
              <p className="text-xs text-muted-foreground">Includes 12-week timetable, projects, salary data, and learning resources</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isLoading && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Loader2 className="h-14 w-14 text-primary mx-auto" />
            </motion.div>
            <p className="text-muted-foreground mt-4">Building your comprehensive career plan...</p>
            <p className="text-xs text-muted-foreground mt-1">Analyzing market trends, skill gaps, and salary data</p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {careerPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Action Plan */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Action Plan</CardTitle></CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {careerPlan.actionPlan.map((step, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                        className="flex gap-3 text-sm group">
                        <span className="h-7 w-7 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">{i + 1}</span>
                        <span className="text-foreground pt-0.5">{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Timetable */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-chart-3" /> 12-Week Timetable</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {careerPlan.weeklyTimetable?.map((week, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                        className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/20 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-primary">{week.week}</h4>
                          <Badge variant="secondary" className="text-xs">Goal</Badge>
                        </div>
                        <p className="text-xs text-accent font-medium">{week.goal}</p>
                        <ul className="space-y-1">
                          {week.tasks.map((task, j) => (
                            <li key={j} className="text-xs text-muted-foreground flex gap-2">
                              <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" /> {task}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Trends */}
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-accent" /> Market Trends</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {careerPlan.marketTrends.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
                          className="border border-border rounded-lg p-3 hover:bg-muted/20 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-foreground">{t.trend}</span>
                            <Badge variant="secondary" className="text-xs shrink-0">{t.demand}</Badge>
                          </div>
                          {t.growth && <p className="text-xs text-accent">{t.growth}</p>}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skill Gaps */}
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-chart-4" /> Skill Gaps & Time to Learn</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {careerPlan.skillGaps.map((sg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "100%" }} transition={{ delay: 0.6 + i * 0.08 }}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground">{sg.skill}</span>
                          <span className="text-xs text-muted-foreground">{sg.timeToLearn || `${sg.importance}%`}</span>
                        </div>
                        <Progress value={sg.importance} className="h-1.5" />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project Ideas */}
              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-chart-3" /> Project Ideas to Build</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {careerPlan.projectIdeas?.map((project, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                          className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/20 hover:-translate-y-0.5 transition-all">
                          <h4 className="font-semibold text-sm text-foreground">{project.title}</h4>
                          <p className="text-xs text-muted-foreground">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Salary Expectations */}
              <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-accent" /> Salary Expectations</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {careerPlan.salaryExpectations?.map((sal, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}
                          className="border border-border rounded-lg p-3 hover:bg-muted/20 transition-colors">
                          <p className="text-sm font-medium text-foreground mb-2">{sal.role}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">${(sal.min / 1000).toFixed(0)}k</span>
                            <div className="flex-1 bg-muted rounded-full h-2.5 relative overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${((sal.avg - sal.min) / (sal.max - sal.min)) * 100}%` }}
                                transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                                className="absolute h-2.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                            </div>
                            <span className="text-muted-foreground">${(sal.max / 1000).toFixed(0)}k</span>
                          </div>
                          <p className="text-xs text-accent mt-1 font-medium">Avg: ${(sal.avg / 1000).toFixed(0)}k/year</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Industry Insights */}
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Industry Insights</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {careerPlan.industryInsights?.map((insight, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.08 }}
                        className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border text-sm hover:bg-muted/50 transition-colors">
                        <span className="text-primary font-bold text-lg">💡</span>
                        <span className="text-foreground">{insight}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Resources */}
            <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-chart-3" /> Learning Resources</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {careerPlan.learningResources.map((lr, i) => (
                      <motion.a key={i} href={lr.url} target="_blank" rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.06 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{lr.type}</Badge>
                            {lr.difficulty && <Badge variant="secondary" className="text-xs">{lr.difficulty}</Badge>}
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-foreground font-medium">{lr.title}</span>
                      </motion.a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
