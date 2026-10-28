import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  AlertCircle, 
  ArrowRight,
  Eye, 
  EyeOff,
  Code2,
  Newspaper,
  CheckCircle2,
  Radio,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

const CSE_GOALS = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps / Cloud Associate",
  "QA Automation Engineer"
];

const BJMC_GOALS = [
  "Content Writer / Strategist",
  "Digital Journalist / Reporter",
  "PR & Brand Specialist",
  "Social Media Manager",
  "Video Producer / Editor",
  "Broadcast Anchor / Assistant Producer"
];

export default function Register() {
  const [degree, setDegree] = useState<"CSE" | "BJMC">("CSE");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "B.Tech CSE",
    branch: "Computer Science & Engineering",
    academicYear: "4",
    graduationYear: "2025",
    skills: "React, Node.js, JavaScript, Python, SQL",
    careerGoal: "Full Stack Developer"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDegreeChange = (newDegree: "CSE" | "BJMC") => {
    setDegree(newDegree);
    if (newDegree === "CSE") {
      setFormData(prev => ({
        ...prev,
        course: "B.Tech",
        branch: "Computer Science & Engineering",
        skills: "React, Node.js, JavaScript, Python, SQL, Git",
        careerGoal: "Full Stack Developer"
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        course: "BJMC",
        branch: "Journalism & Mass Communication",
        skills: "News Writing, Copy Editing, Social Media, Adobe Premiere, Content Strategy",
        careerGoal: "Digital Journalist / Reporter"
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const { name, email, password, college, course, branch, graduationYear, careerGoal } = formData;
    
    if (!name || !email || !password || !college || !course || !branch || !graduationYear || !careerGoal) {
      toast({ 
        title: "Validation Error", 
        description: "Please complete all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        ...formData,
        degree,
        academicYear: Number(formData.academicYear) || 4,
        graduationYear: Number(graduationYear)
      });
      toast({ title: "Account Created!", description: "Welcome to AI Student Career Guide." });
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.message || "An error occurred during registration.";
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("already exists")) {
        toast({
          title: "Account Already Exists",
          description: `An account for ${email} is already registered. Please sign in!`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Failed",
          description: msg,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentGoals = degree === "CSE" ? CSE_GOALS : BJMC_GOALS;

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-12 selection:bg-primary/20">
      {/* Left Column: Registration Form */}
      <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-xs tracking-tight font-heading">
              Student Career Guide
            </span>
          </div>
        </div>

        {/* Center Card */}
        <div className="my-auto py-8 max-w-xl w-full mx-auto space-y-6">
          <div className="space-y-1.5 text-left">
            <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30 mb-1">
              Student Registration
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
              Create Student Profile
            </h1>
            <p className="text-xs text-muted-foreground">
              Select your academic discipline to calibrate your resume ATS scoring and mock interview panels.
            </p>
          </div>

          {/* Academic Stream Selector Tabs */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDegreeChange("CSE")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                degree === "CSE" 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30" 
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${degree === "CSE" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">B.Tech CSE & IT</span>
                  {degree === "CSE" && <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />}
                </div>
                <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                  Software, Web, Cloud & Systems
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDegreeChange("BJMC")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                degree === "BJMC" 
                  ? "border-amber-600 bg-amber-500/5 ring-1 ring-amber-500/30" 
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${degree === "BJMC" ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"}`}>
                <Radio className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">BJMC Media</span>
                  {degree === "BJMC" && <CheckCircle2 className="h-3 w-3 text-amber-600 shrink-0" />}
                </div>
                <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                  Journalism, Broadcast & PR
                </span>
              </div>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{errorMessage}</p>
                  {errorMessage.toLowerCase().includes("already exists") && (
                    <Button
                      type="button"
                      size="sm"
                      variant="link"
                      onClick={() => navigate(`/login?email=${encodeURIComponent(formData.email)}`)}
                      className="h-auto p-0 text-xs text-primary font-bold"
                    >
                      Sign in with this email instead <ArrowRight className="h-3 w-3 ml-1 inline" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-8 h-9 text-xs bg-card border-border"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">Student Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@college.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-8 h-9 text-xs bg-card border-border"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password (Min 6 characters)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-8 pr-9 h-9 text-xs bg-card border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* University & Academic Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="college" className="text-xs font-semibold text-foreground">University / College</Label>
                <Input
                  id="college"
                  placeholder="e.g. Stanford / Amity"
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                  className="h-9 text-xs bg-card border-border"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="academicYear" className="text-xs font-semibold text-foreground">Current Year</Label>
                <Select 
                  value={formData.academicYear} 
                  onValueChange={(val) => handleInputChange("academicYear", val)}
                >
                  <SelectTrigger id="academicYear" className="h-9 text-xs bg-card border-border">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year (Freshman)</SelectItem>
                    <SelectItem value="2">2nd Year (Sophomore)</SelectItem>
                    <SelectItem value="3">3rd Year (Junior)</SelectItem>
                    <SelectItem value="4">4th Year (Final Year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="graduationYear" className="text-xs font-semibold text-foreground">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="2025"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                  className="h-9 text-xs bg-card border-border"
                  required
                />
              </div>
            </div>

            {/* Career Goal & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="careerGoal" className="text-xs font-semibold text-foreground">Target Role</Label>
                <Select 
                  value={formData.careerGoal} 
                  onValueChange={(val) => handleInputChange("careerGoal", val)}
                >
                  <SelectTrigger id="careerGoal" className="h-9 text-xs bg-card border-border">
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentGoals.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="skills" className="text-xs font-semibold text-foreground">Primary Skills (comma separated)</Label>
                <Input
                  id="skills"
                  placeholder={degree === "CSE" ? "React, Python, SQL" : "News Writing, Premiere, PR"}
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  className="h-9 text-xs bg-card border-border"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-xs font-semibold shadow-sm mt-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Student Account...
                </>
              ) : (
                <>
                  Complete Registration <ArrowRight className="h-3.5 w-3.5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground border-t border-border/80 pt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>University Placement Cell Compliant</span>
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="lg:col-span-5 xl:col-span-6 hidden lg:block relative bg-slate-900 text-white overflow-hidden">
        {/* High-Resolution Campus Photo */}
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80" 
          alt="University campus academic building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        <div className="relative h-full flex flex-col justify-between p-12 z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <span className="status-dot-active" />
              <span>Campus Season 2025–26</span>
            </div>
            <span className="text-xs font-mono text-white/80">
              Student Registration
            </span>
          </div>

          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Placement Readiness Engine
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight font-heading leading-tight text-white">
                Start Your Journey from Campus to Industry
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Connect your academic projects and courses with top corporate recruiters and national newsrooms.
              </p>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg flex items-start gap-3">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                alt="Priya Sharma"
                className="h-10 w-10 rounded-full object-cover shrink-0 border border-white/30"
              />
              <div className="text-xs space-y-1">
                <p className="text-white/90 italic leading-snug">
                  "The ATS Resume Studio revealed that my GitHub deployments were buried under course projects. Fixing it got me 4 shortlist callbacks."
                </p>
                <div className="text-[11px] font-bold text-emerald-300">
                  Priya Sharma • B.Tech CSE '25, Microsoft SDE-1
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-white/60">
            <span>Verified recruiter networks: Microsoft, Google, Amazon, BBC News, NDTV, Ogilvy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
