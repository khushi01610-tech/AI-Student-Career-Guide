import { useState } from "react";
import { useCareer } from "@/context/CareerContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building, ExternalLink, Loader2, Star, Briefcase, Calendar, Filter, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/career";
import { motion, AnimatePresence } from "framer-motion";

export default function JobSearch() {
  const { resumeAnalysis, jobs, setJobs, setIsLoading, isLoading } = useCareer();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "date">("match");
  const [minMatch, setMinMatch] = useState(0);
  const { toast } = useToast();

  const searchJobs = async () => {
    if (!resumeAnalysis) {
      toast({ title: "Upload Resume First", description: "Please analyze your resume before searching for jobs.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-jobs", {
        body: {
          skills: resumeAnalysis.skills,
          query: query || resumeAnalysis.roleRecommendations[0] || "software developer",
          location,
        },
      });
      if (error) throw error;
      const foundJobs = data.jobs || [];
      setJobs(foundJobs);
      if (foundJobs.length === 0) {
        toast({ title: "No Jobs Found", description: "Try different keywords or broaden your search.", variant: "destructive" });
      } else {
        toast({ title: `🎯 ${foundJobs.length} Jobs Found!`, description: `Found ${foundJobs.length} matching jobs from real sources.` });
      }
    } catch (err: any) {
      console.error("Job search error:", err);
      toast({ title: "Search Failed", description: err.message || "Failed to search jobs. Please retry.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs
    .filter(j => j.matchScore >= minMatch)
    .sort((a, b) => sortBy === "match" ? b.matchScore - a.matchScore : 0);

  const topJobs = filteredJobs.slice(0, 5);
  const otherJobs = filteredJobs.slice(5);

  const avgMatch = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.matchScore, 0) / jobs.length) : 0;
  const highMatches = jobs.filter(j => j.matchScore >= 70).length;

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold gradient-text">Job Search</motion.h1>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Job title or keywords..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" onKeyDown={(e) => e.key === "Enter" && searchJobs()} />
              </div>
              <div className="relative w-full sm:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" onKeyDown={(e) => e.key === "Enter" && searchJobs()} />
              </div>
              <Button onClick={searchJobs} disabled={isLoading} className="gap-2 glow-primary">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats + Filters */}
      {jobs.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3 items-center">
          <Badge variant="secondary" className="gap-1"><Briefcase className="h-3 w-3" /> {jobs.length} jobs</Badge>
          <Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" /> Avg match: {avgMatch}%</Badge>
          <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3" /> {highMatches} high matches</Badge>
          <div className="ml-auto flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-card border border-border rounded px-2 py-1 text-foreground">
              <option value="match">Sort: Best Match</option>
              <option value="date">Sort: Most Recent</option>
            </select>
            <select value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))}
              className="text-xs bg-card border border-border rounded px-2 py-1 text-foreground">
              <option value={0}>All Scores</option>
              <option value={50}>50%+ Match</option>
              <option value={70}>70%+ Match</option>
            </select>
          </div>
        </motion.div>
      )}

      {!resumeAnalysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 text-center text-sm text-destructive">
              Upload and analyze your resume first to get personalized job matches.
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isLoading && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Loader2 className="h-14 w-14 text-primary mx-auto" />
            </motion.div>
            <p className="text-muted-foreground mt-4">Searching real jobs from RemoteOK & Adzuna...</p>
            <p className="text-xs text-muted-foreground mt-1">Matching against your {resumeAnalysis?.skills.length || 0} skills</p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {topJobs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-chart-3" /> Top Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topJobs.map((job, i) => (<JobCard key={job.id} job={job} featured index={i} />))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {otherJobs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> More Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {otherJobs.map((job, i) => (<JobCard key={job.id} job={job} index={i + 5} />))}
          </div>
        </motion.div>
      )}

      {jobs.length === 0 && !isLoading && resumeAnalysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Briefcase className="h-14 w-14 mx-auto mb-3 opacity-40" />
          </motion.div>
          <p className="text-lg">Click "Search Jobs" to find real jobs matching your skills!</p>
          <p className="text-sm mt-1">We'll search RemoteOK and Adzuna for the best matches.</p>
        </motion.div>
      )}
    </div>
  );
}

function JobCard({ job, featured, index = 0 }: { job: Job; featured?: boolean; index?: number }) {
  const matchColor = job.matchScore >= 70 ? "text-accent" : job.matchScore >= 40 ? "text-chart-3" : "text-muted-foreground";
  const matchBg = job.matchScore >= 70 ? "bg-accent/10" : job.matchScore >= 40 ? "bg-chart-3/10" : "bg-muted/30";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
      <Card className={`glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${featured ? "ring-1 ring-primary/30" : ""}`}>
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm leading-tight">{job.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" /> {job.company}
              </p>
            </div>
            <div className={`text-lg font-bold ${matchColor} ${matchBg} rounded-lg px-2 py-0.5`}>{job.matchScore}%</div>
          </div>
          {job.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            {job.location && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            )}
            {job.salary && <Badge variant="secondary" className="text-xs">{job.salary}</Badge>}
            <Badge variant="outline" className="text-xs capitalize">{job.source}</Badge>
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs py-0">{tag}</Badge>
              ))}
            </div>
          )}
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="w-full gap-2 mt-1 hover:bg-primary hover:text-primary-foreground transition-colors">
              <ExternalLink className="h-3 w-3" /> Apply Now
            </Button>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
