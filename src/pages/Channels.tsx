import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Share2, Plus, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const channels = [
  { name: "Email", icon: Mail, status: "active", sent: 15234, delivered: 14890, openRate: "68%", clickRate: "24%" },
  { name: "SMS", icon: MessageSquare, status: "active", sent: 8456, delivered: 8423, openRate: "92%", clickRate: "35%" },
  { name: "Social Media", icon: Share2, status: "active", sent: 23451, delivered: 23120, openRate: "45%", clickRate: "18%" },
  { name: "Web Push", icon: MessageSquare, status: "inactive", sent: 0, delivered: 0, openRate: "0%", clickRate: "0%" },
];

const Channels = () => {
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
                <h1 className="text-3xl font-bold text-foreground">Distribution Channels</h1>
                <p className="text-muted-foreground mt-1">Manage your communication channels</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Channel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 4 channels</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47,141</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all channels</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">26%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all channels</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4">
              {channels.map((channel, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <channel.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{channel.name}</CardTitle>
                          <CardDescription>
                            <Badge variant={channel.status === "active" ? "success" : "secondary"}>
                              {channel.status}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch checked={channel.status === "active"} />
                        <Button variant="outline" size="icon">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Sent</p>
                        <p className="text-2xl font-bold">{channel.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Delivered</p>
                        <p className="text-2xl font-bold">{channel.delivered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Open Rate</p>
                        <p className="text-2xl font-bold">{channel.openRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Click Rate</p>
                        <p className="text-2xl font-bold">{channel.clickRate}</p>
                      </div>
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

export default Channels;
