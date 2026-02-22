import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Star, ChevronDown, GripVertical, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType =
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

interface PreviewQuestion {
  id: number;
  label: string;
  placeholder?: string;
  required?: boolean;
  type: QuestionType;
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

interface PreviewData {
  title: string;
  description: string;
  questions: PreviewQuestion[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "compass.survey.preview.";

/** Safely coerce any array element to a plain string (handles API that returns objects) */
function toStr(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const o = val as Record<string, unknown>;
    const v = o["value"] ?? o["label"] ?? o["text"] ?? o["name"];
    if (v !== undefined) return String(v);
  }
  return String(val ?? "");
}

function toStringArray(arr: unknown[] | undefined): string[] {
  return (arr ?? []).map(toStr);
}

export function openSurveyPreview(data: PreviewData) {
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  window.open(`/survey-preview?key=${key}`, "_blank", "noopener");
}

// ─── Question renderers ────────────────────────────────────────────────────────

const baseInput =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#206AB5]/30 focus:border-[#206AB5] transition-all";

function TextField({ q }: { q: PreviewQuestion }) {
  return (
    <input
      type={
        q.type === "email"
          ? "email"
          : q.type === "website"
            ? "url"
            : q.type === "number"
              ? "number"
              : "text"
      }
      placeholder={q.placeholder || "Type your answer…"}
      maxLength={q.max_length}
      className={baseInput}
    />
  );
}

function MultilineField({ q }: { q: PreviewQuestion }) {
  return (
    <textarea
      placeholder={q.placeholder || "Type your answer…"}
      maxLength={q.max_length}
      rows={4}
      className={`${baseInput} resize-none`}
    />
  );
}

function DateField({ q }: { q: PreviewQuestion }) {
  const type =
    q.type === "date_time"
      ? "datetime-local"
      : q.type === "time"
        ? "time"
        : "date";
  return (
    <input
      type={type}
      min={q.min_date ?? q.min_datetime ?? undefined}
      max={q.max_date ?? q.max_datetime ?? undefined}
      className={baseInput}
    />
  );
}

function SliderField({ q }: { q: PreviewQuestion }) {
  const [val, setVal] = useState(q.min ?? 0);
  const min = q.min ?? 0;
  const max = q.max ?? 100;
  const step = q.step ?? 1;
  const pct = ((val - min) / (max - min)) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-100"
          style={{
            background: `linear-gradient(to right, #206AB5 ${pct}%, #e2e8f0 ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#206AB5]/10 text-[#206AB5] font-bold text-sm">
          {val}
        </span>
      </div>
    </div>
  );
}

function RatingField({ q }: { q: PreviewQuestion }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const scale = q.scale ?? 5;
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: scale }, (_, i) => i + 1).map((n) => {
        const active =
          hovered !== null ? n <= hovered : selected !== null && n <= selected;
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelected(n)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${n}`}
          >
            <Star
              className="w-8 h-8 transition-colors"
              fill={active ? "#206AB5" : "none"}
              stroke={active ? "#206AB5" : "#cbd5e1"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

function DropdownField({ q }: { q: PreviewQuestion }) {
  const options = toStringArray(q.options ?? q.locations);
  return (
    <div className="relative">
      <select defaultValue="" className={`${baseInput} appearance-none pr-10`}>
        <option value="" disabled>
          {q.placeholder || "Select an option…"}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    </div>
  );
}

function SingleSelectField({ q }: { q: PreviewQuestion }) {
  const [val, setVal] = useState("");
  const options = toStringArray(q.options);
  return (
    <div className="space-y-2">
      {options.map((opt, i) => {
        const chosen = val === opt;
        return (
          <label
            key={i}
            className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border transition-all select-none ${
              chosen
                ? "border-[#206AB5] bg-[#206AB5]/5"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt}
              checked={chosen}
              onChange={() => setVal(opt)}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                chosen ? "border-[#206AB5] bg-[#206AB5]" : "border-slate-300"
              }`}
            />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        );
      })}
      {options.length === 0 && (
        <p className="text-xs text-slate-400 italic">No options added yet</p>
      )}
    </div>
  );
}

function MultipleSelectField({ q }: { q: PreviewQuestion }) {
  const [vals, setVals] = useState<Set<string>>(new Set());
  const options = toStringArray(q.options);
  const toggle = (opt: string) => {
    setVals((prev) => {
      const next = new Set(prev);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return next;
    });
  };
  return (
    <div className="space-y-2">
      {options.map((opt, i) => {
        const chosen = vals.has(opt);
        return (
          <label
            key={i}
            className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border transition-all select-none ${
              chosen
                ? "border-[#206AB5] bg-[#206AB5]/5"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="checkbox"
              value={opt}
              checked={chosen}
              onChange={() => toggle(opt)}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                chosen ? "border-[#206AB5] bg-[#206AB5]" : "border-slate-300"
              }`}
            >
              {chosen && (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        );
      })}
      {options.length === 0 && (
        <p className="text-xs text-slate-400 italic">No options added yet</p>
      )}
    </div>
  );
}

function RankingField({ q }: { q: PreviewQuestion }) {
  const [items, setItems] = useState<string[]>(toStringArray(q.items));
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const onDragStart = (i: number) => setDragIdx(i);
  const onDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setItems(next);
    setDragIdx(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(i)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white cursor-grab active:cursor-grabbing hover:border-slate-300 transition-all"
        >
          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#206AB5]/10 text-[#206AB5] text-xs font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <span className="text-sm text-slate-700">{item}</span>
        </div>
      ))}
    </div>
  );
}

function SingleSelectGridField({ q }: { q: PreviewQuestion }) {
  const rows = toStringArray(q.rows);
  const cols = toStringArray(q.columns);
  const [vals, setVals] = useState<Record<string, string>>({});

  if (rows.length === 0 || cols.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic">No rows/columns added yet</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left py-3 px-4 text-slate-500 font-medium text-xs min-w-[120px]" />
            {cols.map((col, ci) => (
              <th
                key={ci}
                className="py-3 px-4 text-center text-xs text-slate-600 font-semibold whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-slate-50 last:border-0 ${ri % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
            >
              <td className="py-3 px-4 text-slate-700 text-sm font-medium">
                {row}
              </td>
              {cols.map((col, ci) => (
                <td key={ci} className="py-3 px-4 text-center">
                  <label className="inline-flex items-center justify-center cursor-pointer">
                    <input
                      type="radio"
                      name={`grid-${q.id}-row-${ri}`}
                      value={col}
                      checked={vals[row] === col}
                      onChange={() => setVals((v) => ({ ...v, [row]: col }))}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        vals[row] === col
                          ? "border-[#206AB5] bg-[#206AB5]"
                          : "border-slate-300 hover:border-[#206AB5]/60"
                      }`}
                    />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LikertField({ q }: { q: PreviewQuestion }) {
  const scale = toStringArray(q.scale_options);
  const stmts = toStringArray(q.statements);
  const [vals, setVals] = useState<Record<string, string>>({});

  if (scale.length === 0 || stmts.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic">
        No scale options or statements added yet
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left py-3 px-4 text-slate-500 font-medium text-xs min-w-[140px]" />
            {scale.map((s, i) => (
              <th
                key={i}
                className="py-3 px-3 text-center text-xs text-slate-600 font-semibold whitespace-nowrap"
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stmts.map((stmt, si) => (
            <tr
              key={si}
              className={`border-b border-slate-50 last:border-0 ${si % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
            >
              <td className="py-3 px-4 text-slate-700 text-sm">{stmt}</td>
              {scale.map((s, i) => {
                const chosen = vals[stmt] === s;
                return (
                  <td key={i} className="py-3 px-3 text-center">
                    <label className="inline-flex items-center justify-center cursor-pointer">
                      <input
                        type="radio"
                        name={`likert-${q.id}-stmt-${si}`}
                        value={s}
                        checked={chosen}
                        onChange={() => setVals((v) => ({ ...v, [stmt]: s }))}
                        className="sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          chosen
                            ? "border-[#206AB5] bg-[#206AB5]"
                            : "border-slate-300 hover:border-[#206AB5]/60"
                        }`}
                      />
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuestionInput({ q }: { q: PreviewQuestion }) {
  switch (q.type) {
    case "multiline_text":
      return <MultilineField q={q} />;
    case "date":
    case "time":
    case "date_time":
      return <DateField q={q} />;
    case "slider":
      return <SliderField q={q} />;
    case "rating":
      return <RatingField q={q} />;
    case "single_select":
      return <SingleSelectField q={q} />;
    case "multiple_select":
      return <MultipleSelectField q={q} />;
    case "drop_down":
    case "location_list":
      return <DropdownField q={q} />;
    case "ranking":
      return <RankingField q={q} />;
    case "single_select_grid":
      return <SingleSelectGridField q={q} />;
    case "likert_scale":
      return <LikertField q={q} />;
    default:
      return <TextField q={q} />;
  }
}

function typeLabel(type: QuestionType): string {
  const map: Partial<Record<QuestionType, string>> = {
    text: "Short text",
    multiline_text: "Long text",
    number: "Number",
    email: "Email",
    website: "Website",
    address: "Address",
    date: "Date",
    time: "Time",
    date_time: "Date & Time",
    slider: "Slider",
    rating: "Rating",
    single_select: "Single choice",
    multiple_select: "Multiple choice",
    drop_down: "Dropdown",
    location_list: "Location",
    ranking: "Ranking",
    single_select_grid: "Grid",
    likert_scale: "Likert scale",
  };
  return map[type] ?? type;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SurveyPreviewPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<PreviewData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const key = searchParams.get("key");
    if (!key) {
      setNotFound(true);
      return;
    }
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      setData(JSON.parse(raw) as PreviewData);
    } catch {
      setNotFound(true);
    }
  }, [searchParams]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FBFF]">
        <div className="text-center max-w-sm px-6">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            Preview not available
          </h2>
          <p className="text-sm text-slate-400">
            This preview link has expired or was opened in a different browser.
            Please return to the survey builder and click Preview again.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FBFF]">
        <div className="w-8 h-8 rounded-full border-2 border-[#206AB5] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#F7FBFF] to-[#EEF4FF]">
      {/* Preview banner */}
      <div className="sticky top-0 z-10 flex items-center justify-center gap-2 bg-[#206AB5] py-2.5 px-4 text-white text-xs font-medium shadow-sm">
        <Eye className="w-3.5 h-3.5" />
        <span>Preview mode — this is how your survey looks to respondents</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        {/* Survey header card */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden mb-6">
          {/* Accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#206AB5] to-[#4E9DDB]" />
          <div className="px-8 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
              {data.title || "Untitled Survey"}
            </h1>
            {data.description && (
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {data.description}
              </p>
            )}
            <div className="mt-5 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-4">
              <span>
                {data.questions.length} question
                {data.questions.length !== 1 ? "s" : ""}
              </span>
              <span>·</span>
              <span>
                {data.questions.filter((q) => q.required).length} required
              </span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {data.questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-2xl bg-white shadow-sm border border-slate-100 px-6 sm:px-8 py-6 transition-shadow hover:shadow-md"
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#206AB5]/10 text-[#206AB5] text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                      {q.label || `Question ${idx + 1}`}
                      {q.required && (
                        <span
                          className="text-red-500 ml-1 font-bold"
                          title="Required"
                        >
                          *
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="flex-shrink-0 text-[10px] font-medium text-slate-400 uppercase tracking-wide bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1 mt-0.5">
                  {typeLabel(q.type)}
                </span>
              </div>

              {/* Required badge */}
              {q.required && (
                <div className="flex items-center gap-1.5 text-xs text-red-500 mb-3 -mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  Required
                </div>
              )}

              {/* Input */}
              <QuestionInput q={q} />
            </div>
          ))}
        </div>

        {/* Footer submit area */}
        {data.questions.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white shadow-sm border border-slate-100 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              <span className="text-red-400 font-bold">*</span> indicates a
              required question
            </p>
            <button
              type="button"
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#206AB5] text-white text-sm font-semibold px-8 py-3 opacity-50 cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}

        {data.questions.length === 0 && (
          <div className="mt-6 rounded-2xl bg-white shadow-sm border border-slate-100 px-8 py-12 text-center">
            <p className="text-slate-400 text-sm">No questions added yet.</p>
          </div>
        )}

        <p className="text-center text-xs text-slate-300 mt-8">
          Powered by Compass Survey
        </p>
      </div>
    </div>
  );
}

// Re-export the Eye icon locally for the banner
function Eye({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
