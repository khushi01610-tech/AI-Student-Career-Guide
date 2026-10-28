import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Loader2, GraduationCap, CheckCircle2, Building2, Code2, Radio } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/profile": "Student Profile & Portfolio",
  "/resume": "Resume Studio & ATS Audit",
  "/recommendations": "Career Recommendations & Skill Gaps",
  "/roadmap": "Curated Career Roadmaps",
  "/interview": "Technical & HR Interview Questions",
  "/mock-interview": "AI Mock Interview System",
  "/communication": "Communication Coach",
  "/jobs": "Live Placement Jobs",
  "/applications": "Application Tracker",
  "/chat": "AI Career Coach",
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.notifications.get();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const markAllRead = async () => {
    setIsLoading(true);
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const currentTitle = PAGE_TITLES[location.pathname] || "Placement Engine";
  const degree = user?.degree || "CSE";
  const isBJMC = degree === "BJMC";

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const clean = name.trim().replace(/[^a-zA-Z\s]/g, "");
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase() || "ST";
  };

  const userInitials = getInitials(user?.name || "Student");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground transition-colors">
        {isAuthenticated && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          
          {isAuthenticated && (
            <header className="h-14 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <h1 className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight truncate font-heading">
                    {currentTitle}
                  </h1>
                  {isBJMC ? (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] h-5 px-2 font-bold rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Radio className="h-3 w-3" /> BJMC Media
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] h-5 px-2 font-bold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      <Code2 className="h-3 w-3" /> B.Tech CSE
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* College Affiliation Badge */}
                {user?.college && (
                  <div 
                    onClick={() => navigate("/profile")}
                    className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/80 text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate max-w-[200px]">{user.college}</span>
                  </div>
                )}

                {/* Notifications Center */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[9px] bg-primary text-primary-foreground font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-2 bg-card border border-border shadow-lg">
                    <div className="flex items-center justify-between border-b border-border pb-2 mb-2 px-1">
                      <span className="text-xs font-bold text-foreground font-heading">Placement Notifications</span>
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllRead} 
                          disabled={isLoading}
                          className="h-6 text-[10px] text-primary hover:underline hover:bg-transparent p-0"
                        >
                          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark all as read"}
                        </Button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6">
                          <CheckCircle2 className="h-6 w-6 text-muted-foreground/40 mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">You are all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n._id} 
                            onClick={() => !n.isRead && markSingleRead(n._id)}
                            className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all border ${
                              n.isRead 
                                ? "bg-card border-border/40 text-muted-foreground" 
                                : "bg-primary/5 border-primary/20 text-foreground font-medium"
                            }`}
                          >
                            <p className="text-xs font-semibold leading-snug">{n.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-muted-foreground/60 mt-1">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Monogram Avatar */}
                <div 
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer transition-transform hover:scale-105 shrink-0"
                  title="View Student Profile"
                >
                  {profile?.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover border border-border" 
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                      {userInitials}
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          {!isAuthenticated && (
            <header className="h-16 flex items-center justify-between border-b border-border px-4 md:px-8 bg-card/90 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground tracking-tight block font-heading">AI Student Career Guide</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">Campus Placement Portal</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-xs font-semibold">
                  Home
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="text-xs font-semibold">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold shadow-sm">
                  Get Started
                </Button>
              </div>
            </header>
          )}

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
