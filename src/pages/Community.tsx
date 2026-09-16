import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  PlusCircle, 
  Tag, 
  Send, 
  Loader2,
  Calendar,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const TAGS = ["All", "Interview", "Resume", "Communication", "Coding", "Career", "Projects", "Placement", "General"];

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTag, setActiveTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  // Post Creation state
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Comments state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const tagQuery = activeTag === "All" ? undefined : activeTag;
      const data = await api.posts.get({ tag: tagQuery, isHubResource: false });
      setPosts(data);
    } catch (e) {
      console.error("Error loading community posts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [activeTag]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      const tagArray = newPostTags
        ? newPostTags.split(",").map(t => t.trim())
        : ["General"];

      await api.posts.create({
        content: newPostContent,
        tags: tagArray,
        isHubResource: false
      });

      setNewPostContent("");
      setNewPostTags("");
      setIsDialogOpen(false);
      toast({ title: "Published!", description: "Your community post is live." });
      fetchPosts();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not publish post.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await api.posts.like(postId);
      setPosts(prev => 
        prev.map(p => p._id === postId ? { ...p, likes: res.likes } : p)
      );
    } catch (e) {
      console.error("Error liking post:", e);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      const res = await api.posts.save(postId);
      setPosts(prev => 
        prev.map(p => p._id === postId ? { ...p, savedBy: res.savedBy } : p)
      );
      toast({
        title: res.saved ? "Saved to Bookmarks" : "Removed Bookmark",
        description: res.saved ? "Access this post later from your profile." : "Post removed from saves."
      });
    } catch (e) {
      console.error("Error saving post:", e);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newCommentText.trim()) return;
    setIsCommentSubmitting(true);

    try {
      const updatedComments = await api.posts.comment(postId, newCommentText);
      setPosts(prev => 
        prev.map(p => p._id === postId ? { ...p, comments: updatedComments } : p)
      );
      setNewCommentText("");
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not post comment.", variant: "destructive" });
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const activeCommentPost = posts.find(p => p._id === activeCommentsPostId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and post launcher */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Student Community</h1>
          <p className="text-sm text-muted-foreground">Collaborate and share interview tips across different universities.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-primary gap-1.5 h-10">
              <PlusCircle className="h-4 w-4" /> Share Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-border/50">
            <DialogHeader>
              <DialogTitle>Share Placement Experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="post-content">Post Content</Label>
                <Textarea 
                  id="post-content"
                  rows={4}
                  placeholder="Share details about interview rounds, coding tips, or preparation roadmaps..."
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-tags">Tags (Comma-separated)</Label>
                <Input 
                  id="post-tags"
                  placeholder="e.g. Interview, Coding, Placement"
                  value={newPostTags}
                  onChange={e => setNewPostTags(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter tag chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none shrink-0">
        {TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={activeTag === tag ? "default" : "secondary"}
            onClick={() => setActiveTag(tag)}
            className="cursor-pointer text-[10px] py-1.5 px-3 border border-border/30 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading college feeds...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card className="glass-card text-center py-20 text-muted-foreground">
          <CardContent className="space-y-2">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-xs">No posts matching tag '{activeTag}' yet. Be the first to share one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => {
              const liked = user ? post.likes?.includes(user.id) : false;
              const saved = user ? post.savedBy?.includes(user.id) : false;

              return (
                <motion.div 
                  key={post._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass-card overflow-hidden">
                    <CardHeader className="p-4 flex flex-row items-center gap-3 py-3 border-b border-border/10 bg-muted/10">
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-primary/20 shrink-0">
                        <img 
                          src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.authorName)}`} 
                          alt={post.authorName} 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{post.authorName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{post.authorCollege}</p>
                      </div>
                      <span className="ml-auto text-[9px] text-muted-foreground/60 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </CardHeader>
                    
                    <CardContent className="p-5 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                      {post.content}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/10">
                        {post.tags?.map((t: string) => (
                          <Badge key={t} variant="secondary" className="text-[9px] scale-95 origin-left">
                            <Tag className="h-2.5 w-2.5 mr-0.5" /> {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-3 border-t border-border/10 flex justify-between items-center text-xs bg-muted/5">
                      <div className="flex gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleLike(post._id)}
                          className={`h-8 px-2.5 gap-1.5 hover:bg-transparent text-[11px] ${liked ? "text-primary font-bold" : "text-muted-foreground"}`}
                        >
                          <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                          <span>{post.likes?.length || 0}</span>
                        </Button>

                        {/* Open Comment Dialog Trigger */}
                        <Dialog 
                          open={activeCommentsPostId === post._id} 
                          onOpenChange={(isOpen) => setActiveCommentsPostId(isOpen ? post._id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 px-2.5 gap-1.5 hover:bg-transparent text-muted-foreground text-[11px]"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments?.length || 0}</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-full max-w-lg bg-card border border-border/50 max-h-[80vh] flex flex-col p-4">
                            <DialogHeader className="shrink-0 pb-2 border-b border-border/20">
                              <DialogTitle className="text-sm font-bold">Comments Thread</DialogTitle>
                            </DialogHeader>

                            {/* Comments scroll list */}
                            <div className="flex-1 overflow-y-auto py-3 space-y-3">
                              {activeCommentPost?.comments?.length === 0 ? (
                                <p className="text-center py-8 text-xs text-muted-foreground">No replies yet. Speak up!</p>
                              ) : (
                                activeCommentPost?.comments?.map((comment: any) => (
                                  <div key={comment._id} className="p-2.5 rounded-lg border border-border/40 bg-muted/15 text-xs space-y-1">
                                    <div className="flex items-center gap-2">
                                      <img 
                                        className="h-5 w-5 rounded-full" 
                                        src={comment.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.name)}`} 
                                      />
                                      <span className="font-bold">{comment.name}</span>
                                      <span className="text-[9px] text-muted-foreground truncate font-normal">({comment.college})</span>
                                    </div>
                                    <p className="text-muted-foreground pl-7 leading-relaxed">{comment.content}</p>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Comment post input */}
                            <div className="shrink-0 border-t border-border/20 pt-3 flex gap-2">
                              <Input 
                                placeholder="Write a comment..." 
                                value={newCommentText} 
                                onChange={e => setNewCommentText(e.target.value)} 
                                onKeyDown={e => e.key === "Enter" && handleAddComment(post._id)}
                                disabled={isCommentSubmitting}
                                className="text-xs"
                              />
                              <Button 
                                size="icon"
                                onClick={() => handleAddComment(post._id)} 
                                disabled={isCommentSubmitting || !newCommentText.trim()}
                                className="h-9 w-9 glow-primary shrink-0"
                              >
                                {isCommentSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSave(post._id)}
                        className={`h-8 px-2.5 hover:bg-transparent ${saved ? "text-accent" : "text-muted-foreground"}`}
                      >
                        <Bookmark className={`h-4 w-4 ${saved ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
