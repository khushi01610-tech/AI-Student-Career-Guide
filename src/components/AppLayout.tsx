import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Loader2, GraduationCap, CheckCircle2 } from "lucide-react";
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

  const currentTitle = PAGE_TITLES[location.pathname] || "AI Career Guide";
  const degree = user?.degree || "CSE";
  const isBJMC = degree === "BJMC";
  const userAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Student")}`;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/60 dark:bg-slate-950 text-foreground transition-colors">
        {isAuthenticated && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          
          {isAuthenticated && (
            <header className="h-14 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-4 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <h1 className="text-xs sm:text-sm font-bold text-foreground tracking-tight truncate">
                    {currentTitle}
                  </h1>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] h-5 px-2 font-mono font-bold hidden md:inline-flex border-primary/30 text-primary bg-primary/5"
                  >
                    {isBJMC ? "BJMC • Media & Comm" : "CSE • Computer Science"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Degree Switch Link */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5 px-2"
                >
                  <span className="text-[11px] font-medium">{user?.college || "Placement Portal"}</span>
                </Button>

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
                      <span className="text-xs font-bold text-foreground">Placement Notifications</span>
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
                                ? "text-muted-foreground hover:bg-muted/40 border-transparent" 
                                : "bg-primary/5 text-foreground hover:bg-primary/10 border-primary/20 font-medium"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="flex-1 leading-snug">{n.content}</p>
                              {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />}
                            </div>
                            <p className="text-[9px] text-muted-foreground/60 mt-1">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Avatar trigger */}
                <div 
                  onClick={() => navigate("/profile")}
                  className="h-8 w-8 rounded-full overflow-hidden border border-border cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all shrink-0 bg-muted"
                  title="View Profile"
                >
                  <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
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
                  <span className="font-bold text-sm text-foreground tracking-tight block">AI Career Growth Engine</span>
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
                <Button size="sm" onClick={() => navigate("/register")} className="text-xs font-semibold">
                  Get Started
                </Button>
              </div>
            </header>
          )}

          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
