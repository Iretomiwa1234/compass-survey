import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  badges?: {
    label: string;
    count: number;
    variant?:
      | "default"
      | "secondary"
      | "success"
      | "warning"
      | "destructive"
      | "outline";
  }[];
  iconBgColor?: string;
  iconColor?: string;
}

const badgeStyles: Record<string, { bg: string; text: string }> = {
  success: { bg: "#E8F8EB", text: "#118C36" },
  warning: { bg: "#F8E8D9", text: "#8C5A22" },
  destructive: { bg: "#F8DCDC", text: "#A12D2D" },
  secondary: { bg: "#EEF2F8", text: "#65758B" },
  default: { bg: "#EEF2F8", text: "#65758B" },
  outline: { bg: "transparent", text: "currentColor" },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  badges,
  iconBgColor,
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <Card className="border-[#dce8f5] shadow-sm rounded-xl">
      <CardContent className="p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-sm font-semibold text-[#5a6b80]">{title}</p>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-black leading-tight text-[#0b1526]">
            {value}
          </p>
        </div>

        {badges && badges.length > 0 && (
          <div className="flex gap-4 overflow-hidden">
            {badges.map((badge, idx) => {
              const style =
                badgeStyles[badge.variant || "default"] || badgeStyles.default;
              return (
                <div
                  key={`${badge.label}-${idx}`}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  <span
                    className="block w-full truncate rounded-full px-3 py-[6px] text-[11px] font-semibold leading-4 text-center"
                    style={{ backgroundColor: style.bg, color: style.text }}
                    title={badge.label}
                  >
                    {badge.label}
                  </span>
                  <span
                    className="mt-2 text-base font-black sm:text-lg text-center"
                    style={{ color: style.text }}
                  >
                    {badge.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
