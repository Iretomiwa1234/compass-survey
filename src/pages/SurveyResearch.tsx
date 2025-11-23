import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/StatCard";
import { DonutMetricCard } from "@/components/DonutMetricCard";
import { SurveyListItem, Survey } from "@/components/SurveyListItem";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Users,
  TrendingUp,
  CheckCircle2,
  Globe2,
  Search,
  Plus,
} from "lucide-react";

const surveys: Survey[] = [
  {
    id: "1",
    title: "Customer Satisfaction Survey",
    status: "Active",
    totalResponse: 1520,
    responseRate: 68,
    createdDate: "20/09/2025",
  },
  {
    id: "2",
    title: "Product Feedback Collection",
    status: "Draft",
    totalResponse: 0,
    responseRate: 0,
    createdDate: "22/09/2025",
  },
  {
    id: "3",
    title: "Employee Engagement Study",
    status: "Closed",
    totalResponse: 1520,
    responseRate: 68,
    createdDate: "20/09/2025",
  },
  {
    id: "4",
    title: "Product Market Survey",
    status: "Closed",
    totalResponse: 1520,
    responseRate: 68,
    createdDate: "20/09/2025",
  },
  {
    id: "5",
    title: "Useability Study",
    status: "Closed",
    totalResponse: 1490,
    responseRate: 78,
    createdDate: "19/09/2025",
  },
  {
    id: "6",
    title: "Customer Product Feedback",
    status: "Closed",
    totalResponse: 520,
    responseRate: 58,
    createdDate: "17/09/2025",
  },
  {
    id: "7",
    title: "Webinar Follow-Up Survey",
    status: "Closed",
    totalResponse: 1220,
    responseRate: 82,
    createdDate: "15/09/2025",
  },
  {
    id: "8",
    title: "Product Concept Testing",
    status: "Closed",
    totalResponse: 20,
    responseRate: 38,
    createdDate: "12/09/2025",
  },
  {
    id: "9",
    title: "Speaker and Session Rating",
    status: "Closed",
    totalResponse: 450,
    responseRate: 58,
    createdDate: "10/09/2025",
  },
  {
    id: "10",
    title: "Customer Product Feedback",
    status: "Closed",
    totalResponse: 620,
    responseRate: 65,
    createdDate: "6/09/2025",
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
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Customer Satisfaction Survey
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                  title="Total Responses"
                  value="1,500"
                  icon={Users}
                  iconBgColor="bg-purple-500/10"
                  iconColor="text-purple-500"
                  badges={[
                    { label: "Completed", count: 1100, variant: "success" },
                    { label: "In Progress", count: 200, variant: "warning" },
                    { label: "Abandoned", count: 200, variant: "destructive" },
                  ]}
                />

                <DonutMetricCard
                  title="Avg Response Rate"
                  icon={TrendingUp}
                  percentage={72}
                  chartColor="#3B82F6"
                  iconBgColor="bg-orange-500/10"
                  iconColor="text-orange-500"
                  data={[
                    { label: "Total Invite Sent", value: "1,500" },
                    {
                      label: "Total Responded",
                      value: "1,300",
                      color: "text-blue-500",
                    },
                  ]}
                />

                <DonutMetricCard
                  title="Completion Rate"
                  icon={CheckCircle2}
                  percentage={80}
                  chartColor="#22C55E"
                  iconBgColor="bg-green-500/10"
                  iconColor="text-green-500"
                  data={[
                    {
                      label: "Completed",
                      value: "1,300",
                      color: "text-green-500",
                    },
                    { label: "Abandoned", value: "200", color: "text-red-500" },
                  ]}
                />

                <StatCard
                  title="Country Reach"
                  value="16"
                  icon={Globe2}
                  iconBgColor="bg-blue-500/10"
                  iconColor="text-blue-500"
                  badges={[
                    { label: "Africa", count: 5, variant: "secondary" },
                    { label: "Asia", count: 3, variant: "secondary" },
                    { label: "Europe", count: 3, variant: "secondary" },
                    { label: "America", count: 4, variant: "secondary" },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for survey"
                    className="pl-9 bg-background"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Surveys" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Surveys</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                Create Survey
              </Button>
            </div>

            <div className="space-y-3 mb-8">
              {surveys.map((survey) => (
                <SurveyListItem key={survey.id} survey={survey} />
              ))}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">50</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SurveyResearch;
