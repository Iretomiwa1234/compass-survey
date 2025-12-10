import { CheckCircle2 } from "lucide-react";
import { DonutMetricCard } from "@/components/DonutMetricCard";

interface CompletionRateCardProps {
  percentage?: number;
  completedValue?: string;
  abandonedValue?: string;
}

export function CompletionRateCard({
  percentage = 80,
  completedValue = "1,300",
  abandonedValue = "200",
}: CompletionRateCardProps) {
  return (
    <DonutMetricCard
      title="Completion Rate"
      icon={CheckCircle2}
      percentage={percentage}
      chartColor="#60DE60"
      secondaryChartColor="#F68181"
      iconBgColor="bg-green-500/10"
      iconColor="text-green-500"
      showBackground={false}
      data={[
        {
          label: "Completed",
          value: completedValue,
          color: "text-[#118C36]",
        },
        { label: "Abandoned", value: abandonedValue, color: "text-[#A12D2D]" },
      ]}
    />
  );
}
