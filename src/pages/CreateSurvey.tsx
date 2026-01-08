import { ArrowLeft, Eye, Save, Send, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import AddInputPanel from "@/components/survey/AddInputPannel";
import SurveyPreview from "@/components/survey/SurveyPreview";
import EditInputPanel from "@/components/survey/EditInputPanel";
import { useState } from "react";
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

const CreateSurvey = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [surveyTitle, setSurveyTitle] = useState(
    "Customer Satisfaction Survey"
  );
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [questions, setQuestions] = useState<
    Array<{
      id: number;
      label: string;
      hint?: string;
      defaultValue?: string;
      required?: boolean;
      type?: string;
    }>
  >([]);

  const addQuestion = (label: string) => {
    const id = Date.now();
    const q = {
      id,
      label,
      hint: "",
      defaultValue: "",
      required: false,
      type: label,
    };
    setQuestions((s) => [...s, q]);
    setSelectedId(id);
  };

  const updateQuestion = (id: number, patch: Partial<any>) => {
    setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
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
                    <DropdownMenuItem>Save as Draft</DropdownMenuItem>
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

            {/* Editable Survey Info Bar */}
            <div className="flex flex-wrap items-center gap-6 bg-white border border-[#E2E8F0] px-6 py-2 mb-4 rounded-[12px] shadow-sm">
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
            </div>

            <div className="flex flex-1 gap-2 overflow-hidden md:flex-row flex-col">
              <AddInputPanel onSelect={(label) => addQuestion(label)} />
              <SurveyPreview
                onDropType={(label) => addQuestion(label)}
                questions={questions}
                title={surveyTitle}
                description={description}
                onSelectQuestion={(id: number) => setSelectedId(id)}
              />
              <EditInputPanel
                selected={questions.find((q) => q.id === selectedId) ?? null}
                onUpdate={(patch: Partial<any>) =>
                  selectedId && updateQuestion(selectedId, patch)
                }
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreateSurvey;
