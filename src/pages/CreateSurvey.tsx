import { ArrowLeft, Eye, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            <div className="flex items-center justify-between bg-card px-6 py-4 mb-2 rounded-[8px]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/survey-research")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <h1 className="text-xl font-semibold">
                Customer Satisfaction Survey
              </h1>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-[#EDF3FF] text-[#206AB5] rounded-[10px] px-2.5 py-4"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-[#EDF3FF] text-[#206AB5] rounded-[10px] px-2.5 py-4 border-none"
                    >
                      <Save className="h-4 w-4" />
                      Save
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem>Save as Draft</DropdownMenuItem>
                    <DropdownMenuItem>Save as Template</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  className="gap-2 bg-[#206AB5] text-[#f7f7f7] rounded-[10px] px-2.5 py-4 border-none"
                >
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>

            <div className="flex flex-1 gap-2 overflow-hidden md:flex-row flex-col">
              <AddInputPanel onSelect={(label) => addQuestion(label)} />
              <SurveyPreview
                onDropType={(label) => addQuestion(label)}
                questions={questions}
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
