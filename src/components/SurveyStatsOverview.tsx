import { Users, TrendingUp, Globe2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DonutMetricCard } from "@/components/DonutMetricCard";
import { CompletionRateCard } from "@/components/CompletionRateCard";
import { Card, CardContent } from "@/components/ui/card";

interface SurveyStatsOverviewProps {
  totalResponses?: string;
  avgResponsePercentage?: number;
  completionPercentage?: number;
  completedCount?: string;
  abandonedCount?: string;
  countryReach?: number;
  countryData?: Array<{ name: string; count: number }>;
  variant?: "research" | "analysis";
}

export function SurveyStatsOverview({
  totalResponses = "1,500",
  avgResponsePercentage = 72,
  completionPercentage = 10,
  completedCount = "1,300",
  abandonedCount = "200",
  countryReach = 16,
  countryData = [
    { name: "Africa", count: 5 },
    { name: "Asia", count: 3 },
    { name: "Europe", count: 3 },
    { name: "America", count: 4 },
  ],
  variant = "research",
}: SurveyStatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Total Responses Card - Always use StatCard */}
      <StatCard
        title="Total Responses"
        value={totalResponses}
        icon={Users}
        iconBgColor="bg-purple-500/10"
        iconColor="text-purple-500"
        badges={[
          { label: "Completed", count: 1100, variant: "success" },
          { label: "In Progress", count: 200, variant: "warning" },
          { label: "Abandoned", count: 200, variant: "destructive" },
        ]}
      />

      {/* Avg Response Rate */}
      <DonutMetricCard
        title="Avg Response Rate"
        icon={TrendingUp}
        percentage={avgResponsePercentage}
        chartColor="#6A9CCE"
        iconBgColor="bg-amber-500/10"
        iconColor="text-amber-500"
        rotation={0}
        data={[
          { label: "Total Invite Sent", value: "1,500" },
          {
            label: "Total Responds",
            value: "1,300",
            color: "text-blue-600",
          },
        ]}
      />

      {/* Completion Rate Card */}
      <CompletionRateCard
        percentage={completionPercentage}
        completedValue={completedCount}
        abandonedValue={abandonedCount}
      />

      {/* Country Reach Card - Always use research styling */}
      <Card className="border-[#dce8f5] shadow-sm rounded-xl">
        <CardContent className="p-5 md:p-6">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <Globe2 className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <div className="mb-3 space-y-1">
            <p className="text-xs font-semibold text-[#5a6b80] sm:text-sm">
              Country Reach
            </p>
            <p className="text-xl font-black leading-tight text-[#0b1526] sm:text-2xl">
              {countryReach}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {countryData.map((region) => (
              <div key={region.name} className="space-y-1">
                <span className="block max-w-[88px] truncate rounded-full bg-[#EEF2F8] px-3 py-[6px] text-[11px] font-semibold text-[#65758B] mx-auto">
                  {region.name}
                </span>
                <span className="block text-base font-black text-[#65758B]">
                  {region.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
