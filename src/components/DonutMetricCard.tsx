import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { LucideIcon } from "lucide-react";

interface DonutMetricCardProps {
  title: string;
  icon: LucideIcon;
  percentage: number;
  data: { label: string; value: string | number; color?: string }[];
  chartColor: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function DonutMetricCard({
  title,
  icon: Icon,
  percentage,
  data,
  chartColor,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: DonutMetricCardProps) {
  const chartData = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={chartColor} />
                  <Cell fill="hsl(var(--muted))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-0 flex-1">
            {data.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs text-muted-foreground truncate">
                  {item.label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    item.color || "text-foreground"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
