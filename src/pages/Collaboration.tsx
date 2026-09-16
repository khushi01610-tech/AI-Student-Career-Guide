import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Presentation, 
  Calendar, 
  Clock, 
  PlusCircle, 
  Loader2, 
  Users, 
  Video, 
  Link as LinkIcon,
  CheckCircle,
  HelpCircle,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function Collaboration() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Session scheduling form state
  const [role, setRole] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("2");
  const [meetingLink, setMeetingLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Peer feedback ratings form
  const [ratingSessionId, setRatingSessionId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const data = await api.collaboration.getSessions();
      setSessions(data);
    } catch (e) {
      console.error("Error loading collab sessions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !dateTime || !meetingLink) return;

    setIsSubmitting(true);
    try {
      await api.collaboration.createSession({
        role,
        dateTime,
        maxParticipants: Number(maxParticipants),
        meetingLink
      });

      setRole("");
      setDateTime("");
      setMeetingLink("");
      setIsDialogOpen(false);
      toast({ title: "Session Created!", description: "Your mock interview panel is scheduled." });
      fetchSessions();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not schedule session.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      await api.collaboration.joinSession(sessionId);
      toast({ title: "Joined!", description: "You are added to the mock panel. Copy the meeting link." });
      fetchSessions();
    } catch (e: any) {
      toast({ title: "Join Failed", description: e.message || "Failed to join session.", variant: "destructive" });
    }
  };

  const handleLeaveSession = async (sessionId: string) => {
    try {
      await api.collaboration.leaveSession(sessionId);
      toast({ title: "Left Session", description: "You removed yourself from the mock panel." });
      fetchSessions();
    } catch (e: any) {
      toast({ title: "Operation Failed", description: e.message || "Error leaving session.", variant: "destructive" });
    }
  };

  const submitPeerFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Feedback Saved! ⭐", description: "Thanks for rating your peer collaboration mock interview." });
    setRatingSessionId(null);
    setFeedbackText("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and create panel */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Peer Collaboration</h1>
          <p className="text-sm text-muted-foreground">Schedule or join peer mock interview panels to practice live talking with other students.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-primary gap-1.5 h-10">
              <PlusCircle className="h-4 w-4" /> Schedule Mock Panel
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-border/50">
            <DialogHeader>
              <DialogTitle>Schedule Live Peer Interview</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="collab-role">Target Interview Role</Label>
                <Input id="collab-role" placeholder="e.g. Frontend Developer Peer Mock" value={role} onChange={e => setRole(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="collab-date">Date & Time</Label>
                <Input id="collab-date" type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="collab-max">Max Participants (1-5)</Label>
                <Input id="collab-max" type="number" min="1" max="5" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="collab-link">Google Meet / Zoom URL</Label>
                <Input id="collab-link" placeholder="https://meet.google.com/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Panel"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions board */}
      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Compiling upcoming panels...</p>
        </div>
      ) : sessions.length === 0 ? (
        <Card className="glass-card text-center py-20 text-muted-foreground">
          <CardContent className="space-y-2">
            <Presentation className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-xs">No peer interview sessions active right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const isCreator = user ? session.creator === user.id : false;
            const joined = user ? session.participants?.includes(user.id) : false;
            const spotsRemaining = Math.max(0, session.maxParticipants - (session.participants?.length || 0));

            return (
              <Card key={session._id} className="glass-card flex flex-col border border-border/45">
                <CardHeader className="p-4 border-b border-border/10 bg-muted/15 flex flex-row items-center gap-3 py-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border">
                    <img src={session.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.creatorName)}`} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-xs font-bold text-foreground truncate">{session.creatorName}</CardTitle>
                    <CardDescription className="text-[9px] truncate">{session.creatorCollege}</CardDescription>
                  </div>
                  
                  {isCreator ? (
                    <Badge className="ml-auto text-[9px] bg-primary">My Session</Badge>
                  ) : joined ? (
                    <Badge className="ml-auto text-[9px] bg-accent">Member</Badge>
                  ) : spotsRemaining === 0 ? (
                    <Badge className="ml-auto text-[9px]" variant="destructive">Full</Badge>
                  ) : (
                    <Badge className="ml-auto text-[9px] bg-green-500/80">Active Spots</Badge>
                  )}
                </CardHeader>

                <CardContent className="p-5 flex-1 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{session.role}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-muted-foreground border-b border-border/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span>{new Date(session.dateTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span>{new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span>{session.participants?.length || 0} / {session.maxParticipants} Members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Video className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">Remote Room</span>
                    </div>
                  </div>

                  {(joined || isCreator) && (
                    <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <LinkIcon className="h-4 w-4 text-primary shrink-0" />
                        <a 
                          href={session.meetingLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-semibold text-primary truncate hover:underline text-xs"
                        >
                          {session.meetingLink}
                        </a>
                      </div>
                      <Badge className="bg-primary text-[9px] shrink-0">Meeting Link</Badge>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-3 border-t border-border/10 bg-muted/5 flex justify-between gap-2">
                  <div className="flex gap-2 w-full">
                    {isCreator ? (
                      <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                        Hosting
                      </Button>
                    ) : joined ? (
                      <>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleLeaveSession(session._id)}
                          className="w-1/2 text-xs"
                        >
                          Leave Panel
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setRatingSessionId(session._id)}
                          className="w-1/2 text-xs gap-1 border-accent/30 text-accent hover:bg-accent/5"
                        >
                          <Star className="h-3.5 w-3.5 fill-accent" /> Rate Partner
                        </Button>
                      </>
                    ) : (
                      <Button 
                        disabled={spotsRemaining === 0} 
                        onClick={() => handleJoinSession(session._id)}
                        className="w-full text-xs glow-primary"
                      >
                        Join Mock Panel
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Peer Feedback Modal */}
      <Dialog open={!!ratingSessionId} onOpenChange={(isOpen) => !isOpen && setRatingSessionId(null)}>
        <DialogContent className="bg-card border border-border/50">
          <DialogHeader>
            <DialogTitle>Peer Mock Rating Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitPeerFeedback} className="space-y-4">
            <div className="space-y-2">
              <Label>Partner Communication & Performance</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    onClick={() => setRatingStars(star)}
                    className={`h-6 w-6 cursor-pointer hover:scale-115 transition-transform ${star <= ratingStars ? "fill-accent text-accent" : "text-muted-foreground"}`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="rating-desc">Feedback Comments</Label>
              <Input 
                id="rating-desc" 
                placeholder="Grammar correctness, algorithm skills, clarity of STAR descriptions..." 
                value={feedbackText} 
                onChange={e => setFeedbackText(e.target.value)} 
                required 
              />
            </div>

            <Button type="submit" className="w-full mt-2 glow-accent">
              Submit Review
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
