import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Sparkles
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
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, ease: "easeOut" }} 
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Career Growth Engine</h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            University Placement Portal & Adaptive AI Guidance for CSE & BJMC Students
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border/80 shadow-sm rounded-2xl bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight text-foreground">Sign In</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your student credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  College / Institutional Email
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
                    className="pl-9 h-10 text-sm bg-background border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-medium text-foreground">Password</Label>
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
                    className="pl-9 pr-10 h-10 text-sm bg-background border-border"
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
                    Remember this device
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 text-sm font-semibold shadow-sm transition-all mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Portal
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Evaluation Demo Login
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDemoFill("khushi01610@gmail.com")}
                className="w-full text-left p-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/60 transition-colors flex items-center justify-between group"
              >
                <div className="text-[11px]">
                  <span className="font-semibold text-foreground">khushi01610@gmail.com</span>
                  <span className="text-muted-foreground block text-[10px]">Pre-configured Student Account</span>
                </div>
                <span className="text-[10px] text-primary group-hover:underline flex items-center gap-0.5">
                  Autofill <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 justify-center border-t border-border/60 pt-4 bg-muted/20 rounded-b-2xl">
            <p className="text-xs text-muted-foreground text-center">
              New student joining campus placement?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Campus Placement Cell Security Verified</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
