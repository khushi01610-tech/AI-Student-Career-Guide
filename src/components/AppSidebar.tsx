import {
  LayoutDashboard,
  FileText,
  Compass,
  Mic,
  Swords,
  BookOpen,
  Users,
  Video,
  Presentation,
  User,
  LogOut,
  Building2,
  Briefcase,
  Coffee,
  FolderArchive,
  GraduationCap,
  Bot,
  Globe
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

const menuGroups = [
  {
    label: "Placement Prep",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Company Archives", url: "/companies", icon: Building2 },
      { title: "Resume Studio", url: "/resume", icon: FileText },
      { title: "Mock Interview", url: "/mock-interview", icon: Swords },
      { title: "Interview Prep", url: "/interview", icon: BookOpen },
      { title: "Communication Coach", url: "/communication", icon: Mic },
    ]
  },
  {
    label: "Applications & Strategy",
    items: [
      { title: "Application Tracker", url: "/applications", icon: Briefcase },
      { title: "Jobs (LinkedIn/Indeed)", url: "/jobs", icon: Globe },
      { title: "Career Roadmaps", url: "/roadmap", icon: Compass },
    ]
  },
  {
    label: "Network & Mentorship",
    items: [
      { title: "Alumni Coffee Chats", url: "/mentors", icon: Coffee },
      { title: "Peer Mock Panels", url: "/collaboration", icon: Presentation },
      { title: "Student Community", url: "/community", icon: Users },
      { title: "Video Guides", url: "/videos", icon: Video },
    ]
  },
  {
    label: "Resources & Profile",
    items: [
      { title: "Templates Vault", url: "/vault", icon: FolderArchive },
      { title: "Career Hub", url: "/career-hub", icon: GraduationCap },
      { title: "AI Assistant", url: "/chat", icon: Bot },
      { title: "My Profile", url: "/profile", icon: User },
    ]
  }
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
  const displayCollege = user?.college || "Campus Placement Cell";
  const displayAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0 text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground truncate">Student Career Guide</span>
              <span className="text-[10px] text-muted-foreground truncate">University Placement Portal</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-1 py-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink 
                        to={item.url} 
                        className="hover:bg-accent/50 transition-colors text-xs font-medium py-2 rounded-md"
                        activeClassName="bg-primary/10 text-primary font-semibold"
                      >
                        <item.icon className="mr-2 h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border space-y-3 bg-muted/20">
        {/* User Card */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
            <img 
              src={displayAvatar} 
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{displayCollege}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          <ThemeToggle />
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1 h-7 px-2"
            >
              <LogOut className="h-3 w-3" /> Log Out
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
