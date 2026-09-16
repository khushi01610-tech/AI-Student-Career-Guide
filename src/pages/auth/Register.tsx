import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Lock, ShieldAlert, GraduationCap, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "",
    branch: "",
    graduationYear: "",
    skills: "",
    careerGoal: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, college, course, branch, graduationYear, careerGoal } = formData;
    
    if (!name || !email || !password || !college || !course || !branch || !graduationYear || !careerGoal) {
      toast({ title: "Validation Error", description: "Please fill out all mandatory fields.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        ...formData,
        graduationYear: Number(graduationYear)
      });
      toast({ title: "Account Created!", description: "Welcome to AI Student Career Guide." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message || "An error occurred during registration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-background">
      <div className="fixed inset-0 mesh-gradient pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/10 filter blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg relative z-10 my-8">
        <Card className="glass-card shadow-2xl border-border/50">
          <CardHeader className="text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto text-accent">
              <GraduationCap className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">Create Student Account</CardTitle>
            <CardDescription>Join peer networks and master interview training</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@university.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••••• (Min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="college">College/University</Label>
                  <Input
                    id="college"
                    placeholder="e.g. Stanford University"
                    value={formData.college}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Degree</Label>
                  <Input
                    id="course"
                    placeholder="e.g. B.Tech / M.S."
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch/Major</Label>
                  <Input
                    id="branch"
                    placeholder="e.g. Computer Science"
                    value={formData.branch}
                    onChange={(e) => handleInputChange("branch", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="e.g. 2027"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="careerGoal">Target Career Goal</Label>
                  <Select onValueChange={(val) => handleInputChange("careerGoal", val)}>
                    <SelectTrigger id="careerGoal">
                      <SelectValue placeholder="Select career path" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      <SelectItem value="Python Developer">Python Developer</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                      <SelectItem value="QA/SDET">QA / SDET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (Comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder="HTML, CSS, React, JS"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 glow-accent mt-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/20 pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
