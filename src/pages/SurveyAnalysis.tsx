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
  Legend,
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
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-16">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-6">
                Survey Analysis
              </h1>

              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border mb-6">
                <h2 className="text-lg font-medium">
                  Customer Satisfaction Survey
                </h2>
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for survey" className="pl-9" />
                  </div>
                  <Select defaultValue="survey1">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Survey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survey1">Select Survey</SelectItem>
                      <SelectItem value="survey2">Product Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      Total Responses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">1,500</div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-green-50 p-1 rounded">
                        <div className="font-semibold text-green-700">
                          Completed
                        </div>
                        <div className="text-green-700">1,100</div>
                      </div>
                      <div className="bg-orange-50 p-1 rounded">
                        <div className="font-semibold text-orange-700">
                          In Progress
                        </div>
                        <div className="text-orange-700">200</div>
                      </div>
                      <div className="bg-red-50 p-1 rounded">
                        <div className="font-semibold text-red-700">
                          Abandoned
                        </div>
                        <div className="text-red-700">200</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-500" />
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
                            <Cell fill="#3B82F6" />
                            <Cell fill="#E5E7EB" />
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
                        <div className="font-bold text-blue-600">1,300</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
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
                            <Cell fill="#22C55E" />
                            <Cell fill="#E5E7EB" />
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
                        <div className="font-bold text-green-600">1,300</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Abandoned</div>
                        <div className="font-bold text-red-600">200</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      Country Reach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">16</div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-blue-50 p-1 rounded">
                        <div className="font-semibold text-blue-700">
                          Africa
                        </div>
                        <div className="text-blue-700">5</div>
                      </div>
                      <div className="bg-blue-50 p-1 rounded">
                        <div className="font-semibold text-blue-700">Asia</div>
                        <div className="text-blue-700">3</div>
                      </div>
                      <div className="bg-blue-50 p-1 rounded">
                        <div className="font-semibold text-blue-700">
                          Europe
                        </div>
                        <div className="text-blue-700">3</div>
                      </div>
                      <div className="bg-blue-50 p-1 rounded">
                        <div className="font-semibold text-blue-700">
                          America
                        </div>
                        <div className="text-blue-700">4</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
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
                                stopColor="#3B82F6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3B82F6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
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
                        <div className="text-center">
                          <div className="text-2xl font-bold">24%</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Response By Country
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={countryData} barSize={6}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#1E40AF"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Browser usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {browserData.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{item.name}</span>
                            <span className="text-blue-600 font-medium">
                              {item.value}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-200 rounded-full"
                              style={{ width: `${(item.value / 1000) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs text-muted-foreground mt-4">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Full Name</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableBody>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell className="font-medium text-right pr-12 py-4">
                            Respondent
                          </TableCell>
                        </TableRow>
                        {respondentData.map((name, idx) => (
                          <TableRow
                            key={idx}
                            className="even:bg-muted/50 border-0"
                          >
                            <TableCell className="text-center text-muted-foreground py-4">
                              {name}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Age</CardTitle>
                    <div className="text-sm font-medium">Total: 1,300</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-8 mb-4">
                        <div className="text-sm font-medium w-12">Age</div>
                      </div>
                      {ageData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 text-sm"
                        >
                          <div className="w-12 text-muted-foreground">
                            {item.range}
                          </div>
                          <div className="flex-1 h-3 bg-blue-50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400 rounded-full relative group"
                              style={{ width: `${item.value * 2}%` }}
                            >
                              {idx === 2 && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded">
                                  56
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-12 text-right text-muted-foreground">
                            {item.value}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                      {ageData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                          <span>{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SurveyAnalysis;
