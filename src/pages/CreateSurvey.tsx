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
  const [surveyTitle, setSurveyTitle] = useState(
    "Customer Satisfaction Survey",
  );
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [maxResponses, setMaxResponses] = useState("500");
  const [singleResponse, setSingleResponse] = useState("false");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [allowEdit, setAllowEdit] = useState("false");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(false);

  type QuestionType = "text" | "rating";

  type Question = {
    id: number;
    label: string;
    placeholder?: string;
    required?: boolean;
    type: QuestionType;
    scale?: number;
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  const normalizeType = useCallback((value: string): QuestionType => {
    const normalized = value.trim().toLowerCase();
    return normalized === "rating" ? "rating" : "text";
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

  const addQuestion = (value: string) => {
    setQuestions((prev) => {
      const type = normalizeType(value);
      const next = [
        ...prev,
        {
          id: prev.length + 1,
          label: "",
          placeholder: "",
          required: false,
          type,
          ...(type === "rating" ? { scale: 5 } : {}),
        },
      ].map((q, idx) => ({ ...q, id: idx + 1 }));
      setSelectedId(next[next.length - 1]?.id ?? null);
      return next;
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
      const payload = {
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
          placeholder: q.placeholder,
          required: q.required ?? false,
          ...(q.type === "rating" ? { scale: q.scale ?? 5 } : {}),
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
                    onDropType={(label) => addQuestion(label)}
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
