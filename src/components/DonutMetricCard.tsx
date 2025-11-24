import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DonutMetricCardProps {
  title: string;
  icon: LucideIcon;
  percentage: number;
  chartColor: string;
  iconBgColor: string;
  iconColor: string;
  data: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
}

export const DonutMetricCard = ({
  title,
  icon: Icon,
  percentage,
  chartColor,
  iconBgColor,
  iconColor,
  data,
}: DonutMetricCardProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke={chartColor}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{percentage}%</span>
            </div>
          </div>

          <div className="space-y-2">
            {data.map((item, idx) => (
              <div key={idx}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-sm font-semibold ${item.color || "text-foreground"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
