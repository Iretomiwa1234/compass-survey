import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch, SearchItem } from "@/contexts/SearchContext";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Globe,
  Activity,
  Users,
  TrendingUp,
  CheckCircle2,
  FileBarChart,
  Search as SearchIcon,
  ArrowRight,
  Brain,
} from "lucide-react";

// Static navigation items (only enabled paths)
const NAVIGATION_ITEMS: SearchItem[] = [
  {
    id: "nav-dashboard",
    title: "Dashboard",
    description: "Overview of all your surveys and metrics",
    page: "Navigation",
    pagePath: "/",
    keywords: ["home", "overview", "metrics", "stats"],
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    id: "nav-survey-research",
    title: "Survey Research",
    description: "Create and manage your surveys",
    page: "Navigation",
    pagePath: "/survey-research",
    keywords: ["surveys", "create", "manage", "research"],
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "nav-channels",
    title: "Channels",
    description: "Distribute surveys through various channels",
    page: "Navigation",
    pagePath: "/channels",
    keywords: ["distribute", "email", "sms", "qr", "link", "share"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "nav-survey-analysis",
    title: "Survey Analysis",
    description: "Analyze survey responses and insights",
    page: "Navigation",
    pagePath: "/survey-analysis",
    keywords: ["analyze", "results", "responses", "insights", "data"],
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

// Static section items that are always searchable
const STATIC_SECTION_ITEMS: SearchItem[] = [
  {
    id: "section-total-responses",
    title: "Total Responses",
    description: "View total survey responses across all surveys",
    page: "Survey Research",
    pagePath: "/survey-research",
    section: "Stats Overview",
    keywords: ["responses", "total", "count", "completed", "in progress", "abandoned"],
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "section-avg-response-rate",
    title: "Avg Response Rate",
    description: "Average response rate across surveys",
    page: "Survey Research",
    pagePath: "/survey-research",
    section: "Stats Overview",
    keywords: ["response rate", "average", "completion", "rate"],
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "section-completion-rate",
    title: "Completion Rate",
    description: "Survey completion rate statistics",
    page: "Survey Research",
    pagePath: "/survey-research",
    section: "Stats Overview",
    keywords: ["completion", "rate", "completed", "abandoned", "finished"],
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    id: "section-country-reach",
    title: "Country Reach",
    description: "Geographic reach of your surveys",
    page: "Survey Research",
    pagePath: "/survey-research",
    section: "Stats Overview",
    keywords: ["country", "geographic", "reach", "location", "global"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "section-active-surveys",
    title: "Active Surveys",
    description: "View and manage your active surveys",
    page: "Dashboard",
    pagePath: "/",
    section: "Active Surveys",
    keywords: ["active", "surveys", "published", "live"],
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "section-recent-projects",
    title: "Recent Projects",
    description: "Your recently worked on survey projects",
    page: "Dashboard",
    pagePath: "/",
    section: "Recent Projects",
    keywords: ["recent", "projects", "history", "latest"],
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "section-response-trend",
    title: "Response Trend",
    description: "Track response trends over time",
    page: "Dashboard",
    pagePath: "/",
    section: "Response Trend",
    keywords: ["trend", "response", "chart", "graph", "timeline"],
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "section-mentions",
    title: "Mentions",
    description: "Social media mentions and engagement",
    page: "Dashboard",
    pagePath: "/",
    section: "Mentions",
    keywords: ["mentions", "social", "media", "engagement"],
    icon: <FileBarChart className="h-4 w-4" />,
  },
  {
    id: "section-sentiment",
    title: "Sentiment Analysis",
    description: "Track sentiment across social channels",
    page: "Dashboard",
    pagePath: "/",
    section: "Sentiment",
    keywords: ["sentiment", "analysis", "positive", "negative", "neutral"],
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "section-analysis-responses",
    title: "Survey Responses Analysis",
    description: "Detailed analysis of survey responses",
    page: "Survey Analysis",
    pagePath: "/survey-analysis",
    section: "Analysis",
    keywords: ["responses", "analysis", "detailed", "breakdown"],
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "section-device-usage",
    title: "Device Usage",
    description: "See which devices respondents used",
    page: "Survey Analysis",
    pagePath: "/survey-analysis",
    section: "Analysis",
    keywords: ["device", "desktop", "mobile", "tablet", "usage"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "section-browser-usage",
    title: "Browser Usage",
    description: "See which browsers respondents used",
    page: "Survey Analysis",
    pagePath: "/survey-analysis",
    section: "Analysis",
    keywords: ["browser", "chrome", "firefox", "safari", "usage"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "section-age-range",
    title: "Age Range Distribution",
    description: "Respondent age range breakdown",
    page: "Survey Analysis",
    pagePath: "/survey-analysis",
    section: "Demographics",
    keywords: ["age", "range", "demographics", "respondents"],
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "section-respondents-list",
    title: "Respondents List",
    description: "View all survey respondents",
    page: "Survey Analysis",
    pagePath: "/survey-analysis",
    section: "Respondents",
    keywords: ["respondents", "list", "participants", "users"],
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "section-channel-distribution",
    title: "Channel Distribution",
    description: "Survey distribution channels and settings",
    page: "Channels",
    pagePath: "/channels",
    section: "Distribution",
    keywords: ["channel", "distribution", "email", "sms", "qr", "link"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    id: "section-demography",
    title: "Demography Settings",
    description: "Configure survey demographic targeting",
    page: "Channels",
    pagePath: "/channels",
    section: "Demography",
    keywords: ["demography", "targeting", "age", "gender", "location"],
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "action-create-survey",
    title: "Create New Survey",
    description: "Start creating a new survey",
    page: "Actions",
    pagePath: "/create-survey",
    keywords: ["create", "new", "survey", "start", "build"],
    icon: <FileText className="h-4 w-4" />,
  },
];

// Fuzzy match helper
function fuzzyMatch(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedText.includes(normalizedQuery);
}

function scoreMatch(item: SearchItem, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  // Exact title match gets highest score
  if (item.title.toLowerCase() === q) score += 100;
  // Title starts with query
  else if (item.title.toLowerCase().startsWith(q)) score += 80;
  // Title contains query
  else if (item.title.toLowerCase().includes(q)) score += 60;

  // Description match
  if (item.description?.toLowerCase().includes(q)) score += 30;

  // Keyword matches
  if (item.keywords) {
    for (const keyword of item.keywords) {
      if (keyword.toLowerCase() === q) score += 50;
      else if (keyword.toLowerCase().includes(q)) score += 20;
    }
  }

  // Section match
  if (item.section?.toLowerCase().includes(q)) score += 15;

  return score;
}

export function UniversalSearchModal() {
  const { isOpen, closeSearch, searchItems } = useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Combine static items with dynamic items from pages
  const allItems = useMemo(() => {
    return [...NAVIGATION_ITEMS, ...STATIC_SECTION_ITEMS, ...searchItems];
  }, [searchItems]);

  // Filter and sort results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return allItems;

    return allItems
      .map((item) => ({
        item,
        score: scoreMatch(item, query),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [query, allItems]);

  // Group results by page
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of filteredResults) {
      if (!groups[item.page]) {
        groups[item.page] = [];
      }
      groups[item.page].push(item);
    }
    return groups;
  }, [filteredResults]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      closeSearch();
      setQuery("");
      if (item.action) {
        item.action();
      } else {
        navigate(item.pagePath);
      }
    },
    [closeSearch, navigate],
  );

  // Global keyboard shortcut - handled by SearchProvider, but we can also listen here
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // Page icon mapping
  const pageIcons: Record<string, React.ReactNode> = {
    Navigation: <LayoutDashboard className="h-4 w-4 text-blue-500" />,
    Dashboard: <LayoutDashboard className="h-4 w-4 text-purple-500" />,
    "Survey Research": <FileText className="h-4 w-4 text-green-500" />,
    "Survey Analysis": <BarChart3 className="h-4 w-4 text-orange-500" />,
    Channels: <Globe className="h-4 w-4 text-cyan-500" />,
    Actions: <ArrowRight className="h-4 w-4 text-indigo-500" />,
    "Social Listening": <Activity className="h-4 w-4 text-pink-500" />,
    "Social Insights": <BarChart3 className="h-4 w-4 text-violet-500" />,
    Contacts: <Users className="h-4 w-4 text-teal-500" />,
    "Audience Insights": <Users className="h-4 w-4 text-amber-500" />,
    "Community Panel": <Users className="h-4 w-4 text-rose-500" />,
    Reports: <FileBarChart className="h-4 w-4 text-emerald-500" />,
    "AI Assistant": <Brain className="h-4 w-4 text-sky-500" />,
  };

  // Group order
  const groupOrder = [
    "Navigation",
    "Actions",
    "Dashboard",
    "Survey Research",
    "Survey Analysis",
    "Channels",
    "Social Listening",
    "Social Insights",
    "Contacts",
    "Audience Insights",
    "Community Panel",
    "Reports",
    "AI Assistant",
  ];

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && closeSearch()}>
      <Command className="!h-auto" shouldFilter={false}>
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          {groupOrder.map((groupName) => {
            const items = groupedResults[groupName];
            if (!items || items.length === 0) return null;

            return (
              <div key={groupName}>
                <CommandGroup
                  heading={
                    <div className="flex items-center gap-2">
                      {pageIcons[groupName]}
                      <span>{groupName}</span>
                    </div>
                  }
                >
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </div>
                      {item.section && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.section}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </div>
            );
          })}
        </CommandList>
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <span>Type to search across all pages</span>
          <div className="flex items-center gap-2">
            <kbd className="rounded border bg-muted px-1.5 py-0.5">↑↓</kbd>
            <span>Navigate</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5">↵</kbd>
            <span>Select</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5">esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
