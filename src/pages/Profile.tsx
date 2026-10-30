import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Trash2, 
  PlusCircle, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  ExternalLink,
  Code2,
  Newspaper,
  Upload,
  RefreshCw,
  Sparkles,
  FileEdit,
  Check,
  X,
  Layers,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

// Stream Skill Dictionaries
const CSE_CATEGORIES: Record<string, string[]> = {
  "Programming Languages": ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "SQL", "Go", "C#"],
  "Web Development": ["HTML5", "CSS3", "React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS", "REST APIs"],
  "Databases & Tools": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Git", "GitHub", "Docker", "Postman", "AWS"],
  "Core CS Fundamentals": ["DSA", "OOP", "Operating Systems", "DBMS", "Computer Networks", "System Design"],
  "Emerging Technologies": ["Machine Learning", "Artificial Intelligence", "Data Analytics", "Deep Learning", "Cybersecurity"]
};

const BJMC_CATEGORIES: Record<string, string[]> = {
  "Journalism & Reporting": ["News Writing", "Reporting", "Copy Editing", "Fact-Checking", "Beat Reporting", "Investigative Journalism"],
  "Digital Media & Content": ["Content Writing", "Copywriting", "SEO", "Blogging", "Social Media Management", "Digital Storytelling"],
  "Broadcasting & Audio": ["Public Speaking", "Interviewing & Anchoring", "Radio/Podcast Production", "TV Journalism", "Speech Writing"],
  "Production & Design": ["Video Editing", "Adobe Premiere Pro", "Canva", "Photoshop", "Audacity", "Photography"],
  "PR & Brand Strategy": ["Public Relations", "Press Releases", "Brand Communication", "Crisis Management", "Media Relations"]
};

const CSE_CAREER_GOALS = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps / Cloud Associate",
  "QA Automation Engineer"
];

const BJMC_CAREER_GOALS = [
  "Content Writer / Strategist",
  "Digital Journalist / Reporter",
  "PR & Brand Specialist",
  "Social Media Manager",
  "Video Producer / Editor",
  "Broadcast Anchor / Assistant Producer"
];

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("skills");
  const [degree, setDegree] = useState<"CSE" | "BJMC">(user?.degree === "BJMC" ? "BJMC" : "CSE");
  const [academicYear, setAcademicYear] = useState<string>(String(user?.academicYear || "4"));
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [activeSkills, setActiveSkills] = useState<string[]>(user?.skills || []);
  const [customSkill, setCustomSkill] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  
  // Project state
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Extracted text review dialog state
  const [isTextReviewOpen, setIsTextReviewOpen] = useState(false);
  const [reviewedText, setReviewedText] = useState("");

  useEffect(() => {
    if (user) {
      setDegree(user.degree === "BJMC" ? "BJMC" : "CSE");
      setAcademicYear(String(user.academicYear || "4"));
      setCareerGoal(user.careerGoal || "");
      setActiveSkills(user.skills || []);
    }
    if (profile) {
      setBio(profile.bio || "");
      setReviewedText(profile.extractedResumeText || "");
    }
  }, [user, profile]);

  // Toggle skill inclusion
  const handleToggleSkill = (skill: string) => {
    const exists = activeSkills.some(s => s.toLowerCase() === skill.toLowerCase());
    if (exists) {
      setActiveSkills(prev => prev.filter(s => s.toLowerCase() !== skill.toLowerCase()));
    } else {
      setActiveSkills(prev => [...prev, skill]);
    }
  };

  // Add custom typed skill
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    const trimmed = customSkill.trim();
    if (!activeSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setActiveSkills(prev => [...prev, trimmed]);
      toast({ title: "Skill Added", description: `Added ${trimmed} to your profile.` });
    }
    setCustomSkill("");
  };

  // Switch degree stream
  const handleSwitchDegree = async (newDegree: "CSE" | "BJMC") => {
    setDegree(newDegree);
    const defaultGoal = newDegree === "CSE" ? "Full Stack Developer" : "Digital Journalist / Reporter";
    setCareerGoal(defaultGoal);

    try {
      await api.profile.update({
        degree: newDegree,
        careerGoal: defaultGoal
      });
      await refreshProfile();
      toast({
        title: "Stream Switched!",
        description: `Your profile has been set to ${newDegree}. Skill libraries and role recommendations are updated.`
      });
    } catch (e: any) {
      toast({ title: "Failed to switch stream", description: e.message, variant: "destructive" });
    }
  };

  // Save all profile credentials
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await api.profile.update({
        bio,
        careerGoal,
        degree,
        academicYear: Number(academicYear),
        skills: activeSkills
      });
      await refreshProfile();
      toast({ title: "Profile Saved!", description: "All changes updated successfully." });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Resume upload handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Invalid File Format", description: "Only PDF resumes are supported.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Maximum resume file size is 10MB.", variant: "destructive" });
      return;
    }

    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.resume.analyze(formData);
      await refreshProfile();
      
      const analysis = res?.analysis || res;
      if (analysis?.skills) {
        // Merge extracted skills
        const merged = Array.from(new Set([...activeSkills, ...analysis.skills]));
        setActiveSkills(merged);
      }

      setReviewedText(res?.extractedText || analysis?.extractedText || "");
      const score = analysis?.atsScore ?? analysis?.resumeScore ?? 80;
      const skillsCount = analysis?.skills?.length || 0;
      toast({
        title: "Resume Analyzed Successfully! 🚀",
        description: `ATS Score: ${score}/100 with ${skillsCount} skills detected.`
      });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message || "Failed to process resume.", variant: "destructive" });
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Remove resume
  const handleRemoveResume = async () => {
    try {
      await api.profile.update({
        resumeUrl: "",
        resumeFileName: "",
        extractedResumeText: "",
        resumeScore: 0,
        atsScore: 0
      });
      await refreshProfile();
      setReviewedText("");
      toast({ title: "Resume Removed", description: "Resume file reference cleared." });
    } catch (err: any) {
      toast({ title: "Failed to remove resume", description: err.message, variant: "destructive" });
    }
  };

  // Save reviewed resume text
  const handleSaveReviewedText = async () => {
    try {
      await api.profile.update({
        extractedResumeText: reviewedText
      });
      await refreshProfile();
      setIsTextReviewOpen(false);
      toast({ title: "Extracted Text Updated", description: "Resume summary saved to profile." });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    }
  };

  // Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) return;
    setIsAddingProject(true);

    try {
      const currentProjects = profile?.projects || [];
      const newProj = {
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        technologies: projectTech.split(",").map(t => t.trim()).filter(Boolean),
        link: projectLink.trim() || undefined
      };

      await api.profile.update({
        projects: [...currentProjects, newProj]
      });
      await refreshProfile();
      setProjectTitle("");
      setProjectDesc("");
      setProjectTech("");
      setProjectLink("");
      setIsProjectDialogOpen(false);
      toast({ title: "Project Added!", description: "Portfolio item saved." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not add project.", variant: "destructive" });
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = async (idx: number) => {
    const current = profile?.projects || [];
    const updated = [...current];
    updated.splice(idx, 1);

    try {
      await api.profile.update({ projects: updated });
      await refreshProfile();
      toast({ title: "Project Removed", description: "Deleted portfolio card." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const activeCategories = degree === "CSE" ? CSE_CATEGORIES : BJMC_CATEGORIES;
  const currentGoalOptions = degree === "CSE" ? CSE_CAREER_GOALS : BJMC_CAREER_GOALS;

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt="Student Avatar"
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-border shrink-0 shadow-sm"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary font-black text-xl flex items-center justify-center shrink-0 border border-primary/20 shadow-xs font-heading">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">{user?.name}</h1>
                  <Badge variant="outline" className="font-mono text-xs font-bold border-primary/30 text-primary bg-primary/5">
                    {degree === "CSE" ? "CSE • Computer Science" : "BJMC • Media & Mass Comm"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Year {academicYear}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> {user?.college} • {user?.course}
                </p>
                <p className="text-xs text-foreground font-medium flex items-center gap-1.5 pt-0.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> Target Role: <span className="text-primary font-bold">{careerGoal || "Not set yet"}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics & Stream Switcher */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
              <div className="text-center px-2">
                <span className="text-2xl font-black text-foreground">{profile?.atsScore || 0}</span>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">ATS Score</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center px-2">
                <span className="text-2xl font-black text-primary">{activeSkills.length}</span>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground">Skills Saved</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase">Degree Stream</span>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
                  <Button
                    size="sm"
                    variant={degree === "CSE" ? "default" : "ghost"}
                    onClick={() => handleSwitchDegree("CSE")}
                    className="h-6 text-[10px] px-2 font-bold"
                  >
                    CSE
                  </Button>
                  <Button
                    size="sm"
                    variant={degree === "BJMC" ? "default" : "ghost"}
                    onClick={() => handleSwitchDegree("BJMC")}
                    className="h-6 text-[10px] px-2 font-bold"
                  >
                    BJMC
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/70 p-1 border border-border rounded-xl">
          <TabsTrigger value="skills" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Skills & Competencies ({activeSkills.length})
          </TabsTrigger>
          <TabsTrigger value="resume" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <FileText className="h-3.5 w-3.5" /> Resume & ATS Data
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Briefcase className="h-3.5 w-3.5" /> Projects & Portfolio ({profile?.projects?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <GraduationCap className="h-3.5 w-3.5" /> Academic & Target Goal
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SKILLS PICKER */}
        <TabsContent value="skills" className="space-y-4">
          <Card className="border border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {degree === "CSE" ? "Computer Science & Engineering Skills" : "Journalism & Mass Comm Skills"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Click any skill badge to toggle it on/off in your candidate profile.
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="text-xs h-8 font-semibold gap-1.5"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Save Skills Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Groups */}
              {Object.entries(activeCategories).map(([catTitle, catSkills]) => (
                <div key={catTitle} className="space-y-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {catTitle}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {catSkills.map(skill => {
                      const isSelected = activeSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold" 
                              : "bg-muted/40 hover:bg-muted text-foreground border-border hover:border-border/80"
                          }`}
                        >
                          {isSelected ? <Check className="h-3 w-3" /> : <PlusCircle className="h-3 w-3 text-muted-foreground" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Add Custom Skill */}
              <div className="pt-4 border-t border-border">
                <form onSubmit={handleAddCustomSkill} className="flex gap-2 max-w-md">
                  <Input
                    placeholder="Add custom unlisted skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button type="submit" size="sm" variant="outline" className="text-xs h-8 font-semibold shrink-0">
                    <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Skill
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: RESUME & ATS DATA */}
        <TabsContent value="resume" className="space-y-4">
          <Card className="border border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Resume PDF & ATS Compatibility</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Upload your genuine resume to extract ATS keywords, verify contact info, and calculate placement scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Box */}
              <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {profile?.resumeFileName || (profile?.resumeUrl ? "Uploaded Resume.pdf" : "No resume uploaded yet")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {profile?.resumeUrl ? "Active in university placement index" : "Upload a 1-page PDF to extract credentials"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                  <Button
                    size="sm"
                    onClick={() => document.getElementById("resume-file-input")?.click()}
                    disabled={isUploadingResume}
                    className="text-xs h-8 font-semibold gap-1.5"
                  >
                    {isUploadingResume ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Extracting PDF...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        {profile?.resumeUrl ? "Replace Resume" : "Upload PDF Resume"}
                      </>
                    )}
                  </Button>

                  {profile?.resumeUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveResume}
                      className="text-xs h-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Extracted Resume Text & Editable Review Modal */}
              {profile?.extractedResumeText && (
                <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Extracted Resume Plain Text
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Verified by pdf-parse. You can edit this text below to refine your candidate profile.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsTextReviewOpen(true)}
                      className="text-xs h-7 font-semibold gap-1"
                    >
                      <FileEdit className="h-3.5 w-3.5" /> Edit Parsed Text
                    </Button>
                  </div>

                  <div className="max-h-48 overflow-y-auto p-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {profile.extractedResumeText}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PROJECTS & PORTFOLIO */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card className="border border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {degree === "CSE" ? "Technical Projects & Repositories" : "Media Samples, Articles & Video Portfolio"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Featured work samples showcased to campus interviewers and recruiters.
                  </CardDescription>
                </div>
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="text-xs h-8 font-semibold gap-1.5">
                      <PlusCircle className="h-3.5 w-3.5" /> Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-card border border-border">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">
                        {degree === "CSE" ? "Add Engineering Project" : "Add Media Work Sample"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProject} className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <Label htmlFor="proj-title" className="text-xs font-medium">Title</Label>
                        <Input
                          id="proj-title"
                          placeholder={degree === "CSE" ? "e.g. Distributed Task Queue" : "e.g. Campus Investigative Report"}
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          className="h-8 text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="proj-desc" className="text-xs font-medium">Description</Label>
                        <Textarea
                          id="proj-desc"
                          placeholder="Describe the problem, implementation, and measurable result..."
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                          className="text-xs min-h-[80px]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="proj-tech" className="text-xs font-medium">
                          {degree === "CSE" ? "Technologies Used (comma separated)" : "Tools & Topics"}
                        </Label>
                        <Input
                          id="proj-tech"
                          placeholder={degree === "CSE" ? "React, Node.js, MongoDB" : "Premiere Pro, Audacity, AP Style"}
                          value={projectTech}
                          onChange={(e) => setProjectTech(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="proj-link" className="text-xs font-medium">URL (GitHub / Live Link / Article)</Label>
                        <Input
                          id="proj-link"
                          placeholder="https://..."
                          value={projectLink}
                          onChange={(e) => setProjectLink(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button type="submit" size="sm" className="w-full text-xs h-8 font-semibold mt-2" disabled={isAddingProject}>
                        {isAddingProject ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Check className="h-3.5 w-3.5 mr-1" />}
                        Save Project to Portfolio
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {(!profile?.projects || profile.projects.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-border rounded-xl">
                  <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">No portfolio items added yet</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1">
                    Add your best 2-3 projects to prove practical competence to campus placement coordinators.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.projects.map((proj: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 relative group">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-foreground">{proj.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold pt-1"
                        >
                          View Work <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: ACADEMIC CREDENTIALS */}
        <TabsContent value="academic" className="space-y-4">
          <Card className="border border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Academic Status & Career Goals</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Set your university placement parameters and target role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label htmlFor="target-career-goal" className="text-xs font-semibold text-foreground">
                  Target Role / Career Goal
                </Label>
                <Select value={careerGoal} onValueChange={setCareerGoal}>
                  <SelectTrigger id="target-career-goal" className="h-9 text-xs">
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentGoalOptions.map(goal => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acad-year" className="text-xs font-semibold text-foreground">
                  Academic Year
                </Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger id="acad-year" className="h-9 text-xs">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year (Freshman)</SelectItem>
                    <SelectItem value="2">2nd Year (Sophomore)</SelectItem>
                    <SelectItem value="3">3rd Year (Junior)</SelectItem>
                    <SelectItem value="4">4th Year (Final Year / Placement)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-semibold text-foreground">
                  Student Bio / Placement Statement
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summary of student career interests..."
                  className="text-xs min-h-[90px]"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="text-xs h-9 font-semibold gap-1.5"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save Academic Parameters
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Editable Text Review Dialog */}
      <Dialog open={isTextReviewOpen} onOpenChange={setIsTextReviewOpen}>
        <DialogContent className="max-w-2xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Review Extracted Resume Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              You can edit the plain-text resume content directly. When saved, our ATS parser uses this text to evaluate keywords and formatting.
            </p>
            <Textarea
              value={reviewedText}
              onChange={(e) => setReviewedText(e.target.value)}
              className="text-xs font-mono min-h-[280px] leading-relaxed"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsTextReviewOpen(false)} className="text-xs h-8">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveReviewedText} className="text-xs h-8 font-semibold">
                Save Extracted Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
