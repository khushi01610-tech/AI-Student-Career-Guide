import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSent(true);
    toast({ title: "Email Sent!", description: `Password reset instructions sent to ${email}` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-background">
      <div className="fixed inset-0 mesh-gradient pointer-events-none z-0" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Card className="glass-card shadow-2xl border-border/50">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Recover Password</CardTitle>
            <CardDescription>Enter your email to receive recovery instructions</CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <div className="text-center space-y-4 py-4">
                <div className="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent text-xl">✓</div>
                <p className="text-sm text-muted-foreground">We sent a password recovery link to your inbox. Check your email to reset your credentials.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2 glow-primary mt-6">
                  <Send className="h-4 w-4" /> Send Reset Link
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
