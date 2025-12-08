import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown, Smile } from "lucide-react";

const data = [
  { name: "Positive", value: 60, count: 1404 },
  { name: "Neutral", value: 25, count: 819 },
  { name: "Negative", value: 15, count: 117 },
];

const COLORS = {
  Positive: "hsl(var(--success))",
  Neutral: "hsl(var(--warning))",
  Negative: "hsl(var(--destructive))",
};

export function SentimentChart() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="p-2 rounded-lg bg-success/10">
            <Smile className="w-5 h-5 text-success" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 !border-none !text-[0.6em]"
          >
            Optimal Brand
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-sm text-muted-foreground">Sentiment</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  cornerRadius={4}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">60%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: COLORS[item.name as keyof typeof COLORS],
                    }}
                  />
                  <span className="text-sm text-muted-foreground truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
