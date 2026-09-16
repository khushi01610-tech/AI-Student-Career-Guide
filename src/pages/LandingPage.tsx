import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  Users, 
  Swords, 
  FileText, 
  Mic,
  Presentation
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 filter blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent/15 filter blur-3xl" />
      
      {/* Header Navigation */}
      <nav className="h-16 flex items-center justify-between px-6 border-b border-border/40 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-md font-bold tracking-tight text-foreground">AI Student Career Guide</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
          <Button size="sm" onClick={() => navigate("/register")} className="glow-primary">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 text-center max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium"
        >
          <Sparkles className="h-3 w-3 animate-pulse" /> Your AI Career Companion
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          Learn. Practice. Connect. <br />
          <span className="gradient-text font-black">Get Career Ready.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          An AI-powered coaching engine designed for college students. Analyze resumes, practice speaking, conduct mock interviews, and collaborate on placements with peers from universities worldwide.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Button size="lg" onClick={() => navigate("/register")} className="gap-2 px-8 py-6 text-md glow-primary">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="px-8 py-6 text-md">
            Explore Career Hub
          </Button>
        </motion.div>
      </section>

      {/* Mockup Chat preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="rounded-2xl border border-border/80 bg-card/65 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative"
        >
          <div className="absolute inset-0 shimmer pointer-events-none rounded-2xl opacity-10" />
          <div className="flex items-center gap-2 border-b border-border/20 pb-3 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="text-xs text-muted-foreground ml-2">CareerGuide AI Coach</span>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">AI</div>
              <div className="p-3 rounded-2xl bg-muted/60 max-w-[85%] text-xs space-y-1">
                <p className="font-semibold text-foreground">Hello Aarav! How is your Frontend roadmap coming along?</p>
                <p className="text-muted-foreground">I recommend finishing the **API Integration** chapter next to increase your Career Readiness Score to 82%.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="p-3 rounded-2xl bg-primary text-primary-foreground max-w-[85%] text-xs">
                Thanks! Which React coding questions should I expect for my interview?
              </div>
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">Me</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works section */}
      <section className="relative z-10 border-t border-border/30 py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Four Steps to Land Your Dream Job</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Our AI engine analyzes your portfolio and drives your preparation loop.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              { step: "01", icon: FileText, title: "ATS Resume Scan", desc: "Upload your CV to extract skills and calculate scoring metrics." },
              { step: "02", icon: Bot, title: "Personal Roadmap", desc: "Unlock custom tutorials and code project ideas for target roles." },
              { step: "03", icon: Mic, title: "Speaking Practice", desc: "Record intros and speaking challenges to refine communication skills." },
              { step: "04", icon: Swords, title: "Mock Evaluation", desc: "Practice coding & behavioral boards and review instant score feedback." },
            ].map((item, idx) => (
              <div key={item.title} className="p-6 rounded-xl bg-card border border-border/40 hover:-translate-y-1 transition-all text-left relative group">
                <span className="text-4xl font-black text-primary/10 group-hover:text-primary/20 absolute right-4 top-4 transition-colors">{item.step}</span>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Features Packed for Placement Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Bot, title: "CareerGuide AI Chat", desc: "Ask structural questions on interview guides, roadmap materials, and industry trends." },
            { icon: Swords, title: "Live Mock System", desc: "Simulate pressure with custom role levels. Get evaluations on relevance and clarity." },
            { icon: Users, title: "Student Communities", desc: "Share placement updates, coding cheat sheets, and videos with peers from other universities." },
            { icon: Mic, title: "Speaking Diagnostics", desc: "Speech recognition checking grammar, articulation, and presenting better word sentences." },
            { icon: FileText, title: "Resume Enhancement", desc: "Score matching percentages and rewrite select bullet points using active keywords." },
            { icon: Presentation, title: "Mock Collaboration", desc: "Create and join peer scheduling boards to conduct study meets together." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border/40 hover:border-primary/30 transition-all text-left bg-card">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 border-t border-border/30 py-20 bg-muted/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {[
              { quote: "The AI Resume Analyzer helped me restructure my projects. My ATS score increased from 52 to 84, and I landed a front-end internship next month!", author: "Rohan K., B.Tech CSE" },
              { quote: "Practicing the speaking prompts daily boosted my confidence. The grammar feedback and vocabulary builder prepared me for HR discussions.", author: "Sophia L., Stanford University" }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border/40 bg-card text-left italic relative">
                <span className="text-6xl text-primary/10 absolute left-4 top-2 font-serif">“</span>
                <p className="text-sm text-muted-foreground relative z-10 pl-6 leading-relaxed">
                  {item.quote}
                </p>
                <div className="mt-4 pl-6 text-xs font-bold text-foreground">— {item.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6 text-center text-xs text-muted-foreground bg-card">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">AI Student Career Guide</span>
          </div>
          <p>© 2026 AI Student Career Guide. Learn. Practice. Connect. Get Career Ready.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
