import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CheckCircle2
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
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, ease: "easeOut" }} 
        className="sm:mx-auto sm:w-full sm:max-w-xl"
      >
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Student Profile</h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Choose your academic program to customize your AI career roadmap, resume scoring, and interview prep.
          </p>
        </div>

        {/* Register Card */}
        <Card className="border border-border/80 shadow-sm rounded-2xl bg-card">
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground">Academic Program</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Select your stream</CardDescription>
              </div>
            </div>

            {/* Degree Stream Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 pt-1">
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
                    <span className="text-xs font-bold text-foreground">CSE & IT</span>
                    {degree === "CSE" && <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                    Computer Science, Software, Web, AI/ML
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDegreeChange("BJMC")}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  degree === "BJMC" 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30" 
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${degree === "BJMC" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Newspaper className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">BJMC</span>
                    {degree === "BJMC" && <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                    Journalism, Media, PR, Video & Content
                  </span>
                </div>
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
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

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-medium text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-8 h-9 text-xs"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-medium text-foreground">Student Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@college.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-8 h-9 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password with toggle */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">Password (Min 6 characters)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-8 pr-9 h-9 text-xs"
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
                  <Label htmlFor="college" className="text-xs font-medium text-foreground">College / University</Label>
                  <Input
                    id="college"
                    placeholder="e.g. Stanford / Amity"
                    value={formData.college}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="academicYear" className="text-xs font-medium text-foreground">Current Year</Label>
                  <Select 
                    value={formData.academicYear} 
                    onValueChange={(val) => handleInputChange("academicYear", val)}
                  >
                    <SelectTrigger id="academicYear" className="h-9 text-xs">
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
                  <Label htmlFor="graduationYear" className="text-xs font-medium text-foreground">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="2025"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Target Career Goal & Initial Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="careerGoal" className="text-xs font-medium text-foreground">Target Role</Label>
                  <Select 
                    value={formData.careerGoal} 
                    onValueChange={(val) => handleInputChange("careerGoal", val)}
                  >
                    <SelectTrigger id="careerGoal" className="h-9 text-xs">
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
                  <Label htmlFor="skills" className="text-xs font-medium text-foreground">Known Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder={degree === "CSE" ? "React, Python, SQL" : "Writing, Premiere, SEO"}
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 text-xs font-semibold shadow-sm mt-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="h-3.5 w-3.5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border/60 py-3 bg-muted/20 rounded-b-2xl">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
