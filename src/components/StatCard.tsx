import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  badges?: { label: string; count: number; variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }[];
  iconBgColor?: string;
}

export function StatCard({ title, value, icon: Icon, badges, iconBgColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${iconBgColor || 'bg-primary/10'}`}>
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="space-y-1 mb-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        
        {badges && badges.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Badge variant={badge.variant || "secondary"}>
                  {badge.label}
                </Badge>
                <span className="text-sm font-semibold">{badge.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
