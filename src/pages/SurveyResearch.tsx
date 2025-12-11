import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SurveyStatsOverview } from "@/components/SurveyStatsOverview";
import { SurveyListItem, Survey } from "@/components/SurveyListItem";
<<<<<<< Updated upstream
import { Card, CardContent } from "@/components/ui/card"; // Keep for later use
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
=======
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
>>>>>>> Stashed changes
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StarIcon from "/assets/stars-01.svg?url";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Calendar, Target, FileText, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const surveys: Survey[] = [
  {
    id: "1",
    title: "Customer Satisfaction Survey",
    status: "Active",
    totalResponse: 1520,
    responseRate: 68,
    createdDate: "20/09/2025",
    description:
      "Gather feedback on customer satisfaction with our products and services.",
    targetAudience: "Customers",
  },
  {
    id: "2",
    title: "Product Feedback Collection",
    status: "Draft",
    totalResponse: 0,
    responseRate: 0,
    createdDate: "22/09/2025",
    description: "Collect feedback on new product features and improvements.",
    targetAudience: "All Groups",
  },
  {
    id: "3",
    title: "Employee Engagement Study",
    status: "Closed",
    totalResponse: 1520,
    responseRate: 68,
    createdDate: "20/09/2025",
    description: "Measure employee engagement and satisfaction levels.",
    targetAudience: "Employees",
  },
  {
    id: "4",
    title: "Product Market Survey",
    status: "Closed",
    totalResponse: 1520,
    responseRate: 68,
    createdDate: "20/09/2025",
    description: "Analyze market trends and product positioning.",
    targetAudience: "Customers",
  },
  {
    id: "5",
    title: "Useability Study",
    status: "Closed",
    totalResponse: 1490,
    responseRate: 78,
    createdDate: "19/09/2025",
    description: "Test user experience and interface usability.",
    targetAudience: "All Groups",
  },
  {
    id: "6",
    title: "Customer Product Feedback",
    status: "Closed",
    totalResponse: 520,
    responseRate: 58,
    createdDate: "17/09/2025",
    description: "Gather customer opinions on product quality.",
    targetAudience: "Customers",
  },
  {
    id: "7",
    title: "Webinar Follow-Up Survey",
    status: "Closed",
    totalResponse: 1220,
    responseRate: 82,
    createdDate: "15/09/2025",
    description: "Collect feedback from webinar attendees.",
    targetAudience: "All Groups",
  },
  {
    id: "8",
    title: "Product Concept Testing",
    status: "Closed",
    totalResponse: 20,
    responseRate: 38,
    createdDate: "12/09/2025",
    description: "Test new product concepts with target audience.",
    targetAudience: "Customers",
  },
  {
    id: "9",
    title: "Speaker and Session Rating",
    status: "Closed",
    totalResponse: 450,
    responseRate: 58,
    createdDate: "10/09/2025",
    description: "Rate conference speakers and sessions.",
    targetAudience: "All Groups",
  },
  {
    id: "10",
    title: "Customer Product Feedback",
    status: "Closed",
    totalResponse: 620,
    responseRate: 65,
    createdDate: "6/09/2025",
    description: "Ongoing customer feedback collection.",
    targetAudience: "Customers",
  },
];

const SurveyResearch = () => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const navigate = useNavigate();

  const handleGenerateWithAI = () => {
    setOpen(false);
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/ai-survey");
    }, 10000);
  };

  const handleView = (survey: Survey) => {
<<<<<<< Updated upstream
    setSelectedSurvey(survey);
    setViewModalOpen(true);
=======
    console.log("View survey:", survey.id);
>>>>>>> Stashed changes
  };

  const handleAnalytics = (survey: Survey) => {
    navigate("/survey-analysis");
  };

  const handleEdit = (survey: Survey) => {
    navigate("/create-survey");
  };

<<<<<<< Updated upstream
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600 border-green-200";
      case "draft":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "closed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

=======
>>>>>>> Stashed changes
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F7FBFF]">
        <DashboardSidebar />

        <SidebarInset className="flex flex-1 flex-col bg-[#F7FBFF]">
          <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-[#F7FBFF] px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Surveys" hideGreeting />

<<<<<<< Updated upstream
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="rounded-xl border border-[#dce8f5] bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                <h2 className="text-md font-semibold text-[#2b3a4f]">
                  Customer Satisfaction Survey
                </h2>
=======
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
                  remainingColor="#EF4444"
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
>>>>>>> Stashed changes
              </div>
            </div>

            <SurveyStatsOverview variant="research" />
            <div className="mt-6 rounded-xl border border-[#dce8f5] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex w-full items-center gap-4 sm:w-auto">
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
                      <SelectValue
                        placeholder="All Surveys"
                        className="!text-[0.4em]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Surveys</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => setOpen(true)}
                  className="w-full gap-2 bg-[#206AB5] text-white !text-xs !py-1 hover:bg-[#185287] sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create Survey
                </Button>
              </div>

              <div className="mb-8 space-y-3">
                {surveys.map((survey) => (
                  <SurveyListItem
                    key={survey.id}
                    survey={survey}
                    onView={handleView}
                    onAnalytics={handleAnalytics}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
<<<<<<< Updated upstream
=======

            <div className="space-y-3 mb-8">
              {surveys.map((survey) => (
                <SurveyListItem 
                  key={survey.id} 
                  survey={survey}
                  onView={handleView}
                  onAnalytics={handleAnalytics}
                  onEdit={handleEdit}
                />
              ))}
            </div>

>>>>>>> Stashed changes
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

      {/* Create Survey Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Survey</DialogTitle>
            <DialogDescription>
              Let's start with some basic information about your survey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Survey Title</Label>
              <Input placeholder="Customer feedback" className="mt-2" />
            </div>

            <div>
              <Label>Description</Label>
<<<<<<< Updated upstream
              <textarea
                className="w-full border rounded-md p-2 mt-2 h-24 bg-background text-foreground"
=======
              <textarea 
                className="w-full border rounded-md p-2 mt-2 h-24 bg-background text-foreground" 
>>>>>>> Stashed changes
                placeholder="Describe your survey..."
              />
            </div>

            <div>
              <Label>Target Audience</Label>
              <Select defaultValue="all">
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="employees">Employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleGenerateWithAI}
                className="bg-[#206AB5] hover:bg-[#123c67] text-white rounded-[8px] px-[10px] py-[16px]"
              >
                <img src={StarIcon} alt="" /> Generate with AI
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/create-survey")}
                className="bg-white border-[#D2E1F0] text-[#48556B] rounded-[8px] px-[10px] py-[16px]"
              >
                Create Manually
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generating Survey Loading Modal */}
      <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
        <DialogContent className="max-w-md p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <div>
              <DialogTitle className="text-lg mb-2">Create Survey</DialogTitle>
              <p className="text-sm text-muted-foreground">Generating Survey</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Survey Details View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSurvey?.title}
              {selectedSurvey && (
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                    selectedSurvey.status
                  )}`}
                >
                  {selectedSurvey.status}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedSurvey && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Description
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSurvey.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Target Audience
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSurvey.targetAudience || "All Groups"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Total Responses
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSurvey.totalResponse.toLocaleString()} responses (
                    {selectedSurvey.responseRate}% response rate)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Created Date
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSurvey.createdDate}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-[#206AB5] hover:bg-[#185287] text-white"
                  onClick={() => {
                    setViewModalOpen(false);
                    navigate("/survey-analysis");
                  }}
                >
                  View Analytics
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SurveyResearch;
