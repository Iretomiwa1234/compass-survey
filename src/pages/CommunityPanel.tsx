import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, Star, MessageCircle } from "lucide-react";

const panelMembers = [
  {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    status: "active",
    responses: 45,
    rating: 4.8,
    joined: "Jan 2024",
  },
  {
    name: "Michael Chen",
    email: "m.chen@email.com",
    status: "active",
    responses: 38,
    rating: 4.6,
    joined: "Feb 2024",
  },
  {
    name: "Emily Davis",
    email: "emily.d@email.com",
    status: "inactive",
    responses: 12,
    rating: 4.2,
    joined: "Mar 2024",
  },
  {
    name: "James Wilson",
    email: "j.wilson@email.com",
    status: "active",
    responses: 52,
    rating: 4.9,
    joined: "Dec 2023",
  },
  {
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    status: "active",
    responses: 29,
    rating: 4.5,
    joined: "Jan 2024",
  },
  {
    name: "Robert Brown",
    email: "r.brown@email.com",
    status: "pending",
    responses: 0,
    rating: 0,
    joined: "Apr 2024",
  },
];

const CommunityPanel = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Community Panel
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your research community
                </p>
              </div>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Members
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +12 this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Active Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    91% active rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Avg Response Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +3% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Avg Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Out of 5.0
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Panel Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {panelMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-[#206AB5] text-primary-foreground">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{member.name}</p>
                            <Badge
                              variant={
                                member.status === "active"
                                  ? "success"
                                  : member.status === "inactive"
                                  ? "secondary"
                                  : "warning"
                              }
                            >
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm font-semibold">
                            <MessageCircle className="w-4 h-4 text-primary" />
                            {member.responses}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Responses
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm font-semibold">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {member.rating > 0 ? member.rating : "-"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Rating
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">
                            {member.joined}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CommunityPanel;
