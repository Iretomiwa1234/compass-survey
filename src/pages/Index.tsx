import { useEffect, useMemo, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/StatCard";
import { ResponseTrendChart } from "@/components/ResponseTrendChart";
import { RecentProjects } from "@/components/RecentProjects";
import { MentionsCard } from "@/components/MentionsCard";
import { SentimentChart } from "@/components/SentimentChart";
import { ActiveSurveys } from "@/components/ActiveSurveys";
import { FileText, Users } from "lucide-react";
import { getSurveys, SurveyListItemApi } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Index = () => {
  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);

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
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
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
                value="3,250"
                icon={Users}
                iconBgColor="bg-purple-500/10"
                badges={[
                  { label: "Completed", count: 1872, variant: "success" },
                  { label: "In Progress", count: 234, variant: "warning" },
                  { label: "Abandoned", count: 234, variant: "destructive" },
                ]}
              />

              <MentionsCard />

              <SentimentChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ResponseTrendChart />
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
