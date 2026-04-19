import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SurveyStatsOverview } from "@/components/SurveyStatsOverview";
import { SurveyListItem, Survey } from "@/components/SurveyListItem";
import { Card, CardContent } from "@/components/ui/card"; // Keep for later use
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
import { Search, Plus, Calendar, Target, FileText, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  editSurvey,
  getSurveyDetail,
  getSurveys,
  getSurveyCards,
  getSurveyCompletionRate,
  getSurveyAverageRate,
  getSurveyCountryReach,
} from "@/lib/auth";
import type {
  CreateSurveyPayload,
  SurveyCardsData,
  SurveyCompletionRateData,
  SurveyAverageRateData,
  SurveyCountryReachData,
} from "@/lib/auth";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/survey/EmptyState";
import { toast } from "@/hooks/use-toast";
const SurveyResearch = () => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [surveyToClose, setSurveyToClose] = useState<Survey | null>(null);

  const [surveyCards, setSurveyCards] = useState<SurveyCardsData | null>(null);
  const [completionRate, setCompletionRate] =
    useState<SurveyCompletionRateData | null>(null);
  const [averageRate, setAverageRate] = useState<SurveyAverageRateData | null>(
    null,
  );
  const [countryReach, setCountryReach] =
    useState<SurveyCountryReachData | null>(null);
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
      navigate(`/survey-analysis?survey_id=${survey.id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (survey: Survey) => {
      navigate(`/create-survey/edit/${survey.id}`);
    },
    [navigate],
  );

  const normalizeStatus = (status?: string) =>
    (status ?? "").trim().toLowerCase();

  const getDisplayStatus = (status: string, isPublished: number) => {
    if (isPublished === 1) return "Published";
    if (!status && isPublished === 0) return "Draft";
    switch (status) {
      case "draft":
        return "Draft";
      case "active":
        return "Template";
      case "close":
        return "Closed";
      case "pending":
        return "Pending";
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
    }
  };

  const getStatusColor = (status: string, isPublished: number) => {
    if (isPublished === 1) {
      return "bg-green-100 text-green-600 border-green-200";
    }
    if (!status && isPublished === 0) {
      return "bg-orange-100 text-orange-600 border-orange-200";
    }

    switch (status) {
      case "active":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "draft":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "close":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "pending":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const handleClose = useCallback((survey: Survey) => {
    setSurveyToClose(survey);
    setCloseConfirmOpen(true);
  }, []);

  const handleConfirmClose = useCallback(async () => {
    if (!surveyToClose) return;
    try {
      const response = await getSurveyDetail(Number(surveyToClose.id));
      const surveyPayload = response?.data?.survey as
        | { data?: Array<Record<string, unknown>> }
        | Record<string, unknown>
        | undefined;
      const detail = Array.isArray(surveyPayload?.data)
        ? (surveyPayload?.data?.[0] as Record<string, unknown> | undefined)
        : (surveyPayload as Record<string, unknown> | undefined);
      if (!detail) {
        throw new Error("Survey not found.");
      }

      const payload: CreateSurveyPayload = {
        title: (detail.title as string | undefined) ?? "",
        description: (detail.description as string | undefined) ?? "",
        survey_group: (detail.survey_group as string | undefined) ?? "all",
        status: "close",
        is_published: 0,
        max_responses: Number(detail.max_responses ?? 0),
        single_response: Number(detail.single_response ?? 0) === 1,
        end_date: (detail.end_date as string | undefined) ?? "",
        allow_edit_after_submit:
          Number(detail.allow_edit_after_submit ?? 0) === 1,
        questions: (detail.question ??
          detail.questions ??
          []) as CreateSurveyPayload["questions"],
      };

      await editSurvey(Number(surveyToClose.id), payload);
      setSurveys((prev) =>
        prev.map((item) => {
          if (item.id !== surveyToClose.id) return item;
          return {
            ...item,
            status: "close",
            isPublished: 0,
            displayStatus: "Closed",
          };
        }),
      );
      toast({
        title: "Survey closed",
        description: "The survey has been closed successfully.",
      });
      setCloseConfirmOpen(false);
      setSurveyToClose(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to close survey.";
      toast({
        title: "Close failed",
        description: message,
        variant: "destructive",
      });
    }
  }, [surveyToClose, setSurveys]);

  useEffect(() => {
    let isActive = true;
    setIsLoadingSurveys(true);

    getSurveys(currentPage)
      .then((response) => {
        if (!isActive) return;
        const data = response?.data?.survey?.data ?? [];
        const backendCurrentPage = response?.data?.survey?.current_page ?? 1;
        const backendLastPage = response?.data?.survey?.last_page ?? 1;
        const backendTotal = response?.data?.survey?.total ?? 0;
        const backendPerPage = response?.data?.survey?.per_page ?? 20;

        const mapped = data.map((item) => {
          const completion = Number.parseFloat(
            item.completion_percentage || "0",
          );
          const rawStatus = normalizeStatus(item.status);
          const isPublished = Number(item.is_published ?? 0) === 1 ? 1 : 0;
          const displayStatus = getDisplayStatus(rawStatus, isPublished);
          return {
            id: String(item.survey_id),
            title: item.title,
            status: rawStatus,
            displayStatus,
            isPublished,
            totalResponse: item.total_responses,
            responseRate: Number.isNaN(completion) ? 0 : completion,
            createdDate: item.created_at,
          };
        });

        setSurveys(mapped);
        setCurrentPage(backendCurrentPage);
        setLastPage(backendLastPage);
        setTotalSurveys(backendTotal);
        setPerPage(backendPerPage);
        setIsLoadingSurveys(false);
      })
      .catch(() => {
        if (!isActive) return;
        setSurveys([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotalSurveys(0);
        setPerPage(20);
        setIsLoadingSurveys(false);
      });

    return () => {
      isActive = false;
    };
  }, [currentPage]);

  // Fetch survey stats cards on mount
  useEffect(() => {
    let isActive = true;

    Promise.allSettled([
      getSurveyCards(),
      getSurveyCompletionRate(),
      getSurveyAverageRate(),
      getSurveyCountryReach(),
    ]).then(([cardsRes, completionRes, avgRateRes, countryRes]) => {
      if (!isActive) return;
      if (cardsRes.status === "fulfilled") setSurveyCards(cardsRes.value);
      if (completionRes.status === "fulfilled")
        setCompletionRate(completionRes.value);
      if (avgRateRes.status === "fulfilled") setAverageRate(avgRateRes.value);
      if (countryRes.status === "fulfilled") setCountryReach(countryRes.value);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredSurveys = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return surveys.filter((survey) => {
      const matchesStatus =
        statusFilter === "all" || survey.status === statusFilter;
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
        onClose={handleClose}
      />
    ));
  }, [filteredSurveys, handleAnalytics, handleClose, handleEdit, handleView]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F7FBFF]">
        <DashboardSidebar />

        <SidebarInset className="flex flex-1 flex-col bg-[#F7FBFF]">
          <DashboardHeader headerTitle="Surveys" hideGreeting />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* <div className="mb-4 sm:mb-6">
              <div className="rounded-xl border border-[#dce8f5] bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                <h2 className="text-md font-semibold text-[#2b3a4f]">
                  Customer Satisfaction Survey
                </h2>
              </div>
            </div> */}

            <SurveyStatsOverview
              variant="research"
              totalResponses={
                surveyCards
                  ? surveyCards.totalResponses.toLocaleString()
                  : undefined
              }
              completedBadgeCount={surveyCards?.completed ?? 0}
              inProgressBadgeCount={surveyCards?.inProgress ?? 0}
              abandonedBadgeCount={surveyCards?.abandoned ?? 0}
              completionPercentage={
                completionRate?.completionRatePercentage ?? 0
              }
              completedCount={
                completionRate
                  ? completionRate.completed.toLocaleString()
                  : undefined
              }
              abandonedCount={
                completionRate
                  ? completionRate.abandoned.toLocaleString()
                  : undefined
              }
              avgResponsePercentage={
                averageRate?.avgResponseRatePercentage ?? 0
              }
              totalInviteSent={
                averageRate
                  ? averageRate.totalInviteSent.toLocaleString()
                  : undefined
              }
              totalResponds={
                averageRate
                  ? averageRate.totalResponds.toLocaleString()
                  : undefined
              }
              countryReach={countryReach?.totalCountries ?? 0}
              countryData={
                countryReach?.top4.map((c) => ({
                  name: c.countryName,
                  count: c.totalResponses,
                })) ?? []
              }
            />
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
                      <SelectItem value="active">Template</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="close">Closed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentPage <= 1}
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage <= 1) return;
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
                    aria-disabled={currentPage >= lastPage}
                    className={
                      currentPage >= lastPage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage >= lastPage) return;
                      setCurrentPage((prev) => Math.min(lastPage, prev + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            {lastPage > 1 ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Page {currentPage} of {lastPage} · {totalSurveys} total surveys
                · {perPage} per page
              </p>
            ) : null}
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
            <div className="grid grid-cols-1 gap-4 pt-4">
              {/* <button
                onClick={handleGenerateWithAI}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#206AB5]/30 hover:border-[#206AB5] hover:bg-[#206AB5]/5 transition-all group gap-3"
              >
                <div className="p-3 rounded-full bg-[#206AB5] group-hover:bg-[#206AB5]/20 transition-colors">
                  <img src={StarIcon} alt="" className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[#206AB5]">
                  Generate with AI
                </span>
              </button> */}
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
                    selectedSurvey.isPublished ?? 0,
                  )}`}
                >
                  {selectedSurvey.displayStatus ?? selectedSurvey.status}
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
                    if (selectedSurvey) {
                      navigate(`/create-survey/edit/${selectedSurvey.id}`);
                    }
                  }}
                >
                  Edit Survey
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Survey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close "{surveyToClose?.title}"? This
              survey will no longer accept responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Close Survey
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default SurveyResearch;
