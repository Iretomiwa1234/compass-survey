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
  success: { bg: "#DFFFE1", text: "#2F8035" },
  warning: { bg: "#FFEDDD", text: "#80522A" },
  destructive: { bg: "#FCD9D9", text: "#792121" },
  secondary: { bg: "#F1F5F9", text: "#64748B" },
  default: { bg: "#F1F5F9", text: "#64748B" },
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={`p-2 rounded-lg ${iconBgColor || "bg-primary/10"}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>

        {badges && badges.length > 0 && (
          <div className="flex gap-2">
            {badges.map((badge, idx) => {
              const style =
                badgeStyles[badge.variant || "default"] || badgeStyles.default;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center flex-1 gap-2 min-w-0"
                >
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-md w-full text-center truncate"
                    style={{ backgroundColor: style.bg, color: style.text }}
                    title={badge.label}
                  >
                    {badge.label}
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: style.text }}
                  >
                    {badge.count}
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
