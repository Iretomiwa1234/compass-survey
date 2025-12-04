import { LayoutGrid } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import editIcon from "/assets/edit-05.svg?url";
import glassesIcon from "/assets/glasses-01.svg?url";
import barChartIcon from "/assets/bar-line-chart.svg?url";
import fileIcon from "/assets/file-07.svg?url";
import starIcon from "/assets/star-icon.svg?url";

// Pages where QuickActions should be hidden
const hiddenRoutes = ["/auth", "/verification"];

// SVG icon components
const EditIcon = () => (
  <img src="/assets/edit-05.svg" alt="Create Survey" className="h-5 w-5" />
);

const GlassesIcon = () => (
  <img src="/assets/glasses-01.svg" alt="Social Insights" className="h-5 w-5" />
);

const BarChartIcon = () => (
  <img
    src="/assets/bar-line-chart.svg"
    alt="Survey Analysis"
    className="h-5 w-5"
  />
);

const FileIcon = () => (
  <img src="/assets/file-07.svg" alt="Report" className="h-5 w-5" />
);

const StarIcon = () => (
  <img src="/assets/star-icon.svg" alt="Generate with AI" className="h-5 w-5" />
);

const quickActions = [
  {
    icon: EditIcon,
    label: "Create Survey",
    path: "/create-survey",
  },
  {
    icon: GlassesIcon,
    label: "Social Insights",
    path: "/social-insights",
  },
  {
    icon: BarChartIcon,
    label: "Survey Analysis",
    path: "/survey-analysis",
  },
  {
    icon: FileIcon,
    label: "Report",
    path: "/report",
  },
  {
    icon: StarIcon,
    label: "Generate Survey with AI",
    path: "/create-survey",
  },
  {
    icon: LayoutGrid,
    label: "Dashboard",
    path: "/",
  },
];

export function QuickActions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on auth-related pages
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
        {quickActions.map((action, index) => (
          <div key={action.label} className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-500 hover:text-[#206AB5] hover:bg-[#206AB5]/5"
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-gray-900 text-white text-xs"
              >
                {action.label}
              </TooltipContent>
            </Tooltip>

            {/* Divider before last item */}
            {index === quickActions.length - 2 && (
              <div className="h-6 w-px bg-gray-200 mx-1" />
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
