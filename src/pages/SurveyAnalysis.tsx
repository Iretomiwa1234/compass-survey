import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  FileText,
  Users,
  TrendingUp,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  getSurveys,
  getSurveyCards,
  getSurveyCompletionRate,
  getSurveyAverageRate,
  getSurveyCountryReach,
  getSurveyResponseTrend,
  getSurveyDeviceUsage,
  getSurveyBrowserUsage,
  getSurveyRespondents,
  getSurveyResponseByCountry,
  type SurveyListItemApi,
  type SurveyCardsData,
  type SurveyCompletionRateData,
  type SurveyAverageRateData,
  type SurveyCountryReachData,
  type SurveyRespondentItem,
  type CountryByDayItem,
} from "@/lib/auth";
import { StatCard } from "@/components/StatCard";
import { DonutMetricCard } from "@/components/DonutMetricCard";
import { CompletionRateCard } from "@/components/CompletionRateCard";

const defaultTrendData = [
  { day: "Monday", value: 0 },
  { day: "Tuesday", value: 0 },
  { day: "Wednesday", value: 0 },
  { day: "Thursday", value: 0 },
  { day: "Friday", value: 0 },
  { day: "Saturday", value: 0 },
  { day: "Sunday", value: 0 },
];

const defaultDeviceData = [
  { name: "Desktop", value: 0, color: "#5B8FF9" },
  { name: "Mobile", value: 0, color: "#FF9D4D" },
  { name: "Tablet", value: 0, color: "#313C4A" },
];

const countryColorPalette = [
  "#206AB5",
  "#1A4D80",
  "#4A89C7",
  "#26A69A",
  "#2E7D32",
  "#66BB6A",
  "#5C6BC0",
  "#8E24AA",
  "#C2185B",
  "#D84315",
  "#F9A825",
  "#6D4C41",
  "#607D8B",
  "#102A43",
  "#0288D1",
];

const countryKeyFromName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ageData = [
  { range: "18 - 24", value: 3.3 },
  { range: "25 - 34", value: 12.7 },
  { range: "35 - 44", value: 15.2 },
  { range: "45 - 64", value: 25.3 },
  { range: "65+", value: 33.5 },
];

const SurveyAnalysis = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);

  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Survey listing
  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(false);

  // Survey selection
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [selectedSurveyTitle, setSelectedSurveyTitle] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Card data
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [surveyCards, setSurveyCards] = useState<SurveyCardsData | null>(null);
  const [completionRate, setCompletionRate] =
    useState<SurveyCompletionRateData | null>(null);
  const [averageRate, setAverageRate] = useState<SurveyAverageRateData | null>(
    null,
  );
  const [countryReach, setCountryReach] =
    useState<SurveyCountryReachData | null>(null);

  // Response trend
  const [trendData, setTrendData] = useState(defaultTrendData);

  // Device / Browser / Respondent
  const [deviceUsageData, setDeviceUsageData] = useState(defaultDeviceData);
  const [browserData, setBrowserData] = useState<
    { name: string; value: number }[]
  >([]);
  const [respondentData, setRespondentData] = useState<SurveyRespondentItem[]>(
    [],
  );

  // Country chart
  const [countryChartRaw, setCountryChartRaw] = useState<CountryByDayItem[]>(
    [],
  );
  const [countryDateOffset, setCountryDateOffset] = useState(0);
  const [isLoadingCountryChart, setIsLoadingCountryChart] = useState(false);

  // Load surveys on mount
  useEffect(() => {
    let isActive = true;
    setIsLoadingSurveys(true);
    getSurveys(1)
      .then((res) => {
        if (!isActive) return;
        setSurveys(res?.data?.survey?.data ?? []);
        setIsLoadingSurveys(false);
      })
      .catch(() => {
        if (!isActive) return;
        setSurveys([]);
        setIsLoadingSurveys(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  // Pre-select from ?survey_id= query param once surveys are loaded
  useEffect(() => {
    if (!surveys.length) return;
    const idParam = searchParams.get("survey_id");
    if (!idParam) return;
    const id = Number(idParam);
    const found = surveys.find((s) => s.survey_id === id);
    if (found) {
      setSelectedSurveyId(id);
      setSelectedSurveyTitle(found.title);
    }
  }, [surveys, searchParams]);

  // Click-outside to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch cards / trend / device / browser / respondent when selected survey changes
  useEffect(() => {
    if (!selectedSurveyId) return;
    let isActive = true;

    setIsLoadingCards(true);
    setSurveyCards(null);
    setCompletionRate(null);
    setAverageRate(null);
    setCountryReach(null);
    setTrendData(defaultTrendData);
    setDeviceUsageData(defaultDeviceData);
    setBrowserData([]);
    setRespondentData([]);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    Promise.allSettled([
      getSurveyCards(selectedSurveyId),
      getSurveyCompletionRate(selectedSurveyId),
      getSurveyAverageRate(selectedSurveyId),
      getSurveyCountryReach(selectedSurveyId),
      getSurveyResponseTrend(selectedSurveyId, fmt(startDate), fmt(endDate)),
      getSurveyDeviceUsage(selectedSurveyId),
      getSurveyBrowserUsage(selectedSurveyId),
      getSurveyRespondents(selectedSurveyId),
    ]).then(
      ([
        cardsRes,
        completionRes,
        avgRes,
        countryRes,
        trendRes,
        deviceRes,
        browserRes,
        respondentRes,
      ]) => {
        if (!isActive) return;

        if (cardsRes.status === "fulfilled") setSurveyCards(cardsRes.value);
        else
          toast({
            title: "Failed to load response data",
            description: "Could not fetch total responses for this survey.",
            variant: "destructive",
          });

        if (completionRes.status === "fulfilled")
          setCompletionRate(completionRes.value);
        else
          toast({
            title: "Failed to load completion rate",
            description: "Could not fetch completion rate for this survey.",
            variant: "destructive",
          });

        if (avgRes.status === "fulfilled") setAverageRate(avgRes.value);
        else
          toast({
            title: "Failed to load average response rate",
            description:
              "Could not fetch average response rate for this survey.",
            variant: "destructive",
          });

        if (countryRes.status === "fulfilled")
          setCountryReach(countryRes.value);
        else
          toast({
            title: "Failed to load country reach",
            description: "Could not fetch country reach data for this survey.",
            variant: "destructive",
          });

        if (trendRes.status === "fulfilled") {
          const raw = trendRes.value?.data?.data;
          if (Array.isArray(raw) && raw.length > 0) {
            setTrendData(
              raw.map((item: any) => ({
                day: item.day ?? item.date ?? "",
                value: Number(item.value ?? 0),
              })),
            );
          }
        }

        if (deviceRes.status === "fulfilled") {
          const d = deviceRes.value;
          setDeviceUsageData([
            { name: "Desktop", value: d.desktop, color: "#5B8FF9" },
            { name: "Mobile", value: d.mobile, color: "#FF9D4D" },
            { name: "Tablet", value: d.tablet, color: "#313C4A" },
          ]);
        }

        if (browserRes.status === "fulfilled") {
          setBrowserData(
            Object.entries(browserRes.value).map(([name, value]) => ({
              name,
              value: value as number,
            })),
          );
        }

        if (respondentRes.status === "fulfilled") {
          setRespondentData(respondentRes.value);
        }

        setIsLoadingCards(false);
      },
    );

    return () => {
      isActive = false;
    };
  }, [selectedSurveyId, toast]);

  // Fetch response-by-country when survey or date window changes
  useEffect(() => {
    if (!selectedSurveyId) return;
    let isActive = true;
    setIsLoadingCountryChart(true);
    setCountryChartRaw([]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - countryDateOffset);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    getSurveyResponseByCountry(selectedSurveyId, fmt(startDate), fmt(endDate))
      .then((data) => {
        if (!isActive) return;
        setCountryChartRaw(data);
        setIsLoadingCountryChart(false);
      })
      .catch(() => {
        if (!isActive) return;
        setIsLoadingCountryChart(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedSurveyId, countryDateOffset]);

  const sortedSurveys = useMemo(() => {
    return [...surveys].sort((a, b) => b.survey_id - a.survey_id);
  }, [surveys]);

  const filteredSurveys = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return surveys
      .filter((s) => s.title.toLowerCase().includes(q))
      .sort((a, b) => b.survey_id - a.survey_id)
      .slice(0, 10);
  }, [surveys, searchTerm]);

  const countrySeries = useMemo(() => {
    const names = new Set<string>();
    countryChartRaw.forEach((d) =>
      d.countries.forEach((c) => names.add(c.name)),
    );
    return Array.from(names).map((name) => ({
      name,
      key: countryKeyFromName(name),
    }));
  }, [countryChartRaw]);

  const countryStackData = useMemo(() => {
    return countryChartRaw.map((entry) => {
      const values = entry.countries.reduce<Record<string, number>>(
        (acc, c) => {
          acc[countryKeyFromName(c.name)] = c.value;
          return acc;
        },
        {},
      );
      return { day: entry.day, ...values };
    });
  }, [countryChartRaw]);

  const handleSelectSurvey = useCallback((survey: SurveyListItemApi) => {
    setSelectedSurveyId(survey.survey_id);
    setSelectedSurveyTitle(survey.title);
    setSearchTerm("");
    setShowSuggestions(false);
  }, []);

  const handleExport = () => {
    setExportModalOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card px-4 h-14">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>

          <DashboardHeader hideGreeting headerTitle="Survey Analysis" />

          <main className="flex-1 p-6 space-y-6">
            <Card>
              <CardContent className="!py-2 px-3">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <h2 className="text-md font-normal text-muted-foreground">
                    {selectedSurveyTitle ? (
                      <span className="font-semibold text-foreground">
                        {selectedSurveyTitle}
                      </span>
                    ) : (
                      <span className="italic">No survey selected</span>
                    )}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Live search + dropdown */}
                    <div className="relative flex-1 sm:w-72" ref={searchRef}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Search for survey…"
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                      />
                      {showSuggestions && (
                        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                          {isLoadingSurveys ? (
                            <div className="p-3 space-y-2">
                              {[1, 2, 3].map((i) => (
                                <Skeleton
                                  key={i}
                                  className="h-8 w-full rounded"
                                />
                              ))}
                            </div>
                          ) : filteredSurveys.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-3 text-center">
                              {searchTerm
                                ? "No surveys match your search."
                                : "No surveys found."}
                            </p>
                          ) : (
                            filteredSurveys.map((survey) => (
                              <button
                                key={survey.survey_id}
                                type="button"
                                onMouseDown={() => handleSelectSurvey(survey)}
                                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-[#F1F5FB] transition-colors flex items-center justify-between gap-2 ${
                                  selectedSurveyId === survey.survey_id
                                    ? "bg-[#EEF4FC] font-medium text-[#206AB5]"
                                    : "text-foreground"
                                }`}
                              >
                                <span className="truncate">{survey.title}</span>
                                <span className="text-xs text-muted-foreground shrink-0 capitalize">
                                  {survey.status}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    <Select
                      value={
                        selectedSurveyId ? String(selectedSurveyId) : undefined
                      }
                      onValueChange={(value) => {
                        const survey = surveys.find(
                          (s) => s.survey_id === Number(value),
                        );
                        if (survey) handleSelectSurvey(survey);
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] h-9 bg-card border border-border">
                        <SelectValue placeholder="Select Survey" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSurveys && (
                          <SelectItem value="loading" disabled>
                            Loading surveys…
                          </SelectItem>
                        )}
                        {!isLoadingSurveys && sortedSurveys.length === 0 && (
                          <SelectItem value="empty" disabled>
                            No surveys found
                          </SelectItem>
                        )}
                        {sortedSurveys.map((survey) => (
                          <SelectItem
                            key={survey.survey_id}
                            value={String(survey.survey_id)}
                          >
                            {survey.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="w-full sm:w-auto gap-2"
                      disabled={!selectedSurveyId}
                      onClick={() => setExportModalOpen(true)}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty state when no survey is selected */}
            {!selectedSurveyId ? (
              <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center py-18 text-center max-w-md border border-border shadow-sm mx-auto mt-[10%]">
                <CardContent className="flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      No survey selected
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Search for a survey above to view its analysis, or open
                      this page from the survey list.
                    </p>
                  </div>
                </CardContent>
              </div>
            ) : (
              <>
                {/* 4 stat cards with skeleton loaders */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {/* Total Responses */}
                  {isLoadingCards ? (
                    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
                      <CardContent className="p-5 md:p-6 space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-8 w-20" />
                        <div className="flex gap-3">
                          <Skeleton className="h-8 flex-1 rounded-full" />
                          <Skeleton className="h-8 flex-1 rounded-full" />
                          <Skeleton className="h-8 flex-1 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <StatCard
                      title="Total Responses"
                      value={
                        surveyCards
                          ? surveyCards.totalResponses.toLocaleString()
                          : "0"
                      }
                      icon={Users}
                      iconBgColor="bg-purple-500/10"
                      iconColor="text-purple-500"
                      badges={[
                        {
                          label: "Completed",
                          count: surveyCards?.completed ?? 0,
                          variant: "success",
                        },
                        {
                          label: "In Progress",
                          count: surveyCards?.inProgress ?? 0,
                          variant: "warning",
                        },
                        {
                          label: "Abandoned",
                          count: surveyCards?.abandoned ?? 0,
                          variant: "destructive",
                        },
                      ]}
                    />
                  )}

                  {/* Avg Response Rate */}
                  {isLoadingCards ? (
                    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
                      <CardContent className="p-5 md:p-6 space-y-3">
                        <Skeleton className="h-5 w-36" />
                        <div className="flex gap-4">
                          <Skeleton className="h-28 w-28 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <DonutMetricCard
                      title="Avg Response Rate"
                      icon={TrendingUp}
                      percentage={averageRate?.avgResponseRatePercentage ?? 0}
                      chartColor="#6A9CCE"
                      iconBgColor="bg-amber-500/10"
                      iconColor="text-amber-500"
                      rotation={0}
                      data={[
                        {
                          label: "Total Invite Sent",
                          value: averageRate
                            ? averageRate.totalInviteSent.toLocaleString()
                            : "0",
                        },
                        {
                          label: "Total Responds",
                          value: averageRate
                            ? averageRate.totalResponds.toLocaleString()
                            : "0",
                          color: "text-blue-600",
                        },
                      ]}
                    />
                  )}

                  {/* Completion Rate */}
                  {isLoadingCards ? (
                    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
                      <CardContent className="p-5 md:p-6 space-y-3">
                        <Skeleton className="h-5 w-36" />
                        <div className="flex gap-4">
                          <Skeleton className="h-28 w-28 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <CompletionRateCard
                      percentage={completionRate?.completionRatePercentage ?? 0}
                      completedValue={
                        completionRate
                          ? completionRate.completed.toLocaleString()
                          : "0"
                      }
                      abandonedValue={
                        completionRate
                          ? completionRate.abandoned.toLocaleString()
                          : "0"
                      }
                    />
                  )}

                  {/* Country Reach */}
                  {isLoadingCards ? (
                    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
                      <CardContent className="p-5 md:p-6 space-y-3">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-8 w-12" />
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-10 rounded-full" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
                      <CardContent className="p-5 md:p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Globe2 className="h-4 w-4 text-blue-500" />
                          <p className="text-sm font-semibold text-[#5a6b80]">
                            Country Reach
                          </p>
                        </div>
                        <p className="text-xl font-black leading-tight text-[#0b1526] sm:text-2xl mb-3">
                          {countryReach?.totalCountries ?? 0}
                        </p>
                        {(countryReach?.top4.length ?? 0) > 0 ? (
                          <div className="grid grid-cols-4 gap-2 text-center">
                            {countryReach!.top4.map((c) => (
                              <div key={c.countryId} className="space-y-1">
                                <span className="block max-w-[88px] truncate rounded-full bg-[#EEF2F8] px-3 py-[6px] text-[11px] font-semibold text-[#65758B] mx-auto">
                                  {c.countryName}
                                </span>
                                <span className="block text-base font-black text-[#65758B]">
                                  {c.totalResponses}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No country data for this survey yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Response Trend + Device Usage */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Response Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Response Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData}>
                            <defs>
                              <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--primary))"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--primary))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="hsl(var(--border))"
                            />
                            <XAxis
                              dataKey="day"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fontSize: 12,
                                fill: "hsl(var(--muted-foreground))",
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fontSize: 12,
                                fill: "hsl(var(--muted-foreground))",
                              }}
                            />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorValue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Device Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceUsageData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={0}
                              dataKey="value"
                            >
                              {deviceUsageData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-2xl font-bold">
                            {deviceUsageData
                              .reduce((s, d) => s + d.value, 0)
                              .toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        {deviceUsageData.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span>{item.name}</span>
                            </div>
                            <span className="font-medium">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <CardTitle className="text-base">
                        Response By Country
                      </CardTitle>
                      <Select
                        value={String(countryDateOffset)}
                        onValueChange={(v) => setCountryDateOffset(Number(v))}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Last 7 days</SelectItem>
                          <SelectItem value="7">Previous 7 days</SelectItem>
                          <SelectItem value="14">2 weeks ago</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardHeader>
                    <CardContent>
                      {isLoadingCountryChart ? (
                        <div className="h-[300px] flex items-center justify-center">
                          <div className="space-y-3 w-full">
                            {[1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-8 w-full" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={countryStackData} barSize={30}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="hsl(var(--border))"
                                />
                                <XAxis
                                  dataKey="day"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fontSize: 12,
                                    fill: "hsl(var(--muted-foreground))",
                                  }}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fontSize: 12,
                                    fill: "hsl(var(--muted-foreground))",
                                  }}
                                />
                                <Tooltip />
                                {countrySeries.map((country, idx) => (
                                  <Bar
                                    key={country.key}
                                    dataKey={country.key}
                                    stackId="country"
                                    fill={
                                      countryColorPalette[
                                        idx % countryColorPalette.length
                                      ]
                                    }
                                    radius={
                                      idx === countrySeries.length - 1
                                        ? [4, 4, 0, 0]
                                        : [0, 0, 0, 0]
                                    }
                                  />
                                ))}
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          {countrySeries.length === 0 ? (
                            <p className="mt-4 text-center text-xs text-muted-foreground">
                              No country data for this period.
                            </p>
                          ) : (
                            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {countrySeries.map((country, idx) => (
                                <div
                                  key={country.key}
                                  className="flex items-center gap-2"
                                >
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        countryColorPalette[
                                          idx % countryColorPalette.length
                                        ],
                                    }}
                                  />
                                  <span>{country.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Browser Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {browserData.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-8">
                          No browser data yet.
                        </p>
                      ) : (
                        <div className="space-y-5">
                          {(() => {
                            const max = Math.max(
                              ...browserData.map((d) => d.value),
                              1,
                            );
                            return browserData.map((item, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between text-sm mb-1.5">
                                  <span>{item.name}</span>
                                  <span className="text-primary font-medium">
                                    {item.value.toLocaleString()}
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#206AB5]/40 rounded-full transition-all"
                                    style={{
                                      width: `${(item.value / max) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Respondents</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {respondentData.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">
                        No respondent data yet.
                      </p>
                    ) : (
                      <Table>
                        <TableBody>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell className="font-medium py-3 pl-6">
                              Full Name
                            </TableCell>
                            <TableCell className="font-medium py-3 text-right pr-6">
                              Total Responses
                            </TableCell>
                          </TableRow>
                          {respondentData.map((r) => (
                            <TableRow
                              key={r.customerId}
                              className="hover:bg-muted/20"
                            >
                              <TableCell className="text-muted-foreground py-3 pl-6">
                                {r.fname} {r.sname}
                              </TableCell>
                              <TableCell className="text-muted-foreground py-3 text-right pr-6 font-medium">
                                {r.totalResponses.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-48 p-6 border-r">
                        <h3 className="text-base font-semibold mb-6">Age</h3>
                        <div className="space-y-3">
                          {ageData.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                              <span>{item.range}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-base font-semibold">Age</h3>
                          <div className="text-sm font-medium">
                            Total: 1,300
                          </div>
                        </div>
                        <div className="space-y-4">
                          {ageData.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 text-sm"
                            >
                              <div className="w-12 text-muted-foreground">
                                {item.range.replace(" - ", "-")}
                              </div>
                              <div className="flex-1 h-3 bg-[#206AB5]/10 rounded overflow-hidden relative">
                                <div
                                  className="h-full bg-[#206AB5]/60 rounded"
                                  style={{ width: `${item.value * 2.5}%` }}
                                />
                              </div>
                              <div className="w-12 text-right text-muted-foreground">
                                {item.value}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </main>
        </SidebarInset>
      </div>
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Contacts</DialogTitle>
            <DialogDescription>
              Export your audience insights as a CSV file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SurveyAnalysis;

// import { useState } from "react";
// import { DashboardSidebar } from "@/components/DashboardSidebar";
// import { DashboardHeader } from "@/components/DashboardHeader";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   SidebarProvider,
//   SidebarInset,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Search,
//   Download,
//   Users,
//   TrendingUp,
//   CheckCircle,
//   Globe,
// } from "lucide-react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
// } from "recharts";
// import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

// const responseTrendData = [
//   { day: "Monday", value: 1800 },
//   { day: "Tuesday", value: 1000 },
//   { day: "Wednesday", value: 1600 },
//   { day: "Thursday", value: 1500 },
//   { day: "Friday", value: 1900 },
//   { day: "Saturday", value: 900 },
//   { day: "Sunday", value: 1200 },
// ];

// const deviceUsageData = [
//   { name: "Desktop", value: 410, color: "#5B8FF9" },
//   { name: "Mobile", value: 142, color: "#FF9D4D" },
//   { name: "Tablet", value: 340, color: "#313C4A" },
// ];

// const countryData = [
//   { day: "Monday", value: 250 },
//   { day: "Tuesday", value: 1100 },
//   { day: "Wednesday", value: 750 },
//   { day: "Thursday", value: 550 },
//   { day: "Friday", value: 800 },
//   { day: "Saturday", value: 250 },
//   { day: "Sunday", value: 1100 },
// ];

// const browserData = [
//   { name: "Chrome", value: 807 },
//   { name: "Safari", value: 455 },
//   { name: "Firefox", value: 253 },
//   { name: "Edge", value: 57 },
// ];

// const respondentData = [
//   "Ronald Richards",
//   "Jerome Bell",
//   "Floyd Miles",
//   "Brooklyn Simmons",
//   "Darlene Robertson",
//   "Robert Fox",
// ];

// const ageData = [
//   { range: "18 - 24", value: 3.3 },
//   { range: "25 - 34", value: 12.7 },
//   { range: "35 - 44", value: 15.2 },
//   { range: "45 - 64", value: 25.3 },
//   { range: "65+", value: 33.5 },
// ];

// const SurveyAnalysis = () => {
//   const [exportModalOpen, setExportModalOpen] = useState(false);

//   const handleExport = () => {
//     const headers = ["Category", "Metric", "Value"];
//     const exportData = [
//       ["Total Responses", "Total", "1500"],
//       ["Total Responses", "Completed", "1100"],
//       ["Total Responses", "In Progress", "200"],
//       ["Total Responses", "Abandoned", "200"],
//       ["Avg Response Rate", "Rate", "72%"],
//       ["Avg Response Rate", "Total Invite Sent", "1500"],
//       ["Avg Response Rate", "Total Responds", "1300"],
//       ["Completion Rate", "Rate", "80%"],
//       ["Completion Rate", "Completed", "1300"],
//       ["Completion Rate", "Abandoned", "200"],
//       ["Country Reach", "Total Countries", "16"],
//       ["Country Reach", "Africa", "5"],
//       ["Country Reach", "Asia", "3"],
//       ["Country Reach", "Europe", "3"],
//       ["Country Reach", "America", "4"],
//       ...responseTrendData.map((d) => ["Response Trend", d.day, d.value.toString()]),
//       ...deviceUsageData.map((d) => ["Device Usage", d.name, d.value.toString()]),
//       ...browserData.map((d) => ["Browser Usage", d.name, d.value.toString()]),
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...exportData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.href = url;
//     link.download = `survey_analysis_${new Date().toISOString().split("T")[0]}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);

//     setExportModalOpen(false);
//   };

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full">
//         <DashboardSidebar />

//         <SidebarInset className="flex-1">
//           <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card px-4 h-14">
//             <SidebarTrigger />
//             <div className="flex-1" />
//           </header>

//           <DashboardHeader />

//           <main className="flex-1 p-6 space-y-6 bg-background">
//             <div className="flex items-center justify-between">
//               <h1 className="text-2xl font-semibold text-foreground">
//                 Survey Analysis
//               </h1>
//             </div>

//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//                   <h2 className="text-lg font-medium">
//                     Customer Satisfaction Survey
//                   </h2>
//                   <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//                     <div className="relative flex-1 sm:w-64">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input placeholder="Search for survey" className="pl-9" />
//                     </div>
//                     <Select defaultValue="survey1">
//                       <SelectTrigger className="w-full sm:w-[180px]">
//                         <SelectValue placeholder="Select Survey" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="survey1">Select Survey</SelectItem>
//                         <SelectItem value="survey2">Product Feedback</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Button className="w-full sm:w-auto gap-2" onClick={() => setExportModalOpen(true)}>
//                       <Download className="w-4 h-4" />
//                       Export
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//               <Card>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Users className="w-4 h-4 text-primary" />
//                     </div>
//                     Total Responses
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold mb-4">1,500</div>
//                   <div className="grid grid-cols-3 gap-2 text-xs">
//                     <div className="bg-success/10 p-2 rounded text-center">
//                       <div className="font-semibold text-success">Completed</div>
//                       <div className="text-success">1,100</div>
//                     </div>
//                     <div className="bg-warning/10 p-2 rounded text-center">
//                       <div className="font-semibold text-warning">In Progress</div>
//                       <div className="text-warning">200</div>
//                     </div>
//                     <div className="bg-destructive/10 p-2 rounded text-center">
//                       <div className="font-semibold text-destructive">Abandoned</div>
//                       <div className="text-destructive">200</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
//                       <TrendingUp className="w-4 h-4 text-warning" />
//                     </div>
//                     Avg Response Rate
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex items-center justify-between">
//                   <div className="relative w-20 h-20">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={[{ value: 72 }, { value: 28 }]}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={25}
//                           outerRadius={35}
//                           startAngle={90}
//                           endAngle={-270}
//                           dataKey="value"
//                         >
//                           <Cell fill="hsl(var(--primary))" />
//                           <Cell fill="hsl(var(--muted))" />
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                     <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
//                       72%
//                     </div>
//                   </div>
//                   <div className="text-xs space-y-2">
//                     <div>
//                       <div className="text-muted-foreground">Total Invite Sent</div>
//                       <div className="font-bold">1,500</div>
//                     </div>
//                     <div>
//                       <div className="text-muted-foreground">Total Responds</div>
//                       <div className="font-bold text-primary">1,300</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
//                       <CheckCircle className="w-4 h-4 text-success" />
//                     </div>
//                     Completion Rate
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex items-center justify-between">
//                   <div className="relative w-20 h-20">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={[{ value: 80 }, { value: 20 }]}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={25}
//                           outerRadius={35}
//                           startAngle={90}
//                           endAngle={-270}
//                           dataKey="value"
//                         >
//                           <Cell fill="hsl(var(--success))" />
//                           <Cell fill="hsl(var(--destructive))" />
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                     <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
//                       80%
//                     </div>
//                   </div>
//                   <div className="text-xs space-y-2">
//                     <div>
//                       <div className="text-muted-foreground">Completed</div>
//                       <div className="font-bold text-success">1,300</div>
//                     </div>
//                     <div>
//                       <div className="text-muted-foreground">Abandoned</div>
//                       <div className="font-bold text-destructive">200</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Globe className="w-4 h-4 text-primary" />
//                     </div>
//                     Country Reach
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold mb-4">16</div>
//                   <div className="grid grid-cols-4 gap-2 text-xs">
//                     <div className="bg-primary/10 p-2 rounded text-center">
//                       <div className="font-semibold text-primary">Africa</div>
//                       <div className="text-primary">5</div>
//                     </div>
//                     <div className="bg-primary/10 p-2 rounded text-center">
//                       <div className="font-semibold text-primary">Asia</div>
//                       <div className="text-primary">3</div>
//                     </div>
//                     <div className="bg-primary/10 p-2 rounded text-center">
//                       <div className="font-semibold text-primary">Europe</div>
//                       <div className="text-primary">3</div>
//                     </div>
//                     <div className="bg-primary/10 p-2 rounded text-center">
//                       <div className="font-semibold text-primary">America</div>
//                       <div className="text-primary">4</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//               <Card className="xl:col-span-2">
//                 <CardHeader>
//                   <CardTitle className="text-base">Response Trend</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={responseTrendData}>
//                         <defs>
//                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
//                             <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
//                         <XAxis
//                           dataKey="day"
//                           axisLine={false}
//                           tickLine={false}
//                           tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
//                         />
//                         <YAxis
//                           axisLine={false}
//                           tickLine={false}
//                           tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
//                         />
//                         <Tooltip />
//                         <Area
//                           type="monotone"
//                           dataKey="value"
//                           stroke="hsl(var(--primary))"
//                           strokeWidth={2}
//                           fillOpacity={1}
//                           fill="url(#colorValue)"
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-base">Device Usage</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-[200px] relative">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={deviceUsageData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={60}
//                           outerRadius={80}
//                           paddingAngle={0}
//                           dataKey="value"
//                         >
//                           {deviceUsageData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-2xl font-bold">892</div>
//                     </div>
//                   </div>
//                   <div className="mt-6 space-y-3">
//                     {deviceUsageData.map((item, idx) => (
//                       <div key={idx} className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="w-3 h-3 rounded-full"
//                             style={{ backgroundColor: item.color }}
//                           />
//                           <span>{item.name}</span>
//                         </div>
//                         <span className="font-medium">{item.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//               <Card className="xl:col-span-2">
//                 <CardHeader>
//                   <CardTitle className="text-base">Response By Country</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={countryData} barSize={8}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
//                         <XAxis
//                           dataKey="day"
//                           axisLine={false}
//                           tickLine={false}
//                           tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
//                         />
//                         <YAxis
//                           axisLine={false}
//                           tickLine={false}
//                           tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
//                         />
//                         <Tooltip />
//                         <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-base">Browser Usage</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     {browserData.map((item, idx) => (
//                       <div key={idx}>
//                         <div className="flex justify-between text-sm mb-2">
//                           <span>{item.name}</span>
//                           <span className="text-primary font-medium">{item.value}</span>
//                         </div>
//                         <div className="h-2 bg-muted rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-primary/40 rounded-full"
//                             style={{ width: `${(item.value / 1000) * 100}%` }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                     <div className="flex justify-between text-xs text-muted-foreground pt-2">
//                       <span>0</span>
//                       <span>500</span>
//                       <span>1k</span>
//                       <span>1.5k</span>
//                       <span>2k</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card>
//               <CardContent className="p-0">
//                 <div className="flex">
//                   <div className="w-48 p-6 border-r">
//                     <h3 className="text-base font-semibold">Full Name</h3>
//                   </div>
//                   <div className="flex-1">
//                     <Table>
//                       <TableBody>
//                         <TableRow className="bg-muted/30 hover:bg-muted/30">
//                           <TableCell className="font-medium text-center py-3">
//                             Respondent
//                           </TableCell>
//                         </TableRow>
//                         {respondentData.map((name, idx) => (
//                           <TableRow key={idx} className="hover:bg-muted/20">
//                             <TableCell className="text-center text-muted-foreground py-3">
//                               {name}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-0">
//                 <div className="flex">
//                   <div className="w-48 p-6 border-r">
//                     <h3 className="text-base font-semibold mb-6">Age</h3>
//                     <div className="space-y-3">
//                       {ageData.map((item, idx) => (
//                         <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
//                           <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
//                           <span>{item.range}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex-1 p-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className="text-base font-semibold">Age</h3>
//                       <div className="text-sm font-medium">Total: 1,300</div>
//                     </div>
//                     <div className="space-y-4">
//                       {ageData.map((item, idx) => (
//                         <div key={idx} className="flex items-center gap-4 text-sm">
//                           <div className="w-12 text-muted-foreground">{item.range.replace(" - ", "-")}</div>
//                           <div className="flex-1 h-3 bg-primary/10 rounded overflow-hidden relative">
//                             <div
//                               className="h-full bg-primary/60 rounded"
//                               style={{ width: `${item.value * 2.5}%` }}
//                             />
//                           </div>
//                           <div className="w-12 text-right text-muted-foreground">
//                             {item.value}%
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </main>
//         </SidebarInset>
//       </div>
//       <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Export Contacts</DialogTitle>
//             <DialogDescription>
//               Export your audience insights as a CSV file.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="gap-2 sm:gap-0">
//             <Button variant="outline" onClick={() => setExportModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleExport}>
//               Export
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </SidebarProvider>
//   );
// };

// export default SurveyAnalysis;
