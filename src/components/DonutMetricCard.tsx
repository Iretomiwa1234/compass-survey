import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DonutMetricCardProps {
  title: string;
  icon: LucideIcon;
  percentage: number;
  chartColor: string;
  secondaryChartColor?: string;
  iconBgColor: string;
  iconColor: string;
  rotation?: number;
  showBackground?: boolean;
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
  secondaryChartColor,
  iconBgColor,
  iconColor,
  rotation = -360,
  showBackground = true,
  data,
}: DonutMetricCardProps) => {
  const circumference = 2 * Math.PI * 45;
  const clampedPct = Math.max(0, Math.min(100, percentage));

  // Small gap between segments when secondary color exists
  const gapAngle = secondaryChartColor ? 20 : 0;
  const gapLength = (gapAngle / 360) * circumference;

  // Calculate lengths
  const primaryLength = Math.max(0, (clampedPct / 100) * circumference);

  const secondaryLength = secondaryChartColor
    ? Math.max(0, circumference - primaryLength - gapLength)
    : 0;

  const primaryRotation = rotation;

  // Map primary length to degrees
  const primaryAngleDegrees = (primaryLength / circumference) * 360;

  // Start secondary after primary + small gap
  const secondaryRotation = rotation + primaryAngleDegrees + gapAngle;

  return (
    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
      <CardContent className="p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-sm font-semibold text-[#5a6b80]">{title}</p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 96 96"
              preserveAspectRatio="xMidYMid meet"
            >
              {showBackground && (
                <circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke="#dfe7f2"
                  strokeWidth="14"
                  fill="none"
                  transform={`rotate(${rotation} 48 48)`}
                />
              )}
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke={chartColor}
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${Math.max(
                  0,
                  primaryLength
                )} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform={`rotate(${primaryRotation} 48 48)`}
              />
              {secondaryChartColor && secondaryLength > 0 && (
                <circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke={secondaryChartColor}
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={`${Math.max(
                    0,
                    secondaryLength
                  )} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform={`rotate(${secondaryRotation} 48 48)`}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-[#0b1526]">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 text-right">
            {data.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs font-medium text-[#5a6b80]">
                  {item.label}
                </p>
                <p
                  className={`text-xl font-bold ${
                    item.color || "text-[#0b1526]"
                  }`}
                >
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
