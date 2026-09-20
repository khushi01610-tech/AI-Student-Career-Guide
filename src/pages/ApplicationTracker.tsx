import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  PlusCircle, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  MapPin,
  DollarSign,
  Layers,
  ListFilter
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const STAGES = [
  "Wishlist",
  "Applied",
  "Online Assessment",
  "Technical Interview",
  "Final Round",
  "Offer Received",
  "Rejected"
];

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // New Application Form State
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [location, setLocation] = useState("Hybrid");
  const [ctc, setCtc] = useState("");
  const [stage, setStage] = useState("Applied");
  const [deadline, setDeadline] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");

  const { toast } = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await api.applications.get();
      setApplications(data);
    } catch (e) {
      console.error("Error fetching applications:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !role) return;

    setIsSubmitting(true);
    try {
      await api.applications.create({
        companyName,
        role,
        jobType,
        location,
        ctc,
        stage,
        deadline: deadline || undefined,
        jobUrl,
        notes
      });

      toast({ title: "Application Added", description: `Added ${companyName} (${role}) to your tracker.` });
      setCompanyName("");
      setRole("");
      setCtc("");
      setDeadline("");
      setJobUrl("");
      setNotes("");
      setIsDialogOpen(false);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not save application", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageChange = async (id: string, newStage: string) => {
    try {
      await api.applications.update(id, { stage: newStage });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, stage: newStage } : a));
      toast({ title: "Stage Updated", description: `Application moved to ${newStage}.` });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.applications.delete(id);
      setApplications(prev => prev.filter(a => a._id !== id));
      toast({ title: "Deleted", description: "Application removed from your tracker." });
    } catch (e) {
      console.error(e);
    }
  };

  const getStageColor = (st: string) => {
    switch(st) {
      case "Offer Received": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Rejected": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Final Round":
      case "Technical Interview": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Online Assessment": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default: return "bg-secondary text-secondary-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Placement & Internship Application Tracker</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor active applications across recruitment stages from initial submission to final offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted p-1 rounded-lg border border-border">
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="text-xs h-7 px-2.5 font-medium"
            >
              <Layers className="h-3.5 w-3.5 mr-1" /> Kanban
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="text-xs h-7 px-2.5 font-medium"
            >
              <ListFilter className="h-3.5 w-3.5 mr-1" /> Table
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 h-9 text-xs font-semibold">
                <PlusCircle className="h-4 w-4" /> Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border">
              <DialogHeader>
                <DialogTitle>Log Placement Application</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" placeholder="e.g. Microsoft" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="role">Target Role</Label>
                    <Input id="role" placeholder="e.g. Software Engineer Intern" value={role} onChange={e => setRole(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Job Type</Label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-Time">Full-Time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ctc">Package / Stipend</Label>
                    <Input id="ctc" placeholder="e.g. 18 LPA" value={ctc} onChange={e => setCtc(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="deadline">Next Deadline / Date</Label>
                    <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Bengaluru / Remote" value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="jobUrl">Application Link / Portal URL</Label>
                  <Input id="jobUrl" placeholder="https://careers.company.com/..." value={jobUrl} onChange={e => setJobUrl(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes & Referral Info</Label>
                  <Textarea id="notes" rows={2} placeholder="Referred by college senior Rohan. Focus on Tree algorithms." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save to Tracker"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Total Applied</span>
          <span className="text-xl font-bold text-foreground">{applications.length}</span>
        </Card>
        <Card className="p-3.5 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Assessments / Mocks</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {applications.filter(a => a.stage === "Online Assessment" || a.stage === "Technical Interview" || a.stage === "Final Round").length}
          </span>
        </Card>
        <Card className="p-3.5 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Offers Secured</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {applications.filter(a => a.stage === "Offer Received").length}
          </span>
        </Card>
        <Card className="p-3.5 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Wishlist</span>
          <span className="text-xl font-bold text-muted-foreground">
            {applications.filter(a => a.stage === "Wishlist").length}
          </span>
        </Card>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading applications pipeline...</p>
        </div>
      ) : applications.length === 0 ? (
        <Card className="text-center py-20 bg-card border-border">
          <CardContent className="space-y-3">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base">No Applications Tracked Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Start tracking on-campus drives, off-campus referrals, and summer internship applications to stay organized.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Log First Application
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "kanban" ? (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {STAGES.filter(s => s !== "Rejected").map((stg) => {
            const stageApps = applications.filter(a => a.stage === stg);

            return (
              <div key={stg} className="bg-muted/30 p-3 rounded-lg border border-border flex flex-col space-y-3 min-w-[260px]">
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <span className="font-bold text-xs text-foreground">{stg}</span>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{stageApps.length}</Badge>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px]">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-muted-foreground border border-dashed border-border/60 rounded-md">
                      Empty
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <Card key={app._id} className="p-3 bg-card border-border space-y-2 shadow-sm">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-xs text-foreground">{app.companyName}</h4>
                            <p className="text-[11px] text-muted-foreground">{app.role}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(app._id)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {app.ctc && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                            💰 {app.ctc}
                          </span>
                        )}

                        {app.deadline && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(app.deadline).toLocaleDateString()}
                          </span>
                        )}

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-1">
                          <Select 
                            value={app.stage} 
                            onValueChange={(val) => handleStageChange(app._id, val)}
                          >
                            <SelectTrigger className="h-6 text-[10px] px-1.5 border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STAGES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          
                          {app.jobUrl && (
                            <a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary p-1">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground">{app.companyName}</td>
                    <td className="p-3 text-muted-foreground">{app.role}</td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px]">{app.jobType}</Badge></td>
                    <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{app.ctc || "—"}</td>
                    <td className="p-3">
                      <Select value={app.stage} onValueChange={(val) => handleStageChange(app._id, val)}>
                        <SelectTrigger className={`h-7 text-xs w-36 ${getStageColor(app.stage)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {app.deadline ? new Date(app.deadline).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(app._id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
