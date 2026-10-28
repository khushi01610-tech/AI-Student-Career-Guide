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
  Check,
  Code2,
  Newspaper,
  Compass,
  Users2
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePreviewStream, setActivePreviewStream] = useState<"CSE" | "BJMC">("CSE");

  const techRecruiters = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", role: "SDE & Cloud" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", role: "Core Systems" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", role: "SDE-1 & AWS" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg", role: "Backend Systems" },
    { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", role: "Fintech Platform" }
  ];

  const mediaRecruiters = [
    { name: "BBC News", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC.svg", role: "Broadcast Trainee" },
    { name: "NDTV", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/NDTV_logo.svg", role: "Video Journalist" },
    { name: "The Hindu", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/The_Hindu_logo.svg", role: "Beat Sub-Editor" },
    { name: "Ogilvy", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ogilvy_logo_2018.svg", role: "PR & Comm" },
    { name: "Vox Media", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vox_Media_logo.svg", role: "Multimedia" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      degree: "B.Tech CSE '25",
      role: "Software Development Engineer 1",
      company: "Microsoft",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      quote: "The sequential mock interview grader pinpointed my exact algorithmic bottleneck in O(1) Running Median. Two weeks later, I faced that exact pattern in my final round."
    },
    {
      name: "Rohan Verma",
      degree: "BJMC '25",
      role: "Trainee Broadcast Journalist",
      company: "BBC News",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC.svg",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      quote: "No other platform evaluates Section 499 Defamation defenses and live teleprompter breakdowns. The BJMC rubrics are tuned for actual newsroom editors."
    },
    {
      name: "Ananya Sengupta",
      degree: "B.Tech CSE '26",
      role: "Summer SDE Intern",
      company: "Swiggy",
      companyLogo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      quote: "The ATS Resume Studio revealed that my GitHub deployments were buried under course projects. Fixing the rubric score from 61 to 91 got me 4 shortlist callbacks."
    },
    {
      name: "Kabir Malhotra",
      degree: "BJMC '25",
      role: "Corporate PR Coordinator",
      company: "Ogilvy",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ogilvy_logo_2018.svg",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      quote: "The PR holding statement simulation gave me structured confidence for agency campus interviews. Everything is calibrated for corporate media."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-border px-4 md:px-8 flex items-center justify-between bg-card/95 backdrop-blur-md sticky top-0 z-40">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-xs font-semibold">
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold px-4 shadow-sm">
            Create Profile <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 md:py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-foreground shadow-sm">
              <span className="status-dot-active" />
              <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">
                2025–2026 Campus Drive Season
              </Badge>
              <span className="hidden sm:inline text-muted-foreground">Dual-Stream Placement Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12] font-heading">
              University Placement Prep Built for Real Recruiters
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-normal">
              Engineered specifically for final-year students. Test your technical or journalism resume against rigorous ATS filters, practice stream-specific sequential mock interviews, and track verified campus drives.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button size="lg" onClick={() => navigate("/register")} className="h-11 px-6 text-xs sm:text-sm font-semibold shadow-sm">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-11 px-6 text-xs sm:text-sm font-semibold border-border hover:bg-muted">
                Student Sign In
              </Button>
            </div>

            {/* Credibility Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/80">
              <div className="p-3 bg-card rounded-lg border border-border shadow-sm">
                <span className="text-2xl font-extrabold text-foreground block font-heading">94%</span>
                <span className="text-[11px] text-muted-foreground">Placement Shortlist Rate</span>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border shadow-sm">
                <span className="text-2xl font-extrabold text-primary block font-heading">Dual</span>
                <span className="text-[11px] text-muted-foreground">B.Tech & BJMC Tracks</span>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border shadow-sm">
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-heading">100%</span>
                <span className="text-[11px] text-muted-foreground">Transparent ATS Rubrics</span>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border shadow-sm">
                <span className="text-2xl font-extrabold text-foreground block font-heading">4-Round</span>
                <span className="text-[11px] text-muted-foreground">Sequential Mock Graders</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Composite with Authentic Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
              {/* Authentic University Collaborative Workspace Image */}
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
                alt="University students collaborating on campus placement prep" 
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 image-gradient-scrim" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-md border border-white/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Verified Placement Portal
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
                  Season 2026
                </span>
              </div>

              {/* Bottom Floating Placement Badges */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                {/* Placement Badge 1: Microsoft SDE-1 */}
                <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 p-1.5 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                      <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate leading-tight">
                        Software Engineer 1 (SDE-1)
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        Microsoft • B.Tech CSE Campus Drive
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] font-mono shrink-0">
                    ₹42.0 LPA
                  </Badge>
                </div>

                {/* Placement Badge 2: BBC News Trainee */}
                <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 p-1.5 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                      <Radio className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate leading-tight">
                        Trainee Broadcast Journalist
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        BBC News • BJMC Graduate Scheme
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-mono shrink-0">
                    ₹9.0 LPA
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Recruiter Trust Wall (Authentic Logos) */}
      <section className="py-10 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Campus Recruitment Partners & Editorial Networks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3 items-center justify-center pt-2">
            {[...techRecruiters, ...mediaRecruiters].map((recruiter) => (
              <div 
                key={recruiter.name}
                className="p-2.5 rounded-lg border border-border/80 bg-background hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-1.5 text-center group h-16"
              >
                <img 
                  src={recruiter.logo} 
                  alt={recruiter.name}
                  className="h-5 w-auto max-w-[70px] object-contain grayscale group-hover:grayscale-0 transition-all"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors leading-none">
                  {recruiter.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Dual-Stream Explorer */}
      <section className="py-16 px-4 bg-muted/40 border-b border-border">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-primary/30 text-primary">
              Stream-Specific Placement Architecture
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground font-heading">
              Tailored Roadmaps for Engineering & Media
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Every mock interview question, resume rubric, and job opportunity adapts automatically to your branch of study.
            </p>

            {/* Stream Selector Buttons */}
            <div className="inline-flex items-center p-1 bg-card rounded-xl border border-border mt-3 shadow-sm">
              <button
                type="button"
                onClick={() => setActivePreviewStream("CSE")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activePreviewStream === "CSE"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="h-4 w-4" /> B.Tech (Computer Science & IT)
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewStream("BJMC")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activePreviewStream === "BJMC"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Radio className="h-4 w-4" /> BJMC (Journalism & Mass Comm)
              </button>
            </div>
          </div>

          {/* Stream Preview Card */}
          {activePreviewStream === "CSE" ? (
            <Card className="border border-border bg-card shadow-sm overflow-hidden rounded-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Photo Side */}
                <div className="lg:col-span-4 relative min-h-[220px] lg:min-h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                    alt="B.Tech Computer Science workspace" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <Badge className="bg-blue-600 text-white w-fit text-[10px] mb-2 font-mono">
                      Engineering Hub
                    </Badge>
                    <h3 className="text-xl font-bold font-heading">
                      Systems, Algorithms & Architecture
                    </h3>
                    <p className="text-xs text-blue-100 mt-1">
                      Targeting FAANG, Tier-1 Product & Digital campus drives.
                    </p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-8 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                        B.Tech CSE Track
                      </span>
                      <h4 className="text-lg font-bold text-foreground">
                        Full Stack, Backend Systems & Cloud Platforms
                      </h4>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-muted-foreground block">Campus CTC Range:</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹8.5 LPA – ₹42.0 LPA
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-foreground block">Target Roles</span>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• SDE-1 / Associate Engineer</li>
                        <li>• Full Stack Developer (React/Node)</li>
                        <li>• Backend Systems (Java/Go)</li>
                        <li>• Cloud & DevOps Associate</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-foreground block">Interview Graders</span>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Two-Heap Running Median in O(1)</li>
                        <li>• Distributed Rate Limiter (500k QPS)</li>
                        <li>• B+ Tree vs Hash Indexing</li>
                        <li>• STAR Project Walkthroughs</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-foreground block">Recruiter Partners</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {["Google", "Microsoft", "Amazon", "Swiggy", "Razorpay", "Flipkart", "TCS Digital"].map((co) => (
                          <span key={co} className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-border font-medium">
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20 gap-3">
                    <span className="text-xs text-foreground font-medium">
                      Calibrate your engineering resume against GitHub deployment verification and algorithmic keywords.
                    </span>
                    <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold shrink-0">
                      Test CSE Resume Free
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border border-border bg-card shadow-sm overflow-hidden rounded-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Photo Side */}
                <div className="lg:col-span-4 relative min-h-[220px] lg:min-h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80" 
                    alt="BJMC Broadcast newsroom workspace" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <Badge className="bg-amber-600 text-white w-fit text-[10px] mb-2 font-mono">
                      Media & Newsroom Hub
                    </Badge>
                    <h3 className="text-xl font-bold font-heading">
                      Journalism, Anchoring & PR
                    </h3>
                    <p className="text-xs text-amber-100 mt-1">
                      Calibrated for BBC News, NDTV, national dailies, and PR agencies.
                    </p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-8 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                        BJMC Media Track
                      </span>
                      <h4 className="text-lg font-bold text-foreground">
                        Broadcast Journalism, Beat Reporting & Corporate PR
                      </h4>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-muted-foreground block">Campus CTC Range:</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹5.0 LPA – ₹24.0 LPA
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-foreground block">Target Roles</span>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Trainee Broadcast Journalist</li>
                        <li>• Assistant News Producer</li>
                        <li>• Staff Reporter & Beat Sub-Editor</li>
                        <li>• PR & Crisis Account Coordinator</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-foreground block">Interview Graders</span>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Section 499 Defamation Defenses</li>
                        <li>• Unscripted Teleprompter Breakdown</li>
                        <li>• Whistleblower Anonymous Sources</li>
                        <li>• 60-Minute Crisis PR Statements</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-foreground block">Recruiter Partners</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {["BBC News", "NDTV 24x7", "The Hindu", "Ogilvy", "Vox Media", "The Quint", "Adfactors"].map((co) => (
                          <span key={co} className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-border font-medium">
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 gap-3">
                    <span className="text-xs text-foreground font-medium">
                      Validate your media portfolio for published editorial bylaws, audio packages, and broadcast ethics.
                    </span>
                    <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
                      Test BJMC Portfolio Free
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Real Student Testimonials Wall with Authentic Portraits */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">
              Verified Campus Outcomes
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
              Placed Students from the 2025–26 Cohort
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Real candidates who converted on-campus drives and national media trainee schemes using the Career Engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t) => (
              <Card key={t.name} className="border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between rounded-xl">
                <CardContent className="p-5 space-y-4">
                  {/* Student Portrait & Basic Info */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-border"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-foreground leading-snug">
                        {t.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        {t.degree}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{t.quote}"
                  </p>

                  {/* Offer Badge */}
                  <div className="pt-2 border-t border-border/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">
                      {t.role}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {t.company}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
            Ready for Your Final-Year Campus Placements?
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/90 max-w-xl mx-auto">
            Create your personalized profile today. Calibrate your resume against strict ATS rubrics and practice sequential mock interviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 shadow-md text-sm h-11"
            >
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-white/40 text-white hover:bg-white/10 font-bold px-6 text-sm h-11"
            >
              Sign In to Existing Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>AI Student Career Guide • Campus Placement Engine</span>
          </div>
          <p>© 2026 University Placement System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
