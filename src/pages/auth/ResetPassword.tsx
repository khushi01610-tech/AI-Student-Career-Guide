import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsSuccess(true);
    toast({ title: "Success!", description: "Password updated successfully." });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-background">
      <div className="fixed inset-0 mesh-gradient pointer-events-none z-0" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Card className="glass-card shadow-2xl border-border/50">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new secure account password</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent">
                  <Check className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">Your password has been changed. Redirecting to login page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2 glow-primary mt-6">
                  Update Password
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/20 pt-4">
            <Link to="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
