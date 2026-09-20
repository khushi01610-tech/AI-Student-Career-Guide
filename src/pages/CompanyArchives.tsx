import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Search, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  Award
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const INDUSTRIES = ["All", "Internet & Cloud Technology", "E-Commerce & Cloud Infrastructure (AWS)", "Management & Technology Consulting", "Cloud, AI & Productivity Platforms", "Global IT Services & Consulting"];

export default function CompanyArchives() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await api.companies.get({
        search: searchQuery || undefined,
        industry: activeIndustry !== "All" ? activeIndustry : undefined
      });
      setCompanies(data);
    } catch (e) {
      console.error("Error loading company archives:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [activeIndustry]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Company Recruitment Archives</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore verified recruitment patterns, CGPA cutoffs, interview rounds, and real past questions from campus placement drives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-medium bg-background">
            <Award className="h-3.5 w-3.5 text-primary mr-1" />
            Verified Recruiter Data
          </Badge>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by company name, role, or technology..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-card border-border"
          />
        </form>
        <Button onClick={fetchCompanies} className="h-10 px-5">Search</Button>
      </div>

      {/* Industry Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {INDUSTRIES.map((ind) => (
          <Badge
            key={ind}
            variant={activeIndustry === ind ? "default" : "secondary"}
            onClick={() => setActiveIndustry(ind)}
            className="cursor-pointer text-xs py-1.5 px-3 transition-colors shrink-0"
          >
            {ind === "All" ? "All Sectors" : ind.split("&")[0].trim()}
          </Badge>
        ))}
      </div>

      {/* Company Cards Grid */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading recruitment drives...</p>
        </div>
      ) : companies.length === 0 ? (
        <Card className="text-center py-20 bg-card border-border">
          <CardContent className="space-y-2">
            <Building2 className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold">No companies match your search criteria</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or searching for general terms like "Google", "Amazon", or "Consulting".</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => (
            <Card 
              key={comp._id || comp.slug} 
              className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md"
              onClick={() => setSelectedCompany(comp)}
            >
              <div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center p-2 border border-border shrink-0">
                        {comp.logo ? (
                          <img src={comp.logo} alt={comp.name} className="h-full w-full object-contain" />
                        ) : (
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {comp.name}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-1">
                          {comp.industry}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                      {comp.packageRange}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3.5 text-xs text-muted-foreground">
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Min. CGPA</span>
                      <span className="font-semibold text-foreground">{comp.cgpaCutoff}+</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Hiring Season</span>
                      <span className="font-semibold text-foreground">{comp.hiringSeason}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Key Roles</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.rolesHiring?.slice(0, 2).map((r: string) => (
                        <Badge key={r} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                          {r}
                        </Badge>
                      ))}
                      {comp.rolesHiring?.length > 2 && (
                        <span className="text-[10px] text-muted-foreground self-center">+{comp.rolesHiring.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 pt-0 border-t border-border/40 mt-2 flex items-center justify-between text-xs font-medium text-primary">
                <span>View {comp.selectionRounds?.length || 0} Selection Rounds</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Recruitment Breakdown Modal */}
      <Dialog open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border-border">
          {selectedCompany && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center p-2 border border-border shrink-0">
                    {selectedCompany.logo ? (
                      <img src={selectedCompany.logo} alt={selectedCompany.name} className="h-full w-full object-contain" />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">{selectedCompany.name} - Placement Blueprint</DialogTitle>
                    <p className="text-xs text-muted-foreground">{selectedCompany.industry} • {selectedCompany.headquarters}</p>
                  </div>
                  <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-bold">
                    {selectedCompany.packageRange}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Eligibility & Branches */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-muted/40 border border-border text-xs">
                <div>
                  <span className="font-semibold text-foreground block">Cutoff Requirement</span>
                  <span className="text-muted-foreground">{selectedCompany.cgpaCutoff} CGPA or above</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Eligible Branches</span>
                  <span className="text-muted-foreground">{selectedCompany.eligibleBranches?.join(", ")}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Alumni Placed</span>
                  <span className="text-muted-foreground">{selectedCompany.alumniHiredCount}+ Verified Placements</span>
                </div>
              </div>

              {/* Selection Rounds Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Hiring Rounds Breakdown ({selectedCompany.selectionRounds?.length} Stages)
                </h3>

                <div className="space-y-3">
                  {selectedCompany.selectionRounds?.map((round: any) => (
                    <div key={round.roundNumber} className="p-3.5 rounded-lg border border-border bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                            {round.roundNumber}
                          </span>
                          <span className="text-sm font-bold text-foreground">{round.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{round.duration}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                        {round.description}
                      </p>
                      {round.focusTopics?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-8 pt-1">
                          {round.focusTopics.map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Past Interview Questions */}
              {selectedCompany.pastQuestions?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                    Actual Interview Questions Asked
                  </h3>

                  <div className="space-y-2">
                    {selectedCompany.pastQuestions.map((q: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg border border-border bg-muted/20 text-xs space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="text-[10px] font-medium">{q.round}</Badge>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground">{q.topic}</span>
                            <Badge className={`text-[9px] ${q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-500' : q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                              {q.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="font-semibold text-foreground pt-1">"{q.question}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Advice */}
              {selectedCompany.prepTips?.length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2 text-xs">
                  <h4 className="font-bold text-primary flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Placement Cell Tips for {selectedCompany.name}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedCompany.prepTips.map((tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
