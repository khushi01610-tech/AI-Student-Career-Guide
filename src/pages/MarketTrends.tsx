import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Globe, Cpu, Zap, BarChart3, DollarSign, Users, Rocket, Sparkles, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const trendingSkills = [
  { skill: "AI/ML Engineering", demand: 95, growth: "+45%", trend: "up" },
  { skill: "Cloud Architecture", demand: 92, growth: "+32%", trend: "up" },
  { skill: "Full Stack (React/Node)", demand: 90, growth: "+28%", trend: "up" },
  { skill: "Cybersecurity", demand: 88, growth: "+35%", trend: "up" },
  { skill: "DevOps/SRE", demand: 87, growth: "+30%", trend: "up" },
  { skill: "Data Engineering", demand: 85, growth: "+25%", trend: "up" },
  { skill: "Mobile (React Native)", demand: 78, growth: "+15%", trend: "up" },
  { skill: "Blockchain", demand: 55, growth: "-10%", trend: "down" },
  { skill: "WordPress Dev", demand: 40, growth: "-20%", trend: "down" },
  { skill: "PHP (Legacy)", demand: 35, growth: "-15%", trend: "down" },
];

const salaryData = [
  { role: "ML Engineer", min: 95, avg: 145, max: 200 },
  { role: "Cloud Architect", min: 110, avg: 155, max: 210 },
  { role: "Full Stack Dev", min: 70, avg: 110, max: 160 },
  { role: "Data Scientist", min: 85, avg: 130, max: 180 },
  { role: "DevOps Engineer", min: 90, avg: 135, max: 185 },
  { role: "Frontend Dev", min: 65, avg: 100, max: 145 },
];

const industryGrowth = [
  { industry: "AI & ML", value: 45, color: "hsl(245,58%,51%)" },
  { industry: "Cloud", value: 32, color: "hsl(170,60%,45%)" },
  { industry: "Security", value: 35, color: "hsl(340,65%,55%)" },
  { industry: "FinTech", value: 28, color: "hsl(32,95%,55%)" },
  { industry: "HealthTech", value: 22, color: "hsl(200,70%,50%)" },
  { industry: "EdTech", value: 18, color: "hsl(280,60%,55%)" },
];

const remoteVsOnsite = [
  { name: "Remote", value: 42 },
  { name: "Hybrid", value: 35 },
  { name: "On-site", value: 23 },
];

const yearlyTrend = [
  { year: "2022", ai: 40, cloud: 55, web: 70, security: 45 },
  { year: "2023", ai: 60, cloud: 65, web: 72, security: 55 },
  { year: "2024", ai: 80, cloud: 78, web: 74, security: 68 },
  { year: "2025", ai: 95, cloud: 88, web: 75, security: 82 },
  { year: "2026", ai: 98, cloud: 92, web: 76, security: 90 },
];

const COLORS = ["hsl(245,58%,51%)", "hsl(170,60%,45%)", "hsl(32,95%,55%)", "hsl(340,65%,55%)", "hsl(200,70%,50%)", "hsl(280,60%,55%)"];

export default function MarketTrends() {
  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold gradient-text">
        Market Trends 2025-26
      </motion.h1>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: "Avg Growth", value: "+32%", color: "text-accent" },
          { icon: DollarSign, label: "Avg Salary", value: "$125k", color: "text-primary" },
          { icon: Users, label: "Remote Jobs", value: "42%", color: "text-chart-3" },
          { icon: Cpu, label: "AI Demand", value: "95%", color: "text-chart-4" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }} whileHover={{ scale: 1.05 }}>
            <Card className="glass-card hover:glow-primary transition-all duration-300">
              <CardContent className="p-4 text-center">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
                  <stat.icon className={`h-6 w-6 mx-auto mb-1 ${stat.color}`} />
                </motion.div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Trending Skills</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {trendingSkills.map((s, i) => (
                <motion.div key={s.skill} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground font-medium">{s.skill}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${s.trend === "up" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                          {s.trend === "up" ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                          {s.growth}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.demand}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                        className={`h-full rounded-full ${s.trend === "up" ? "bg-primary" : "bg-destructive/50"}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Salary Comparison */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-accent" /> Salary Ranges (USD/yr)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salaryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} unit="k" />
                  <YAxis type="category" dataKey="role" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="min" fill="hsl(var(--muted))" radius={[4, 0, 0, 4]} animationDuration={1200} name="Min" />
                  <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} animationDuration={1200} name="Avg" />
                  <Bar dataKey="max" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} animationDuration={1200} name="Max" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Growth Yearly */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-chart-3" /> Tech Demand Over Years</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={yearlyTrend}>
                  <defs>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                    <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="ai" stroke="hsl(var(--primary))" fill="url(#colorAi)" name="AI/ML" animationDuration={2000} />
                  <Area type="monotone" dataKey="cloud" stroke="hsl(var(--accent))" fill="url(#colorCloud)" name="Cloud" animationDuration={2000} />
                  <Line type="monotone" dataKey="web" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} name="Web Dev" animationDuration={2000} />
                  <Line type="monotone" dataKey="security" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} name="Security" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Remote vs Onsite */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-chart-5" /> Work Mode Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={remoteVsOnsite} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label animationDuration={1500}>
                    {remoteVsOnsite.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Industry Growth Bars */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> Industry Growth Rate (%)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {industryGrowth.map((ig, i) => (
                <motion.div key={ig.industry} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                  className="border border-border rounded-xl p-4 hover:bg-muted/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{ig.industry}</span>
                    <span className="text-lg font-bold" style={{ color: ig.color }}>+{ig.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${ig.value * 2}%` }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.8 }}
                      className="h-full rounded-full" style={{ backgroundColor: ig.color }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
