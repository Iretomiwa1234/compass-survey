import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Question {
  id: number;
  label: string;
  placeholder?: string;
  required?: boolean;
  type: "text" | "rating";
  scale?: number;
}

interface EditInputPanelProps {
  selected?: Question | null;
  onUpdate?: (patch: Partial<Question>) => void;
}

const EditInputPanel = ({ selected, onUpdate }: EditInputPanelProps) => {
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [required, setRequired] = useState(false);
  const [scale, setScale] = useState(5);

  useEffect(() => {
    if (selected) {
      setLabel(selected.label ?? "");
      setPlaceholder(selected.placeholder ?? "");
      setRequired(!!selected.required);
      setScale(selected.scale ?? 5);
    } else {
      setLabel("");
      setPlaceholder("");
      setRequired(false);
      setScale(5);
    }
  }, [selected]);

  return (
    <div className="min-w-[300px] md:max-w-[350px] rounded-lg bg-card p-4 overflow-y-auto h-[calc(100vh-var(--nav-height))] md:w-[35%] w-full">
      <h2 className="text-lg font-semibold mb-4">Edit Input</h2>

      {!selected ? (
        <Card className="p-4 bg-muted/50 border-0">
          <p className="text-sm text-muted-foreground text-center">
            Click on input to start editing
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 bg-muted/50 border-0">
            <h3 className="text-sm font-semibold">{selected?.label}</h3>
          </Card>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <input
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  onUpdate?.({ label: e.target.value });
                }}
                placeholder="Question1"
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Placeholder
              </label>
              <input
                value={placeholder}
                onChange={(e) => {
                  setPlaceholder(e.target.value);
                  onUpdate?.({ placeholder: e.target.value });
                }}
                placeholder="Enter placeholder"
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="required"
                type="checkbox"
                checked={required}
                onChange={(e) => {
                  setRequired(e.target.checked);
                  onUpdate?.({ required: e.target.checked });
                }}
                className="mt-1"
              />
              <label htmlFor="required" className="text-sm">
                Required Question
              </label>
            </div>

            {selected?.type === "rating" ? (
              <div>
                <label className="text-xs text-muted-foreground">
                  Rating Scale (1-5)
                </label>
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setScale(num);
                          onUpdate?.({ scale: num });
                        }}
                        className={`flex-1 h-10 rounded font-medium text-sm transition-colors ${
                          scale === num
                            ? "bg-[#6AAFE0] text-white"
                            : "bg-[#E8F0FB] text-[#206AB5] hover:bg-[#D5E6F5]"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                    <span>Not satisfied</span>
                    <span>Very satisfied</span>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() =>
                  selected &&
                  onUpdate?.({
                    label,
                    placeholder,
                    required,
                    ...(selected.type === "rating" ? { scale } : {}),
                  })
                }
                className="inline-flex items-center rounded bg-[#206AB5] px-3 py-1.5 text-sm text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditInputPanel;
