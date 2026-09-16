import { useState, useCallback } from "react";
import { useCareer } from "@/context/CareerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, Award, Briefcase, GraduationCap, Sparkles, BarChart3, ArrowRight, RefreshCw, User, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const scoreColors: Record<string, string> = {
  "Resume Score": "text-primary",
  "ATS Score": "text-accent",
  "Format Score": "text-chart-1",
  "Impact Score": "text-chart-2",
  "Brevity Score": "text-chart-3",
  "Keyword Score": "text-chart-4",
  "Readability": "text-chart-5",
  "Quantification": "text-primary",
};

function getGrade(score: number) {
  if (score >= 90) return { grade: "A+", color: "text-accent" };
  if (score >= 80) return { grade: "A", color: "text-accent" };
  if (score >= 70) return { grade: "B+", color: "text-primary" };
  if (score >= 60) return { grade: "B", color: "text-chart-3" };
  if (score >= 50) return { grade: "C", color: "text-chart-3" };
  return { grade: "D", color: "text-destructive" };
}

export default function ResumeAnalysis() {
  const { resumeAnalysis, setResumeAnalysis, setIsLoading, isLoading, userName, setUserName, userEmail, setUserEmail, userPhone, setUserPhone, userLocation, setUserLocation } = useCareer();
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setFileName(file.name);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90));
    }, 500);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { fileContent: base64, fileName: file.name },
      });
      if (error) throw error;
      setResumeAnalysis(data);
      if (data.candidateName) setUserName(data.candidateName);
      if (data.candidateEmail) setUserEmail(data.candidateEmail);
      if (data.candidatePhone) setUserPhone(data.candidatePhone);
      if (data.candidateLocation) setUserLocation(data.candidateLocation);
      setProgress(100);
      toast({ title: "✅ Analysis Complete!", description: "Your resume has been analyzed with 10 different metrics." });
    } catch (err: any) {
      console.error("Resume analysis error:", err);
      toast({ title: "Analysis Failed", description: err.message || "Failed to analyze resume.", variant: "destructive" });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const overallGrade = resumeAnalysis ? getGrade(resumeAnalysis.resumeScore) : null;

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold gradient-text">
        Resume Analysis
      </motion.h1>

      {/* Upload Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer relative ${dragOver ? "border-primary bg-primary/5 glow-primary" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <Loader2 className="h-14 w-14 text-primary" />
                  </motion.div>
                  <p className="text-foreground font-medium">Analyzing {fileName}...</p>
                  <div className="w-64">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">Extracting skills, certifications, experience & 10 scoring metrics</p>
                  </div>
                </div>
              ) : (
                <motion.div className="flex flex-col items-center gap-3" whileHover={{ scale: 1.02 }}>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                    <Upload className="h-14 w-14 text-muted-foreground" />
                  </motion.div>
                  <p className="text-lg font-medium text-foreground">Drop your PDF resume here</p>
                  <p className="text-sm text-muted-foreground">or click to browse • PDF only • Max 10MB</p>
                  {resumeAnalysis && (
                    <Badge variant="secondary" className="mt-2 gap-1">
                      <RefreshCw className="h-3 w-3" /> Upload new resume to re-analyze
                    </Badge>
                  )}
                </motion.div>
              )}
              <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {resumeAnalysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Profile Card */}
            {userName && (
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
                <Card className="glass-card overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
                  <div className="absolute inset-0 shimmer pointer-events-none" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center gap-5">
                      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                        className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg glow-primary shrink-0">
                        {userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-bold text-foreground">{userName}</motion.h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {userEmail && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 text-primary" /> {userEmail}
                            </motion.span>
                          )}
                          {userPhone && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3 text-accent" /> {userPhone}
                            </motion.span>
                          )}
                          {userLocation && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 text-chart-3" /> {userLocation}
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <div className="text-center shrink-0">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                          <div className={`text-4xl font-black ${overallGrade?.color}`}>{overallGrade?.grade}</div>
                          <p className="text-xs text-muted-foreground">{resumeAnalysis.resumeScore}/100</p>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Overall Summary (if no name extracted, show old style) */}
            {!userName && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card overflow-hidden">
                  <div className="absolute inset-0 shimmer pointer-events-none" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-6">
                      <div className="text-center shrink-0">
                        <div className={`text-5xl font-black ${overallGrade?.color}`}>{overallGrade?.grade}</div>
                        <p className="text-sm text-muted-foreground mt-1">{resumeAnalysis.resumeScore}/100</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" /> Professional Summary
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{resumeAnalysis.summary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Summary below profile */}
            {userName && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2 text-sm">
                      <Sparkles className="h-4 w-4 text-primary" /> Professional Summary
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{resumeAnalysis.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 10 Score Metrics */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Resume Score", value: resumeAnalysis.resumeScore },
                { label: "ATS Score", value: resumeAnalysis.atsScore },
                { label: "Format Score", value: resumeAnalysis.formatScore },
                { label: "Impact Score", value: resumeAnalysis.impactScore },
                { label: "Brevity Score", value: resumeAnalysis.brevityScore },
                { label: "Keyword Score", value: resumeAnalysis.keywordScore },
                { label: "Readability", value: resumeAnalysis.readabilityScore },
                { label: "Quantification", value: resumeAnalysis.quantificationScore },
              ].map((m, i) => {
                const g = getGrade(m.value);
                return (
                  <motion.div key={m.label} custom={i} variants={fadeUp} whileHover={{ scale: 1.05, y: -5 }}>
                    <Card className="glass-card transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">{m.label}</p>
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                            className={`text-xs font-bold ${g.color}`}>{g.grade}</motion.span>
                        </div>
                        <p className={`text-2xl font-bold ${scoreColors[m.label] || "text-foreground"}`}>{m.value}<span className="text-sm text-muted-foreground">/100</span></p>
                        <Progress value={m.value} className="h-1.5 mt-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills */}
              <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Extracted Skills ({resumeAnalysis.skills.length})</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.skills.map((skill, i) => (
                        <motion.div key={skill} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.03, type: "spring" }}
                          whileHover={{ scale: 1.1 }}>
                          <Badge variant="secondary" className="hover:bg-primary/10 transition-colors cursor-default">{skill}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Certifications */}
              <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-chart-3" /> Certifications ({resumeAnalysis.certifications?.length || 0})</CardTitle></CardHeader>
                  <CardContent>
                    {resumeAnalysis.certifications?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {resumeAnalysis.certifications.map((cert, i) => (
                          <motion.div key={cert} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                            whileHover={{ scale: 1.05 }}>
                            <Badge variant="outline" className="border-chart-3/50">{cert}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No certifications found.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Experience */}
              <motion.div custom={10} initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Experience ({resumeAnalysis.experience?.length || 0})</CardTitle></CardHeader>
                  <CardContent>
                    {resumeAnalysis.experience?.length > 0 ? (
                      <div className="space-y-4">
                        {resumeAnalysis.experience.map((exp, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                            whileHover={{ x: 5 }}
                            className="border border-border rounded-lg p-4 hover:bg-muted/30 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-sm text-foreground">{exp.role}</h4>
                                <p className="text-xs text-muted-foreground">{exp.company}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs shrink-0">{exp.duration}</Badge>
                            </div>
                            <ul className="space-y-1">
                              {exp.highlights.map((h, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex gap-2">
                                  <span className="text-primary mt-0.5">▸</span> {h}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No work experience extracted.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Education */}
              <motion.div custom={11} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4 text-chart-4" /> Education</CardTitle></CardHeader>
                  <CardContent>
                    {resumeAnalysis.education?.length > 0 ? (
                      <div className="space-y-3">
                        {resumeAnalysis.education.map((edu, i) => (
                          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-all">
                            <h4 className="font-semibold text-sm text-foreground">{edu.degree}</h4>
                            <p className="text-xs text-muted-foreground">{edu.institution} • {edu.year}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No education details extracted.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Section Analysis */}
              <motion.div custom={12} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-chart-5" /> Section Analysis</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {resumeAnalysis.sectionAnalysis?.map((sec, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05 }}
                        className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <motion.span animate={sec.present ? { scale: [1, 1.3, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }}
                              className={`h-2 w-2 rounded-full ${sec.present ? "bg-accent" : "bg-destructive"}`} />
                            <span className="text-foreground">{sec.section}</span>
                          </div>
                          <span className={`text-xs font-medium ${sec.quality >= 70 ? "text-accent" : sec.quality >= 50 ? "text-chart-3" : "text-destructive"}`}>{sec.quality}/100</span>
                        </div>
                        <Progress value={sec.quality} className="h-1" />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Missing Skills */}
              <motion.div custom={13} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-destructive" /> Missing Skills ({resumeAnalysis.missingSkills.length})</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">Adding these skills can improve your match score:</p>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.missingSkills.map((skill, i) => (
                        <motion.div key={skill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.04 }}
                          whileHover={{ scale: 1.1 }}>
                          <Badge variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/5 transition-colors">{skill}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Role Recommendations */}
              <motion.div custom={14} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card h-full">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" /> Role Recommendations</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumeAnalysis.roleRecommendations.map((role, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.08 }}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-muted/30 transition-all">
                          <motion.span whileHover={{ scale: 1.2 }}
                            className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</motion.span>
                          <span className="text-foreground">{role}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bullet Improvements */}
              <motion.div custom={15} initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Resume Bullet Improvements</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resumeAnalysis.bulletImprovements.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                          className="rounded-lg border border-border p-4 space-y-2 hover:bg-muted/20 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground line-through">{item.original}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground font-medium">{item.improved}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
