import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const responseData = [
  { question: "Q1", responses: 342 },
  { question: "Q2", responses: 298 },
  { question: "Q3", responses: 315 },
  { question: "Q4", responses: 289 },
  { question: "Q5", responses: 305 },
];

const sentimentData = [
  { name: "Positive", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Neutral", value: 35, color: "hsl(var(--chart-2))" },
  { name: "Negative", value: 20, color: "hsl(var(--chart-3))" },
];

const trendData = [
  { date: "Jan", satisfaction: 65, engagement: 72 },
  { date: "Feb", satisfaction: 68, engagement: 75 },
  { date: "Mar", satisfaction: 72, engagement: 78 },
  { date: "Apr", satisfaction: 70, engagement: 76 },
  { date: "May", satisfaction: 75, engagement: 82 },
  { date: "Jun", satisfaction: 78, engagement: 85 },
];

const SurveyAnalysis = () => {
  const [exportOpen, setExportOpen] = useState(false);

  const handleExport = () => {
    const csvContent = [
      "Survey Analysis Report - Customer Satisfaction Survey",
      "",
      "Total Responses,1500",
      "Completed,1100",
      "In Progress,200",
      "Abandoned,200",
      "Avg Response Rate,72%",
      "Completion Rate,80%",
      "Country Reach,16",
      "",
      "Device Usage",
      "Device,Count",
      "Desktop,410",
      "Mobile,142",
      "Tablet,340",
      "",
      "Browser Usage",
      "Browser,Count",
      "Chrome,807",
      "Safari,455",
      "Firefox,253",
      "Edge,57",
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `survey_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
  };

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Survey Analysis</h1>
              <p className="text-muted-foreground mt-1">Analyze survey responses and insights</p>
            </div>
            <div className="flex gap-3 items-center">
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select survey" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Surveys</SelectItem>
                  <SelectItem value="q4">Customer Satisfaction Q4</SelectItem>
                  <SelectItem value="product">Product Feedback</SelectItem>
                  <SelectItem value="employee">Employee Engagement</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setExportOpen(true)} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="responses">Response Analysis</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Responses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-foreground">3,250</p>
                    <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Avg Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-foreground">68%</p>
                    <p className="text-sm text-muted-foreground mt-2">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Satisfaction Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-foreground">4.2/5</p>
                    <p className="text-sm text-muted-foreground mt-2">+0.3 from last month</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="responses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Responses by Question</CardTitle>
                  <CardDescription>Total responses received per question</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={responseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="question" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar dataKey="responses" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Sentiment</CardTitle>
                  <CardDescription>Distribution of sentiment across all responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
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

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>6-Month Trend Analysis</CardTitle>
                  <CardDescription>Satisfaction and engagement scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trendData}>
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
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="satisfaction" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </main>
        </SidebarInset>
      </div>

      {/* Export Modal */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Survey Analysis</DialogTitle>
            <DialogDescription>
              Export your survey analysis data as a CSV file.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SurveyAnalysis;
