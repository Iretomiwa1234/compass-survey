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
import { useLocation, useNavigate } from "react-router-dom";
import AddInputPanel from "@/components/survey/AddInputPannel";
import SurveyPreview from "@/components/survey/SurveyPreview";
import EditInputPanel from "@/components/survey/EditInputPanel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createSurvey, editSurvey, getSurveyDetail } from "@/lib/auth";
import type { CreateSurveyPayload } from "@/lib/auth";
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

const CreateSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = useMemo(() => {
    return (location.state ?? {}) as {
      surveyId?: string | number;
      title?: string;
      description?: string;
    };
  }, [location.state]);
  const surveyId = useMemo(() => {
    const rawId = locationState.surveyId;
    if (rawId == null) return null;
    const parsed = Number(rawId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [locationState.surveyId]);
  const isEditing = surveyId !== null;
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
    if (locationState.title) {
      setSurveyTitle(locationState.title);
    }
    if (locationState.description) {
      setDescription(locationState.description);
    }
  }, [locationState.description, locationState.title]);

  useEffect(() => {
    if (!isEditing || !surveyId) return;

    let isActive = true;
    setIsLoadingSurvey(true);

    getSurveyDetail(surveyId)
      .then((response) => {
        if (!isActive) return;
        const survey = response?.data?.survey;
        if (!survey) {
          throw new Error("Survey not found.");
        }

        setSurveyTitle(survey.title || "");
        setDescription(survey.description || "");
        setTargetAudience(survey.survey_group || "all");
        setMaxResponses(String(survey.max_responses ?? 0));
        setSingleResponse(survey.single_response ? "true" : "false");
        setEndDate(survey.end_date || "");
        setAllowEdit(survey.allow_edit_after_submit ? "true" : "false");

        const mappedQuestions = (survey.questions ?? []).map((q, idx) => {
          const type = normalizeType(q.type);
          return {
            id: q.id ?? idx + 1,
            label: q.label ?? "",
            placeholder: q.placeholder ?? "",
            required: q.required ?? false,
            type,
            ...(type === "rating" ? { scale: q.scale ?? 5 } : {}),
            ...(type === "text" || type === "multiline_text"
              ? { max_length: q.max_length }
              : {}),
            ...(type === "slider"
              ? { min: q.min ?? 0, max: q.max ?? 100, step: q.step ?? 1 }
              : {}),
            ...(type === "date"
              ? { min_date: q.min_date ?? null, max_date: q.max_date ?? null }
              : {}),
            ...(type === "date_time"
              ? {
                  min_datetime: q.min_datetime ?? null,
                  max_datetime: q.max_datetime ?? null,
                }
              : {}),
            ...(type === "single_select" ||
            type === "multiple_select" ||
            type === "drop_down"
              ? { options: q.options ?? [] }
              : {}),
            ...(type === "ranking" ? { items: q.items ?? [] } : {}),
            ...(type === "single_select_grid"
              ? { rows: q.rows ?? [], columns: q.columns ?? [] }
              : {}),
            ...(type === "likert_scale"
              ? {
                  scale_options: q.scale_options ?? [],
                  statements: q.statements ?? [],
                }
              : {}),
            ...(type === "location_list"
              ? { locations: q.locations ?? [] }
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
  }, [isEditing, surveyId, normalizeType]);

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
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.filter((q) => q.id !== id).map((q, idx) => ({ ...q, id: idx + 1 })),
    );
    setSelectedId((prev) => {
      if (prev == null) return null;
      if (prev === id) return null;
      if (prev > id) return prev - 1;
      return prev;
    });
  };

  const handleSaveDraft = async () => {
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

    try {
      const payload: CreateSurveyPayload = {
        title: surveyTitle,
        description,
        survey_group: targetAudience,
        status: "draft",
        is_published: false,
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
          ...(q.type === "location_list"
            ? { locations: q.locations ?? [] }
            : {}),
        })),
      };

      if (isEditing && surveyId) {
        await editSurvey(surveyId, payload);
      } else {
        await createSurvey(payload);
      }
      toast({
        title: isEditing ? "Draft updated" : "Draft saved",
        description: isEditing
          ? "Your survey draft has been updated."
          : "Your survey has been saved as a draft.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save draft.";
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Create Survey" hideGreeting />
          <div className="flex flex-col h-[calc(100vh-var(--nav-height))] bg-[#F7FAFE] px-3">
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
                    <DropdownMenuItem>Save as Template</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  className="gap-2 bg-[#206AB5] text-white rounded-[10px] px-3 py-4 border-none hover:bg-[#185287]"
                >
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>
            {isEditing && isLoadingSurvey ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader />
              </div>
            ) : (
              <>
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
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-[#206AB5] hover:bg-slate-50"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
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

                <div className="flex flex-1 gap-2 overflow-hidden md:flex-row flex-col">
                  <AddInputPanel onSelect={(label) => addQuestion(label)} />
                  <SurveyPreview
                    onDropType={(label, insertIndex) =>
                      addQuestion(label, insertIndex)
                    }
                    questions={questions}
                    title={surveyTitle}
                    description={description}
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
    </SidebarProvider>
  );
};

export default CreateSurvey;
