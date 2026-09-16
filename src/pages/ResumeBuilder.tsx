import { useState } from "react";
import { useCareer } from "@/context/CareerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download, ArrowRight, Sparkles, CheckCircle2, Star, Shield, Palette, Zap, Award, Eye, Copy, Briefcase, GraduationCap, Code, User, Mail, Phone, MapPin, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const templates = [
  { id: "professional", name: "Professional", desc: "Clean, corporate-ready", icon: Briefcase, color: "from-blue-500 to-indigo-600" },
  { id: "modern", name: "Modern", desc: "Sleek with accent colors", icon: Zap, color: "from-violet-500 to-purple-600" },
  { id: "minimal", name: "Minimal", desc: "Simple & elegant", icon: Star, color: "from-gray-500 to-slate-600" },
  { id: "creative", name: "Creative", desc: "Bold & eye-catching", icon: Palette, color: "from-pink-500 to-rose-600" },
  { id: "executive", name: "Executive", desc: "Senior leadership style", icon: Award, color: "from-amber-500 to-orange-600" },
  { id: "technical", name: "Technical", desc: "Developer-focused", icon: Code, color: "from-emerald-500 to-green-600" },
  { id: "academic", name: "Academic", desc: "Research & education", icon: GraduationCap, color: "from-cyan-500 to-teal-600" },
  { id: "startup", name: "Startup", desc: "Dynamic & growth-oriented", icon: Sparkles, color: "from-red-500 to-pink-600" },
  { id: "consulting", name: "Consulting", desc: "Strategy & impact driven", icon: Globe, color: "from-sky-500 to-blue-600" },
  { id: "data-driven", name: "Data-Driven", desc: "Metrics & analytics focus", icon: Shield, color: "from-lime-500 to-emerald-600" },
  { id: "federal", name: "Federal/Govt", desc: "Government & public sector", icon: Shield, color: "from-slate-500 to-zinc-700" },
  { id: "healthcare", name: "Healthcare", desc: "Medical & clinical roles", icon: Award, color: "from-teal-500 to-cyan-600" },
  { id: "sales", name: "Sales & Marketing", desc: "Revenue-driven results", icon: Zap, color: "from-orange-500 to-red-500" },
  { id: "design", name: "UX/Design", desc: "Portfolio-oriented", icon: Palette, color: "from-fuchsia-500 to-pink-500" },
  { id: "finance", name: "Finance & Banking", desc: "Quantitative & compliance", icon: Briefcase, color: "from-emerald-600 to-teal-700" },
];

interface BuiltResume {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  portfolio?: string;
  professionalSummary: string;
  skills: { technical: string[]; soft: string[]; tools: string[] };
  experience: { title: string; company: string; location?: string; startDate: string; endDate: string; bullets: string[] }[];
  education: { degree: string; institution: string; graduationDate: string; gpa?: string; honors?: string }[];
  certifications: string[];
  projects?: { name: string; description: string; technologies: string[] }[];
  atsScore: number;
  atsKeywords: string[];
}

export default function ResumeBuilder() {
  const { resumeAnalysis, userName, userEmail, userPhone, userLocation } = useCareer();
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [targetRole, setTargetRole] = useState("");
  const [builtResume, setBuiltResume] = useState<BuiltResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const buildResume = async () => {
    if (!resumeAnalysis) {
      toast({ title: "Upload Resume First", description: "Analyze your resume before building a new one.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("build-resume", {
        body: {
          resumeData: {
            ...resumeAnalysis,
            candidateName: userName,
            candidateEmail: userEmail,
            candidatePhone: userPhone,
            candidateLocation: userLocation,
          },
          template: selectedTemplate,
          targetRole: targetRole || resumeAnalysis.roleRecommendations?.[0] || "",
        },
      });
      if (error) throw error;
      setBuiltResume(data);
      toast({ title: "🎉 Resume Built!", description: `ATS Score: ${data.atsScore}/100 — Your new resume is ready!` });
    } catch (err: any) {
      toast({ title: "Build Failed", description: err.message || "Failed to build resume.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!builtResume) return;
    const text = formatResumeAsText(builtResume);
    navigator.clipboard.writeText(text);
    toast({ title: "📋 Copied!", description: "Resume text copied to clipboard." });
  };

  const downloadAsText = () => {
    if (!builtResume) return;
    const text = formatResumeAsText(builtResume);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${builtResume.fullName.replace(/\s+/g, "_")}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "⬇️ Downloaded!", description: "Resume downloaded as text file." });
  };

  if (!resumeAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div animate={{ y: [0, -12, 0], rotateY: [0, 360] }} transition={{ y: { repeat: Infinity, duration: 3 }, rotateY: { repeat: Infinity, duration: 6, ease: "linear" } }}>
          <FileText className="h-20 w-20 text-primary/30" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">Upload Your Resume First</h2>
          <p className="text-sm text-muted-foreground max-w-md">We need your existing resume to create a polished, ATS-optimized version with your chosen template.</p>
        </motion.div>
        <Button onClick={() => navigate("/resume")} className="gap-2 glow-primary">
          <ArrowRight className="h-4 w-4" /> Go to Resume Analysis
        </Button>
      </div>
    );
  }

  const templateData = templates.find(t => t.id === selectedTemplate)!;

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold gradient-text">
        Resume Builder
      </motion.h1>

      {/* Template Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <div className="absolute inset-0 shimmer pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Choose Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {templates.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`cursor-pointer relative rounded-xl border-2 p-3 text-center transition-all duration-300 ${
                    selectedTemplate === t.id
                      ? "border-primary bg-primary/5 shadow-lg glow-primary"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}>
                  {selectedTemplate === t.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 z-10">
                      <CheckCircle2 className="h-5 w-5 text-primary bg-background rounded-full" />
                    </motion.div>
                  )}
                  <div className={`h-8 w-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <t.icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Target role (e.g. Senior React Developer)..." value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && buildResume()} />
              </div>
              <Button onClick={buildResume} disabled={isLoading} className="gap-2 glow-primary min-w-[180px]">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Build ATS Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <motion.div className="relative inline-block">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Loader2 className="h-16 w-16 text-primary" />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-primary/10" />
            </motion.div>
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
              className="text-muted-foreground mt-6 text-lg">
              AI is crafting your perfect resume...
            </motion.p>
            <p className="text-xs text-muted-foreground mt-2">Using {templateData.name} template • Optimizing for 100% ATS compatibility</p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {builtResume && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* ATS Score & Actions */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col sm:flex-row gap-4">
              <Card className="glass-card flex-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
                <CardContent className="p-6 relative flex items-center gap-4">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 glow-primary">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{builtResume.atsScore}%</div>
                      <div className="text-[9px] text-white/80">ATS</div>
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">ATS-Optimized Resume Ready!</h3>
                    <p className="text-sm text-muted-foreground">Template: {templateData.name} • {builtResume.atsKeywords?.length || 0} keywords optimized</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {builtResume.atsKeywords?.slice(0, 8).map((kw, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex sm:flex-col gap-2">
                <Button onClick={copyToClipboard} variant="outline" className="gap-2 flex-1">
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button onClick={downloadAsText} className="gap-2 flex-1 glow-primary">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </motion.div>

            {/* Resume Preview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" /> Resume Preview — {templateData.name} Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-background p-8 max-w-3xl mx-auto space-y-6 resume-preview">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center border-b border-border pb-4">
                      <h1 className="text-2xl font-bold text-foreground">{builtResume.fullName}</h1>
                      <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-muted-foreground">
                        {builtResume.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {builtResume.email}</span>}
                        {builtResume.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {builtResume.phone}</span>}
                        {builtResume.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {builtResume.location}</span>}
                      </div>
                    </motion.div>

                    {/* Summary */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Professional Summary</h2>
                      <p className="text-sm text-foreground leading-relaxed">{builtResume.professionalSummary}</p>
                    </motion.div>

                    {/* Skills */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Skills</h2>
                      <div className="space-y-1.5">
                        {builtResume.skills.technical?.length > 0 && (
                          <p className="text-sm"><span className="font-semibold text-foreground">Technical:</span> <span className="text-muted-foreground">{builtResume.skills.technical.join(" • ")}</span></p>
                        )}
                        {builtResume.skills.tools?.length > 0 && (
                          <p className="text-sm"><span className="font-semibold text-foreground">Tools:</span> <span className="text-muted-foreground">{builtResume.skills.tools.join(" • ")}</span></p>
                        )}
                        {builtResume.skills.soft?.length > 0 && (
                          <p className="text-sm"><span className="font-semibold text-foreground">Soft Skills:</span> <span className="text-muted-foreground">{builtResume.skills.soft.join(" • ")}</span></p>
                        )}
                      </div>
                    </motion.div>

                    {/* Experience */}
                    {builtResume.experience?.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Professional Experience</h2>
                        <div className="space-y-4">
                          {builtResume.experience.map((exp, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.08 }}>
                              <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-sm text-foreground">{exp.title}</h3>
                                <span className="text-xs text-muted-foreground shrink-0">{exp.startDate} – {exp.endDate}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">{exp.company}{exp.location ? ` • ${exp.location}` : ""}</p>
                              <ul className="space-y-1">
                                {exp.bullets.map((b, j) => (
                                  <li key={j} className="text-sm text-foreground flex gap-2">
                                    <span className="text-primary mt-1 shrink-0">▸</span> {b}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Education */}
                    {builtResume.education?.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Education</h2>
                        {builtResume.education.map((edu, i) => (
                          <div key={i} className="mb-2">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-semibold text-sm text-foreground">{edu.degree}</h3>
                              <span className="text-xs text-muted-foreground">{edu.graduationDate}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{edu.institution}{edu.gpa ? ` • GPA: ${edu.gpa}` : ""}{edu.honors ? ` • ${edu.honors}` : ""}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Certifications */}
                    {builtResume.certifications?.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Certifications</h2>
                        <div className="flex flex-wrap gap-2">
                          {builtResume.certifications.map((c, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Projects */}
                    {builtResume.projects?.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Projects</h2>
                        {builtResume.projects.map((p, i) => (
                          <div key={i} className="mb-3">
                            <h3 className="font-semibold text-sm text-foreground">{p.name}</h3>
                            <p className="text-xs text-muted-foreground mb-1">{p.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {p.technologies.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
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

function formatResumeAsText(r: BuiltResume): string {
  let text = `${r.fullName}\n`;
  const contact = [r.email, r.phone, r.location, r.linkedIn, r.portfolio].filter(Boolean).join(" | ");
  if (contact) text += `${contact}\n`;
  text += `\n${"=".repeat(60)}\nPROFESSIONAL SUMMARY\n${"=".repeat(60)}\n${r.professionalSummary}\n`;
  text += `\n${"=".repeat(60)}\nSKILLS\n${"=".repeat(60)}\n`;
  if (r.skills.technical?.length) text += `Technical: ${r.skills.technical.join(", ")}\n`;
  if (r.skills.tools?.length) text += `Tools: ${r.skills.tools.join(", ")}\n`;
  if (r.skills.soft?.length) text += `Soft Skills: ${r.skills.soft.join(", ")}\n`;
  if (r.experience?.length) {
    text += `\n${"=".repeat(60)}\nPROFESSIONAL EXPERIENCE\n${"=".repeat(60)}\n`;
    r.experience.forEach(exp => {
      text += `\n${exp.title} | ${exp.company}${exp.location ? ` | ${exp.location}` : ""}\n${exp.startDate} – ${exp.endDate}\n`;
      exp.bullets.forEach(b => { text += `  • ${b}\n`; });
    });
  }
  if (r.education?.length) {
    text += `\n${"=".repeat(60)}\nEDUCATION\n${"=".repeat(60)}\n`;
    r.education.forEach(e => {
      text += `${e.degree} — ${e.institution} (${e.graduationDate})${e.gpa ? ` GPA: ${e.gpa}` : ""}${e.honors ? ` ${e.honors}` : ""}\n`;
    });
  }
  if (r.certifications?.length) {
    text += `\n${"=".repeat(60)}\nCERTIFICATIONS\n${"=".repeat(60)}\n`;
    r.certifications.forEach(c => { text += `  • ${c}\n`; });
  }
  if (r.projects?.length) {
    text += `\n${"=".repeat(60)}\nPROJECTS\n${"=".repeat(60)}\n`;
    r.projects.forEach(p => {
      text += `\n${p.name}\n${p.description}\nTech: ${p.technologies.join(", ")}\n`;
    });
  }
  return text;
}
