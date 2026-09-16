import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  BookOpen, 
  Award, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Loader2, 
  CheckCircle,
  FileText,
  Mail,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("portfolio");
  const { toast } = useToast();

  // Editing credentials state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Projects CRUD state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // Achievements state
  const [newAchievement, setNewAchievement] = useState("");
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);

  // User posts lists state
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarUrl || "");
    }
    if (user) {
      setCareerGoal(user.careerGoal || "");
      setSkills(user.skills?.join(", ") || "");
    }
    
    // Load student community contributions & bookmarks
    const loadUserPosts = async () => {
      if (!user) return;
      setIsPostsLoading(true);
      try {
        const allPosts = await api.posts.get({ isHubResource: false });
        const allHub = await api.posts.get({ isHubResource: true });
        const consolidated = [...allPosts, ...allHub];
        
        setMyPosts(consolidated.filter(p => p.author === user.id));
        setSavedPosts(consolidated.filter(p => p.savedBy?.includes(user.id)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsPostsLoading(false);
      }
    };
    loadUserPosts();
  }, [user, profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.profile.update({
        bio,
        careerGoal,
        skills: skills.split(",").map(s => s.trim()),
        avatarUrl
      });
      await refreshProfile();
      setIsEditingProfile(false);
      toast({ title: "Profile Updated!", description: "Your student details have been saved." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not update credentials.", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDesc) return;
    setIsAddingProject(true);

    try {
      const currentProjects = profile?.projects || [];
      const newProj = {
        title: projectTitle,
        description: projectDesc,
        technologies: projectTech.split(",").map(t => t.trim()),
        link: projectLink || undefined
      };

      await api.profile.update({
        projects: [...currentProjects, newProj]
      });
      
      await refreshProfile();
      setProjectTitle("");
      setProjectDesc("");
      setProjectTech("");
      setProjectLink("");
      setIsProjectDialogOpen(false);
      toast({ title: "Project Added!", description: "Included project card in portfolio." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not add project.", variant: "destructive" });
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = async (projIdx: number) => {
    const currentProjects = profile?.projects || [];
    const updated = [...currentProjects];
    updated.splice(projIdx, 1);

    try {
      await api.profile.update({ projects: updated });
      await refreshProfile();
      toast({ title: "Project Removed", description: "Portfolio card deleted." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Error deleting project.", variant: "destructive" });
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.trim()) return;
    setIsAddingAchievement(true);

    try {
      const list = profile?.achievements || [];
      await api.profile.update({
        achievements: [...list, newAchievement]
      });

      await refreshProfile();
      setNewAchievement("");
      toast({ title: "Achievement Added!", description: "Portfolio achievements updated." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not save achievement.", variant: "destructive" });
    } finally {
      setIsAddingAchievement(false);
    }
  };

  const handleDeleteAchievement = async (achIdx: number) => {
    const currentList = profile?.achievements || [];
    const updated = [...currentList];
    updated.splice(achIdx, 1);

    try {
      await api.profile.update({ achievements: updated });
      await refreshProfile();
      toast({ title: "Achievement Deleted", description: "Removed from accomplishments list." });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Error deleting achievement.", variant: "destructive" });
    }
  };

  const displayAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Student")}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upper Cover and details */}
      <Card className="glass-card overflow-hidden relative border-border/40">
        <div className="h-28 bg-gradient-to-r from-primary/30 to-accent/30 relative" />
        <CardContent className="p-6 pt-0 relative z-10 flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12 border-b border-border/10 pb-6">
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-card bg-card shadow-lg shrink-0">
            <img src={displayAvatar} alt={user?.name} className="h-full w-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <GraduationCap className="h-4 w-4" /> {user?.course} in {user?.branch} • {user?.college}
                </p>
              </div>
              
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border border-border/50">
                  <DialogHeader>
                    <DialogTitle>Edit Profile Details</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-bio">Short Biography</Label>
                      <Textarea id="edit-bio" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Aspiring Full Stack Engineer at Stanford..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-goal">Target Career Goal</Label>
                      <Input id="edit-goal" value={careerGoal} onChange={e => setRole(e.target.value)} placeholder="e.g. Frontend Developer" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-skills">Skills (Comma-separated)</Label>
                      <Input id="edit-skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, TS" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-avatar">Avatar Seed/URL</Label>
                      <Input id="edit-avatar" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="DICE image link or username seed" />
                    </div>
                    <Button type="submit" className="w-full gap-1.5" disabled={isSavingProfile}>
                      {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
        
        {/* Core Stats Overview block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 text-center p-3 divide-y-0 divide-x border-t divide-border/20 text-xs text-muted-foreground bg-muted/10">
          <div>
            <span className="block font-bold text-foreground text-sm">{profile?.resumeScore || 0}%</span>
            <span>Resume Scan</span>
          </div>
          <div>
            <span className="block font-bold text-foreground text-sm">{profile?.interviewScore || 0}%</span>
            <span>Mock Marks</span>
          </div>
          <div>
            <span className="block font-bold text-foreground text-sm">{profile?.communicationScore || 0}%</span>
            <span>Speaking Score</span>
          </div>
          <div>
            <span className="block font-bold text-foreground text-sm">{profile?.communityContributions || 0}</span>
            <span>Contributions</span>
          </div>
        </div>
      </Card>

      {/* Profile Sections tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="max-w-md grid grid-cols-3 mb-6 bg-card border border-border/30">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="saved">Bookmarks</TabsTrigger>
        </TabsList>

        {/* Tab 1: Portfolio (Projects + Achievements) */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Projects list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-4.5 w-4.5 text-primary" /> Key Code Projects
                </h2>
                
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="xs" variant="outline" className="gap-1 text-[10px] h-7 px-2">
                      <PlusCircle className="h-3.5 w-3.5" /> Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border border-border/50">
                    <DialogHeader>
                      <DialogTitle>Add Project Card</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="proj-title">Project Title</Label>
                        <Input id="proj-title" placeholder="e.g. AI Search Optimizer" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="proj-desc">Description</Label>
                        <Textarea id="proj-desc" rows={3} placeholder="Describe implementation steps and STAR metrics..." value={projectDesc} onChange={e => setProjectDesc(e.target.value)} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="proj-tech">Technologies (Comma-separated)</Label>
                        <Input id="proj-tech" placeholder="Python, ElasticSearch" value={projectTech} onChange={e => setProjectTech(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="proj-link">Deployment/Github URL (Optional)</Label>
                        <Input id="proj-link" placeholder="https://github.com/..." value={projectLink} onChange={e => setProjectLink(e.target.value)} />
                      </div>
                      <Button type="submit" className="w-full gap-1.5" disabled={isAddingProject}>
                        {isAddingProject ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Project"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Projects Display */}
              {(!profile?.projects || profile.projects.length === 0) ? (
                <Card className="glass-card text-center py-10 text-muted-foreground">
                  <CardContent className="text-xs">No project cards added. Include key assignments to boost project score.</CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {profile.projects.map((proj: any, idx: number) => (
                    <Card key={idx} className="glass-card">
                      <CardHeader className="p-4 flex flex-row items-start justify-between gap-3 pb-2">
                        <div>
                          <CardTitle className="text-xs font-bold text-foreground">{proj.title}</CardTitle>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline">{proj.link}</a>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteProject(idx)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground leading-relaxed">
                        <p>{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {proj.technologies?.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-[8px] px-1.5 py-0.5">{tech}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements list */}
            <div>
              <Card className="glass-card h-full">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-bold flex items-center gap-1.5"><Award className="h-4.5 w-4.5 text-accent" /> Accomplishments</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddAchievement} className="flex gap-2">
                    <Input 
                      placeholder="Add certification/award..." 
                      value={newAchievement} 
                      onChange={e => setNewAchievement(e.target.value)}
                      disabled={isAddingAchievement}
                      className="text-xs h-9"
                    />
                    <Button type="submit" size="icon" disabled={isAddingAchievement || !newAchievement.trim()} className="h-9 w-9 shrink-0">
                      {isAddingAchievement ? <Loader2 className="h-3 w-3 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                    </Button>
                  </form>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(!profile?.achievements || profile.achievements.length === 0) ? (
                      <p className="text-center py-6 text-[10px] text-muted-foreground">List Hackathons or certificates.</p>
                    ) : (
                      profile.achievements.map((ach: string, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-border/40 flex justify-between items-center gap-3 bg-muted/15 text-[11px]">
                          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" /> {ach}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteAchievement(idx)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: User Published Posts */}
        <TabsContent value="posts" className="space-y-4">
          {isPostsLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading published feeds...</div>
          ) : myPosts.length === 0 ? (
            <p className="text-center py-12 text-xs text-muted-foreground">You haven't posted any placement tips on the forums yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myPosts.map((post) => (
                <Card key={post._id} className="glass-card">
                  <CardHeader className="p-4 border-b border-border/10 py-2.5 flex flex-row justify-between items-center bg-muted/10">
                    <span className="text-[10px] font-bold text-primary uppercase">{post.tags?.[0] || "General"}</span>
                    <span className="text-[9px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </CardHeader>
                  <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Saved/Bookmarked posts */}
        <TabsContent value="saved" className="space-y-4">
          {isPostsLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading saved guides...</div>
          ) : savedPosts.length === 0 ? (
            <p className="text-center py-12 text-xs text-muted-foreground">No bookmarked threads. Bookmark tips from Career Hub to review them here.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {savedPosts.map((post) => (
                <Card key={post._id} className="glass-card">
                  <CardHeader className="p-4 border-b border-border/10 py-2.5 flex flex-row items-center gap-3 bg-muted/10 justify-between">
                    <div className="min-w-0 text-[10px]">
                      <span className="font-bold text-foreground block">{post.authorName}</span>
                      <span className="text-muted-foreground truncate">{post.authorCollege}</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] uppercase">{post.category || post.tags?.[0] || "Hub"}</Badge>
                  </CardHeader>
                  <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
