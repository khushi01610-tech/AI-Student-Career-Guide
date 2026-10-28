import {
  LayoutDashboard,
  FileText,
  Compass,
  Mic,
  Swords,
  BookOpen,
  User,
  LogOut,
  Briefcase,
  GraduationCap,
  Bot,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navigationGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "My Profile", url: "/profile", icon: User },
      { title: "AI Career Coach", url: "/chat", icon: Bot },
    ]
  },
  {
    label: "Placement Prep",
    items: [
      { title: "Resume Studio & ATS", url: "/resume", icon: FileText },
      { title: "Career Recommendations", url: "/recommendations", icon: Sparkles },
      { title: "Career Roadmaps", url: "/roadmap", icon: Compass },
      { title: "Interview Questions", url: "/interview", icon: BookOpen },
      { title: "Mock Interview System", url: "/mock-interview", icon: Swords },
      { title: "Communication Coach", url: "/communication", icon: Mic },
    ]
  },
  {
    label: "Opportunities",
    items: [
      { title: "Live Job Search", url: "/jobs", icon: Globe },
      { title: "Application Tracker", url: "/applications", icon: Briefcase },
    ]
  }
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || "Student";
  const displayCollege = user?.college || "Campus Placement Cell";
  const displayDegree = user?.degree || "CSE";
  const displayAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card transition-all">
      {/* Header */}
      <SidebarHeader className="p-3 border-b border-border/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 text-primary-foreground shadow-sm">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-foreground truncate leading-tight">Career Engine</span>
                <span className="text-[10px] text-muted-foreground truncate">Placement Portal</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 hidden md:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </SidebarHeader>

      {/* Menu Groups */}
      <SidebarContent className="space-y-1 py-2 px-1">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider px-2 h-6">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  const buttonContent = (
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  );

                  return (
                    <SidebarMenuItem key={item.title}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild isActive={isActive} className="p-0">
                              {buttonContent}
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-xs font-medium">
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton asChild isActive={isActive} className="p-0">
                          {buttonContent}
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer Profile */}
      <SidebarFooter className="p-3 border-t border-border/80 space-y-2 bg-muted/20">
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
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 font-mono font-bold border-primary/30 text-primary">
                  {displayDegree}
                </Badge>
              </div>
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
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 h-7 px-2"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
