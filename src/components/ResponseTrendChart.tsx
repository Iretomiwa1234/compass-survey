import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fallbackData = [
  { day: "Monday", value: 0 },
  { day: "Tuesday", value: 0 },
  { day: "Wednesday", value: 0 },
  { day: "Thursday", value: 0 },
  { day: "Friday", value: 0 },
  { day: "Saturday", value: 0 },
  { day: "Sunday", value: 0 },
];

interface ResponseTrendChartProps {
  data?: { day: string; value: number }[];
  selectedRange?: "this-week" | "last-week" | "last-2-weeks";
  onRangeChange?: (value: "this-week" | "last-week" | "last-2-weeks") => void;
}

export function ResponseTrendChart({
  data,
  selectedRange = "this-week",
  onRangeChange,
}: ResponseTrendChartProps) {
  const chartData = data && data.length > 0 ? data : fallbackData;
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Response Trend
          </CardTitle>
          <Select
            value={selectedRange}
            onValueChange={(value) =>
              onRangeChange?.(
                value as "this-week" | "last-week" | "last-2-weeks",
              )
            }
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="This Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-2-weeks">Last 2 Weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
