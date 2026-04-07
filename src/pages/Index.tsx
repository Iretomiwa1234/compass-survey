import { useEffect, useMemo, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/StatCard";
import { ResponseTrendChart } from "@/components/ResponseTrendChart";
import { ActiveSurveys } from "@/components/ActiveSurveys";
import { RecentProjects } from "@/components/RecentProjects";
import { MentionsCard } from "@/components/MentionsCard";
import { SentimentChart } from "@/components/SentimentChart";
import { FileText, Users } from "lucide-react";
import {
  getSurveyCards,
  getDashboardResponseTrend,
  getDashboardMentions,
  getDashboardSentiment,
  getSurveys,
  SurveyListItemApi,
  SurveyCardsData,
  DashboardMentionsCard,
  DashboardSentimentCard,
} from "@/lib/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

type TrendRange = "this-week" | "last-week" | "last-2-weeks";

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTrendDateRange(range: TrendRange) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  const end = new Date(today);

  if (range === "this-week") {
    start.setDate(start.getDate() - 7);
  } else if (range === "last-week") {
    end.setDate(end.getDate() - 7);
    start.setTime(end.getTime());
    start.setDate(start.getDate() - 7);
  } else {
    start.setDate(start.getDate() - 14);
  }

  return {
    start: formatLocalDate(start),
    end: formatLocalDate(end),
  };
}

const Index = () => {
  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [surveyCards, setSurveyCards] = useState<SurveyCardsData | null>(null);
  const [trendData, setTrendData] = useState<{ day: string; value: number }[]>(
    [],
  );
  const [trendRange, setTrendRange] = useState<TrendRange>("this-week");
  const [mentionsCard, setMentionsCard] =
    useState<DashboardMentionsCard | null>(null);
  const [sentimentCard, setSentimentCard] =
    useState<DashboardSentimentCard | null>(null);

  // Fetch dashboard response trend based on selected date range
  useEffect(() => {
    const { start, end } = getTrendDateRange(trendRange);

    getDashboardResponseTrend(start, end)
      .then((res) => {
        const rows: { date: string; day: string; value: number }[] =
          res?.data?.data ?? [];
        setTrendData(rows.map(({ day, value }) => ({ day, value })));
      })
      .catch(() => {
        setTrendData([]);
      });
  }, [trendRange]);

  useEffect(() => {
    let isActive = true;

    getSurveys()
      .then((response) => {
        if (!isActive) return;
        const items = response?.data?.survey?.data ?? [];
        setSurveys(items);
      })
      .catch(() => {
        if (!isActive) return;
        setSurveys([]);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Fetch survey response cards
  useEffect(() => {
    let isActive = true;

    getSurveyCards()
      .then((data) => {
        if (!isActive) return;
        setSurveyCards(data);
      })
      .catch(() => {
        if (!isActive) return;
        setSurveyCards(null);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Fetch social listening dashboard cards
  useEffect(() => {
    let isActive = true;

    Promise.allSettled([getDashboardMentions(), getDashboardSentiment()])
      .then(([mentionsRes, sentimentRes]) => {
        if (!isActive) return;

        if (mentionsRes.status === "fulfilled") {
          setMentionsCard(mentionsRes.value);
        } else {
          setMentionsCard(null);
        }

        if (sentimentRes.status === "fulfilled") {
          setSentimentCard(sentimentRes.value);
        } else {
          setSentimentCard(null);
        }
      })
      .catch(() => {
        if (!isActive) return;
        setMentionsCard(null);
        setSentimentCard(null);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const surveyStats = useMemo(() => {
    return surveys.reduce(
      (acc, survey) => {
        const status = (survey.status ?? "").trim().toLowerCase();
        const isPublished = Number(survey.is_published ?? 0) === 1;

        acc.total += 1;

        if (status === "close") {
          acc.closed += 1;
        } else if (isPublished) {
          acc.active += 1;
        } else if (status === "draft") {
          acc.draft += 1;
        }

        return acc;
      },
      { total: 0, active: 0, closed: 0, draft: 0 },
    );
  }, [surveys]);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total Surveys"
                value={surveyStats.total.toString()}
                icon={FileText}
                badges={[
                  {
                    label: "Active",
                    count: surveyStats.active,
                    variant: "success",
                  },
                  {
                    label: "Closed",
                    count: surveyStats.closed,
                    variant: "secondary",
                  },
                  {
                    label: "Draft",
                    count: surveyStats.draft,
                    variant: "warning",
                  },
                ]}
              />

              <StatCard
                title="Total Responses"
                value={
                  surveyCards
                    ? surveyCards.totalResponses.toLocaleString()
                    : "0"
                }
                icon={Users}
                iconBgColor="bg-purple-500/10"
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

              <MentionsCard totalMentions={mentionsCard?.totalMentions ?? 0} />
              <SentimentChart
                positive={sentimentCard?.positive ?? 0}
                neutral={sentimentCard?.neutral ?? 0}
                negative={sentimentCard?.negative ?? 0}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <div className="xl:col-span-2">
                <ResponseTrendChart
                  data={trendData}
                  selectedRange={trendRange}
                  onRangeChange={setTrendRange}
                />
              </div>
              <RecentProjects />
            </div>

            <ActiveSurveys surveys={surveys} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
