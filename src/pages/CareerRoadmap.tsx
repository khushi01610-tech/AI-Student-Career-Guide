import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  MapPin, 
  ExternalLink, 
  BookOpen, 
  ClipboardList, 
  Lightbulb, 
  HelpCircle, 
  TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion";

export default function CareerRoadmap() {
  const { user, refreshProfile } = useAuth();
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSkillIdx, setActiveSkillIdx] = useState<number | null>(0);
  const [togglingSkill, setTogglingSkill] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRoadmap = async () => {
    try {
      const data = await api.roadmap.get();
      setRoadmapData(data);
    } catch (e) {
      console.error("Error fetching roadmap:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleSkill = async (skillName: string) => {
    setTogglingSkill(skillName);
    try {
      await api.roadmap.toggleSkill(skillName);
      await fetchRoadmap();
      await refreshProfile(); // Recalculate Career Readiness Score
      toast({ title: "Roadmap Updated", description: `Toggled completion status of: ${skillName}` });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not update skill status.", variant: "destructive" });
    } finally {
      setTogglingSkill(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Plotting your target learning roadmap...</p>
        </div>
      </div>
    );
  }

  const {
    careerGoal = "Career Prep",
    skills = [],
    completedSkills = [],
    progressPercent = 0
  } = roadmapData || {};

  return (
    <div className="space-y-6">
      {/* Header bar and progress */}
      <Card className="glass-card overflow-hidden relative border-primary/20">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 filter blur-xl pointer-events-none" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge className="gap-1 text-xs">
                <TrendingUp className="h-3.5 w-3.5" /> target roadmap
              </Badge>
              <h1 className="text-xl font-bold text-foreground">{careerGoal} Roadmap</h1>
              <p className="text-xs text-muted-foreground">Complete each skill category to increase placement readiness.</p>
            </div>
            
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Skill Steps List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" /> Learning Path Milestones
          </h2>
          
          <div className="space-y-2">
            {skills.map((skill: any, idx: number) => {
              const isCompleted = completedSkills.includes(skill.name);
              const isActive = activeSkillIdx === idx;
              const isToggling = togglingSkill === skill.name;

              return (
                <div 
                  key={idx}
                  onClick={() => setActiveSkillIdx(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${isActive ? "bg-primary/10 border-primary" : "bg-card border-border/40 hover:bg-muted/30"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleToggleSkill(skill.name); }}
                      className="shrink-0 text-primary hover:scale-115 transition-transform"
                    >
                      {isToggling ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {skill.name}
                      </p>
                      <Badge variant="outline" className="text-[9px] mt-1 scale-90 origin-left uppercase">
                        {skill.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <span className="text-[10px] text-muted-foreground">Step {idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel for Active Skill */}
        <div className="lg:col-span-2">
          {activeSkillIdx !== null && skills[activeSkillIdx] ? (() => {
            const skill = skills[activeSkillIdx];
            const isCompleted = completedSkills.includes(skill.name);

            return (
              <Card className="glass-card h-full flex flex-col">
                <CardHeader className="border-b border-border/20 py-4 flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold">{skill.name}</CardTitle>
                    <CardDescription className="text-xs">Level: {skill.level}</CardDescription>
                  </div>
                  <Button 
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                    disabled={togglingSkill === skill.name}
                    onClick={() => handleToggleSkill(skill.name)}
                    className="gap-1.5 shadow-sm"
                  >
                    {togglingSkill === skill.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </>
                    ) : (
                      "Mark as Complete"
                    )}
                  </Button>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto">
                  {/* Resources */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-accent uppercase flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> Recommended Tutorials & Docs
                    </h3>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {skill.resources?.map((r: string, i: number) => (
                        <a 
                          key={i} 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); toast({ title: "Navigating (Simulation)", description: `Opening ${r} tutorial link.` }); }}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted/40 hover:bg-muted text-muted-foreground hover:text-primary p-2 rounded-lg border border-border/40 transition-all"
                        >
                          {r} <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                      <ClipboardList className="h-4 w-4" /> Practice Action Tasks
                    </h3>
                    <ul className="space-y-1.5 pl-1.5">
                      {skill.tasks?.map((t: string, i: number) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="text-primary font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Project Ideas */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-accent uppercase flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4" /> Portfolio Project Ideas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {skill.projectIdeas?.map((proj: string, i: number) => (
                        <div key={i} className="p-3 rounded-lg border border-border/40 bg-muted/15">
                          <p className="text-xs font-bold text-foreground">{proj}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Develop this layout to expand your github portfolio.</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Questions */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-chart-4 uppercase flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4" /> Interview Board Questions
                    </h3>
                    <ul className="space-y-2 pl-1.5">
                      {skill.questions?.map((q: string, i: number) => (
                        <li key={i} className="p-2.5 rounded border border-border/20 bg-muted/5 text-xs text-muted-foreground leading-relaxed italic">
                          "{q}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })() : (
            <Card className="glass-card flex items-center justify-center py-20 text-muted-foreground text-center">
              <CardContent className="space-y-1">
                <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-xs">Select a roadmap step on the left to review instructions.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
