import {
  LayoutDashboard,
  FileText,
  Volume2,
  TrendingUp,
  BarChart3,
  Activity,
  UserCircle,
  FileBarChart,
  Settings,
  Globe,
  User,
} from "lucide-react";
import compassLogo from "/assets/Compass-logo.png?url";
import audienceInsightsIcon from "/assets/audienceInsights-icon.svg?url";
import channelsIcon from "/assets/channels-icon.svg?url";
import socialInsightsIcon from "/assets/socialInsights-icon.svg?url";
import surveyAnalysisIcon from "/assets/surveyAnalysis-icon.svg?url";
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

// Component for rendering SVG icons with dynamic color
function IconImage({ src, isActive }: { src: string; isActive: boolean }) {
  return (
    <img
      src={src}
      alt=""
      className="h-4 w-4"
      style={{
        filter: isActive
          ? "invert(20%) sepia(50%) saturate(1200%) hue-rotate(200deg)"
          : "invert(53%) sepia(0%) saturate(0%) brightness(97%)",
      }}
    />
  );
}
const menuSections = [
  {
    title: "Intelligence Hub",
    items: [
      { name: "Survey Research", icon: FileText, path: "/survey-research" },
      { name: "Social Listening", icon: Volume2, path: "/social-listening" },
      { name: "Community Panel", icon: Globe, path: "/community-panel" },
    ],
  },
  {
    title: "Distribution",
    items: [
      { name: "Channels", icon: "image", src: channelsIcon, path: "/channels" },
      { name: "Campaigns", icon: Activity, path: "/campaigns" },
    ],
  },
  {
    title: "Analysis",
    items: [
      {
        name: "Survey Analysis",
        icon: "image",
        src: surveyAnalysisIcon,
        path: "/survey-analysis",
      },
      {
        name: "Social Insights",
        icon: "image",
        src: socialInsightsIcon,
        path: "/social-insights",
      },
      { name: "Report", icon: FileBarChart, path: "/report" },
    ],
  },
  {
    title: "Audience",
    items: [
      { name: "Contacts", icon: User, path: "/contacts" },
      {
        name: "Audience Insights",
        icon: "image",
        src: audienceInsightsIcon,
        path: "/audience-insights",
      },
    ],
  },
];

const dashboardItem = { name: "Dashboard", icon: LayoutDashboard, path: "/" };
const settingsItem = { name: "Settings", icon: Settings, path: "/settings" };

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E4E9F1] bg-white">
      <SidebarHeader>
        <div className="flex items-center px-3 py-5">
          {!isCollapsed ? (
            <img src={compassLogo} alt="" className="w-28" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F0FB] text-sm font-semibold text-[#1F6BB8]">
              C
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={currentPath === dashboardItem.path}
                className="relative !h-auto gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#4A5567] transition-all hover:bg-[#F1F5FB] data-[active=true]:bg-transparent data-[active=true]:font-semibold data-[active=true]:text-[#1F6BB8]"
              >
                <NavLink
                  to={dashboardItem.path}
                  className="flex w-full items-center gap-2"
                >
                  {currentPath === dashboardItem.path && (
                    <div className="absolute left-1 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#1F6BB8]" />
                  )}
                  <dashboardItem.icon
                    className={`h-4 w-4 ${
                      currentPath === dashboardItem.path
                        ? "text-[#1F6BB8]"
                        : "text-[#6B7287]"
                    }`}
                  />
                  <span className="leading-[18px]">{dashboardItem.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {menuSections.map((section, idx) => {
          return (
            <SidebarGroup key={idx} className="px-2">
              {!isCollapsed && (
                <SidebarGroupLabel className="px-1 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9AA4B5]">
                  {section.title}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {section.items.map((item) => {
                    const isActive = currentPath === item.path;

                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="relative !h-auto gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#4A5567] transition-all hover:bg-[#F1F5FB] data-[active=true]:bg-transparent data-[active=true]:font-semibold data-[active=true]:text-[#1F6BB8]"
                        >
                          <NavLink
                            to={item.path}
                            className="flex w-full items-center gap-2"
                          >
                            {isActive && (
                              <div className="absolute left-1 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#1F6BB8]" />
                            )}
                            {item.icon === "image" ? (
                              <IconImage src={item.src} isActive={isActive} />
                            ) : (
                              <item.icon
                                className={`h-4 w-4 ${
                                  isActive ? "text-[#1F6BB8]" : "text-[#6B7287]"
                                }`}
                              />
                            )}
                            <span className="leading-[18px]">{item.name}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        <SidebarGroup className="mt-2 px-2">
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={currentPath === settingsItem.path}
                className="relative !h-auto gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#4A5567] transition-all hover:bg-[#F1F5FB] data-[active=true]:bg-transparent data-[active=true]:font-semibold data-[active=true]:text-[#1F6BB8]"
              >
                <NavLink
                  to={settingsItem.path}
                  className="flex w-full items-center gap-2"
                >
                  {currentPath === settingsItem.path && (
                    <div className="absolute left-1 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#1F6BB8]" />
                  )}
                  <settingsItem.icon
                    className={`h-4 w-4 ${
                      currentPath === settingsItem.path
                        ? "text-[#1F6BB8]"
                        : "text-[#6B7287]"
                    }`}
                  />
                  <span className="leading-[18px]">{settingsItem.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
