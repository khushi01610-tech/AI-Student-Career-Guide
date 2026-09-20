import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Building2, 
  Briefcase, 
  Coffee, 
  FolderArchive, 
  GraduationCap, 
  CheckCircle2, 
  Users, 
  Swords, 
  FileText, 
  Mic,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Star
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-border/80 px-4 md:px-8 flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-base text-foreground tracking-tight block">Student Career Guide</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">Campus Placement & Alumni Network</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-xs font-semibold">
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold px-4">
            Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-16 md:py-24 px-4 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-foreground shadow-sm">
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">2026-27 Season</Badge>
          <span>University Placement Preparation & Alumni Mentorship</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Crack Your Dream Campus Drive With Real Recruiter Blueprints
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
          The all-in-one placement portal for college students. Explore company hiring rounds, practice technical mock panels, track internship applications, and connect 1:1 with verified alumni mentors.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Button size="lg" onClick={() => navigate("/register")} className="h-11 px-6 text-sm font-semibold shadow-sm w-full sm:w-auto">
            Create Student Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-11 px-6 text-sm font-semibold w-full sm:w-auto">
            Browse Placement Archives
          </Button>
        </div>

        {/* Credibility Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-border/80 text-left max-w-4xl mx-auto">
          <div className="p-3">
            <span className="text-2xl md:text-3xl font-bold text-foreground block">500+</span>
            <span className="text-xs text-muted-foreground">Company Interview Archives</span>
          </div>
          <div className="p-3">
            <span className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 block">₹18-45 LPA</span>
            <span className="text-xs text-muted-foreground">Average Tier-1 CTC Range</span>
          </div>
          <div className="p-3">
            <span className="text-2xl md:text-3xl font-bold text-primary block">1-on-1</span>
            <span className="text-xs text-muted-foreground">Alumni Coffee Chats</span>
          </div>
          <div className="p-3">
            <span className="text-2xl md:text-3xl font-bold text-foreground block">100%</span>
            <span className="text-xs text-muted-foreground">ATS Resume Checklists</span>
          </div>
        </div>
      </header>

      {/* Main Pillars Section */}
      <section className="py-16 px-4 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1">Core Modules</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Built For Realistic Placement Preparation</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Everything you need to navigate aptitude tests, technical rounds, low-level design, and partner interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="bg-card border-border p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Company Archives</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hiring patterns, CGPA cutoffs, and exact questions asked at Google, Amazon, Deloitte, Microsoft, and TCS.
              </p>
            </Card>

            <Card className="bg-card border-border p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Application Tracker</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visual Kanban board to track active on-campus and off-campus applications through every interview stage.
              </p>
            </Card>

            <Card className="bg-card border-border p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Coffee className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Alumni Mentorship</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Book 30-minute 1-on-1 mock interviews and resume reviews with college seniors working in top tech firms.
              </p>
            </Card>

            <Card className="bg-card border-border p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FolderArchive className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Templates Vault</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy-paste referral cold emails, SQL interview cheatsheets, and Google XYZ resume bullet worksheets.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Recruiter-Ready Tools Breakdown */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">Mock Simulations</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Technical Rounds Graded With Recruiter Standards
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Practice role-specific coding questions and behavioral STAR questions. Receive actionable diagnostics on code efficiency, communication clarity, and metric quantification before your real drive.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Time & space complexity analysis (O(N), O(log N) evaluations)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>STAR behavioral response structured scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Microphone voice recording for articulation and grammar feedback</span>
              </div>
            </div>

            <Button onClick={() => navigate("/register")} className="mt-4 text-xs font-semibold">
              Start Free Mock Interview
            </Button>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <span className="font-bold text-xs text-foreground">Placement Evaluation Card</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                Candidate: Ready
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-muted-foreground">ATS Resume Readability</span>
                  <span className="font-bold text-foreground">92%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-muted-foreground">Data Structures & Algorithms</span>
                  <span className="font-bold text-foreground">88%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-muted-foreground">Verbal Communication & Articulation</span>
                  <span className="font-bold text-foreground">85%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground">
              "Strong metric quantification on project bullets. Recommended to review Tree traversal edge cases before Amazon OA."
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Testimonials */}
      <section className="py-16 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Trusted By Students Across Top Universities</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Real placement stories from students who cracked top offers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 bg-card border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "The Company Archives for Deloitte had the exact SQL and case study questions I was asked in Round 2. Having the hiring breakdown beforehand eliminated 90% of my interview anxiety."
              </p>
              <div className="pt-2 border-t border-border/80 text-xs">
                <span className="font-bold text-foreground block">Pooja Sharma</span>
                <span className="text-[11px] text-muted-foreground">B.Tech CSE '25 • Placed at Deloitte</span>
              </div>
            </Card>

            <Card className="p-5 bg-card border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Booking a 30-minute coffee chat with Rohan (Microsoft SDE-2) through the alumni hub gave me real feedback on my system design answers that you can't find in textbooks."
              </p>
              <div className="pt-2 border-t border-border/80 text-xs">
                <span className="font-bold text-foreground block">Aditya Mehta</span>
                <span className="text-[11px] text-muted-foreground">IT Engineering '25 • Placed at Microsoft</span>
              </div>
            </Card>

            <Card className="p-5 bg-card border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "The Google X-Y-Z formula in the Templates Vault completely changed my resume bullet points. I went from zero callbacks to 4 off-campus interview shortlists in two weeks."
              </p>
              <div className="pt-2 border-t border-border/80 text-xs">
                <span className="font-bold text-foreground block">Sneha Kulkarni</span>
                <span className="text-[11px] text-muted-foreground">Computer Science '26 • SDE Intern</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <footer className="py-12 px-4 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-foreground block">Student Career Guide</span>
              <span className="text-[11px] text-muted-foreground">University Placement & Alumni Career Ecosystem</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2026-2027 Student Career Guide</span>
            <span>•</span>
            <button onClick={() => navigate("/login")} className="hover:text-foreground">Login</button>
            <span>•</span>
            <button onClick={() => navigate("/register")} className="hover:text-foreground">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
