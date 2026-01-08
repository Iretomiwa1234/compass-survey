import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SurveyPreviewProps {
  onDropType?: (label: string) => void;
  title?: string;
  description?: string;
  questions?: Array<{
    id: number;
    label: string;
    hint?: string;
    defaultValue?: string;
    required?: boolean;
    type?: string;
  }>;
  onSelectQuestion?: (id: number) => void;
}

const SurveyPreview = ({
  onDropType,
  title = "Survey Title",
  description = "",
  questions = [],
  onSelectQuestion,
}: SurveyPreviewProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("application/x-inputtype");
    if (label) onDropType?.(label);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="min-w-[500px] flex-1 p-6 overflow-y-auto bg-white rounded-lg md:w-[35%] w-full"
    >
      <Card className="w-full mx-auto border-accent/50">
        <div className="rounded-lg border border-[#B5CDE6] overflow-hidden">
          <div className="mb-1 border-b border-[#B5CDE6]">
            <h2 className="text-lg font-normal mb-2 px-6 py-2 text-foreground text-[#3C4759] bg-[#E4EDFF]">
              {title || "Survey Title"}
            </h2>
            <div className="px-6 py-3 min-h-[116px] text-sm text-muted-foreground whitespace-pre-wrap">
              {description || "Description will go in here"}
            </div>
          </div>

          <div className="flex flex-col gap-2 py-4 px-6">
            {questions.length === 0 ? (
              <div className="flex flex-col gap-2 items-center justify-center py-8 border-b border-1 border-[#B5CDE6] border-border bg-card">
                <div className="flex gap-1">
                  <CirclePlus className="h-6 w-6 text-[#48556B]" />
                  <span className="text-[#48556B]">Add Question</span>
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Please drag from or press on the left panel to add your
                  questions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => onSelectQuestion?.(q.id)}
                    className="cursor-pointer rounded-md p-0"
                  >
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-[#314155]">
                          {q.label || `Question ${idx + 1}`}
                          {q.required ? (
                            <span className="text-rose-600">*</span>
                          ) : null}
                        </div>
                      </div>
                      {q.hint ? (
                        <div className="text-xs text-muted-foreground mt-1">
                          {q.hint}
                        </div>
                      ) : null}
                    </div>

                    <div className="p-4">
                      {q.type === "Multiline text" ? (
                        <textarea
                          disabled
                          value={q.defaultValue ?? ""}
                          className="w-full h-20 rounded-md border border-input px-3 py-2 text-sm bg-white"
                        />
                      ) : (
                        <input
                          disabled
                          value={q.defaultValue ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
