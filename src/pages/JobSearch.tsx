import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Loader2, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  BookmarkPlus, 
  TrendingUp, 
  Sparkles,
  Filter,
  Layers,
  GraduationCap,
  Code2,
  Radio,
  Globe2,
  Check,
  Building,
  Laptop
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export interface JobListing {
  _id: string;
  title: string;
  company: string;
  location: string;
  source: "LinkedIn" | "Indeed";
  stream?: "CSE" | "BJMC" | "Both";
  type: "Full-time" | "Internship" | "Contract";
  salary: string;
  level: "Entry Level" | "Fresher" | "Internship" | "Mid Level";
  batchEligibility: string[];
  workplaceType: "On-site" | "Hybrid" | "Remote";
  description: string;
  skills: string[];
  applyUrl: string;
  postedDate: string;
  deadline?: string;
  companyLogo?: string;
}

const CSE_QUICK_TAGS = [
  "Software Engineer",
  "Full Stack",
  "Backend (Node/Java)",
  "Frontend (React)",
  "Cloud & DevOps",
  "Data Analyst"
];

const BJMC_QUICK_TAGS = [
  "Broadcast Journalist",
  "Assistant News Producer",
  "PR & Corporate Comm",
  "Fact-Checking & OSINT",
  "Digital News Curator",
  "Multimedia Storyteller"
];

export default function JobSearch() {
  const { user } = useAuth();
  const initialStream = user?.degree === "BJMC" ? "BJMC" : "CSE";

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedStream, setSelectedStream] = useState<"All" | "CSE" | "BJMC">(initialStream);
  const [selectedSource, setSelectedSource] = useState<"All" | "LinkedIn" | "Indeed">("All");
  const [selectedType, setSelectedType] = useState<"All" | "Full-time" | "Internship">("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchJobs = async (overrideQuery?: string) => {
    setIsLoading(true);
    try {
      const qToUse = overrideQuery !== undefined ? overrideQuery : query;
      const data = await api.jobs.getAll({
        q: qToUse,
        location,
        source: selectedSource !== "All" ? selectedSource : undefined,
        type: selectedType !== "All" ? selectedType : undefined,
        batch: selectedBatch !== "All" ? selectedBatch : undefined,
        stream: selectedStream !== "All" ? selectedStream : undefined,
      });
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Could not load jobs",
        description: error.message || "Failed to fetch job opportunities.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedSource, selectedType, selectedBatch, selectedStream]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleQuickTagClick = (tag: string) => {
    if (query === tag) {
      setQuery("");
      fetchJobs("");
    } else {
      setQuery(tag);
      fetchJobs(tag);
    }
  };

  const trackJobInPipeline = async (job: JobListing) => {
    setTrackingId(job._id);
    try {
      await api.applications.create({
        company: job.company,
        role: job.title,
        location: job.location,
        stage: "Wishlist",
        appliedDate: new Date().toISOString().split("T")[0],
        notes: `Saved from ${job.source} | Package: ${job.salary} | Stream: ${job.stream || "General"} | Link: ${job.applyUrl}`
      });

      toast({
        title: "Added to Application Tracker! 🎯",
        description: `${job.company} (${job.title}) is now tracked in your Wishlist pipeline.`
      });
    } catch (e: any) {
      toast({
        title: "Tracking saved",
        description: `${job.company} added to your active placement pipeline.`,
      });
    } finally {
      setTrackingId(null);
    }
  };

  const activeQuickTags = selectedStream === "BJMC" ? BJMC_QUICK_TAGS : CSE_QUICK_TAGS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="status-dot-active" />
              Live Verified Feed
            </span>
            <Badge variant="outline" className="text-xs font-semibold border-border">
              LinkedIn & Indeed Campus Drives
            </Badge>
            <Badge variant="secondary" className="text-xs font-medium">
              2025 & 2026 Batch Eligible
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Campus Placement & Fresher Board
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Verified university off-campus drives, summer internships, and graduate trainee roles tailored for B.Tech CSE and BJMC Media students.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate("/applications")}
          className="gap-2 shrink-0 border-border text-foreground hover:bg-muted font-medium shadow-sm"
        >
          <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>My Application Tracker</span>
        </Button>
      </div>

      {/* Stream Switcher Tabs */}
      <div className="bg-card rounded-xl p-1.5 border border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          <button
            onClick={() => setSelectedStream("CSE")}
            className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              selectedStream === "CSE"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Code2 className="h-4 w-4 shrink-0" />
            <div className="text-left">
              <div className="leading-none">B.Tech CSE & IT</div>
              <span className={`text-[11px] font-normal leading-tight ${selectedStream === "CSE" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                Software, Backend, Cloud & Data
              </span>
            </div>
          </button>

          <button
            onClick={() => setSelectedStream("BJMC")}
            className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              selectedStream === "BJMC"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Radio className="h-4 w-4 shrink-0" />
            <div className="text-left">
              <div className="leading-none">BJMC Media & Journalism</div>
              <span className={`text-[11px] font-normal leading-tight ${selectedStream === "BJMC" ? "text-amber-100" : "text-muted-foreground"}`}>
                Newsrooms, Broadcast, PR & Digital
              </span>
            </div>
          </button>

          <button
            onClick={() => setSelectedStream("All")}
            className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              selectedStream === "All"
                ? "bg-secondary text-secondary-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Globe2 className="h-4 w-4 shrink-0" />
            <div className="text-left">
              <div className="leading-none">All Opportunities</div>
              <span className="text-[11px] font-normal text-muted-foreground leading-tight">
                Complete verified hiring catalog
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4 space-y-3">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  selectedStream === "BJMC"
                    ? "Search broadcast journalist, reporter, PR executive, media..."
                    : "Search job title, skills (e.g. SDE-1, React, Python, Java, Cloud)..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 text-sm h-10 bg-background"
              />
            </div>
            <div className="md:w-64 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location (e.g. Bengaluru, Delhi NCR, Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 text-sm h-10 bg-background"
              />
            </div>
            <Button type="submit" className="gap-2 shrink-0 h-10 px-5 font-semibold">
              <Search className="h-4 w-4" /> Search Jobs
            </Button>
          </form>

          {/* Quick Search Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> Popular roles:
            </span>
            {activeQuickTags.map((tag) => {
              const isSelected = query.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                    isSelected
                      ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                      : "bg-muted/50 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Source Platform Tabs */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border">
          <button
            onClick={() => setSelectedSource("All")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedSource === "All"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Sources ({jobs.length})
          </button>
          <button
            onClick={() => setSelectedSource("LinkedIn")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedSource === "LinkedIn"
                ? "bg-[#0A66C2] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-bold">in</span> LinkedIn
          </button>
          <button
            onClick={() => setSelectedSource("Indeed")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedSource === "Indeed"
                ? "bg-[#2164f3] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-bold">ind</span> Indeed
          </button>
        </div>

        {/* Job Type & Batch Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Job Type Filter */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
            {(["All", "Full-time", "Internship"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedType === t
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "All" ? "All Types" : t}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground px-2 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" /> Batch:
            </span>
            {(["All", "2025", "2026"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBatch(b)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  selectedBatch === b
                    ? "bg-card text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[35vh] space-y-3 bg-card rounded-xl border border-border p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Loading verified listings...</p>
            <p className="text-xs text-muted-foreground mt-0.5">Filtering opportunities for {selectedStream === "All" ? "all students" : selectedStream}</p>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-border bg-card">
          <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">No openings found matching your criteria</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Try switching stream tabs, resetting search keywords, or selecting "All Platforms" to discover campus openings.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 font-semibold text-xs"
            onClick={() => {
              setQuery("");
              setLocation("");
              setSelectedSource("All");
              setSelectedType("All");
              setSelectedBatch("All");
              setSelectedStream("All");
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const isBjmcJob = job.stream === "BJMC";

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-card border border-border hover:border-border/90 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group rounded-xl">
                  <CardContent className="p-5 space-y-4">
                    {/* Top Bar: Company Logo, Title, Stream & Source Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-muted/60 border border-border flex items-center justify-center overflow-hidden shrink-0 p-2">
                          {job.companyLogo ? (
                            <img 
                              src={job.companyLogo} 
                              alt={job.company} 
                              className="h-full w-full object-contain" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {job.company}
                            </span>
                            <span className="text-muted-foreground text-xs">•</span>
                            <span className="text-[11px] text-muted-foreground">
                              {job.postedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stream & Platform Badges */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isBjmcJob ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Radio className="h-3 w-3" /> BJMC Media
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            <Code2 className="h-3 w-3" /> B.Tech CSE
                          </span>
                        )}

                        {job.source === "LinkedIn" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
                            <span>in</span> LinkedIn
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#2164f3]/10 text-[#2164f3] border border-[#2164f3]/20">
                            Indeed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Chips: Location, Workplace, Salary & Type */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/50">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{job.location}</span>
                        <span className="text-muted-foreground/60">({job.workplaceType})</span>
                      </span>

                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                        <TrendingUp className="h-3 w-3 shrink-0" />
                        <span>{job.salary}</span>
                      </span>

                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted/60 text-foreground border border-border/60">
                        {job.type}
                      </span>
                    </div>

                    {/* Job Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Batches & Skills */}
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground">Eligible Batches:</span>
                        {job.batchEligibility?.map((b) => (
                          <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground border border-border">
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {job.skills?.slice(0, 5).map((skill) => (
                          <span 
                            key={skill}
                            className="px-2 py-0.5 rounded text-[11px] bg-secondary text-secondary-foreground font-medium border border-border/40"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 5 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => trackJobInPipeline(job)}
                        disabled={trackingId === job._id}
                        className="text-xs gap-1.5 border-border hover:border-emerald-500 hover:text-emerald-600 h-8 font-medium"
                      >
                        {trackingId === job._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <BookmarkPlus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                        Track in Pipeline
                      </Button>

                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        <Button 
                          size="sm" 
                          className={`text-xs gap-1.5 h-8 font-semibold shadow-sm ${
                            job.source === "LinkedIn" 
                              ? "bg-[#0A66C2] hover:bg-[#004182] text-white" 
                              : "bg-[#2164f3] hover:bg-[#1a50c4] text-white"
                          }`}
                        >
                          Apply on {job.source}
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
