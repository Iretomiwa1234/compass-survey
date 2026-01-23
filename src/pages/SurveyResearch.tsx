import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SurveyStatsOverview } from "@/components/SurveyStatsOverview";
import { SurveyListItem, Survey } from "@/components/SurveyListItem";
import { Card, CardContent } from "@/components/ui/card"; // Keep for later use
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
  Search,
  Plus,
  Calendar,
  Target,
  FileText,
  Users,
  SearchX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getSurveys } from "@/lib/auth";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/survey/EmptyState";

const SurveyResearch = () => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const handleGenerateWithAI = useCallback(() => {
    setOpen(false);
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      navigate("/ai-survey");
    }, 10000);
  }, [navigate]);

  const handleView = useCallback((survey: Survey) => {
    setSelectedSurvey(survey);
    setViewModalOpen(true);
  }, []);

  const handleAnalytics = useCallback(
    (survey: Survey) => {
      navigate("/survey-analysis");
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (survey: Survey) => {
      navigate("/create-survey", {
        state: {
          surveyId: survey.id,
          title: survey.title,
        },
      });
    },
    [navigate],
  );

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

  useEffect(() => {
    let isActive = true;
    setIsLoadingSurveys(true);

    getSurveys(currentPage)
      .then((response) => {
        if (!isActive) return;
        const data = response?.data?.survey?.data ?? [];
        const mapped = data.map((item) => {
          const completion = Number.parseFloat(
            item.completion_percentage || "0",
          );
          const status = item.status || "draft";
          const formattedStatus =
            status.charAt(0).toUpperCase() + status.slice(1);
          return {
            id: String(item.survey_id),
            title: item.title,
            status: formattedStatus,
            totalResponse: item.total_responses,
            responseRate: Number.isNaN(completion) ? 0 : completion,
            createdDate: item.created_at,
          };
        });

        setSurveys(mapped);
        setLastPage(response?.data?.survey?.last_page ?? 1);
        setIsLoadingSurveys(false);
      })
      .catch(() => {
        if (!isActive) return;
        setSurveys([]);
        setLastPage(1);
        setIsLoadingSurveys(false);
      });

    return () => {
      isActive = false;
    };
  }, [currentPage]);

  const filteredSurveys = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return surveys.filter((survey) => {
      const matchesStatus =
        statusFilter === "all" || survey.status.toLowerCase() === statusFilter;
      const matchesSearch =
        query.length === 0 || survey.title.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [surveys, searchTerm, statusFilter]);

  const pages = useMemo(() => {
    const total = Math.max(1, lastPage);
    const current = Math.min(Math.max(1, currentPage), total);

    if (total <= 5) {
      return Array.from({ length: total }, (_, idx) => idx + 1);
    }

    const pageSet = new Set<number>();
    pageSet.add(1);
    pageSet.add(total);
    pageSet.add(current);
    pageSet.add(Math.max(1, current - 1));
    pageSet.add(Math.min(total, current + 1));

    return Array.from(pageSet).sort((a, b) => a - b);
  }, [currentPage, lastPage]);

  const surveyItems = useMemo(() => {
    if (filteredSurveys.length === 0) return null;
    return filteredSurveys.map((survey) => (
      <SurveyListItem
        key={survey.id}
        survey={survey}
        onView={handleView}
        onAnalytics={handleAnalytics}
        onEdit={handleEdit}
      />
    ));
  }, [filteredSurveys, handleAnalytics, handleEdit, handleView]);

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

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="rounded-xl border border-[#dce8f5] bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                <h2 className="text-md font-semibold text-[#2b3a4f]">
                  Customer Satisfaction Survey
                </h2>
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
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                {isLoadingSurveys ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={`survey-skeleton-${idx}`}
                      className="rounded-lg border border-border/50 p-4 animate-pulse"
                    >
                      <div className="h-4 w-1/3 rounded bg-muted mb-3" />
                      <div className="h-3 w-2/3 rounded bg-muted mb-2" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  ))
                ) : surveyItems ? (
                  surveyItems
                ) : searchTerm || statusFilter !== "all" ? (
                  <EmptyState
                    icon="search"
                    title="No matching surveys"
                    description={`We couldn't find any surveys matching "${searchTerm}" with status "${statusFilter}".`}
                    action={{
                      label: "Clear filters",
                      onClick: () => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      },
                    }}
                  />
                ) : (
                  <EmptyState
                    icon="clipboard"
                    title="No surveys yet"
                    description="You haven't created any surveys yet. Start by creating your first survey!"
                    action={{
                      label: "Create Survey",
                      onClick: () => setOpen(true),
                    }}
                  />
                )}
              </div>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                  />
                </PaginationItem>
                {pages.map((page, idx) => {
                  const prev = pages[idx - 1];
                  const showEllipsis = prev && page - prev > 1;
                  return (
                    <Fragment key={page}>
                      {showEllipsis ? (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : null}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </Fragment>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((prev) => Math.min(lastPage, prev + 1));
                    }}
                  />
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
              Choose how you want to create your survey.
            </DialogDescription>
          </DialogHeader>

          {open && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleGenerateWithAI}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#206AB5]/30 hover:border-[#206AB5] hover:bg-[#206AB5]/5 transition-all group gap-3"
              >
                <div className="p-3 rounded-full bg-[#206AB5] group-hover:bg-[#206AB5]/20 transition-colors">
                  <img src={StarIcon} alt="" className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[#206AB5]">
                  Generate with AI
                </span>
              </button>
              <button
                onClick={() => navigate("/create-survey")}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all group gap-3"
              >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-700">
                  Create Manually
                </span>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generating Survey Loading Modal */}
      <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
        <DialogContent className="max-w-md p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Loader size={20} />
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
                    selectedSurvey.status,
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
