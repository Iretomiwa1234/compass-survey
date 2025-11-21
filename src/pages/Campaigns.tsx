import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const campaigns = [
  { name: "Customer Satisfaction Q4", status: "active", sent: 3245, responses: 2156, completion: 66, startDate: "Nov 1, 2024", endDate: "Nov 30, 2024" },
  { name: "Product Launch Survey", status: "active", sent: 1567, responses: 892, completion: 57, startDate: "Nov 10, 2024", endDate: "Dec 10, 2024" },
  { name: "Employee Feedback", status: "paused", sent: 856, responses: 734, completion: 86, startDate: "Oct 15, 2024", endDate: "Nov 15, 2024" },
  { name: "Market Research Initiative", status: "scheduled", sent: 0, responses: 0, completion: 0, startDate: "Dec 1, 2024", endDate: "Dec 31, 2024" },
  { name: "Brand Awareness Study", status: "completed", sent: 5234, responses: 4987, completion: 95, startDate: "Sep 1, 2024", endDate: "Oct 31, 2024" },
];

const Campaigns = () => {
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
                <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
                <p className="text-muted-foreground mt-1">Manage your distribution campaigns</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 5 total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10,902</div>
                  <p className="text-xs text-muted-foreground mt-1">All campaigns</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,769</div>
                  <p className="text-xs text-muted-foreground mt-1">80% response rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">73%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across active campaigns</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle>{campaign.name}</CardTitle>
                          <Badge variant={
                            campaign.status === "active" ? "success" :
                            campaign.status === "paused" ? "warning" :
                            campaign.status === "scheduled" ? "secondary" :
                            "secondary"
                          }>
                            {campaign.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {campaign.startDate} - {campaign.endDate}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === "active" && (
                          <Button variant="outline" size="icon">
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {(campaign.status === "paused" || campaign.status === "scheduled") && (
                          <Button variant="outline" size="icon">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="icon">
                          <BarChart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Sent</p>
                        <p className="text-2xl font-bold">{campaign.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Responses</p>
                        <p className="text-2xl font-bold">{campaign.responses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Completion</p>
                        <p className="text-2xl font-bold">{campaign.completion}%</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-semibold">{campaign.completion}%</span>
                      </div>
                      <Progress value={campaign.completion} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Campaigns;
