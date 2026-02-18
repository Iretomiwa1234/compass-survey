import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  Target,
  FileText,
  Settings,
  Calendar,
  Hash,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import AddInputPanel from "@/components/survey/AddInputPannel";
import SurveyPreview from "@/components/survey/SurveyPreview";
import EditInputPanel from "@/components/survey/EditInputPanel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createSurvey, editSurvey, getSurveyDetail } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { CreateSurveyPayload } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ui/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateSurvey = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId?: string }>();
  const parsedSurveyId = useMemo(() => {
    if (!surveyId) return null;
    const parsed = Number(surveyId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [surveyId]);
  const isEditing = parsedSurveyId !== null;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [maxResponses, setMaxResponses] = useState("500");
  const [singleResponse, setSingleResponse] = useState("false");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [allowEdit, setAllowEdit] = useState("false");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(false);
  const [isSavingSurvey, setIsSavingSurvey] = useState(false);
  const [showEditBanner, setShowEditBanner] = useState(true);
  const [invalidQuestionIds, setInvalidQuestionIds] = useState<number[]>([]);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  type QuestionType =
    | "text"
    | "multiline_text"
    | "number"
    | "rating"
    | "slider"
    | "date"
    | "time"
    | "date_time"
    | "email"
    | "website"
    | "address"
    | "location_list"
    | "single_select"
    | "multiple_select"
    | "ranking"
    | "drop_down"
    | "single_select_grid"
    | "likert_scale";

  type Question = {
    id: number;
    label: string;
    placeholder?: string;
    required?: boolean;
    type: QuestionType;
    scale?: number;
    max_length?: number;
    min?: number;
    max?: number;
    step?: number;
    min_date?: string | null;
    max_date?: string | null;
    min_datetime?: string | null;
    max_datetime?: string | null;
    options?: string[];
    items?: string[];
    rows?: string[];
    columns?: string[];
    scale_options?: string[];
    statements?: string[];
    locations?: string[];
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  const normalizeType = useCallback((value: string): QuestionType => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "rating") return "rating";
    if (normalized === "multiline_text" || normalized === "multiline text") {
      return "multiline_text";
    }
    if (normalized === "number") return "number";
    if (normalized === "slider") return "slider";
    if (normalized === "date") return "date";
    if (normalized === "time") return "time";
    if (normalized === "date_time" || normalized === "date and time") {
      return "date_time";
    }
    if (normalized === "email") return "email";
    if (normalized === "website") return "website";
    if (normalized === "address") return "address";
    if (normalized === "location list" || normalized === "location_list") {
      return "location_list";
    }
    if (normalized === "single select") return "single_select";
    if (normalized === "multiple select") return "multiple_select";
    if (normalized === "ranking") return "ranking";
    if (normalized === "drop down" || normalized === "dropdown") {
      return "drop_down";
    }
    if (normalized === "single select grid") return "single_select_grid";
    if (normalized === "likert scale") return "likert_scale";
    return "text";
  }, []);

  useEffect(() => {
    if (!isEditing || !parsedSurveyId) return;

    let isActive = true;
    setIsLoadingSurvey(true);

    getSurveyDetail(parsedSurveyId)
      .then((response) => {
        if (!isActive) return;
        const surveyPayload = response?.data?.survey as
          | { data?: Array<Record<string, unknown>> }
          | Record<string, unknown>
          | undefined;
        const survey = Array.isArray(surveyPayload?.data)
          ? (surveyPayload?.data?.[0] as Record<string, unknown> | undefined)
          : (surveyPayload as Record<string, unknown> | undefined);
        if (!survey) {
          throw new Error("Survey not found.");
        }

        const surveyTitleValue = (survey.title as string | undefined) ?? "";
        const descriptionValue =
          (survey.description as string | undefined) ?? "";
        const surveyGroupValue =
          (survey.survey_group as string | undefined) ?? "all";
        const maxResponsesValue = Number(survey.max_responses ?? 0);
        const singleResponseValue =
          Number(survey.single_response ?? 0) === 1 ? "true" : "false";
        const allowEditValue =
          Number(survey.allow_edit_after_submit ?? 0) === 1 ? "true" : "false";
        const rawEndDate = (survey.end_date as string | undefined) ?? "";
        const normalizedEndDate = rawEndDate ? rawEndDate.split(" ")[0] : "";

        setSurveyTitle(surveyTitleValue);
        setDescription(descriptionValue);
        setTargetAudience(surveyGroupValue);
        setMaxResponses(String(maxResponsesValue));
        setSingleResponse(singleResponseValue);
        setEndDate(normalizedEndDate);
        setAllowEdit(allowEditValue);

        const questionList =
          (survey.question as Array<Record<string, unknown>> | undefined) ??
          (survey.questions as Array<Record<string, unknown>> | undefined) ??
          [];

        const mappedQuestions = questionList.map((q, idx) => {
          const type = normalizeType(String(q.type ?? ""));
          const requiredValue =
            q.required === true || q.required === "1" || q.required === 1;
          const parsedId = Number(q.id ?? idx + 1);
          const parsedScale = Number(q.scale ?? 5);
          return {
            id: Number.isNaN(parsedId) ? idx + 1 : parsedId,
            label: String(q.label ?? ""),
            placeholder: String(q.placeholder ?? ""),
            required: requiredValue,
            type,
            ...(type === "rating"
              ? { scale: Number.isNaN(parsedScale) ? 5 : parsedScale }
              : {}),
            ...(type === "text" || type === "multiline_text"
              ? { max_length: q.max_length as number | undefined }
              : {}),
            ...(type === "slider"
              ? {
                  min: Number(q.min ?? 0),
                  max: Number(q.max ?? 100),
                  step: Number(q.step ?? 1),
                }
              : {}),
            ...(type === "date"
              ? {
                  min_date: (q.min_date as string | null) ?? null,
                  max_date: (q.max_date as string | null) ?? null,
                }
              : {}),
            ...(type === "date_time"
              ? {
                  min_datetime: (q.min_datetime as string | null) ?? null,
                  max_datetime: (q.max_datetime as string | null) ?? null,
                }
              : {}),
            ...(type === "single_select" ||
            type === "multiple_select" ||
            type === "drop_down"
              ? { options: (q.options as string[] | undefined) ?? [] }
              : {}),
            ...(type === "ranking"
              ? { items: (q.items as string[] | undefined) ?? [] }
              : {}),
            ...(type === "single_select_grid"
              ? {
                  rows: (q.rows as string[] | undefined) ?? [],
                  columns: (q.columns as string[] | undefined) ?? [],
                }
              : {}),
            ...(type === "likert_scale"
              ? {
                  scale_options:
                    (q.scale_options as string[] | undefined) ?? [],
                  statements: (q.statements as string[] | undefined) ?? [],
                }
              : {}),
            ...(type === "location_list"
              ? { locations: (q.locations as string[] | undefined) ?? [] }
              : {}),
          };
        });
        const ordered = mappedQuestions.map((q, idx) => ({
          ...q,
          id: idx + 1,
        }));
        setQuestions(ordered);
        setSelectedId(ordered[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load survey details.";
        toast({
          title: "Unable to load survey",
          description: message,
          variant: "destructive",
        });
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingSurvey(false);
      });

    return () => {
      isActive = false;
    };
  }, [isEditing, parsedSurveyId, normalizeType]);

  const addQuestion = (value: string, insertIndex?: number) => {
    setQuestions((prev) => {
      const type = normalizeType(value);
      const defaultPlaceholder =
        type === "date"
          ? "YYYY-MM-DD"
          : type === "time"
            ? "HH:MM"
            : type === "date_time"
              ? "YYYY-MM-DD HH:MM"
              : type === "number"
                ? "Enter a number"
                : type === "email"
                  ? "name@example.com"
                  : type === "website"
                    ? "https://example.com"
                    : type === "address"
                      ? "Street, City, State, Country"
                      : type === "location_list"
                        ? "Search locations..."
                        : type === "drop_down"
                          ? "Choose..."
                          : "";
      const newQuestion: Question = {
        id: prev.length + 1,
        label: "",
        placeholder: defaultPlaceholder,
        required: false,
        type,
        ...(type === "rating" ? { scale: 5 } : {}),
        ...(type === "slider" ? { min: 0, max: 100, step: 1 } : {}),
        ...(type === "date" ? { min_date: null, max_date: null } : {}),
        ...(type === "date_time"
          ? { min_datetime: null, max_datetime: null }
          : {}),
        ...(type === "single_select" ||
        type === "multiple_select" ||
        type === "drop_down"
          ? { options: ["Option 1", "Option 2"] }
          : {}),
        ...(type === "ranking" ? { items: ["Item A", "Item B"] } : {}),
        ...(type === "single_select_grid"
          ? { rows: ["Row 1", "Row 2"], columns: ["Col 1", "Col 2"] }
          : {}),
        ...(type === "likert_scale"
          ? {
              scale_options: [
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
              ],
              statements: ["Statement 1"],
            }
          : {}),
        ...(type === "location_list"
          ? { locations: ["Location A", "Location B"] }
          : {}),
      };
      const next = [...prev];
      if (typeof insertIndex === "number") {
        const safeIndex = Math.max(0, Math.min(insertIndex, next.length));
        next.splice(safeIndex, 0, newQuestion);
      } else {
        next.push(newQuestion);
      }
      const reindexed = next.map((q, idx) => ({
        ...q,
        id: idx + 1,
      }));
      const selectedIndex =
        typeof insertIndex === "number"
          ? Math.max(0, Math.min(insertIndex, reindexed.length - 1))
          : reindexed.length - 1;
      setSelectedId(reindexed[selectedIndex]?.id ?? null);
      return reindexed;
    });
  };

  const updateQuestion = (id: number, patch: Partial<Question>) => {
    setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    if (patch.label !== undefined && patch.label.trim() !== "") {
      setInvalidQuestionIds((prev) => prev.filter((qid) => qid !== id));
    }
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.filter((q) => q.id !== id).map((q, idx) => ({ ...q, id: idx + 1 })),
    );
    setInvalidQuestionIds((prev) => prev.filter((qid) => qid !== id));
    setSelectedId((prev) => {
      if (prev == null) return null;
      if (prev === id) return null;
      if (prev > id) return prev - 1;
      return prev;
    });
  };

  const reorderQuestions = (fromIndex: number, toIndex: number) => {
    setQuestions((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex > prev.length
      ) {
        return prev;
      }

      if (fromIndex === toIndex || fromIndex + 1 === toIndex) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return prev;

      const targetIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      next.splice(targetIndex, 0, moved);

      const currentlySelectedOldId = selectedId;
      const selectedIndexInNext =
        currentlySelectedOldId == null
          ? -1
          : next.findIndex((q) => q.id === currentlySelectedOldId);

      const idMap = new Map<number, number>();
      const reindexed = next.map((q, idx) => {
        const newId = idx + 1;
        idMap.set(q.id, newId);
        return { ...q, id: newId };
      });

      setInvalidQuestionIds((prevInvalidIds) =>
        prevInvalidIds
          .map((id) => idMap.get(id))
          .filter((id): id is number => typeof id === "number"),
      );

      setSelectedId(selectedIndexInNext >= 0 ? selectedIndexInNext + 1 : null);

      return reindexed;
    });
  };

  const buildPayload = (
    status: CreateSurveyPayload["status"],
    isPublished: 0 | 1,
  ): CreateSurveyPayload => ({
    title: surveyTitle,
    description,
    survey_group: targetAudience,
    status,
    is_published: isPublished,
    max_responses: Number(maxResponses) || 0,
    single_response: singleResponse === "true",
    end_date: endDate,
    allow_edit_after_submit: allowEdit === "true",
    questions: questions.map((q, idx) => ({
      id: idx + 1,
      type: q.type,
      label: q.label,
      placeholder:
        q.type === "rating" ||
        q.type === "slider" ||
        q.type === "single_select" ||
        q.type === "multiple_select" ||
        q.type === "ranking" ||
        q.type === "single_select_grid" ||
        q.type === "likert_scale"
          ? undefined
          : q.placeholder,
      required: q.required ?? false,
      ...(q.type === "rating" ? { scale: q.scale ?? 5 } : {}),
      ...(q.type === "text" && q.max_length
        ? { max_length: q.max_length }
        : {}),
      ...(q.type === "multiline_text" && q.max_length
        ? { max_length: q.max_length }
        : {}),
      ...(q.type === "slider"
        ? { min: q.min ?? 0, max: q.max ?? 100, step: q.step ?? 1 }
        : {}),
      ...(q.type === "date"
        ? { min_date: q.min_date ?? null, max_date: q.max_date ?? null }
        : {}),
      ...(q.type === "date_time"
        ? {
            min_datetime: q.min_datetime ?? null,
            max_datetime: q.max_datetime ?? null,
          }
        : {}),
      ...(q.type === "single_select" ||
      q.type === "multiple_select" ||
      q.type === "drop_down"
        ? { options: q.options ?? [] }
        : {}),
      ...(q.type === "ranking" ? { items: q.items ?? [] } : {}),
      ...(q.type === "single_select_grid"
        ? { rows: q.rows ?? [], columns: q.columns ?? [] }
        : {}),
      ...(q.type === "likert_scale"
        ? {
            scale_options: q.scale_options ?? [],
            statements: q.statements ?? [],
          }
        : {}),
      ...(q.type === "location_list" ? { locations: q.locations ?? [] } : {}),
    })),
  });

  const handleSave = async (
    status: CreateSurveyPayload["status"],
    isPublished: 0 | 1,
    successLabel: string,
  ) => {
    if (!surveyTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a survey title.",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingSurvey(true);
    try {
      const payload = buildPayload(status, isPublished);
      if (isEditing && parsedSurveyId) {
        await editSurvey(parsedSurveyId, payload);
      } else {
        await createSurvey(payload);
      }
      setInvalidQuestionIds([]);
      toast({
        title: isEditing ? `${successLabel} updated` : `${successLabel} saved`,
        description: isEditing
          ? `Your survey ${successLabel.toLowerCase()} has been updated.`
          : `Your survey has been saved as ${successLabel.toLowerCase()}.`,
      });

      // Redirect back to survey research after successful publish
      if (successLabel === "Publish") {
        setTimeout(() => navigate("/survey-research"), 1500);
      }
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const data = error.data;
        const invalidIndexes: number[] = [];
        if (data && typeof data === "object") {
          const payload = data as Record<string, unknown>;
          const errorData = payload.data;
          if (errorData && typeof errorData === "object") {
            Object.keys(errorData as Record<string, unknown>).forEach((key) => {
              const match = /^questions\.(\d+)\./.exec(key);
              if (match) {
                const idx = Number(match[1]);
                if (!Number.isNaN(idx)) invalidIndexes.push(idx);
              }
            });
          }
        }

        if (invalidIndexes.length > 0) {
          const invalidIds = invalidIndexes
            .map((idx) => questions[idx]?.id)
            .filter((id): id is number => typeof id === "number");
          setInvalidQuestionIds(invalidIds);
          setSelectedId(invalidIds[0] ?? null);
          const questionNumbers = invalidIndexes
            .map((idx) => idx + 1)
            .sort((a, b) => a - b)
            .join(", ");
          toast({
            title: "Missing question details",
            description: `Please add labels for question${
              invalidIndexes.length > 1 ? "s" : ""
            } ${questionNumbers}.`,
            variant: "destructive",
          });
          return;
        }
      }
      const message =
        error instanceof Error ? error.message : "Failed to save survey.";
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSavingSurvey(false);
    }
  };

  const handleSaveDraft = () => handleSave("draft", 0, "Draft");
  const handleSaveTemplate = () => handleSave("active", 0, "Template");
  const handleSavePublish = () => handleSave("active", 1, "Publish");
  const handleConfirmClose = () => {
    setCloseConfirmOpen(false);
    void handleSave("close", 0, "Closed");
  };

  return (
    <SidebarProvider>
      {isSavingSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033] backdrop-blur-[10px]">
          <Loader size={24} />
        </div>
      )}
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Create Survey" hideGreeting />
          <div className="flex flex-col h-[calc(100vh-var(--nav-height))] min-h-0 bg-[#F7FAFE] px-3 py-3">
            <div className="flex items-center justify-between bg-white px-6 py-3 mb-2 rounded-[12px] border border-[#E2E8F0]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/survey-research")}
                  className="gap-2 text-[#48556B]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-[#EDF3FF] text-[#206AB5] rounded-[10px] px-3 py-4 border-none hover:bg-[#DCE7FF]"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-[#EDF3FF] text-[#206AB5] rounded-[10px] px-3 py-4 border-none hover:bg-[#DCE7FF]"
                    >
                      <Save className="h-4 w-4" />
                      Save
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={handleSaveDraft}>
                      Save as Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSaveTemplate}>
                      Save as Template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  className="gap-2 bg-[#206AB5] text-white rounded-[10px] px-3 py-4 border-none hover:bg-[#185287]"
                  onClick={handleSavePublish}
                >
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>
            {isEditing && isLoadingSurvey ? (
              <div className="flex flex-1 flex-col gap-4">
                <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-80" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <div className="flex flex-1 gap-2 overflow-hidden md:flex-row flex-col">
                  <div className="min-w-[300px] md:max-w-[350px] rounded-lg bg-card p-4 h-[calc(100vh-var(--nav-height))] md:w-[35%] w-full">
                    <Skeleton className="h-5 w-24 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg bg-card p-4 h-[calc(100vh-var(--nav-height))]">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                    </div>
                  </div>
                  <div className="min-w-[300px] md:max-w-[350px] rounded-lg bg-card p-4 h-[calc(100vh-var(--nav-height))] md:w-[35%] w-full">
                    <Skeleton className="h-5 w-28 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {isEditing && showEditBanner ? (
                  <div className="mb-3 rounded-[10px] border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 flex items-center justify-between">
                    <span>
                      You are currently editing this survey. Changes will update
                      the existing survey.
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-900 hover:bg-yellow-100"
                      onClick={() => setShowEditBanner(false)}
                    >
                      Close
                    </Button>
                  </div>
                ) : null}
                {/* Editable Survey Info Bar */}
                <Collapsible
                  open={isAdvancedOpen}
                  onOpenChange={setIsAdvancedOpen}
                  className="bg-white border border-[#E2E8F0] mb-4 rounded-[12px] shadow-sm transition-all duration-200"
                >
                  <div className="flex flex-wrap items-center gap-6 px-6 py-2">
                    <div className="flex-1 min-w-[200px]">
                      <Input
                        value={surveyTitle}
                        onChange={(e) => setSurveyTitle(e.target.value)}
                        placeholder="Survey Title"
                        className="border-none bg-transparent h-8 p-0 focus-visible:ring-0 text-base font-medium text-slate-800 placeholder:text-slate-300"
                      />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                    <div className="flex-[2] min-w-[300px] flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400 italic" />
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add survey description..."
                        className="border-none bg-transparent h-8 p-0 focus-visible:ring-0 text-sm text-slate-600 placeholder:text-slate-300"
                      />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                    <div className="w-[160px] flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-400" />
                      <Select
                        value={targetAudience}
                        onValueChange={setTargetAudience}
                      >
                        <SelectTrigger className="border-none bg-transparent h-8 p-0 focus:ring-0 shadow-none text-sm text-slate-600 hover:bg-transparent">
                          <SelectValue placeholder="Audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Groups</SelectItem>
                          <SelectItem value="customers">Customers</SelectItem>
                          <SelectItem value="employees">Employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-[#206AB5] hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setCloseConfirmOpen(true)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Close
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <Hash className="w-3 h-3" /> Max Responses
                        </Label>
                        <Input
                          type="number"
                          value={maxResponses}
                          onChange={(e) => setMaxResponses(e.target.value)}
                          className="h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          placeholder="e.g. 500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <Users className="w-3 h-3" /> Single Response
                        </Label>
                        <Select
                          value={singleResponse}
                          onValueChange={setSingleResponse}
                        >
                          <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> End Date
                        </Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Allow Edit
                        </Label>
                        <Select value={allowEdit} onValueChange={setAllowEdit}>
                          <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-1 gap-2 overflow-hidden md:flex-row flex-col min-h-0 max-h-[750px]">
                  <AddInputPanel onSelect={(label) => addQuestion(label)} />
                  <SurveyPreview
                    onDropType={(label, insertIndex) =>
                      addQuestion(label, insertIndex)
                    }
                    onReorderQuestions={reorderQuestions}
                    questions={questions}
                    title={surveyTitle}
                    description={description}
                    selectedQuestionId={selectedId}
                    invalidQuestionIds={invalidQuestionIds}
                    onSelectQuestion={(id: number) => setSelectedId(id)}
                    onRemoveQuestion={removeQuestion}
                  />
                  <EditInputPanel
                    selected={
                      questions.find((q) => q.id === selectedId) ?? null
                    }
                    onUpdate={(patch: Partial<Question>) =>
                      selectedId && updateQuestion(selectedId, patch)
                    }
                  />
                </div>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
      <Dialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Survey</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this survey?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCloseConfirmOpen(false)}
            >
              No
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Yes, Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default CreateSurvey;
