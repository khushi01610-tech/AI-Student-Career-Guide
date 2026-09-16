import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Code, GraduationCap, Target, Briefcase, Sparkles, Shield, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.06, duration: 0.5, type: "spring", stiffness: 120 } }),
};

export default function About() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Intro section */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">About Us</Badge>
        <h1 className="text-3xl md:text-5xl font-black gradient-text">AI Student Career Guide</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A modern full-stack coaching engine designed to help college students scan resumes, practice interview boards, and collaborate on placements with peers globally.
        </p>
      </motion.div>

      {/* Core Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { icon: Target, title: "Career Placement", desc: "Equipping students from BTech to MS courses with skills roadmap checkpoints." },
          { icon: Sparkles, title: "AI-Driven Feedback", desc: "Instant grammar, clarity, and ATS diagnostics using modern language APIs." },
          { icon: Users, title: "Cross-College Collab", desc: "Allowing students from Stanford to IIT to host and schedule study meetings together." }
        ].map((item, i) => (
          <motion.div key={i} custom={i + 1} initial="hidden" animate="visible" variants={scaleIn}>
            <Card className="glass-card h-full hover:-translate-y-1 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform Features Detail */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-1.5"><Rocket className="h-4.5 w-4.5 text-accent" /> Platform Core Modules</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              The **AI Student Career Guide** is built to bridge the gap between academic education and industry expectations. Through five unified preparation channels, students get a complete evaluation loop:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Resume Scanning:</strong> Scoring ATS keyword matching, formatting, and project detail improvements.</li>
              <li><strong>Interactive Mock Boards:</strong> Question-by-question technical and HR interviews with comprehensive scorecards.</li>
              <li><strong>Speaking Diagnostics:</strong> Microphone recording checking grammar correctness, clarity, and articulation confidence.</li>
              <li><strong>Roadmaps Checklist:</strong> Toggling completed steps to update profile progress dynamically.</li>
              <li><strong>Placement Forums:</strong> Sharing interview tip videos and posts with students across other universities.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technology Stack & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div custom={5} initial="hidden" animate="visible" variants={scaleIn} className="h-full">
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-base flex items-center gap-1.5"><Code className="h-4.5 w-4.5 text-primary" /> Frontend Stack</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-border/10 pb-2">
                <span>UI Components</span>
                <Badge variant="secondary" className="text-[10px]">React 18 & TypeScript</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border/10 pb-2">
                <span>Styling Engine</span>
                <Badge variant="secondary" className="text-[10px]">Tailwind CSS</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border/10 pb-2">
                <span>Wired Icons</span>
                <Badge variant="secondary" className="text-[10px]">Lucide React</Badge>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span>Build System</span>
                <Badge variant="secondary" className="text-[10px]">Vite</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={6} initial="hidden" animate="visible" variants={scaleIn} className="h-full">
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-base flex items-center gap-1.5"><Shield className="h-4.5 w-4.5 text-primary" /> Backend Stack</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-border/10 pb-2">
                <span>Server Engine</span>
                <Badge variant="secondary" className="text-[10px]">Express & Node.js</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border/10 pb-2">
                <span>Database Client</span>
                <Badge variant="secondary" className="text-[10px]">MongoDB & Mongoose</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border/10 pb-2">
                <span>Auth System</span>
                <Badge variant="secondary" className="text-[10px]">JWT & Bcrypt Hashing</Badge>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span>Database Fallback</span>
                <Badge variant="secondary" className="text-[10px]">Local JSON File Storage</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.p custom={7} initial="hidden" animate="visible" variants={fadeUp} className="text-center text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1">
        Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> for student success globally.
      </motion.p>
    </div>
  );
}
