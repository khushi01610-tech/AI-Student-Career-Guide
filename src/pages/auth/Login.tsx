import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, LogIn, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Validation Error", description: "Please enter email and password.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials, please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-background">
      {/* Decorative gradients */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/10 filter blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <Card className="glass-card shadow-2xl border-border/50">
          <CardHeader className="text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <GraduationCap className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">AI Student Career Guide</CardTitle>
            <CardDescription>Sign in to access your AI coach & connect with peers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Student Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2 glow-primary mt-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/20 pt-4">
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
