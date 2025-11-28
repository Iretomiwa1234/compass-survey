import { ArrowLeft, Eye, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AddInputPanel from "@/components/survey/AddInputPannel";
import SurveyPreview from "@/components/survey/SurveyPreview";
import EditInputPanel from "@/components/survey/EditInputPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const CreateSurvey = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-var(--nav-height))]">
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
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
          <h1 className="text-xl font-semibold">Customer Satisfaction Survey</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
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

          <Button size="sm" className="gap-2">
            <Send className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AddInputPanel />
        <SurveyPreview />
        <EditInputPanel />
      </div>
    </div>
  );
};

export default CreateSurvey;
