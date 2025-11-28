import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SurveyPreview = () => {
  return (
    <div className="min-w-[500px] flex-1 p-6 overflow-y-auto bg-white rounded-lg w-[35%]">
      <Card className="w-full mx-auto border-accent/50">
        <div className="rounded-lg border border-[#B5CDE6] overflow-hidden">
          <div className="mb-1 border-b border-[#B5CDE6]">
            <h2 className="text-lg font-normal mb-2 px-6 py-2 text-foreground text-[#3C4759] bg-[#E4EDFF]">
              Survey Title
            </h2>
            <textarea
              placeholder="Description will go in here"
              className="resize-none text-sm text-muted-foreground h-[116px] px-6 py-3 w-full"
            />
          </div>

          <div className="flex flex-col gap-2 items-center justify-center py-8 border-b border-1 border-[#B5CDE6] border-border bg-card">
            <div className="flex gap-1">
              <CirclePlus className="h-6 w-6 text-[#48556B]" />
              <span className="text-[#48556B]">Add Question</span>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Please drag from or press on the left panel to add your questions
            </p>
          </div>

          <div className="py-4 flex justify-center">
            <Button
              size="lg"
              className="px-8 bg-[#206AB5] transition duration-150 hover:text-[#206AB5] hover:bg-[white] hover:border hover:border-[#206AB5]"
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SurveyPreview;
