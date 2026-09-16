import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Loader2, RefreshCw } from "lucide-react";
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

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
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
      // Poll every 30 seconds for new notifications
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAuthenticated && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Background graphics */}
          <div className="fixed inset-0 mesh-gradient pointer-events-none z-0" />
          
          {isAuthenticated && (
            <header className="h-14 flex items-center border-b border-border/50 px-4 bg-card/60 backdrop-blur-xl sticky top-0 z-20 relative">
              <SidebarTrigger className="mr-4 relative z-10" />
              <motion.h1 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="text-sm font-bold text-foreground relative z-10"
              >
                AI Student Career Guide
              </motion.h1>
              
              <div className="ml-auto flex items-center gap-3 relative z-10">
                {/* Notifications Center */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-muted">
                      <Bell className="h-4 w-4 text-foreground" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[9px] bg-accent text-accent-foreground font-bold">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-2 bg-card/95 border border-border/50 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-2 px-1">
                      <span className="text-xs font-bold text-foreground">Notifications</span>
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllRead} 
                          disabled={isLoading}
                          className="h-7 text-[10px] text-primary hover:underline hover:bg-transparent"
                        >
                          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark all as read"}
                        </Button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-muted-foreground">No alerts yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n._id} 
                            onClick={() => !n.isRead && markSingleRead(n._id)}
                            className={`p-2 rounded-lg text-xs cursor-pointer transition-all border border-transparent ${n.isRead ? "text-muted-foreground hover:bg-muted/40" : "bg-primary/5 text-foreground hover:bg-primary/10 border-primary/10 font-medium"}`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="flex-1">{n.content}</p>
                              {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1 shrink-0" />}
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

                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }} 
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="h-2 w-2 rounded-full bg-accent" 
                />
                <span className="text-xs text-muted-foreground hidden sm:inline-block">AI Career Coach Active</span>
              </div>
            </header>
          )}
          <main className="flex-1 p-4 md:p-6 overflow-auto relative z-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
