import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, MapPin, Building, Users, Sparkles, Star, ExternalLink, UserCheck, Lightbulb, Briefcase, Globe, MessageSquare, Zap, Crown, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface LinkedInProfile {
  name: string;
  title: string;
  company: string;
  location: string;
  headline: string;
  industry: string;
  connectionDegree: string;
  mutualConnections?: number;
  skills: string[];
  about: string;
  experience_years?: number;
  isHiring?: boolean;
  connectionTip: string;
  profileStrength: string;
}

interface SearchResult {
  profiles: LinkedInProfile[];
  searchSummary: string;
  networkingTips: string[];
}

export default function LinkedInSearch() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "hr" | "company">("all");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<LinkedInProfile | null>(null);
  const { toast } = useToast();

  const searchLinkedIn = async () => {
    if (!query.trim()) {
      toast({ title: "Enter a search query", description: "Type a name, company, or role to search.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setSelectedProfile(null);
    try {
      const { data, error } = await supabase.functions.invoke("linkedin-search", {
        body: { query, searchType },
      });
      if (error) throw error;
      setResults(data);
      toast({ title: `🔍 Found ${data.profiles?.length || 0} profiles`, description: "LinkedIn-style results loaded." });
    } catch (err: any) {
      toast({ title: "Search Failed", description: err.message || "Failed to search.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColor = (s: string) => s === "High" ? "text-accent bg-accent/10" : s === "Medium" ? "text-chart-3 bg-chart-3/10" : "text-muted-foreground bg-muted/30";
  const degreeColor = (d: string) => d === "1st" ? "bg-accent/20 text-accent" : d === "2nd" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
          className="h-10 w-10 rounded-xl bg-[#0A66C2] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white fill-current">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </motion.div>
        <h1 className="text-2xl font-bold gradient-text">LinkedIn Search</h1>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <div className="absolute inset-0 shimmer pointer-events-none opacity-40" />
          <CardContent className="p-5 relative space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search people, HR managers, companies..." value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 text-sm" onKeyDown={(e) => e.key === "Enter" && searchLinkedIn()} />
              </div>
              <Button onClick={searchLinkedIn} disabled={isLoading} className="gap-2 glow-primary bg-[#0A66C2] hover:bg-[#004182]">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search LinkedIn
              </Button>
            </div>
            <div className="flex gap-2">
              {(["all", "hr", "company"] as const).map((type) => (
                <motion.button key={type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchType(type)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    searchType === type ? "bg-[#0A66C2] text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {type === "all" ? "👥 All Profiles" : type === "hr" ? "🎯 HR & Recruiters" : "🏢 Companies"}
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <motion.div className="relative inline-block">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Loader2 className="h-16 w-16 text-[#0A66C2]" />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-[#0A66C2]/10" />
            </motion.div>
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
              className="text-muted-foreground mt-6 text-lg">Searching LinkedIn profiles...</motion.p>
            <p className="text-xs text-muted-foreground mt-1">Finding the best matches for "{query}"</p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Summary */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="glass-card overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A66C2]/5 via-transparent to-[#0A66C2]/5" />
                <CardContent className="p-5 relative">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 text-[#0A66C2]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{results.profiles?.length || 0} Profiles Found</h3>
                      <p className="text-sm text-muted-foreground mt-1">{results.searchSummary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Networking Tips */}
            {results.networkingTips?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Lightbulb className="h-4 w-4 text-chart-3" /> Networking Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.networkingTips.map((tip, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                          <Zap className="h-3.5 w-3.5 text-chart-3 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.profiles?.map((profile, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.04, type: "spring", stiffness: 120 }}
                  whileHover={{ y: -5, scale: 1.02 }}>
                  <Card className={`glass-card cursor-pointer transition-all duration-300 h-full ${
                    selectedProfile === profile ? "ring-2 ring-[#0A66C2] shadow-xl" : "hover:shadow-lg"
                  } ${profile.isHiring ? "border-accent/30" : ""}`}
                    onClick={() => setSelectedProfile(selectedProfile === profile ? null : profile)}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <motion.div whileHover={{ scale: 1.1 }}
                          className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                          {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-foreground truncate">{profile.name}</h3>
                            {profile.isHiring && (
                              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Badge className="bg-accent/20 text-accent text-[9px] px-1.5 py-0">Hiring</Badge>
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-[#0A66C2] font-medium truncate">{profile.title}</p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <Building className="h-3 w-3" /> {profile.company}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge className={`text-[9px] ${degreeColor(profile.connectionDegree)}`}>{profile.connectionDegree}</Badge>
                          <Badge className={`text-[9px] ${strengthColor(profile.profileStrength)}`}>{profile.profileStrength}</Badge>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 italic">"{profile.headline}"</p>

                      <div className="flex flex-wrap gap-1">
                        {profile.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {profile.location}
                          </span>
                        )}
                        {profile.mutualConnections && profile.mutualConnections > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                            <Users className="h-3 w-3" /> {profile.mutualConnections} mutual
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {profile.skills?.slice(0, 3).map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px] py-0">{s}</Badge>
                        ))}
                        {profile.skills?.length > 3 && (
                          <Badge variant="outline" className="text-[10px] py-0">+{profile.skills.length - 3}</Badge>
                        )}
                      </div>

                      <AnimatePresence>
                        {selectedProfile === profile && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} className="space-y-3 pt-2 border-t border-border">
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-1">About</p>
                              <p className="text-xs text-muted-foreground">{profile.about}</p>
                            </div>
                            <div className="flex items-start gap-2 p-2 rounded-lg bg-[#0A66C2]/5">
                              <MessageSquare className="h-3.5 w-3.5 text-[#0A66C2] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-semibold text-[#0A66C2]">Connection Tip</p>
                                <p className="text-xs text-muted-foreground">{profile.connectionTip}</p>
                              </div>
                            </div>
                            {profile.skills?.length > 3 && (
                              <div className="flex flex-wrap gap-1">
                                {profile.skills.map((s) => (
                                  <Badge key={s} variant="secondary" className="text-[10px] py-0">{s}</Badge>
                                ))}
                              </div>
                            )}
                            <Button size="sm" variant="outline" className="w-full gap-2 text-[#0A66C2] border-[#0A66C2]/30 hover:bg-[#0A66C2] hover:text-white">
                              <UserCheck className="h-3 w-3" /> Connect on LinkedIn
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!results && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block">
            <div className="h-20 w-20 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-[#0A66C2]/50" />
            </div>
          </motion.div>
          <p className="text-lg text-foreground font-semibold mt-4">Search LinkedIn Profiles</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Find HR managers, recruiters, hiring leads, and companies. Get personalized connection tips and networking advice.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Google HR Manager", "Amazon Recruiter", "TCS Hiring", "Microsoft Talent", "Startup CTO"].map((example, i) => (
              <motion.button key={example} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.05 }}
                onClick={() => { setQuery(example); }}
                className="px-3 py-1.5 rounded-full text-xs bg-muted/50 text-muted-foreground hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-all">
                {example}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
