import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Heart, 
  Eye, 
  PlusCircle, 
  Loader2, 
  Video, 
  X,
  FileVideo,
  Share2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Interview Tips", "Resume tips", "Coding preparation", "Communication tips", "Placement experience", "Career guidance"];

export default function Videos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Video publishing state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Interview Tips");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  // Play video state
  const [activePlayVideo, setActivePlayVideo] = useState<any>(null);

  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      const categoryQuery = activeCategory === "All" ? undefined : activeCategory;
      const data = await api.videos.get(categoryQuery);
      setVideos(data);
    } catch (e) {
      console.error("Error loading career videos:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchVideos();
  }, [activeCategory]);

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newVideoUrl) return;

    setIsSubmitting(true);
    try {
      const finalThumb = newThumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60";
      
      await api.videos.create({
        title: newTitle,
        category: newCategory,
        videoUrl: newVideoUrl,
        thumbnailUrl: finalThumb
      });

      setNewTitle("");
      setNewVideoUrl("");
      setNewThumbnailUrl("");
      setIsPublishOpen(false);
      toast({ title: "Video Shared!", description: "Your placement prep video card is live." });
      fetchVideos();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not publish video.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent opening play dialog
    try {
      const res = await api.videos.like(id);
      setVideos(prev => 
        prev.map(v => v._id === id ? { ...v, likes: res.likes } : v)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlayVideo = async (video: any) => {
    setActivePlayVideo(video);
    try {
      // Increment view count on backend
      const res = await api.videos.view(video._id);
      setVideos(prev => 
        prev.map(v => v._id === video._id ? { ...v, views: res.views } : v)
      );
    } catch (e) {
      console.error("Error logging video view:", e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and publisher */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Video Learning Gallery</h1>
          <p className="text-sm text-muted-foreground">Watch short vlogs, tips, and placement reviews shared by college seniors.</p>
        </div>

        <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
          <DialogTrigger asChild>
            <Button className="glow-primary gap-1.5 h-10">
              <PlusCircle className="h-4 w-4" /> Share Video Card
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-border/50">
            <DialogHeader>
              <DialogTitle>Share Video Insights</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="vid-title">Video Title</Label>
                <Input id="vid-title" placeholder="e.g. 3 Tips to pass technical coding rounds" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vid-cat">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger id="vid-cat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interview Tips">Interview Tips</SelectItem>
                    <SelectItem value="Resume tips">Resume tips</SelectItem>
                    <SelectItem value="Coding preparation">Coding preparation</SelectItem>
                    <SelectItem value="Communication tips">Communication tips</SelectItem>
                    <SelectItem value="Placement experience">Placement experience</SelectItem>
                    <SelectItem value="Career guidance">Career guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vid-url">Video Source URL (MP4 / Web Link)</Label>
                <Input id="vid-url" placeholder="https://www.w3schools.com/html/mov_bbb.mp4" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vid-thumb">Cover Thumbnail Image URL (Optional)</Label>
                <Input id="vid-thumb" placeholder="https://images.unsplash.com/photo-..." value={newThumbnailUrl} onChange={e => setNewThumbnailUrl(e.target.value)} />
              </div>
              <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Video Link"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none shrink-0">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "secondary"}
            onClick={() => setActiveCategory(cat)}
            className="cursor-pointer text-[10px] py-1.5 px-3 border border-border/30 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Videos layout grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Buffering clips...</p>
        </div>
      ) : videos.length === 0 ? (
        <Card className="glass-card text-center py-20 text-muted-foreground">
          <CardContent className="space-y-2">
            <Video className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-xs">No videos matching category '{activeCategory}' yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const liked = user ? vid.likes?.includes(user.id) : false;

            return (
              <motion.div
                key={vid._id}
                whileHover={{ y: -4 }}
                className="cursor-pointer rounded-xl overflow-hidden border border-border/40 bg-card group shadow-md"
                onClick={() => handlePlayVideo(vid)}
              >
                {/* Cover with Play hover overlay */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <div className="h-10 w-10 rounded-full bg-primary/95 flex items-center justify-center text-primary-foreground shadow">
                      <Play className="h-5 w-5 fill-primary-foreground ml-0.5" />
                    </div>
                  </div>
                  <Badge className="absolute bottom-2 right-2 text-[9px] font-bold bg-black/80">{vid.category}</Badge>
                </div>

                <div className="p-4 space-y-2.5">
                  <h3 className="text-xs font-bold text-foreground line-clamp-2">{vid.title}</h3>
                  
                  {/* Creator details */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/10">
                    <img className="h-5 w-5 rounded-full" src={vid.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(vid.creatorName)}`} />
                    <div className="min-w-0 text-[10px]">
                      <p className="font-semibold text-foreground truncate">{vid.creatorName}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{vid.creatorCollege}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/20 border-t border-border/10 flex justify-between items-center text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {vid.views}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {vid.likes?.length || 0}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => handleLike(e, vid._id)}
                    className="h-6 w-6"
                  >
                    <Heart className={`h-3.5 w-3.5 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full screen Video Player Dialog */}
      <Dialog open={!!activePlayVideo} onOpenChange={(isOpen) => !isOpen && setActivePlayVideo(null)}>
        <DialogContent className="max-w-2xl bg-black border-none p-0 overflow-hidden flex flex-col justify-center items-center relative aspect-video">
          {activePlayVideo && (
            <video 
              src={activePlayVideo.videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
