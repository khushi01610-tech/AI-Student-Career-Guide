import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Star, 
  Calendar, 
  Coffee, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DOMAINS = ["All", "Software Engineering", "Product Management", "Data Science", "Consulting", "System Design"];

export default function Mentorship() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState("All");
  
  // Booking Dialog State
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [topic, setTopic] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const { toast } = useToast();

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      const data = await api.mentors.get({
        domain: activeDomain !== "All" ? activeDomain : undefined
      });
      setMentors(data);
    } catch (e) {
      console.error("Error loading mentors:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [activeDomain]);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast({ title: "Select a Time Slot", description: "Please choose an available slot.", variant: "destructive" });
      return;
    }

    setIsBooking(true);
    try {
      const res = await api.mentors.book(selectedMentor._id, {
        slotDate: selectedSlot,
        topic: topic || "1:1 Career Strategy & Resume Review"
      });

      toast({
        title: "Session Confirmed! ☕",
        description: `Your 1:1 session with ${selectedMentor.name} is booked for ${selectedSlot}.`
      });

      setSelectedMentor(null);
      setSelectedSlot("");
      setTopic("");
      fetchMentors();
    } catch (e: any) {
      toast({ title: "Booking Failed", description: e.message || "Could not book session", variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coffee className="h-5 w-5 text-amber-500" />
            <h1 className="text-2xl font-bold text-foreground">Alumni & Senior Mentorship Hub</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect for 1-on-1 coffee chats, resume critiques, and interview preparation with verified alumni working in top companies.
          </p>
        </div>
      </div>

      {/* Domain Filter Badges */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DOMAINS.map((dom) => (
          <Badge
            key={dom}
            variant={activeDomain === dom ? "default" : "secondary"}
            onClick={() => setActiveDomain(dom)}
            className="cursor-pointer text-xs py-1.5 px-3 transition-colors shrink-0"
          >
            {dom}
          </Badge>
        ))}
      </div>

      {/* Mentors Grid */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading verified alumni mentors...</p>
        </div>
      ) : mentors.length === 0 ? (
        <Card className="text-center py-20 bg-card border-border">
          <CardContent className="space-y-2">
            <Users className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold">No mentors found for this domain</p>
            <p className="text-xs text-muted-foreground">Try selecting "All" to browse all available alumni.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mentors.map((mentor) => (
            <Card key={mentor._id} className="bg-card border-border flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start gap-3.5">
                  <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-border shrink-0 bg-muted">
                    <img src={mentor.avatarUrl} alt={mentor.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base font-bold text-foreground truncate">{mentor.name}</CardTitle>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{mentor.rating}</span>
                        <span className="text-muted-foreground font-normal text-[11px]">({mentor.reviewsCount})</span>
                      </div>
                    </div>
                    
                    <p className="text-xs font-semibold text-primary flex items-center gap-1 mt-0.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      {mentor.currentRole} @ {mentor.currentCompany}
                    </p>
                    
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {mentor.college} • Class of {mentor.graduationYear}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-1 space-y-3 flex-1 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.domains?.map((d: string) => (
                    <Badge key={d} variant="secondary" className="text-[10px] font-normal">
                      {d}
                    </Badge>
                  ))}
                </div>

                {mentor.availableSlots?.length > 0 && (
                  <div className="p-2.5 rounded-md bg-muted/40 border border-border/80 text-[11px] space-y-1">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" /> Next Available Slots:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {mentor.availableSlots.slice(0, 3).map((slot: string) => (
                        <span key={slot} className="bg-background px-2 py-0.5 rounded border border-border text-[10px] text-muted-foreground font-medium">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-3">
                {mentor.linkedinUrl && (
                  <a href={mentor.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> LinkedIn Profile
                  </a>
                )}
                
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setSelectedSlot(mentor.availableSlots?.[0] || "");
                  }}
                  disabled={!mentor.availableSlots || mentor.availableSlots.length === 0}
                  className="ml-auto text-xs h-8 px-4"
                >
                  <Coffee className="h-3.5 w-3.5 mr-1.5" />
                  {mentor.availableSlots?.length ? "Book 1:1 Coffee Chat" : "Fully Booked"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
        <DialogContent className="max-w-md bg-card border-border text-xs">
          {selectedMentor && (
            <form onSubmit={handleBookSession} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-amber-500" />
                  Schedule 1:1 with {selectedMentor.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedMentor.currentRole} at {selectedMentor.currentCompany} ({selectedMentor.college} ' {selectedMentor.graduationYear})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Select Available Slot</Label>
                <div className="space-y-1.5">
                  {selectedMentor.availableSlots?.map((slot: string) => (
                    <div 
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-colors ${selectedSlot === slot ? "border-primary bg-primary/10 font-bold text-primary" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"}`}
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" /> {slot}
                      </span>
                      {selectedSlot === slot && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="topic" className="text-xs font-semibold">Session Topic / Notes</Label>
                <Input 
                  id="topic"
                  placeholder="e.g. Software Engineering resume review & DSA interview strategy"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
                <p>💡 <strong>Meeting Details:</strong> 30-minute virtual session conducted via Google Meet. A calendar invite with the meeting room link will be generated upon booking.</p>
              </div>

              <Button type="submit" className="w-full h-9" disabled={isBooking || !selectedSlot}>
                {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm 1:1 Booking"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
