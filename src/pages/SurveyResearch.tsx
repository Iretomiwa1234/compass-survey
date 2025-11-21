import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const surveys = [
  {
    id: 1,
    title: "Customer Satisfaction Q4 2024",
    status: "active",
    responses: 342,
    completion: 68,
    lastModified: "2 hours ago",
    questions: 12,
  },
  {
    id: 2,
    title: "Product Feedback Survey",
    status: "active",
    responses: 156,
    completion: 45,
    lastModified: "1 day ago",
    questions: 8,
  },
  {
    id: 3,
    title: "Employee Engagement 2024",
    status: "closed",
    responses: 892,
    completion: 95,
    lastModified: "3 days ago",
    questions: 15,
  },
  {
    id: 4,
    title: "Market Research - Tech Industry",
    status: "draft",
    responses: 0,
    completion: 0,
    lastModified: "1 week ago",
    questions: 20,
  },
  {
    id: 5,
    title: "Brand Awareness Study",
    status: "active",
    responses: 567,
    completion: 72,
    lastModified: "5 hours ago",
    questions: 10,
  },
];

const SurveyResearch = () => {
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
              <h1 className="text-3xl font-bold text-foreground">Survey Research</h1>
              <p className="text-muted-foreground mt-1">Create and manage your surveys</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Survey
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search surveys..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {surveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{survey.title}</CardTitle>
                        <Badge
                          variant={
                            survey.status === "active"
                              ? "success"
                              : survey.status === "closed"
                              ? "secondary"
                              : "warning"
                          }
                        >
                          {survey.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {survey.questions} questions • Last modified {survey.lastModified}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Survey
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Responses</p>
                      <p className="text-2xl font-bold text-foreground">{survey.responses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold text-foreground">{survey.completion}%</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${survey.completion}%` }}
                        />
                      </div>
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

export default SurveyResearch;
