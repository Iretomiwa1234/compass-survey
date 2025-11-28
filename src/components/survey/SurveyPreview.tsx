import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SurveyPreview = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <Card className="max-w-3xl mx-auto bg-accent/30 border-accent/50">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Survey Title</h2>
            <p className="text-sm text-muted-foreground">Description will go in here</p>
          </div>

          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg bg-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-4">
              <Plus className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Add Question</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Please drag from or press on the left panel to add your questions
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-8">
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SurveyPreview;
