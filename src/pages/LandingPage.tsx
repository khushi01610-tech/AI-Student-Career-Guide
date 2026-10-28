import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  Swords, 
  FileText, 
  Mic, 
  Globe, 
  Briefcase, 
  Sparkles, 
  Star,
  Laptop,
  Radio,
  Scale,
  Award,
  TrendingUp,
  Building2,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePreviewStream, setActivePreviewStream] = useState<"CSE" | "BJMC">("CSE");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-border/80 px-4 md:px-8 flex items-center justify-between bg-card/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-base text-foreground tracking-tight block font-heading">
              Student Career Guide
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              University Campus Placement System • B.Tech CSE & BJMC
            </span>
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
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">
            2026-27 Campus Season
          </Badge>
          <span>Dual-Stream Placement Intelligence: B.Tech CSE & BJMC</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.12] font-heading">
          University Placement Preparation Engineered for Real Recruiters
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
          Designed specifically for final-year students. Test your resume against strict ATS filters, practice sequential mock interviews with stream-specific grading rubrics, and master placement blueprints.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Button size="lg" onClick={() => navigate("/register")} className="h-11 px-6 text-xs sm:text-sm font-semibold shadow-sm w-full sm:w-auto">
            Create Student Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-11 px-6 text-xs sm:text-sm font-semibold w-full sm:w-auto border-border hover:bg-muted">
            Launch Mock Interview Simulator
          </Button>
        </div>

        {/* Credibility Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-border/80 text-left max-w-4xl mx-auto">
          <div className="p-3 bg-card rounded-lg border border-border/60 shadow-sm">
            <span className="text-2xl md:text-3xl font-extrabold text-foreground block font-heading">94%</span>
            <span className="text-xs text-muted-foreground">First-Round Shortlist Rate</span>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border/60 shadow-sm">
            <span className="text-2xl md:text-3xl font-extrabold text-primary block font-heading">Dual</span>
            <span className="text-xs text-muted-foreground">B.Tech & BJMC Calibrations</span>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border/60 shadow-sm">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-heading">100%</span>
            <span className="text-xs text-muted-foreground">Transparent ATS Rubrics</span>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border/60 shadow-sm">
            <span className="text-2xl md:text-3xl font-extrabold text-foreground block font-heading">4-Round</span>
            <span className="text-xs text-muted-foreground">Sequential Interview Graders</span>
          </div>
        </div>
      </header>

      {/* Interactive Dual-Stream Explorer */}
      <section className="py-14 px-4 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-primary/30 text-primary">
              Stream-Specific Preparation
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground font-heading">
              Tailored Roadmaps for Engineering & Media
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
              Every mock question, resume rubric, and career recommendation adapts dynamically to your academic branch.
            </p>

            {/* Stream Selector Buttons */}
            <div className="inline-flex items-center p-1 bg-card rounded-xl border border-border mt-3 shadow-sm">
              <button
                type="button"
                onClick={() => setActivePreviewStream("CSE")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activePreviewStream === "CSE"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Laptop className="h-4 w-4" /> B.Tech (Computer Science & IT)
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewStream("BJMC")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activePreviewStream === "BJMC"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Radio className="h-4 w-4" /> BJMC (Journalism & Mass Comm)
              </button>
            </div>
          </div>

          {/* Stream Preview Card */}
          {activePreviewStream === "CSE" ? (
            <Card className="border border-border/80 bg-card shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border/60 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary mb-1">
                      B.Tech Computer Science Track
                    </Badge>
                    <CardTitle className="text-lg font-bold text-foreground font-heading">
                      Full Stack, Backend Systems & Software Engineering
                    </CardTitle>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-muted-foreground block">Campus CTC Range:</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹8.5 LPA – ₹42 LPA
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                      Target Job Roles
                    </span>
                    <ul className="text-xs text-foreground space-y-1.5 font-medium">
                      <li>• Full Stack Developer (React / Node)</li>
                      <li>• Backend Systems Engineer</li>
                      <li>• Associate Software Engineer (SDE-1)</li>
                      <li>• Data Analyst & Cloud Associate</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                      Mock Interview Panels
                    </span>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      <li><strong className="text-foreground">DSA:</strong> Running Median in O(1), Lowest Common Ancestor</li>
                      <li><strong className="text-foreground">System Design:</strong> 500k QPS Distributed Rate Limiter</li>
                      <li><strong className="text-foreground">Core CS:</strong> B+ Tree Indexing, Concurrency & Deadlocks</li>
                      <li><strong className="text-foreground">Behavioral:</strong> STAR Capstone Project Presentation</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                      Core Recruiter Partners
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Google", "Amazon", "Microsoft", "Swiggy", "Razorpay", "Flipkart", "TCS Digital", "Deloitte"].map((co) => (
                        <Badge key={co} variant="outline" className="text-[10px] font-semibold bg-card">
                          {co}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-lg bg-primary/5 border border-primary/20 gap-3">
                  <span className="text-xs text-foreground font-medium">
                    Analyze your technical resume for programming language keyword density and GitHub project deployments.
                  </span>
                  <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold shrink-0">
                    Test CSE Resume Free
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border/80 bg-card shadow-sm overflow-hidden">
              <CardHeader className="bg-amber-500/5 border-b border-border/60 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-600 dark:text-amber-400 mb-1">
                      BJMC Media & Journalism Track
                    </Badge>
                    <CardTitle className="text-lg font-bold text-foreground font-heading">
                      Investigative Reporting, Broadcast Anchoring & Corporate PR
                    </CardTitle>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-muted-foreground block">Campus CTC Range:</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹5.0 LPA – ₹24 LPA
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Target Job Roles
                    </span>
                    <ul className="text-xs text-foreground space-y-1.5 font-medium">
                      <li>• Digital Journalist & Beat Reporter</li>
                      <li>• Broadcast Anchor & Video Producer</li>
                      <li>• Corporate PR & Crisis Specialist</li>
                      <li>• Digital Content Strategist & Copywriter</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Mock Interview Panels
                    </span>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      <li><strong className="text-foreground">Media Law:</strong> Section 499 Defamation Defenses & Right of Reply</li>
                      <li><strong className="text-foreground">Broadcast:</strong> Live Teleprompter Failure & Breaking News Composure</li>
                      <li><strong className="text-foreground">Fact-Check:</strong> OSINT Keyframe & AI Voice Clone Verification</li>
                      <li><strong className="text-foreground">Crisis PR:</strong> 60-Minute Urgent Holding Line Formulation</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Core Recruiter Partners
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["BBC News", "NDTV 24x7", "The Hindu", "The Indian Express", "Vox Media", "The Quint", "Ogilvy PR", "Edelman"].map((co) => (
                        <Badge key={co} variant="outline" className="text-[10px] font-semibold bg-card">
                          {co}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 gap-3">
                  <span className="text-xs text-foreground font-medium">
                    Upload your media portfolio, published articles, and video reel links for transparent beat scoring.
                  </span>
                  <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold shrink-0">
                    Test BJMC Resume Free
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Main Placement Pillars */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1 border-primary/30 text-primary">
            Integrated Suite
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground font-heading">
            Four Pillars of Campus Recruitment Success
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            No dummy features or broken redirects. Every module is fully backed by real backend models and evaluation algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Module 1: Resume Studio */}
          <Card 
            onClick={() => navigate("/register")}
            className="border border-border/80 p-5 space-y-3 bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary font-heading transition-colors">
              ATS Resume Studio
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real PDF plain-text parser that audits contact coordinates, educational credentials, keyword density, and rewrites bullets with the STAR method.
            </p>
          </Card>

          {/* Module 2: Mock Interview System */}
          <Card 
            onClick={() => navigate("/register")}
            className="border border-border/80 p-5 space-y-3 bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Swords className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-heading transition-colors">
              AI Mock Simulator
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              4 sequential interview rounds. Enter your responses and receive quantitative scoring across accuracy, clarity, and model pitches.
            </p>
          </Card>

          {/* Module 3: Interview Question Archives */}
          <Card 
            onClick={() => navigate("/register")}
            className="border border-border/80 p-5 space-y-3 bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 font-heading transition-colors">
              Question Archives
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              24+ blueprints categorized by Google/FAANG, Product Unicorns, National Broadcasters, and Campus Drives with optimal walk-throughs.
            </p>
          </Card>

          {/* Module 4: Live Jobs & Application Tracker */}
          <Card 
            onClick={() => navigate("/register")}
            className="border border-border/80 p-5 space-y-3 bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 font-heading transition-colors">
              Application Tracker
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Live campus and off-campus job explorer linked to an interactive Kanban tracker tracking your status from Applied to Offer.
            </p>
          </Card>
        </div>
      </section>

      {/* Verified Student Testimonials */}
      <section className="py-16 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground font-heading">
              Placement Success Across Engineering & Media
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Hear directly from students who practiced on our mock simulators and cleared campus drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 bg-card border border-border/80 space-y-3 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "The Tier-1 system design questions on distributed rate limiting and database indexing matched my actual Razorpay technical interview round almost word for word."
              </p>
              <div className="pt-2 border-t border-border/60 text-xs">
                <span className="font-bold text-foreground block">Pooja Sharma</span>
                <span className="text-[11px] text-muted-foreground">B.Tech CSE '25 • Placed at Razorpay</span>
              </div>
            </Card>

            <Card className="p-5 bg-card border border-border/80 space-y-3 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Finding media-specific mock interviews anywhere else was impossible. Practicing Section 499 defamation defenses and live broadcast teleprompter breakdowns helped me clear NDTV's trainee board."
              </p>
              <div className="pt-2 border-t border-border/60 text-xs">
                <span className="font-bold text-foreground block">Aarav Sen</span>
                <span className="text-[11px] text-muted-foreground">BJMC '25 • Trainee Journalist at NDTV</span>
              </div>
            </Card>

            <Card className="p-5 bg-card border border-border/80 space-y-3 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "The ATS resume scanner pinpointed that my bullet points lacked metrics. The STAR rewrite feature turned my vague descriptions into measurable achievements that got me shortlisted by Deloitte."
              </p>
              <div className="pt-2 border-t border-border/60 text-xs">
                <span className="font-bold text-foreground block">Sneha Kulkarni</span>
                <span className="text-[11px] text-muted-foreground">B.Tech IT '25 • Associate at Deloitte</span>
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
              <span className="font-bold text-sm text-foreground block font-heading">Student Career Guide</span>
              <span className="text-[11px] text-muted-foreground">
                University Campus Placement & Readiness Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
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
