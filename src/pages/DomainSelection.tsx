import { useCareer } from "@/context/CareerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Code, Database, Shield, Brain, Palette, Smartphone, Cloud, BarChart3, Cpu, ArrowRight, Sparkles, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const domains = [
  { name: "Web Development", icon: Code, color: "from-blue-500 to-cyan-500", skills: ["React", "Node.js", "TypeScript", "HTML/CSS", "REST APIs"], growth: "High", salary: "$70k-$150k", demand: 92 },
  { name: "Data Science & AI", icon: Brain, color: "from-purple-500 to-pink-500", skills: ["Python", "TensorFlow", "SQL", "Statistics", "NLP"], growth: "Very High", salary: "$85k-$180k", demand: 95 },
  { name: "Mobile Development", icon: Smartphone, color: "from-green-500 to-emerald-500", skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"], growth: "High", salary: "$75k-$160k", demand: 88 },
  { name: "Cloud & DevOps", icon: Cloud, color: "from-orange-500 to-red-500", skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"], growth: "Very High", salary: "$90k-$190k", demand: 94 },
  { name: "Cybersecurity", icon: Shield, color: "from-red-500 to-rose-500", skills: ["Penetration Testing", "SIEM", "Encryption", "Network Security", "Compliance"], growth: "Very High", salary: "$80k-$175k", demand: 96 },
  { name: "UI/UX Design", icon: Palette, color: "from-pink-500 to-violet-500", skills: ["Figma", "User Research", "Prototyping", "Design Systems", "A/B Testing"], growth: "Medium", salary: "$60k-$140k", demand: 78 },
  { name: "Database Engineering", icon: Database, color: "from-teal-500 to-cyan-500", skills: ["PostgreSQL", "MongoDB", "Redis", "Data Modeling", "Performance Tuning"], growth: "Medium", salary: "$75k-$155k", demand: 82 },
  { name: "Machine Learning Ops", icon: Cpu, color: "from-indigo-500 to-blue-500", skills: ["MLflow", "Kubeflow", "Model Deployment", "Monitoring", "Feature Engineering"], growth: "Very High", salary: "$95k-$200k", demand: 90 },
  { name: "Business Analytics", icon: BarChart3, color: "from-amber-500 to-yellow-500", skills: ["Power BI", "Tableau", "SQL", "Excel", "Data Visualization"], growth: "High", salary: "$65k-$130k", demand: 85 },
];

export default function DomainSelection() {
  const { resumeAnalysis } = useCareer();
  const navigate = useNavigate();

  const getMatchedSkills = (domainSkills: string[]) => {
    if (!resumeAnalysis) return [];
    return domainSkills.filter(ds => resumeAnalysis.skills.some(s => s.toLowerCase().includes(ds.toLowerCase()) || ds.toLowerCase().includes(s.toLowerCase())));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">Domain Selection</h1>
        {!resumeAnalysis && (
          <Button variant="outline" size="sm" onClick={() => navigate("/resume")} className="gap-1">
            <ArrowRight className="h-3 w-3" /> Upload Resume for Matching
          </Button>
        )}
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">
        Explore career domains and see which ones match your skills. {resumeAnalysis ? "Skills from your resume are highlighted below." : "Upload your resume to see personalized matches."}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {domains.map((domain, i) => {
          const matched = getMatchedSkills(domain.skills);
          const matchPercent = resumeAnalysis ? Math.round((matched.length / domain.skills.length) * 100) : 0;
          return (
            <motion.div key={domain.name} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}>
              <Card className="glass-card h-full overflow-hidden group cursor-pointer relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center shadow-lg`}>
                        <domain.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-sm">{domain.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{domain.salary}</p>
                      </div>
                    </div>
                    {resumeAnalysis && matchPercent > 0 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.05, type: "spring" }}>
                        <Badge className="bg-accent/10 text-accent">{matchPercent}% match</Badge>
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-accent"><TrendingUp className="h-3 w-3" /> {domain.growth} Growth</span>
                    <span className="flex items-center gap-1 text-primary"><Star className="h-3 w-3" /> {domain.demand}% Demand</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${domain.demand}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                      className={`h-full rounded-full bg-gradient-to-r ${domain.color}`} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.skills.map(skill => (
                      <Badge key={skill} variant={matched.includes(skill) ? "default" : "secondary"} className={`text-xs transition-all ${matched.includes(skill) ? "bg-accent text-accent-foreground" : ""}`}>
                        {matched.includes(skill) && <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />}
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
