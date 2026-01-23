import { CirclePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SurveyPreviewProps {
  onDropType?: (label: string) => void;
  title?: string;
  description?: string;
  questions?: Array<{
    id: number;
    label: string;
    placeholder?: string;
    required?: boolean;
    type:
      | "text"
      | "multiline_text"
      | "rating"
      | "slider"
      | "date"
      | "time"
      | "date_time"
      | "email"
      | "website"
      | "address"
      | "single_select"
      | "multiple_select"
      | "ranking"
      | "drop_down"
      | "single_select_grid"
      | "likert_scale";
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
  }>;
  onSelectQuestion?: (id: number) => void;
  onRemoveQuestion?: (id: number) => void;
}

const SurveyPreview = ({
  onDropType,
  title = "Survey Title",
  description = "",
  questions = [],
  onSelectQuestion,
  onRemoveQuestion,
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
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRemoveQuestion?.(q.id);
                          }}
                          className="rounded p-1 text-slate-400 hover:text-rose-500"
                          aria-label="Remove question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      {q.type === "rating" ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                disabled
                                className="flex-1 h-10 rounded font-medium text-sm bg-[#E8F0FB] text-[#206AB5] cursor-default"
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 px-1">
                            <span>Not satisfied</span>
                            <span>Very satisfied</span>
                          </div>
                        </div>
                      ) : q.type === "multiline_text" ? (
                        <textarea
                          readOnly
                          value=""
                          placeholder={q.placeholder ?? ""}
                          rows={4}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400 resize-none"
                        />
                      ) : q.type === "date" ? (
                        <input
                          type="date"
                          readOnly
                          value=""
                          min={q.min_date ?? undefined}
                          max={q.max_date ?? undefined}
                          placeholder={q.placeholder ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                        />
                      ) : q.type === "time" ? (
                        <input
                          type="time"
                          readOnly
                          value=""
                          placeholder={q.placeholder ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                        />
                      ) : q.type === "date_time" ? (
                        <input
                          type="datetime-local"
                          readOnly
                          value=""
                          min={q.min_datetime ?? undefined}
                          max={q.max_datetime ?? undefined}
                          placeholder={q.placeholder ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                        />
                      ) : q.type === "email" ? (
                        <input
                          type="email"
                          readOnly
                          value=""
                          placeholder={q.placeholder ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                        />
                      ) : q.type === "website" ? (
                        <input
                          type="url"
                          readOnly
                          value=""
                          placeholder={q.placeholder ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                        />
                      ) : q.type === "address" ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            readOnly
                            placeholder="Street"
                            className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                          />
                          <input
                            type="text"
                            readOnly
                            placeholder="City"
                            className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                          />
                          <input
                            type="text"
                            readOnly
                            placeholder="State"
                            className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                          />
                          <input
                            type="text"
                            readOnly
                            placeholder="Country"
                            className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
                          />
                        </div>
                      ) : q.type === "slider" ? (
                        <div className="space-y-3">
                          <input
                            type="range"
                            min={q.min ?? 0}
                            max={q.max ?? 100}
                            step={q.step ?? 1}
                            disabled
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-400 px-1">
                            <span>{q.min ?? 0}</span>
                            <span className="font-medium text-[#206AB5]">
                              {Math.round(
                                (q.min ?? 0) +
                                  ((q.max ?? 100) - (q.min ?? 0)) / 2,
                              )}
                            </span>
                            <span>{q.max ?? 100}</span>
                          </div>
                        </div>
                      ) : q.type === "single_select" ? (
                        <div className="space-y-2">
                          {(q.options ?? []).map((option, optionIdx) => (
                            <label
                              key={`${q.id}-single-${optionIdx}`}
                              className="flex items-center gap-2 text-sm text-slate-700"
                            >
                              <input type="radio" disabled />
                              {option}
                            </label>
                          ))}
                        </div>
                      ) : q.type === "multiple_select" ? (
                        <div className="space-y-2">
                          {(q.options ?? []).map((option, optionIdx) => (
                            <label
                              key={`${q.id}-multi-${optionIdx}`}
                              className="flex items-center gap-2 text-sm text-slate-700"
                            >
                              <input type="checkbox" disabled />
                              {option}
                            </label>
                          ))}
                        </div>
                      ) : q.type === "drop_down" ? (
                        <select
                          disabled
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white text-slate-700"
                        >
                          <option value="">
                            {q.placeholder ?? "Choose..."}
                          </option>
                          {(q.options ?? []).map((option, optionIdx) => (
                            <option
                              key={`${q.id}-dd-${optionIdx}`}
                              value={option}
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : q.type === "ranking" ? (
                        <ol className="space-y-2">
                          {(q.items ?? []).map((item, itemIdx) => (
                            <li
                              key={`${q.id}-rank-${itemIdx}`}
                              className="flex items-center gap-2 rounded-md border border-[#4583C1] px-3 py-2 text-sm text-slate-700"
                            >
                              <span className="text-xs text-slate-400">
                                {itemIdx + 1}.
                              </span>
                              <span className="flex-1">{item}</span>
                              <span className="text-xs text-slate-400">⇅</span>
                            </li>
                          ))}
                        </ol>
                      ) : q.type === "single_select_grid" ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-slate-700 border-collapse">
                            <thead>
                              <tr>
                                <th className="p-2 text-left" />
                                {(q.columns ?? []).map((col, colIdx) => (
                                  <th
                                    key={`${q.id}-col-${colIdx}`}
                                    className="p-2 text-center font-medium"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(q.rows ?? []).map((row, rowIdx) => (
                                <tr
                                  key={`${q.id}-row-${rowIdx}`}
                                  className="border-t"
                                >
                                  <td className="p-2 text-left">{row}</td>
                                  {(q.columns ?? []).map((col, colIdx) => (
                                    <td
                                      key={`${q.id}-cell-${rowIdx}-${colIdx}`}
                                      className="p-2 text-center"
                                    >
                                      <input
                                        type="radio"
                                        disabled
                                        name={`grid-${q.id}-${rowIdx}`}
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : q.type === "likert_scale" ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-slate-700 border-collapse">
                            <thead>
                              <tr>
                                <th className="p-2 text-left" />
                                {(q.scale_options ?? []).map((opt, optIdx) => (
                                  <th
                                    key={`${q.id}-likert-${optIdx}`}
                                    className="p-2 text-center font-medium"
                                  >
                                    {opt}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(q.statements && q.statements.length > 0
                                ? q.statements
                                : [q.label || "Statement"]
                              ).map((statement, rowIdx) => (
                                <tr
                                  key={`${q.id}-likert-row-${rowIdx}`}
                                  className="border-t"
                                >
                                  <td className="p-2 text-left">{statement}</td>
                                  {(q.scale_options ?? []).map(
                                    (opt, optIdx) => (
                                      <td
                                        key={`${q.id}-likert-cell-${rowIdx}-${optIdx}`}
                                        className="p-2 text-center"
                                      >
                                        <input
                                          type="radio"
                                          disabled
                                          name={`likert-${q.id}-${rowIdx}`}
                                        />
                                      </td>
                                    ),
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <input
                          readOnly
                          value=""
                          placeholder={q.placeholder ?? ""}
                          className="w-full rounded-md border border-[#4583C1] px-3 py-2 text-sm bg-white placeholder:text-gray-400"
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
