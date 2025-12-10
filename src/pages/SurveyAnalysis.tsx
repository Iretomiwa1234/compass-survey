import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  Users,
  TrendingUp,
  CheckCircle,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const responseTrendData = [
  { day: "Monday", value: 1800 },
  { day: "Tuesday", value: 1000 },
  { day: "Wednesday", value: 1600 },
  { day: "Thursday", value: 1500 },
  { day: "Friday", value: 1900 },
  { day: "Saturday", value: 900 },
  { day: "Sunday", value: 1200 },
];

const deviceUsageData = [
  { name: "Desktop", value: 410, color: "#5B8FF9" },
  { name: "Mobile", value: 142, color: "#FF9D4D" },
  { name: "Tablet", value: 340, color: "#313C4A" },
];

const countryData = [
  { day: "Monday", value: 250 },
  { day: "Tuesday", value: 1100 },
  { day: "Wednesday", value: 750 },
  { day: "Thursday", value: 550 },
  { day: "Friday", value: 800 },
  { day: "Saturday", value: 250 },
  { day: "Sunday", value: 1100 },
];

const browserData = [
  { name: "Chrome", value: 807 },
  { name: "Safari", value: 455 },
  { name: "Firefox", value: 253 },
  { name: "Edge", value: 57 },
];

const respondentData = [
  "Ronald Richards",
  "Jerome Bell",
  "Floyd Miles",
  "Brooklyn Simmons",
  "Darlene Robertson",
  "Robert Fox",
];

const ageData = [
  { range: "18 - 24", value: 3.3 },
  { range: "25 - 34", value: 12.7 },
  { range: "35 - 44", value: 15.2 },
  { range: "45 - 64", value: 25.3 },
  { range: "65+", value: 33.5 },
];

const SurveyAnalysis = () => {
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleExport = () => {
    // CSV export logic would go here
    setExportModalOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card px-4 h-14">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>

          <DashboardHeader />

          <main className="flex-1 p-6 space-y-6 bg-background">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-foreground">
                Survey Analysis
              </h1>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <h2 className="text-lg font-medium">
                    Customer Satisfaction Survey
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search for survey" className="pl-9" />
                    </div>
                    <Select defaultValue="survey1">
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Survey" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="survey1">Select Survey</SelectItem>
                        <SelectItem value="survey2">
                          Product Feedback
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      className="w-full sm:w-auto gap-2"
                      onClick={() => setExportModalOpen(true)}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Total Responses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">1,500</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="bg-success/10 p-1 rounded text-center font-semibold text-success text-[0.8em]">
                        Completed
                      </div>
                      <div className="text-success">1,100</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-warning/10 p-1 rounded text-center text-warning text-[0.8em]">
                        Progress
                      </div>
                      <div className="text-warning">200</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-destructive/10 p-1 rounded text-center text-destructive text-[0.8em]">
                        Abandoned
                      </div>
                      <div className="text-destructive">200</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-warning" />
                    Avg Response Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="relative w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: 72 }, { value: 28 }]}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          <Cell fill="hsl(var(--primary))" />
                          <Cell fill="hsl(var(--muted))" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                      72%
                    </div>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <div className="text-muted-foreground">
                        Total Invite Sent
                      </div>
                      <div className="font-bold">1,500</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">
                        Total Responds
                      </div>
                      <div className="font-bold text-primary">1,300</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="relative w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: 80 }, { value: 20 }]}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          <Cell fill="hsl(var(--success))" />
                          <Cell fill="hsl(var(--muted))" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                      80%
                    </div>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <div className="text-muted-foreground">Completed</div>
                      <div className="font-bold text-success">1,300</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Abandoned</div>
                      <div className="font-bold text-destructive">200</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Country Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">16</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-primary/10 p-2 rounded text-center">
                      <div className="font-semibold text-primary">Africa</div>
                      <div className="text-primary">5</div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded text-center">
                      <div className="font-semibold text-primary">Asia</div>
                      <div className="text-primary">3</div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded text-center">
                      <div className="font-semibold text-primary">Europe</div>
                      <div className="text-primary">3</div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded text-center">
                      <div className="font-semibold text-primary">America</div>
                      <div className="text-primary">4</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Response Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={responseTrendData}>
                        <defs>
                          <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
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
                          vertical={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <Tooltip />
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Device Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceUsageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          {deviceUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl font-bold">892</div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {deviceUsageData.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    Response By Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={countryData} barSize={8}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Browser Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {browserData.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{item.name}</span>
                          <span className="text-primary font-medium">
                            {item.value}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/40 rounded-full"
                            style={{ width: `${(item.value / 1000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs text-muted-foreground pt-2">
                      <span>0</span>
                      <span>500</span>
                      <span>1k</span>
                      <span>1.5k</span>
                      <span>2k</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-48 p-6 border-r">
                    <h3 className="text-base font-semibold">Full Name</h3>
                  </div>
                  <div className="flex-1">
                    <Table>
                      <TableBody>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell className="font-medium text-center py-3">
                            Respondent
                          </TableCell>
                        </TableRow>
                        {respondentData.map((name, idx) => (
                          <TableRow key={idx} className="hover:bg-muted/20">
                            <TableCell className="text-center text-muted-foreground py-3">
                              {name}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-48 p-6 border-r">
                    <h3 className="text-base font-semibold mb-6">Age</h3>
                    <div className="space-y-3">
                      {ageData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                          <span>{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-semibold">Age</h3>
                      <div className="text-sm font-medium">Total: 1,300</div>
                    </div>
                    <div className="space-y-4">
                      {ageData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 text-sm"
                        >
                          <div className="w-12 text-muted-foreground">
                            {item.range.replace(" - ", "-")}
                          </div>
                          <div className="flex-1 h-3 bg-primary/10 rounded overflow-hidden relative">
                            <div
                              className="h-full bg-primary/60 rounded"
                              style={{ width: `${item.value * 2.5}%` }}
                            />
                          </div>
                          <div className="w-12 text-right text-muted-foreground">
                            {item.value}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Contacts</DialogTitle>
            <DialogDescription>
              Export your audience insights as a CSV file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SurveyAnalysis;
