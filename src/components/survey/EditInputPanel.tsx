import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Question {
  id: number;
  label: string;
  hint?: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}

interface EditInputPanelProps {
  selected?: Question | null;
  onUpdate?: (patch: Partial<Question>) => void;
}

const EditInputPanel = ({ selected, onUpdate }: EditInputPanelProps) => {
  const [label, setLabel] = useState("");
  const [hint, setHint] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (selected) {
      setLabel(selected.label ?? "");
      setHint(selected.hint ?? "");
      setDefaultValue(selected.defaultValue ?? "");
      setRequired(!!selected.required);
    } else {
      setLabel("");
      setHint("");
      setDefaultValue("");
      setRequired(false);
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
              <label className="text-xs text-muted-foreground">Hint</label>
              <textarea
                value={hint}
                onChange={(e) => {
                  setHint(e.target.value);
                  onUpdate?.({ hint: e.target.value });
                }}
                placeholder="Hint"
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent h-24"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Default Value
              </label>
              <input
                value={defaultValue}
                onChange={(e) => {
                  setDefaultValue(e.target.value);
                  onUpdate?.({ defaultValue: e.target.value });
                }}
                placeholder="Question1"
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

            {selected &&
              selected.type !== "Single line text" &&
              selected.type !== "Multiline text" && (
                <Card className="p-3 bg-muted/30 border-0">
                  <p className="text-sm text-muted-foreground">
                    No edit options implemented yet for this input type.
                  </p>
                </Card>
              )}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() =>
                  selected &&
                  onUpdate?.({ label, hint, defaultValue, required })
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
