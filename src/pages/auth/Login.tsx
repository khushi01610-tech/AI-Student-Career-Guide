import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Mail, 
  Lock, 
  LogIn, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Radio,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ 
        title: "Missing Information", 
        description: "Please enter both your college email and password.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast({ title: "Welcome back!", description: "Successfully signed in to your career workspace." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err.message || "Invalid credentials. Please verify your email and password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("123456");
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-12 selection:bg-primary/20">
      {/* Left Column: Clean Authentication Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
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
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
          <div className="space-y-1.5 text-left">
            <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30 mb-1">
              Campus Placement Portal
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Access your personalized ATS resume scorer, mock interviews, and live campus drives.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Institutional / Student Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-sm bg-card border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-10 text-sm bg-card border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(!!checked)} 
                />
                <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                  Keep me signed in on this device
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 text-sm font-semibold shadow-sm transition-all" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Workspace
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="pt-4 border-t border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
              Evaluator / Demo One-Click Sign In:
            </span>
            <button
              type="button"
              onClick={() => handleDemoFill("khushi01610@gmail.com")}
              className="w-full text-left p-3 rounded-lg bg-card hover:bg-muted/60 border border-border transition-colors flex items-center justify-between group shadow-sm"
            >
              <div className="text-[11px]">
                <span className="font-bold text-foreground">khushi01610@gmail.com</span>
                <span className="text-muted-foreground block text-[10px]">Pre-configured Student Profile (CSE & BJMC)</span>
              </div>
              <span className="text-[10px] font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                Autofill <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              New student joining campus placements?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create your student profile
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground border-t border-border/80 pt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Encrypted Placement Cell Authentication</span>
        </div>
      </div>

      {/* Right Column: Editorial Visual Showcase with Photography */}
      <div className="lg:col-span-6 xl:col-span-7 hidden lg:block relative bg-slate-900 text-white overflow-hidden">
        {/* High-Resolution Campus Collaboration Photo */}
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80" 
          alt="University students collaborating in tech lab"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Deep Editorial Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        {/* Overlay Content */}
        <div className="relative h-full flex flex-col justify-between p-12 z-10">
          {/* Top Pill */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <span className="status-dot-active" />
              <span>Campus Season 2025–26</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/80">
              <Code2 className="h-3.5 w-3.5 text-blue-400" /> CSE
              <span>•</span>
              <Radio className="h-3.5 w-3.5 text-amber-400" /> BJMC
            </div>
          </div>

          {/* Center Placement Spotlight Card */}
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Verified Placement Records
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight font-heading leading-tight text-white">
                Preparing Final-Year Students for Tier-1 Recruiters
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Adaptive guidance matching university syllabi with industry hiring bars across software engineering and digital journalism.
              </p>
            </div>

            {/* Placement Metric Strip */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <div>
                <span className="text-2xl font-black font-heading text-white block">850+</span>
                <span className="text-[11px] text-white/70">Verified Campus Offers</span>
              </div>
              <div>
                <span className="text-2xl font-black font-heading text-emerald-400 block">₹42.0 LPA</span>
                <span className="text-[11px] text-white/70">Top CTC (Microsoft SDE-1)</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg flex items-start gap-3">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                alt="Rohan Verma"
                className="h-10 w-10 rounded-full object-cover shrink-0 border border-white/30"
              />
              <div className="text-xs space-y-1">
                <p className="text-white/90 italic leading-snug">
                  "The sequential mock interview grader helped me clear the BBC broadcast newsroom round with full confidence."
                </p>
                <div className="text-[11px] font-bold text-amber-300">
                  Rohan Verma • BJMC '25, BBC News
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Logos Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Recruiting partners: Google, Microsoft, BBC News, Ogilvy, Swiggy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
