import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Bookmark, 
  Award, 
  Sparkles, 
  Loader2, 
  FileText, 
  TrendingUp, 
  ShieldAlert, 
  UserCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Placement Preparation", "Interview Tips", "Resume Guidance", "Communication Skills", "Coding Tips", "Soft Skills", "Career Awareness"];

const categoryIcons: Record<string, any> = {
  "Placement Preparation": Award,
  "Interview Tips": Sparkles,
  "Resume Guidance": FileText,
  "Communication Skills": UserCheck,
  "Coding Tips": TrendingUp,
  "Soft Skills": ShieldAlert,
  "Career Awareness": BookOpen
};

export default function CareerHub() {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHubResources = async () => {
    try {
      const categoryQuery = activeCategory === "All" ? undefined : activeCategory;
      const data = await api.posts.get({ category: categoryQuery, isHubResource: true });
      setResources(data);
    } catch (e) {
      console.error("Error fetching Career Hub resources:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchHubResources();
  }, [activeCategory]);

  const handleSave = async (resourceId: string) => {
    try {
      const res = await api.posts.save(resourceId);
      setResources(prev => 
        prev.map(r => r._id === resourceId ? { ...r, savedBy: res.savedBy } : r)
      );
      toast({
        title: res.saved ? "Saved to Bookmarks" : "Removed Bookmark",
        description: res.saved ? "Access this resource on your profile later." : "Resource unsaved."
      });
    } catch (e) {
      console.error("Error saving resource:", e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Career Hub</h1>
        <p className="text-sm text-muted-foreground">Expert guides, placement checklists, coding cheat sheets, and infographics.</p>
      </div>

      {/* Categories Horizontal Scroll */}
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

      {/* Resources feed */}
      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading study guides...</p>
        </div>
      ) : resources.length === 0 ? (
        <Card className="glass-card text-center py-20 text-muted-foreground">
          <CardContent className="space-y-2">
            <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-xs">No resources published under category '{activeCategory}' yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {resources.map((resItem) => {
              const saved = user ? resItem.savedBy?.includes(user.id) : false;
              const IconComponent = categoryIcons[resItem.category] || BookOpen;

              return (
                <motion.div
                  key={resItem._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass-card overflow-hidden">
                    <CardHeader className="p-4 border-b border-border/10 flex flex-row items-center gap-3 py-3 bg-muted/15">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <CardTitle className="text-xs font-bold text-foreground uppercase">{resItem.category}</CardTitle>
                        <CardDescription className="text-[9px]">Verified AI Student Career Guide Coach Guide</CardDescription>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleSave(resItem._id)}
                        className={`ml-auto h-8 w-8 hover:bg-transparent ${saved ? "text-accent" : "text-muted-foreground"}`}
                      >
                        <Bookmark className={`h-4 w-4 ${saved ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      </Button>
                    </CardHeader>
                    
                    <CardContent className="p-6 text-xs text-foreground leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                      {resItem.content}
                    </CardContent>
                    
                    <CardFooter className="p-3 border-t border-border/10 flex flex-wrap gap-1.5 justify-start bg-muted/5">
                      {resItem.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[9px] border-border">{tag}</Badge>
                      ))}
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
