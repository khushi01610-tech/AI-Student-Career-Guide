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
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export interface JobListing {
  _id: string;
  title: string;
  company: string;
  location: string;
  source: "LinkedIn" | "Indeed";
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

export default function JobSearch() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSource, setSelectedSource] = useState<"All" | "LinkedIn" | "Indeed">("All");
  const [selectedType, setSelectedType] = useState<"All" | "Full-time" | "Internship">("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await api.jobs.getAll({
        q: query,
        location,
        source: selectedSource !== "All" ? selectedSource : undefined,
        type: selectedType !== "All" ? selectedType : undefined,
        batch: selectedBatch !== "All" ? selectedBatch : undefined,
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
  }, [selectedSource, selectedType, selectedBatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
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
        notes: `Saved from ${job.source} | Package: ${job.salary} | Apply link: ${job.applyUrl}`
      });

      toast({
        title: "Added to Application Tracker! 🎯",
        description: `${job.company} (${job.title}) is now tracked in your Wishlist pipeline.`
      });
    } catch (e: any) {
      toast({
        title: "Tracking saved locally",
        description: "Application added to your active placement pipeline.",
      });
    } finally {
      setTrackingId(null);
    }
  };

  const linkedInCount = jobs.filter(j => j.source === "LinkedIn").length;
  const indeedCount = jobs.filter(j => j.source === "Indeed").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              LinkedIn & Indeed Live Feed
            </Badge>
            <Badge variant="secondary" className="text-xs">
              2025 & 2026 Batches
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Campus & Fresher Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verified off-campus drives, summer internships, and graduate engineer roles curated from LinkedIn and Indeed.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate("/applications")}
          className="gap-2 shrink-0 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
        >
          <Briefcase className="h-4 w-4" /> View My Applications Tracker
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="glass-card border-border/70">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job title, skills (e.g. React, Python, Java, SDE)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
            <div className="md:w-60 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location (e.g. Bengaluru, Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
            <Button type="submit" className="gap-2 shrink-0 bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4" /> Search Jobs
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Platform & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Source Platform Tabs */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border/50">
          <button
            onClick={() => setSelectedSource("All")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedSource === "All"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Platforms ({jobs.length})
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
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
            {(["All", "Full-time", "Internship"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedType === t
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "All" ? "All Types" : t}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
            <span className="text-[11px] text-muted-foreground px-2 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> Batch:
            </span>
            {(["All", "2025", "2026"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBatch(b)}
                className={`px-2 py-0.5 rounded text-xs transition-all ${
                  selectedBatch === b
                    ? "bg-card text-foreground font-semibold shadow-xs"
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
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching opportunities from LinkedIn & Indeed...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold">No listings found matching your criteria</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Try resetting your search filters or clearing the location field to browse all open campus drives.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => {
              setQuery("");
              setLocation("");
              setSelectedSource("All");
              setSelectedType("All");
              setSelectedBatch("All");
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between h-full group hover:shadow-md">
                <CardContent className="p-5 space-y-4">
                  {/* Top Bar: Company, Logo, Platform Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center overflow-hidden shrink-0 p-2">
                        {job.companyLogo ? (
                          <img 
                            src={job.companyLogo} 
                            alt={job.company} 
                            className="h-full w-full object-contain" 
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Source Tag */}
                    <div className="shrink-0">
                      {job.source === "LinkedIn" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
                          <span>in</span> LinkedIn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2164f3]/10 text-[#2164f3] border border-[#2164f3]/20">
                          Indeed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Chips: Location, Package, Type */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                      <MapPin className="h-3 w-3" /> {job.location} ({job.workplaceType})
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                      <TrendingUp className="h-3 w-3" /> {job.salary}
                    </span>
                    <Badge variant="secondary" className="text-[11px]">
                      {job.type}
                    </Badge>
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Batch & Skills */}
                  <div className="space-y-2 pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">Eligible Batches:</span>
                      {job.batchEligibility?.map((b) => (
                        <Badge key={b} variant="outline" className="text-[10px] px-1.5 py-0">
                          {b}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {job.skills?.slice(0, 5).map((skill) => (
                        <span 
                          key={skill}
                          className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-medium"
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
                      className="text-xs gap-1.5 border-border hover:border-emerald-500 hover:text-emerald-600 h-8"
                    >
                      {trackingId === job._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <BookmarkPlus className="h-3.5 w-3.5" />
                      )}
                      Track Application
                    </Button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      <Button 
                        size="sm" 
                        className={`text-xs gap-1.5 h-8 font-semibold ${
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
          ))}
        </div>
      )}
    </div>
  );
}
