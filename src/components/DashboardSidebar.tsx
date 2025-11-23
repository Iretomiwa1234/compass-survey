import {
  LayoutDashboard,
  FileText,
  Volume2,
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  UserCircle,
  FileBarChart,
  Settings,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuSections = [
  {
    title: "Intelligence Hub",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/" },
      { name: "Survey Research", icon: FileText, path: "/survey-research" },
      { name: "Social Listening", icon: Volume2, path: "/social-listening" },
      { name: "Community Panel", icon: Users, path: "/community-panel" },
    ],
  },
  {
    title: "Distribution",
    items: [
      { name: "Channels", icon: TrendingUp, path: "/channels" },
      { name: "Campaigns", icon: Activity, path: "/campaigns" },
    ],
  },
  {
    title: "Analysis",
    items: [
      { name: "Survey Analysis", icon: BarChart3, path: "/survey-analysis" },
      { name: "Social Insights", icon: BarChart3, path: "/social-insights" },
      { name: "Report", icon: FileBarChart, path: "/report" },
    ],
  },
  {
    title: "Audience",
    items: [
      { name: "Contacts", icon: UserCircle, path: "/contacts" },
      { name: "Audience Insights", icon: Users, path: "/audience-insights" },
    ],
  },
];

const settingsItem = { name: "Settings", icon: Settings, path: "/settings" };

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="p-4">
          {!isCollapsed ? (
            <>
              <img src="/public/assets/Compass logo.png" alt="" />
            </>
          ) : (
            <h1 className="text-xl font-extrabold text-sidebar-primary">C</h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuSections.map((section, idx) => {
          const hasActiveItem = section.items.some(
            (item) => currentPath === item.path
          );

          return (
            <Collapsible
              key={idx}
              defaultOpen={hasActiveItem || idx === 0}
              className="group/collapsible"
            >
              <SidebarGroup>
                {!isCollapsed && (
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md">
                      <span>{section.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 w-4 h-4" />
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                )}
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            isActive={currentPath === item.path}
                            className="relative data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 transition-all hover:bg-transparent data-[active=true]:hover:bg-blue-50"
                          >
                            <NavLink
                              to={item.path}
                              className="flex items-center gap-3 w-full p-2"
                            >
                              {currentPath === item.path && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded" />
                              )}
                              <item.icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={currentPath === settingsItem.path}
                className="relative data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 transition-all hover:bg-transparent data-[active=true]:hover:bg-blue-50"
              >
                <NavLink
                  to={settingsItem.path}
                  className="flex items-center gap-3 w-full p-2"
                >
                  {currentPath === settingsItem.path && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  <settingsItem.icon className="w-4 h-4" />
                  <span>{settingsItem.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
