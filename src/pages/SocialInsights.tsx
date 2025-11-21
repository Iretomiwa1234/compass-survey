import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const platformData = [
  { platform: "Twitter", mentions: 1850, engagement: 12500 },
  { platform: "Facebook", mentions: 1320, engagement: 8900 },
  { platform: "Instagram", mentions: 2100, engagement: 15600 },
  { platform: "LinkedIn", mentions: 890, engagement: 6700 },
];

const sentimentTrend = [
  { date: "Nov 1", positive: 65, neutral: 25, negative: 10 },
  { date: "Nov 8", positive: 70, neutral: 20, negative: 10 },
  { date: "Nov 15", positive: 68, neutral: 22, negative: 10 },
  { date: "Nov 22", positive: 72, neutral: 18, negative: 10 },
];

const topicDistribution = [
  { name: "Product Features", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Customer Service", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Pricing", value: 20, color: "hsl(var(--chart-3))" },
  { name: "User Experience", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
];

const SocialInsights = () => {
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
              <h1 className="text-3xl font-bold text-foreground">Social Insights</h1>
              <p className="text-muted-foreground mt-1">Analyze social media performance and trends</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6,160</div>
                  <p className="text-xs text-muted-foreground mt-1">+22% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">43,700</div>
                  <p className="text-xs text-muted-foreground mt-1">+18% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+72</div>
                  <p className="text-xs text-muted-foreground mt-1">Mostly positive</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245K</div>
                  <p className="text-xs text-muted-foreground mt-1">Unique users reached</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="platforms" className="space-y-6">
              <TabsList>
                <TabsTrigger value="platforms">Platform Analysis</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
                <TabsTrigger value="topics">Topic Distribution</TabsTrigger>
              </TabsList>

              <TabsContent value="platforms" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance by Platform</CardTitle>
                    <CardDescription>Mentions and engagement across social platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar dataKey="mentions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="engagement" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Trend Over Time</CardTitle>
                    <CardDescription>Weekly sentiment distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={sentimentTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} />
                        <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Distribution</CardTitle>
                    <CardDescription>What people are talking about</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={topicDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {topicDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SocialInsights;
