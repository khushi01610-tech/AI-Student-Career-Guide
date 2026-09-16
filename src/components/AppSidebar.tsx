import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Bot,
  Compass,
  Mic,
  Swords,
  BookOpen,
  Users,
  Video,
  Presentation,
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "AI Career Assistant", url: "/chat", icon: Bot },
  { title: "Interview Prep", url: "/interview", icon: BookOpen },
  { title: "Mock Interview", url: "/mock-interview", icon: Swords },
  { title: "Communication", url: "/communication", icon: Mic },
  { title: "Resume Analyzer", url: "/resume", icon: FileText },
  { title: "Career Roadmap", url: "/roadmap", icon: Compass },
  { title: "Career Hub", url: "/career-hub", icon: BookOpen },
  { title: "Community", url: "/community", icon: Users },
  { title: "Videos", url: "/videos", icon: Video },
  { title: "Collaboration", url: "/collaboration", icon: Presentation },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || "Student Guest";
  const displayCollege = user?.college || "College Portal";
  const displayAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-card/60 backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 relative overflow-hidden">
            <Bot className="h-5 w-5 text-primary" />
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" 
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Student Guide</span>
              <span className="text-[10px] text-muted-foreground">Learn • Connect • Ready</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, i) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.03 }}
                  >
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink 
                        to={item.url} 
                        className="hover:bg-sidebar-accent/50 transition-all duration-200"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      >
                        <item.icon className="mr-2 h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/20 space-y-4">
        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-primary/20 shrink-0">
            <img 
              src={displayAvatar} 
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{displayCollege}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <ThemeToggle />
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1 h-8 px-2"
            >
              <LogOut className="h-3 w-3" /> Log Out
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
