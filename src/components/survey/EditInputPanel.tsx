import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

interface Question {
  id: number;
  label: string;
  placeholder?: string;
  required?: boolean;
  type:
    | "text"
    | "multiline_text"
    | "number"
    | "rating"
    | "slider"
    | "date"
    | "time"
    | "date_time"
    | "email"
    | "website"
    | "address"
    | "location_list"
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
  locations?: string[];
}

interface EditInputPanelProps {
  selected?: Question | null;
  onUpdate?: (patch: Partial<Question>) => void;
}

const EditInputPanel = ({ selected, onUpdate }: EditInputPanelProps) => {
  const prevIdRef = useRef<number | null>(null);
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [required, setRequired] = useState(false);
  const [scale, setScale] = useState(5);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(100);
  const [stepVal, setStepVal] = useState(1);
  const [minDate, setMinDate] = useState<string | null>(null);
  const [maxDate, setMaxDate] = useState<string | null>(null);
  const [minDateTime, setMinDateTime] = useState<string | null>(null);
  const [maxDateTime, setMaxDateTime] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [rows, setRows] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [scaleOptions, setScaleOptions] = useState<string[]>([]);
  const [statements, setStatements] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newStatement, setNewStatement] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [colsToAdd, setColsToAdd] = useState(1);

  useEffect(() => {
    const questionIdChanged = selected?.id !== prevIdRef.current;

    if (selected) {
      if (questionIdChanged) {
        setLabel(selected.label ?? "");
        setPlaceholder(selected.placeholder ?? "");
        setRequired(!!selected.required);
        setScale(selected.scale ?? 5);
        setMaxLength(selected.max_length);
        setMinVal(selected.min ?? 0);
        setMaxVal(selected.max ?? 100);
        setStepVal(selected.step ?? 1);
        setMinDate(selected.min_date ?? null);
        setMaxDate(selected.max_date ?? null);
        setMinDateTime(selected.min_datetime ?? null);
        setMaxDateTime(selected.max_datetime ?? null);
        setOptions(selected.options ?? []);
        setItems(selected.items ?? []);
        setRows(selected.rows ?? []);
        setColumns(selected.columns ?? []);
        setScaleOptions(selected.scale_options ?? []);
        setStatements(selected.statements ?? []);
        setLocations(selected.locations ?? []);
        setNewOption("");
        setNewItem("");
        setNewStatement("");
        setNewLocation("");
        setRowsToAdd(1);
        setColsToAdd(1);
        prevIdRef.current = selected.id;
      }
    } else {
      setLabel("");
      setPlaceholder("");
      setRequired(false);
      setScale(5);
      setMaxLength(undefined);
      setMinVal(0);
      setMaxVal(100);
      setStepVal(1);
      setMinDate(null);
      setMaxDate(null);
      setMinDateTime(null);
      setMaxDateTime(null);
      setOptions([]);
      setItems([]);
      setRows([]);
      setColumns([]);
      setScaleOptions([]);
      setStatements([]);
      setLocations([]);
      setNewOption("");
      setNewItem("");
      setNewStatement("");
      setNewLocation("");
      setRowsToAdd(1);
      setColsToAdd(1);
      prevIdRef.current = null;
    }
  }, [selected]);

  const updateArrayValue = (
    values: string[],
    index: number,
    value: string,
    setter: (next: string[]) => void,
    key: keyof Question,
  ) => {
    const next = [...values];
    next[index] = value;
    setter(next);
    onUpdate?.({ [key]: next } as Partial<Question>);
  };

  const removeArrayValue = (
    values: string[],
    index: number,
    setter: (next: string[]) => void,
    key: keyof Question,
  ) => {
    const next = values.filter((_, idx) => idx !== index);
    setter(next);
    onUpdate?.({ [key]: next } as Partial<Question>);
  };

  const moveArrayValue = (
    values: string[],
    fromIndex: number,
    toIndex: number,
    setter: (next: string[]) => void,
    key: keyof Question,
  ) => {
    if (toIndex < 0 || toIndex >= values.length) return;
    const next = [...values];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setter(next);
    onUpdate?.({ [key]: next } as Partial<Question>);
  };

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

          {selected?.type !== "rating" &&
            selected?.type !== "slider" &&
            selected?.type !== "single_select" &&
            selected?.type !== "multiple_select" &&
            selected?.type !== "ranking" &&
            selected?.type !== "drop_down" &&
            selected?.type !== "single_select_grid" &&
            selected?.type !== "likert_scale" && (
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
            )}

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

          {(selected?.type === "text" ||
            selected?.type === "multiline_text") && (
            <div>
              <label className="text-xs text-muted-foreground">
                Max Length (characters)
              </label>
              <input
                type="number"
                value={maxLength ?? ""}
                onChange={(e) => {
                  const val = e.target.value
                    ? Number(e.target.value)
                    : undefined;
                  setMaxLength(val);
                  onUpdate?.({ max_length: val });
                }}
                placeholder="Leave empty for unlimited"
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
              />
            </div>
          )}

          {selected?.type === "rating" && (
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
          )}

          {selected?.type === "slider" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Min Value
                </label>
                <input
                  type="number"
                  value={minVal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMinVal(val);
                    onUpdate?.({ min: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Max Value
                </label>
                <input
                  type="number"
                  value={maxVal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxVal(val);
                    onUpdate?.({ max: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Step</label>
                <input
                  type="number"
                  value={stepVal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setStepVal(val);
                    onUpdate?.({ step: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
            </div>
          )}

          {selected?.type === "date" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Min Date
                </label>
                <input
                  type="date"
                  value={minDate ?? ""}
                  onChange={(e) => {
                    const val = e.target.value || null;
                    setMinDate(val);
                    onUpdate?.({ min_date: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Max Date
                </label>
                <input
                  type="date"
                  value={maxDate ?? ""}
                  onChange={(e) => {
                    const val = e.target.value || null;
                    setMaxDate(val);
                    onUpdate?.({ max_date: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
            </div>
          )}

          {selected?.type === "date_time" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Min Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={minDateTime ?? ""}
                  onChange={(e) => {
                    const val = e.target.value || null;
                    setMinDateTime(val);
                    onUpdate?.({ min_datetime: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Max Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={maxDateTime ?? ""}
                  onChange={(e) => {
                    const val = e.target.value || null;
                    setMaxDateTime(val);
                    onUpdate?.({ max_datetime: val });
                  }}
                  className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
              </div>
            </div>
          )}

          {(selected?.type === "single_select" ||
            selected?.type === "multiple_select" ||
            selected?.type === "drop_down") && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Options
              </label>
              <div className="mt-2 flex gap-2 mb-3">
                <input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add option"
                  className="block flex-1 rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = newOption.trim();
                    if (!value) return;
                    const next = [...options, value];
                    setOptions(next);
                    setNewOption("");
                    onUpdate?.({ options: next });
                  }}
                  className="inline-flex items-center rounded-md bg-[#206AB5] px-3 py-2 text-sm font-medium text-white hover:bg-[#1a5399]"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div
                    key={`option-${index}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={option}
                      onChange={(e) =>
                        updateArrayValue(
                          options,
                          index,
                          e.target.value,
                          setOptions,
                          "options",
                        )
                      }
                      className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          moveArrayValue(
                            options,
                            index,
                            index - 1,
                            setOptions,
                            "options",
                          )
                        }
                        className="inline-flex h-4 w-6 items-center justify-center rounded border border-input text-muted-foreground hover:text-foreground"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          moveArrayValue(
                            options,
                            index,
                            index + 1,
                            setOptions,
                            "options",
                          )
                        }
                        className="inline-flex h-4 w-6 items-center justify-center rounded border border-input text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayValue(options, index, setOptions, "options")
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected?.type === "ranking" && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Items
              </label>
              <div className="mt-2 flex gap-2 mb-3">
                <input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add item"
                  className="block flex-1 rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = newItem.trim();
                    if (!value) return;
                    const next = [...items, value];
                    setItems(next);
                    setNewItem("");
                    onUpdate?.({ items: next });
                  }}
                  className="inline-flex items-center rounded-md bg-[#206AB5] px-3 py-2 text-sm font-medium text-white hover:bg-[#1a5399]"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={`item-${index}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={item}
                      onChange={(e) =>
                        updateArrayValue(
                          items,
                          index,
                          e.target.value,
                          setItems,
                          "items",
                        )
                      }
                      className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          moveArrayValue(
                            items,
                            index,
                            index - 1,
                            setItems,
                            "items",
                          )
                        }
                        className="inline-flex h-4 w-6 items-center justify-center rounded border border-input text-muted-foreground hover:text-foreground"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          moveArrayValue(
                            items,
                            index,
                            index + 1,
                            setItems,
                            "items",
                          )
                        }
                        className="inline-flex h-4 w-6 items-center justify-center rounded border border-input text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayValue(items, index, setItems, "items")
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected?.type === "single_select_grid" && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground">Rows</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={rowsToAdd}
                      onChange={(e) =>
                        setRowsToAdd(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="w-16 rounded-md border border-input px-2 py-1 text-xs bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = [
                          ...rows,
                          ...Array.from({ length: rowsToAdd }).map(() => ""),
                        ];
                        setRows(next);
                        onUpdate?.({ rows: next });
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {rows.map((row, index) => (
                    <div
                      key={`row-${index}`}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={row}
                        onChange={(e) =>
                          updateArrayValue(
                            rows,
                            index,
                            e.target.value,
                            setRows,
                            "rows",
                          )
                        }
                        placeholder={`Row ${index + 1}`}
                        className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayValue(rows, index, setRows, "rows")
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground">
                    Columns
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={colsToAdd}
                      onChange={(e) =>
                        setColsToAdd(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="w-16 rounded-md border border-input px-2 py-1 text-xs bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = [
                          ...columns,
                          ...Array.from({ length: colsToAdd }).map(() => ""),
                        ];
                        setColumns(next);
                        onUpdate?.({ columns: next });
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {columns.map((column, index) => (
                    <div
                      key={`column-${index}`}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={column}
                        onChange={(e) =>
                          updateArrayValue(
                            columns,
                            index,
                            e.target.value,
                            setColumns,
                            "columns",
                          )
                        }
                        placeholder={`Column ${index + 1}`}
                        className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayValue(
                            columns,
                            index,
                            setColumns,
                            "columns",
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selected?.type === "likert_scale" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Scale Options
                </label>
                <div className="mt-2 space-y-2">
                  {scaleOptions.map((option, index) => (
                    <input
                      key={`${option}-${index}`}
                      value={option}
                      disabled
                      className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-muted/40 text-muted-foreground"
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Statements (optional)
                </label>
                <div className="mt-2 flex gap-2 mb-3">
                  <input
                    value={newStatement}
                    onChange={(e) => setNewStatement(e.target.value)}
                    placeholder="Add statement"
                    className="block flex-1 rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const value = newStatement.trim();
                      if (!value) return;
                      const next = [...statements, value];
                      setStatements(next);
                      setNewStatement("");
                      onUpdate?.({ statements: next });
                    }}
                    className="inline-flex items-center rounded-md bg-[#206AB5] px-3 py-2 text-sm font-medium text-white hover:bg-[#1a5399]"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {statements.map((statement, index) => (
                    <div
                      key={`statement-${index}`}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={statement}
                        onChange={(e) =>
                          updateArrayValue(
                            statements,
                            index,
                            e.target.value,
                            setStatements,
                            "statements",
                          )
                        }
                        className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayValue(
                            statements,
                            index,
                            setStatements,
                            "statements",
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selected?.type === "location_list" && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Locations
              </label>
              <div className="mt-2 flex gap-2 mb-3">
                <input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add location"
                  className="block flex-1 rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = newLocation.trim();
                    if (!value) return;
                    const next = [...locations, value];
                    setLocations(next);
                    setNewLocation("");
                    onUpdate?.({ locations: next });
                  }}
                  className="inline-flex items-center rounded-md bg-[#206AB5] px-3 py-2 text-sm font-medium text-white hover:bg-[#1a5399]"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {locations.map((location, index) => (
                  <div
                    key={`location-${index}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={location}
                      onChange={(e) =>
                        updateArrayValue(
                          locations,
                          index,
                          e.target.value,
                          setLocations,
                          "locations",
                        )
                      }
                      className="block w-full rounded-md border border-input px-3 py-2 text-sm bg-transparent"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          moveArrayValue(
                            locations,
                            index,
                            index - 1,
                            setLocations,
                            "locations",
                          )
                        }
                        className="rounded border border-input bg-transparent p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Move up"
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          moveArrayValue(
                            locations,
                            index,
                            index + 1,
                            setLocations,
                            "locations",
                          )
                        }
                        className="rounded border border-input bg-transparent p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Move down"
                        disabled={index === locations.length - 1}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayValue(
                          locations,
                          index,
                          setLocations,
                          "locations",
                        )
                      }
                      className="rounded border border-input bg-transparent p-1 text-muted-foreground hover:text-rose-500"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() =>
                selected &&
                onUpdate?.({
                  label,
                  placeholder:
                    selected.type === "rating" ||
                    selected.type === "slider" ||
                    selected.type === "single_select" ||
                    selected.type === "multiple_select" ||
                    selected.type === "ranking" ||
                    selected.type === "drop_down" ||
                    selected.type === "single_select_grid" ||
                    selected.type === "likert_scale"
                      ? undefined
                      : placeholder,
                  required,
                  ...(selected.type === "rating" ? { scale } : {}),
                  ...(selected.type === "text" ||
                  selected.type === "multiline_text"
                    ? { max_length: maxLength }
                    : {}),
                  ...(selected.type === "slider"
                    ? { min: minVal, max: maxVal, step: stepVal }
                    : {}),
                  ...(selected.type === "date"
                    ? { min_date: minDate, max_date: maxDate }
                    : {}),
                  ...(selected.type === "date_time"
                    ? { min_datetime: minDateTime, max_datetime: maxDateTime }
                    : {}),
                  ...(selected.type === "single_select" ||
                  selected.type === "multiple_select" ||
                  selected.type === "drop_down"
                    ? { options }
                    : {}),
                  ...(selected.type === "ranking" ? { items } : {}),
                  ...(selected.type === "single_select_grid"
                    ? { rows, columns }
                    : {}),
                  ...(selected.type === "likert_scale"
                    ? {
                        scale_options: scaleOptions,
                        statements,
                      }
                    : {}),
                  ...(selected.type === "location_list" ? { locations } : {}),
                })
              }
              className="inline-flex items-center rounded bg-[#206AB5] px-3 py-1.5 text-sm text-white"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditInputPanel;
