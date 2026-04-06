import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Check,
  ChevronDown,
  GripVertical,
  Loader2,
  Search,
  Star,
} from "lucide-react";
import {
  getRespondentUrl,
  submitCustomerSurveyResponse,
  verifyRespondentToken,
  type RespondentChannelResponse,
  type RespondentSession,
} from "@/lib/auth";
import { ApiError } from "@/lib/api";
import RespondentVerification from "@/components/RespondentVerification";

// Types

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
  required?: boolean | string | number;
  type: QuestionType;
  scale?: number | string;
  max_length?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
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

type SurveyAnswerValue = string | number | string[] | Record<string, string>;

function hasAnswerValue(value: SurveyAnswerValue | undefined): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.length > 0;
  return Object.keys(value).length > 0;
}

// Helpers

const STORAGE_PREFIX = "compass.survey.preview.";
const RESPONDENT_STORAGE_PREFIX = "compass.survey.respondent.";

const formControl =
  "w-full rounded-xl sm:rounded-2xl bg-white px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-[#1A2330] placeholder:text-[#8C98AC] focus:outline-none focus:ring-2 focus:ring-[#206AB5]/25 transition shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md";

const whitePanel =
  "rounded-2xl sm:rounded-3xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)]";

/** Safely coerce any array element to a plain string (handles API that returns objects). */
function toStr(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const found = obj["value"] ?? obj["label"] ?? obj["text"] ?? obj["name"];
    if (found !== undefined) return String(found);
  }
  return String(val ?? "");
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(toStr)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map(toStr)
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      // fall through to delimiter parsing
    }

    if (raw.includes("\n") || raw.includes(",")) {
      return raw
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [raw];
  }

  return [];
}

function toNum(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isRequired(value: PreviewQuestion["required"]): boolean {
  return value === true || value === 1 || value === "1";
}

function normalizeQuestionType(value: unknown): QuestionType {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (normalized === "multiline_text") return "multiline_text";
  if (normalized === "date_time" || normalized === "date_and_time") {
    return "date_time";
  }
  if (normalized === "location_list") return "location_list";
  if (normalized === "single_select") return "single_select";
  if (normalized === "multiple_select") return "multiple_select";
  if (normalized === "drop_down" || normalized === "dropdown") {
    return "drop_down";
  }
  if (normalized === "single_select_grid") return "single_select_grid";
  if (normalized === "likert_scale") return "likert_scale";
  if (
    normalized === "text" ||
    normalized === "number" ||
    normalized === "rating" ||
    normalized === "slider" ||
    normalized === "date" ||
    normalized === "time" ||
    normalized === "email" ||
    normalized === "website" ||
    normalized === "address" ||
    normalized === "ranking"
  ) {
    return normalized;
  }

  return "text";
}

function normalizePreviewQuestion(raw: unknown, idx: number): PreviewQuestion {
  const q =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const type = normalizeQuestionType(q.type);
  const parsedId = Number(q.id ?? idx + 1);

  return {
    id: Number.isFinite(parsedId) ? parsedId : idx + 1,
    label: String(q.label ?? ""),
    placeholder: String(q.placeholder ?? ""),
    required: (q.required as PreviewQuestion["required"]) ?? false,
    type,
    scale: q.scale as PreviewQuestion["scale"],
    max_length:
      q.max_length === undefined ? undefined : Number(q.max_length ?? 0),
    min: q.min as PreviewQuestion["min"],
    max: q.max as PreviewQuestion["max"],
    step: q.step as PreviewQuestion["step"],
    min_date: (q.min_date as string | null | undefined) ?? null,
    max_date: (q.max_date as string | null | undefined) ?? null,
    min_datetime: (q.min_datetime as string | null | undefined) ?? null,
    max_datetime: (q.max_datetime as string | null | undefined) ?? null,
    options: toStringArray(q.options),
    items: toStringArray(q.items),
    rows: toStringArray(q.rows),
    columns: toStringArray(q.columns),
    scale_options: toStringArray(q.scale_options),
    statements: toStringArray(q.statements),
    locations: toStringArray(q.locations),
  };
}

function questionNumber(idx: number): string {
  return String(idx + 1).padStart(2, "0");
}

export function openSurveyPreview(data: PreviewData) {
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  window.open(`/survey-preview?key=${key}`, "_blank", "noopener");
}

function respondentStorageKey(hash: string): string {
  return `${RESPONDENT_STORAGE_PREFIX}${hash}`;
}

function readStoredRespondent(hash: string): RespondentSession | null {
  try {
    const raw = localStorage.getItem(respondentStorageKey(hash));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RespondentSession>;

    if (!parsed || typeof parsed !== "object") return null;

    const normalizedHash = String(parsed.hash ?? hash).trim();
    const normalizedEmail = String(parsed.email ?? "").trim();
    if (!normalizedHash || !normalizedEmail) return null;

    return {
      hash: normalizedHash,
      email: normalizedEmail,
      fname: String(parsed.fname ?? "").trim(),
      sname: String(parsed.sname ?? "").trim(),
      phone: String(parsed.phone ?? "").trim(),
      token: String(parsed.token ?? "").trim() || undefined,
      user_exists:
        parsed.user_exists == null ? undefined : Number(parsed.user_exists),
      verification_pending: Boolean(parsed.verification_pending),
    };
  } catch {
    return null;
  }
}

function storeRespondent(session: RespondentSession): void {
  localStorage.setItem(
    respondentStorageKey(session.hash),
    JSON.stringify(session),
  );
}

function clearStoredRespondent(hash: string): void {
  localStorage.removeItem(respondentStorageKey(hash));
}

function readUserExists(response: RespondentChannelResponse): number {
  const fromDetails = Number(response?.data?.details?.user_exists ?? 0);
  if (Number.isFinite(fromDetails) && fromDetails > 0) return fromDetails;

  const fromData = Number(response?.data?.user_exists ?? 0);
  if (Number.isFinite(fromData) && fromData > 0) return fromData;

  return 0;
}

function responseMessage(response: RespondentChannelResponse): string {
  return (
    String(response?.message ?? "").trim() ||
    String(response?.data?.message ?? "").trim() ||
    ""
  );
}

function sessionFromResponse(
  response: RespondentChannelResponse,
  fallbackHash: string,
): RespondentSession {
  const details = response?.data?.details;
  const hash = String(
    details?.hash ?? response?.data?.hash ?? fallbackHash,
  ).trim();
  const email = String(details?.email ?? response?.data?.email ?? "").trim();
  const fname = String(details?.fname ?? "").trim();
  const sname = String(details?.sname ?? "").trim();
  const phone = String(details?.phone ?? "").trim();
  const token = String(details?.token ?? "").trim();

  return {
    hash,
    email,
    fname,
    sname,
    phone,
    token: token || undefined,
    user_exists: readUserExists(response) || undefined,
    verification_pending: false,
  };
}

function buildDisplayName(session: RespondentSession | null): string {
  if (!session) return "";
  const fullName = `${session.fname ?? ""} ${session.sname ?? ""}`.trim();
  if (fullName) return fullName;
  return session.email;
}

// Question renderers

function TextField({
  q,
  value,
  onChange,
}: {
  q: PreviewQuestion;
  value?: SurveyAnswerValue;
  onChange: (next: string) => void;
}) {
  const normalizedValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";

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
      placeholder={q.placeholder || "Type your answer"}
      maxLength={q.max_length}
      value={normalizedValue}
      onChange={(e) => onChange(e.target.value)}
      className={formControl}
    />
  );
}

function MultilineField({
  q,
  value,
  onChange,
}: {
  q: PreviewQuestion;
  value?: SurveyAnswerValue;
  onChange: (next: string) => void;
}) {
  const normalizedValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";

  return (
    <textarea
      rows={4}
      placeholder={q.placeholder || "Type your answer"}
      maxLength={q.max_length}
      value={normalizedValue}
      onChange={(e) => onChange(e.target.value)}
      className={`${formControl} min-h-[170px] resize-none`}
    />
  );
}

function DatePickerCard({
  value,
  onChange,
  min,
  max,
}: {
  value: string;
  onChange: (next: string) => void;
  min?: string;
  max?: string;
}) {
  const monthLabel = useMemo(() => {
    const source = value ? new Date(`${value}T00:00:00`) : new Date();
    if (Number.isNaN(source.getTime())) {
      return "Select date";
    }
    return source.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [value]);

  const activeDay = useMemo(() => {
    const source = value ? new Date(`${value}T00:00:00`) : new Date();
    if (Number.isNaN(source.getTime())) return 24;
    return source.getDate();
  }, [value]);

  const days = useMemo(() => {
    const start = Math.max(activeDay - 3, 1);
    return Array.from({ length: 7 }, (_, i) => start + i);
  }, [activeDay]);

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={`${whitePanel} p-4 sm:p-6`}>
      <div className="flex items-center justify-between">
        <span className="text-xl sm:text-[1.75rem] font-semibold tracking-tight text-[#151C28]">
          {monthLabel}
        </span>
        <div className="text-[#9AA7BC] text-xl sm:text-2xl font-semibold">
          &#x2039; &#x203A;
        </div>
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-7 gap-y-2 sm:gap-y-3 text-center">
        {weekdays.map((day) => (
          <span
            key={day}
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#92A0B5]"
          >
            {day}
          </span>
        ))}

        {days.map((day) => {
          const selected = day === activeDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                const source = value
                  ? new Date(`${value}T00:00:00`)
                  : new Date();
                source.setDate(day);
                onChange(source.toISOString().slice(0, 10));
              }}
              className={`mx-auto h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition ${
                selected
                  ? "bg-[#206AB5] text-white ring-4 ring-[#206AB5]/20"
                  : "text-[#3A4658] hover:bg-[#F1F4F9]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className={`${formControl} mt-4 sm:mt-5`}
      />
    </div>
  );
}

function TimePickerCard({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw || 14);
  const minute = Number(minuteRaw || 30);
  const isPm = hour >= 12;
  const hour12 = String(((hour + 11) % 12) + 1).padStart(2, "0");

  return (
    <div className={`${whitePanel} p-4 sm:p-6 flex flex-col justify-between`}>
      <div>
        <p className="text-center text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#206AB5]">
          Select Time
        </p>

        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-4">
          <div className="rounded-xl sm:rounded-2xl bg-[#F1F3F7] px-4 py-3 sm:px-6 sm:py-4 text-3xl sm:text-5xl font-bold text-[#161E2B]">
            {hour12}
          </div>
          <span className="text-3xl sm:text-5xl font-bold text-[#AAB3C1]">
            :
          </span>
          <div className="rounded-xl sm:rounded-2xl bg-[#F1F3F7] px-4 py-3 sm:px-6 sm:py-4 text-3xl sm:text-5xl font-bold text-[#161E2B]">
            {String(minute).padStart(2, "0")}
          </div>
          <div className="ml-1 flex flex-col gap-1.5 sm:gap-2">
            <span
              className={`rounded-lg sm:rounded-xl px-2.5 py-1 text-xs sm:text-sm font-bold ${
                isPm ? "bg-[#206AB5] text-white" : "bg-[#E7EBF2] text-[#909DB1]"
              }`}
            >
              PM
            </span>
            <span
              className={`rounded-lg sm:rounded-xl px-2.5 py-1 text-xs sm:text-sm font-bold ${
                !isPm
                  ? "bg-[#206AB5] text-white"
                  : "bg-[#E7EBF2] text-[#909DB1]"
              }`}
            >
              AM
            </span>
          </div>
        </div>
      </div>

      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${formControl} mt-5 sm:mt-6 text-center text-base sm:text-lg font-semibold tracking-[0.12em] sm:tracking-[0.18em]`}
      />
    </div>
  );
}

function DateField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: string) => void;
}) {
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("14:30");

  const updateDate = (next: string) => {
    setDateValue(next);
    if (q.type === "date") {
      onChange(next);
      return;
    }
    onChange(next && timeValue ? `${next} ${timeValue}` : "");
  };

  const updateTime = (next: string) => {
    setTimeValue(next);
    if (q.type === "time") {
      onChange(next);
      return;
    }
    onChange(dateValue && next ? `${dateValue} ${next}` : "");
  };

  if (q.type === "date") {
    return (
      <DatePickerCard
        value={dateValue}
        onChange={updateDate}
        min={q.min_date ?? undefined}
        max={q.max_date ?? undefined}
      />
    );
  }

  if (q.type === "time") {
    return <TimePickerCard value={timeValue} onChange={updateTime} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DatePickerCard
        value={dateValue}
        onChange={updateDate}
        min={(q.min_datetime ?? "").slice(0, 10) || undefined}
        max={(q.max_datetime ?? "").slice(0, 10) || undefined}
      />
      <TimePickerCard value={timeValue} onChange={updateTime} />
    </div>
  );
}

function AddressField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: Record<string, string>) => void;
}) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const emitAddress = (
    nextStreet: string,
    nextCity: string,
    nextStateRegion: string,
    nextPostalCode: string,
    nextCountry: string,
  ) => {
    const next: Record<string, string> = {};
    if (nextStreet.trim()) next.street = nextStreet.trim();
    if (nextCity.trim()) next.city = nextCity.trim();
    if (nextStateRegion.trim()) next.state = nextStateRegion.trim();
    if (nextPostalCode.trim()) next.postal_code = nextPostalCode.trim();
    if (nextCountry.trim()) next.country = nextCountry.trim();
    onChange(next);
  };

  return (
    <div className={`${whitePanel} overflow-hidden`}>
      <div className="border-b border-[#E1E6EE] p-4 sm:p-5">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8FA0B8]">
          Street Address
        </label>
        <input
          type="text"
          value={street}
          onChange={(e) => {
            const next = e.target.value;
            setStreet(next);
            emitAddress(next, city, stateRegion, postalCode, country);
          }}
          placeholder={q.placeholder || "Street and building"}
          className="w-full border-0 bg-transparent p-0 text-xl sm:text-[1.65rem] font-semibold text-[#1A2330] placeholder:text-[#AFB7C4] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#E1E6EE]">
        <div className="border-b border-[#E1E6EE] p-4 sm:p-5 md:border-b-0 md:border-r md:border-r-[#E1E6EE]">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8FA0B8]">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => {
              const next = e.target.value;
              setCity(next);
              emitAddress(street, next, stateRegion, postalCode, country);
            }}
            placeholder="City"
            className="w-full border-0 bg-transparent p-0 text-lg sm:text-[1.5rem] font-semibold text-[#1A2330] placeholder:text-[#AFB7C4] focus:outline-none"
          />
        </div>
        <div className="p-4 sm:p-5">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8FA0B8]">
            State / Region
          </label>
          <input
            type="text"
            value={stateRegion}
            onChange={(e) => {
              const next = e.target.value;
              setStateRegion(next);
              emitAddress(street, city, next, postalCode, country);
            }}
            placeholder="State / Region"
            className="w-full border-0 bg-transparent p-0 text-lg sm:text-[1.5rem] font-semibold text-[#1A2330] placeholder:text-[#AFB7C4] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-[#E1E6EE] p-4 sm:p-5 md:border-b-0 md:border-r md:border-r-[#E1E6EE]">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8FA0B8]">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => {
              const next = e.target.value;
              setPostalCode(next);
              emitAddress(street, city, stateRegion, next, country);
            }}
            placeholder="Postal code"
            className="w-full border-0 bg-transparent p-0 text-lg sm:text-[1.5rem] font-semibold text-[#1A2330] placeholder:text-[#AFB7C4] focus:outline-none"
          />
        </div>
        <div className="p-4 sm:p-5">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8FA0B8]">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => {
              const next = e.target.value;
              setCountry(next);
              emitAddress(street, city, stateRegion, postalCode, next);
            }}
            placeholder="Country"
            className="w-full border-0 bg-transparent p-0 text-lg sm:text-[1.5rem] font-semibold text-[#1A2330] placeholder:text-[#AFB7C4] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function SliderField({
  q,
  value,
  onChange,
}: {
  q: PreviewQuestion;
  value?: SurveyAnswerValue;
  onChange: (next: number) => void;
}) {
  const min = toNum(q.min, 0);
  const max = toNum(q.max, 100);
  const step = toNum(q.step, 1);
  const val =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? toNum(value, min)
        : min;
  const pct = ((val - min) / Math.max(max - min, 1)) * 100;

  return (
    <div className={`${whitePanel} p-4 sm:p-6`}>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[#6A7688]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#DFE5EF]"
        style={{
          background: `linear-gradient(to right, #206AB5 ${pct}%, #DFE5EF ${pct}%)`,
        }}
      />
      <div className="mt-5 flex justify-center">
        <div className="inline-flex h-12 min-w-12 sm:h-14 sm:min-w-14 items-center justify-center rounded-full bg-[#DDEAFF] px-4 sm:px-5 text-lg sm:text-xl font-bold text-[#206AB5]">
          {val}
        </div>
      </div>
    </div>
  );
}

function RatingField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const scale = toNum(q.scale, 5);

  return (
    <div className={`${whitePanel} p-4 sm:p-6`}>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {Array.from({ length: scale }, (_, i) => i + 1).map((n) => {
          const active =
            hovered !== null
              ? n <= hovered
              : selected !== null && n <= selected;
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected(n);
                onChange(n);
              }}
              className="rounded-xl p-1 transition hover:scale-110"
              aria-label={`Rate ${n}`}
            >
              <Star
                className="h-8 w-8 sm:h-10 sm:w-10 transition-colors"
                fill={active ? "#206AB5" : "none"}
                stroke={active ? "#206AB5" : "#BAC4D3"}
                strokeWidth={1.7}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DropdownField({
  q,
  value,
  onChange,
}: {
  q: PreviewQuestion;
  value?: SurveyAnswerValue;
  onChange: (next: string) => void;
}) {
  const options = toStringArray(q.options ?? q.locations);
  const normalizedValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";

  return (
    <div className="relative">
      <select
        value={normalizedValue}
        onChange={(e) => onChange(e.target.value)}
        className={`${formControl} appearance-none pr-12`}
      >
        <option value="" disabled>
          {q.placeholder || "Choose an option"}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9BA8BC]" />
    </div>
  );
}

function LocationListField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: string) => void;
}) {
  const options = toStringArray(q.locations ?? q.options);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((item) => item.toLowerCase().includes(needle));
  }, [options, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#95A3B8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={q.placeholder || "Search locations"}
          className={`${formControl} pl-12`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const active = selected === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSelected(item);
                onChange(item);
              }}
              className={`rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-left text-sm sm:text-base md:text-lg font-semibold transition shadow-[0_4px_12px_rgba(32,106,181,0.02)] ${
                active
                  ? "bg-[#206AB5]/5 ring-2 ring-[#206AB5] text-[#206AB5]"
                  : "bg-white text-[#2A3344] hover:shadow-md hover:ring-2 hover:ring-[#206AB5]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {options.length === 0 && (
        <p className="text-sm text-[#8D9AB0]">No locations added yet.</p>
      )}
    </div>
  );
}

function SingleSelectField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: string) => void;
}) {
  const [val, setVal] = useState("");
  const options = toStringArray(q.options);

  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        options.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {options.map((opt, i) => {
        const chosen = val === opt;
        return (
          <label
            key={i}
            className={`cursor-pointer rounded-2xl sm:rounded-3xl px-4 py-5 sm:px-6 sm:py-8 text-center transition shadow-[0_4px_12px_rgba(0,0,0,0.02)] ${
              chosen
                ? "bg-[#206AB5]/5 ring-2 ring-[#206AB5] text-[#206AB5]"
                : "bg-white hover:shadow-md hover:ring-2 hover:ring-[#206AB5]"
            }`}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt}
              checked={chosen}
              onChange={() => {
                setVal(opt);
                onChange(opt);
              }}
              className="sr-only"
            />
            <span
              className={`text-lg sm:text-2xl font-semibold tracking-tight ${
                chosen ? "text-[#206AB5]" : "text-[#1A2330]"
              }`}
            >
              {opt}
            </span>
          </label>
        );
      })}

      {options.length === 0 && (
        <p className="text-sm text-[#8D9AB0]">No options added yet.</p>
      )}
    </div>
  );
}

function MultipleSelectField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: string[]) => void;
}) {
  const [vals, setVals] = useState<Set<string>>(new Set());
  const options = toStringArray(q.options);

  const toggle = (opt: string) => {
    setVals((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) {
        next.delete(opt);
      } else {
        next.add(opt);
      }
      onChange(Array.from(next));
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {options.map((opt, i) => {
        const chosen = vals.has(opt);
        return (
          <label
            key={i}
            className={`flex cursor-pointer items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-6 sm:py-6 transition shadow-[0_4px_12px_rgba(0,0,0,0.02)] ${
              chosen
                ? "bg-[#206AB5]/5 ring-2 ring-[#206AB5]"
                : "bg-white hover:shadow-md hover:ring-2 hover:ring-[#206AB5]"
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
              className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 transition ${
                chosen
                  ? "border-[#206AB5] bg-[#206AB5] text-white"
                  : "border-[#BAC4D3] bg-white text-transparent"
              }`}
            >
              <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} />
            </span>
            <span
              className={`text-base sm:text-xl font-semibold tracking-tight ${
                chosen ? "text-[#206AB5]" : "text-[#374356]"
              }`}
            >
              {opt}
            </span>
          </label>
        );
      })}

      {options.length === 0 && (
        <p className="text-sm text-[#8D9AB0]">No options added yet.</p>
      )}
    </div>
  );
}

function RankingField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: string[]) => void;
}) {
  const [items, setItems] = useState<string[]>(toStringArray(q.items));
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const onDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setItems(next);
    onChange(next);
    setDragIdx(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item, i) => (
        <div
          key={`${item}-${i}`}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(i)}
          className="flex cursor-grab items-center gap-3 sm:gap-5 rounded-2xl sm:rounded-3xl bg-white px-4 py-4 sm:px-6 sm:py-6 transition shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:ring-2 hover:ring-[#206AB5] active:cursor-grabbing"
        >
          <span className="w-10 sm:w-16 md:w-20 text-2xl sm:text-4xl md:text-5xl font-black italic leading-none text-[#206AB5]/20">
            {questionNumber(i)}
          </span>
          <span className="flex-1 text-base sm:text-xl md:text-2xl font-semibold text-[#1A2330]">
            {item}
          </span>
          <GripVertical className="h-5 w-5 sm:h-6 sm:w-6 text-[#B8C3D2]" />
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-sm text-[#8D9AB0]">No ranking items added yet.</p>
      )}
    </div>
  );
}

function SingleSelectGridField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: Record<string, string>) => void;
}) {
  const rows = toStringArray(q.rows);
  const cols = toStringArray(q.columns);
  const [vals, setVals] = useState<Record<string, string>>({});

  if (rows.length === 0 || cols.length === 0) {
    return <p className="text-sm text-[#8D9AB0]">No rows/columns added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px] sm:min-w-[760px]">
        <div className="mb-3 grid grid-cols-[2fr_repeat(4,minmax(80px,1fr))] sm:grid-cols-[2fr_repeat(4,minmax(90px,1fr))] gap-2 sm:gap-3 px-2 sm:px-3 text-center text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.16em] text-[#4A5568]">
          <span className="text-left">Metric</span>
          {cols.slice(0, 4).map((col, i) => (
            <span key={i}>{col}</span>
          ))}
        </div>

        <div className="space-y-3">
          {rows.map((row, ri) => (
            <div
              key={ri}
              className="grid grid-cols-[2fr_repeat(4,minmax(80px,1fr))] sm:grid-cols-[2fr_repeat(4,minmax(90px,1fr))] items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl bg-white px-3 py-3 sm:px-5 sm:py-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              <span className="text-base sm:text-lg md:text-xl font-medium text-[#222B39]">
                {row}
              </span>
              {cols.slice(0, 4).map((col, ci) => {
                const chosen = vals[row] === col;
                return (
                  <label
                    key={ci}
                    className="mx-auto inline-flex cursor-pointer items-center justify-center"
                  >
                    <input
                      type="radio"
                      name={`grid-${q.id}-row-${ri}`}
                      value={col}
                      checked={chosen}
                      onChange={() => {
                        const next = { ...vals, [row]: col };
                        setVals(next);
                        onChange(next);
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full border-[3px] sm:border-[4px] transition ${
                        chosen
                          ? "border-[#0E5EA8] bg-[#C7DDF4]"
                          : "border-[#B9C3D2] bg-white"
                      }`}
                    >
                      {chosen && (
                        <span className="mx-auto mt-[8px] sm:mt-[10px] block h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#0E5EA8]" />
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LikertField({
  q,
  onChange,
}: {
  q: PreviewQuestion;
  onChange: (next: Record<string, string>) => void;
}) {
  const scale = toStringArray(q.scale_options);
  const stmts = toStringArray(q.statements);
  const [vals, setVals] = useState<Record<string, string>>({});

  if (scale.length === 0 || stmts.length === 0) {
    return (
      <p className="text-sm text-[#8D9AB0]">
        No scale options or statements added yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px] sm:min-w-[820px]">
        <div className="mb-3 grid grid-cols-[2fr_repeat(4,minmax(85px,1fr))] sm:grid-cols-[2fr_repeat(4,minmax(90px,1fr))] gap-2 sm:gap-3 px-2 sm:px-3 text-center text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.16em] text-[#4A5568]">
          <span className="text-left">Metric</span>
          {scale.slice(0, 4).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>

        <div className="space-y-3">
          {stmts.map((stmt, si) => (
            <div
              key={si}
              className="grid grid-cols-[2fr_repeat(4,minmax(85px,1fr))] sm:grid-cols-[2fr_repeat(4,minmax(90px,1fr))] items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl bg-white px-3 py-3 sm:px-5 sm:py-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              <span className="text-base sm:text-lg md:text-xl font-medium text-[#222B39]">
                {stmt}
              </span>

              {scale.slice(0, 4).map((item, i) => {
                const chosen = vals[stmt] === item;
                return (
                  <label
                    key={i}
                    className="mx-auto inline-flex cursor-pointer items-center justify-center"
                  >
                    <input
                      type="radio"
                      name={`likert-${q.id}-stmt-${si}`}
                      value={item}
                      checked={chosen}
                      onChange={() => {
                        const next = { ...vals, [stmt]: item };
                        setVals(next);
                        onChange(next);
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full border-[3px] sm:border-[4px] transition ${
                        chosen
                          ? "border-[#0E5EA8] bg-[#C7DDF4]"
                          : "border-[#B9C3D2] bg-white"
                      }`}
                    >
                      {chosen && (
                        <span className="mx-auto mt-[8px] sm:mt-[10px] block h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#0E5EA8]" />
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionInput({
  q,
  value,
  onAnswerChange,
}: {
  q: PreviewQuestion;
  value?: SurveyAnswerValue;
  onAnswerChange: (next: SurveyAnswerValue) => void;
}) {
  switch (q.type) {
    case "multiline_text":
      return <MultilineField q={q} value={value} onChange={onAnswerChange} />;
    case "date":
    case "time":
    case "date_time":
      return <DateField q={q} onChange={onAnswerChange} />;
    case "address":
      return <AddressField q={q} onChange={onAnswerChange} />;
    case "slider":
      return <SliderField q={q} value={value} onChange={onAnswerChange} />;
    case "rating":
      return <RatingField q={q} onChange={onAnswerChange} />;
    case "single_select":
      return <SingleSelectField q={q} onChange={onAnswerChange} />;
    case "multiple_select":
      return <MultipleSelectField q={q} onChange={onAnswerChange} />;
    case "drop_down":
      return <DropdownField q={q} value={value} onChange={onAnswerChange} />;
    case "location_list":
      return <LocationListField q={q} onChange={onAnswerChange} />;
    case "ranking":
      return <RankingField q={q} onChange={onAnswerChange} />;
    case "single_select_grid":
      return <SingleSelectGridField q={q} onChange={onAnswerChange} />;
    case "likert_scale":
      return <LikertField q={q} onChange={onAnswerChange} />;
    default:
      return <TextField q={q} value={value} onChange={onAnswerChange} />;
  }
}

// Page

function resolveIncomingHash(
  searchParams: URLSearchParams,
  pathHash?: string,
): string {
  const fromPath = (pathHash ?? "").trim();
  if (fromPath) return fromPath;

  const fromNamedParams =
    searchParams.get("hash") ??
    searchParams.get("h") ??
    searchParams.get("respondent_hash");

  if (fromNamedParams && fromNamedParams.trim()) {
    return fromNamedParams.trim();
  }

  const fromEmptyParam = searchParams.get("");
  return (fromEmptyParam ?? "").trim();
}

export default function SurveyPreviewPage() {
  const { hash: pathHash } = useParams<{ hash?: string }>();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<PreviewData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadMessage, setLoadMessage] = useState(
    "Loading survey for response...",
  );
  const [sourceMode, setSourceMode] = useState<"preview" | "hash">("hash");
  const [respondentSession, setRespondentSession] =
    useState<RespondentSession | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null,
  );
  const [isTokenVerifying, setIsTokenVerifying] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionLoadError, setQuestionLoadError] = useState<string | null>(
    null,
  );
  const [surveyAnswers, setSurveyAnswers] = useState<
    Record<number, SurveyAnswerValue>
  >({});
  const [respondentCustomerId, setRespondentCustomerId] = useState("");
  const [activeSurveyId, setActiveSurveyId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const key = searchParams.get("key")?.trim() ?? "";
  const incomingHash = resolveIncomingHash(searchParams, pathHash);
  const incomingToken = (searchParams.get("token") ?? "").trim();

  const isHashMode = sourceMode === "hash";
  const respondentBearerToken = respondentSession?.token;
  const isRespondentVerified =
    isHashMode &&
    Boolean(respondentSession?.token) &&
    !respondentSession?.verification_pending;
  const isWaitingForEmailVerification =
    isHashMode && Boolean(respondentSession?.verification_pending);
  const shouldShowVerificationModal =
    isHashMode &&
    Boolean(incomingHash) &&
    !key &&
    !notFound &&
    !isTokenVerifying &&
    !isRespondentVerified &&
    !isWaitingForEmailVerification;

  const respondentDisplayName = buildDisplayName(respondentSession);

  const handleAnswerChange = (questionId: number, next: SurveyAnswerValue) => {
    setSurveyAnswers((prev) => ({ ...prev, [questionId]: next }));
  };

  const handleSubmitSurvey = async () => {
    if (!data) return;
    if (!respondentCustomerId || !activeSurveyId) {
      setSubmitError(
        "Survey context is missing. Please refresh and try again.",
      );
      return;
    }

    const missingRequired = data.questions.find(
      (question) =>
        isRequired(question.required) &&
        !hasAnswerValue(surveyAnswers[question.id]),
    );

    if (missingRequired) {
      setSubmitSuccess(null);
      setSubmitError(
        `Please answer required question: ${missingRequired.label}`,
      );
      return;
    }

    const payloadAnswers = Object.entries(surveyAnswers)
      .filter(([, answer]) => hasAnswerValue(answer))
      .map(([questionId, answer]) => ({
        question_id: String(questionId),
        answer,
      }));

    if (payloadAnswers.length === 0) {
      setSubmitSuccess(null);
      setSubmitError("Please answer at least one question before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await submitCustomerSurveyResponse(
        {
          customer_id: respondentCustomerId,
          survey_id: activeSurveyId,
          answers: payloadAnswers,
        },
        respondentBearerToken,
      );

      if (response?.status && response.status.toLowerCase() !== "success") {
        throw new Error(response?.message || "Unable to submit response.");
      }

      setSubmitSuccess(
        response?.message || "Thanks! Your survey response was submitted.",
      );
      setSubmitError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not submit your response. Please try again.";
      setSubmitSuccess(null);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseAnotherEmail = () => {
    if (incomingHash) {
      clearStoredRespondent(incomingHash);
    }
    setRespondentSession(null);
    setRespondentCustomerId("");
    setActiveSurveyId(null);
    setSurveyAnswers({});
    setSubmitError(null);
    setSubmitSuccess(null);
    setVerificationMessage(null);
    setData(null);
    setQuestionLoadError(null);
    setNotFound(false);
  };

  const handleRespondentVerified = (session: RespondentSession) => {
    const normalized: RespondentSession = {
      ...session,
      hash: incomingHash || session.hash,
      verification_pending: false,
    };
    storeRespondent(normalized);
    setRespondentSession(normalized);
    setSubmitError(null);
    setSubmitSuccess(null);
    setVerificationMessage(null);
    setData(null);
  };

  const handlePendingVerification = (
    session: RespondentSession,
    message: string,
  ) => {
    const normalized: RespondentSession = {
      ...session,
      hash: incomingHash || session.hash,
      verification_pending: true,
    };
    storeRespondent(normalized);
    setRespondentSession(normalized);
    setRespondentCustomerId("");
    setActiveSurveyId(null);
    setSurveyAnswers({});
    setSubmitError(null);
    setSubmitSuccess(null);
    setVerificationMessage(message);
    setData(null);
    setIsLoadingQuestions(false);
  };

  useEffect(() => {
    let isActive = true;

    if (key) {
      setSourceMode("preview");
      setRespondentSession(null);
      setRespondentCustomerId("");
      setActiveSurveyId(null);
      setSurveyAnswers({});
      setSubmitError(null);
      setSubmitSuccess(null);
      setVerificationMessage(null);
      setQuestionLoadError(null);
      setIsLoadingQuestions(false);
      setNotFound(false);

      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) {
        setLoadMessage(
          "This preview link has expired or was opened in a different browser.",
        );
        setNotFound(true);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as Partial<PreviewData>;
        const rawQuestions = Array.isArray(parsed.questions)
          ? parsed.questions
          : [];

        setData({
          title: String(parsed.title ?? "Untitled Survey"),
          description: String(parsed.description ?? ""),
          questions: rawQuestions.map((q, idx) =>
            normalizePreviewQuestion(q, idx),
          ),
        });
      } catch {
        setLoadMessage("Could not read preview data.");
        setNotFound(true);
      }
      return;
    }

    if (!incomingHash) {
      setRespondentSession(null);
      setRespondentCustomerId("");
      setActiveSurveyId(null);
      setSurveyAnswers({});
      setSubmitError(null);
      setSubmitSuccess(null);
      setLoadMessage("Missing survey hash in URL.");
      setNotFound(true);
      return;
    }

    setSourceMode("hash");
    setNotFound(false);
    setSubmitError(null);
    setSubmitSuccess(null);
    setQuestionLoadError(null);
    setData(null);

    const stored = readStoredRespondent(incomingHash);

    if (incomingToken) {
      setIsTokenVerifying(true);
      setLoadMessage("Verifying your email link...");
      setVerificationMessage(null);
      setRespondentSession(null);

      verifyRespondentToken({ hash: incomingHash, token: incomingToken })
        .then((response) => {
          if (!isActive) return;

          const userExists = readUserExists(response);
          const isSuccessful =
            response?.status === "success" && userExists === 1;

          if (isSuccessful) {
            const session = sessionFromResponse(response, incomingHash);
            if (!session.token || !session.email) {
              setVerificationMessage(
                "Verification succeeded but your session could not be prepared.",
              );
              setRespondentSession(null);
              return;
            }
            storeRespondent(session);
            setRespondentSession(session);
            setVerificationMessage(null);
            return;
          }

          clearStoredRespondent(incomingHash);
          setRespondentSession(null);
          setVerificationMessage(
            responseMessage(response) ||
              "This verification link is invalid or expired. Enter your email to continue.",
          );
        })
        .catch(() => {
          if (!isActive) return;
          clearStoredRespondent(incomingHash);
          setRespondentSession(null);
          setVerificationMessage(
            "We could not verify this link right now. Enter your email to continue.",
          );
        })
        .finally(() => {
          if (!isActive) return;
          setIsTokenVerifying(false);
        });

      return () => {
        isActive = false;
      };
    }

    if (stored) {
      setRespondentSession(stored);
      setSubmitError(null);
      setSubmitSuccess(null);
      setVerificationMessage(
        stored.verification_pending
          ? "A verification email has been sent. Open the link in your email to continue."
          : null,
      );
    } else {
      setRespondentSession(null);
      setRespondentCustomerId("");
      setActiveSurveyId(null);
      setSurveyAnswers({});
      setSubmitError(null);
      setSubmitSuccess(null);
      setVerificationMessage(null);
    }

    return () => {
      isActive = false;
    };
  }, [incomingHash, incomingToken, key]);

  useEffect(() => {
    if (sourceMode !== "hash") return;
    if (!incomingHash) return;
    if (!isRespondentVerified) return;

    let isActive = true;
    setLoadMessage("Resolving survey link...");
    setQuestionLoadError(null);
    setIsLoadingQuestions(true);

    getRespondentUrl(incomingHash, respondentBearerToken)
      .then((res) => {
        if (!isActive) return;

        const payload = res?.data;
        const details = payload?.details;
        const customerId = String(payload?.user_id ?? "").trim();

        // Extract survey directly from respondent lookup response
        const surveyRecord =
          details && typeof details === "object"
            ? (details as Record<string, unknown>)
            : ({} as Record<string, unknown>);

        const survey =
          surveyRecord.survey && typeof surveyRecord.survey === "object"
            ? (surveyRecord.survey as Record<string, unknown>)
            : ({} as Record<string, unknown>);

        const surveyId = Number(surveyRecord.survey_id ?? survey.id ?? 0);

        // Validate that we have a valid survey
        if (!survey.id || !survey.title) {
          setRespondentCustomerId(customerId);
          setActiveSurveyId(Number.isFinite(surveyId) ? surveyId : null);
          setSurveyAnswers({});
          setData({
            title: "Public Survey Response",
            description: "",
            questions: [],
          });
          setQuestionLoadError("No survey is linked to this response hash.");
          return;
        }

        // Parse questions from survey - check both 'question' and 'questions' fields
        const rawQuestions = Array.isArray(survey.question)
          ? survey.question
          : Array.isArray(survey.questions)
            ? survey.questions
            : [];
        const questions = rawQuestions.map((q, idx) =>
          normalizePreviewQuestion(q, idx),
        );

        setData({
          title: String(survey.title ?? "Untitled Survey"),
          description: String(survey.description ?? ""),
          questions,
        });
        setRespondentCustomerId(customerId);
        setActiveSurveyId(
          Number.isFinite(surveyId) && surveyId > 0 ? surveyId : null,
        );
        setSurveyAnswers({});
        setSubmitError(null);
        setSubmitSuccess(null);
        setQuestionLoadError(null);
      })
      .catch((error) => {
        if (!isActive) return;

        // Handle respondent token expiration (401)
        if (error instanceof ApiError && error.status === 401) {
          clearStoredRespondent(incomingHash);
          setRespondentSession(null);
          setRespondentCustomerId("");
          setActiveSurveyId(null);
          setSurveyAnswers({});
          setSubmitError(null);
          setSubmitSuccess(null);
          setVerificationMessage(
            "Your verification link has expired. Please request a new verification email to continue responding to this survey.",
          );
          return;
        }

        // Generic error for other issues (hash not found, etc)
        setLoadMessage("Could not resolve this survey hash.");
        setNotFound(true);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingQuestions(false);
      });

    return () => {
      isActive = false;
    };
  }, [incomingHash, isRespondentVerified, respondentBearerToken, sourceMode]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#ECEFF3] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-[#A2AEC2]" />
          <h2 className="mt-4 text-2xl font-semibold text-[#1A2330]">
            {sourceMode === "preview"
              ? "Preview not available"
              : "Survey response unavailable"}
          </h2>
          <p className="mt-2 text-base text-[#6B788D]">{loadMessage}</p>
        </div>
      </div>
    );
  }

  if (isTokenVerifying) {
    return (
      <div className="min-h-screen bg-[#ECEFF3] flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#206AB5]" />
          <p className="mt-3 text-base text-[#6B788D]">{loadMessage}</p>
        </div>
      </div>
    );
  }

  if (
    isHashMode &&
    incomingToken &&
    !respondentSession &&
    !verificationMessage
  ) {
    return (
      <div className="min-h-screen bg-[#ECEFF3] flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#206AB5]" />
          <p className="mt-3 text-base text-[#6B788D]">
            Verifying your email link...
          </p>
        </div>
      </div>
    );
  }

  if (isWaitingForEmailVerification) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white px-6 py-8 sm:px-10 sm:py-12 text-center shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171E29]">
            Verify your email to continue
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5E6C81] leading-relaxed">
            {verificationMessage ||
              "We sent you a verification email. Open the link from your inbox to continue to this survey."}
          </p>

          <button
            type="button"
            onClick={handleUseAnotherEmail}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-[#206AB5]/25 bg-[#206AB5]/5 px-5 py-2.5 text-sm font-semibold text-[#206AB5] transition hover:bg-[#206AB5]/10"
          >
            Wrong email? Use another one
          </button>
        </div>
      </div>
    );
  }

  if (shouldShowVerificationModal) {
    return (
      <div className="min-h-screen bg-[#F7F9FB]">
        <RespondentVerification
          hash={incomingHash}
          open
          onVerified={handleRespondentVerified}
          onPendingVerification={handlePendingVerification}
        />
        {verificationMessage && (
          <div className="mx-auto max-w-[760px] px-4 pt-8 sm:px-6 sm:pt-10">
            <p className="rounded-xl bg-[#FEEBED] px-4 py-3 text-sm font-medium text-[#B1223C]">
              {verificationMessage}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#ECEFF3] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border-4 border-[#206AB5] border-t-transparent animate-spin" />
          <p className="mt-3 text-base text-[#6B788D]">{loadMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Logo Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
        <img
          src="/assets/Compass-logo.png"
          alt="Compass Survey"
          className="h-10 sm:h-12 w-auto"
        />
      </div>

      <div className="mx-auto max-w-[1024px] px-4 pb-16 pt-4 sm:px-6 sm:pt-6 md:px-8 md:pb-20 md:pt-8">
        {/* Survey Title & Description */}
        <header className="mb-10 sm:mb-12 md:mb-14 text-center">
          {sourceMode === "preview" && (
            <span className="inline-block rounded-full bg-[#C6DAF7] px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[#4D5F7D]">
              Survey Preview
            </span>
          )}
          <h1
            className={`text-[1.9rem] sm:text-[2.6rem] lg:text-[3.3rem] font-bold tracking-tight text-[#171E29] leading-[1.05] sm:leading-[1] ${
              sourceMode === "preview" ? "mt-4 sm:mt-5" : ""
            }`}
          >
            {data.title || "Untitled Survey"}
          </h1>
          {data.description && (
            <p className="mx-auto mt-3 sm:mt-4 max-w-3xl text-base sm:text-xl lg:text-2xl leading-[1.45] text-[#4A5568]">
              {data.description}
            </p>
          )}
        </header>

        {/* Respondent Info - After Title & Description */}
        {sourceMode === "hash" && respondentSession && (
          <section className="mb-8 sm:mb-10 md:mb-12 rounded-2xl sm:rounded-3xl bg-white px-5 py-5 sm:px-8 sm:py-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
            <h2 className="text-sm sm:text-base font-semibold uppercase tracking-[0.12em] text-[#5B6A80]">
              Respondent
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C98AC]">
                  Name
                </p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-[#1A2330] break-words">
                  {respondentDisplayName}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C98AC]">
                  Email
                </p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-[#1A2330] break-words">
                  {respondentSession.email}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C98AC]">
                  Phone
                </p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-[#1A2330] break-words">
                  {respondentSession.phone || "-"}
                </p>
              </div>
            </div>
          </section>
        )}

        {questionLoadError ? (
          <div className={`${whitePanel} px-8 py-12 text-center`}>
            <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
            <h3 className="mt-3 text-2xl font-semibold text-[#1A2330]">
              Could not load survey questions
            </h3>
            <p className="mt-2 text-base text-[#6B788D]">{questionLoadError}</p>
          </div>
        ) : isLoadingQuestions ? (
          <div className={`${whitePanel} px-8 py-12 text-center`}>
            <div className="mx-auto h-10 w-10 rounded-full border-4 border-[#206AB5] border-t-transparent animate-spin" />
            <p className="mt-3 text-base text-[#6B788D]">
              Loading survey questions...
            </p>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12 md:space-y-14">
            {data.questions.map((q, idx) => (
              <section key={q.id}>
                <div className="mb-4 sm:mb-5 flex items-start gap-3 sm:gap-4">
                  <span className="mt-1 inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE2EA] text-sm sm:text-base font-bold text-[#4E6487]">
                    {questionNumber(idx)}
                  </span>
                  <div className="pt-0.5">
                    <h2 className="text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] font-semibold tracking-tight text-[#1A2330] leading-[1.2]">
                      {q.label || `Question ${idx + 1}`}
                    </h2>
                    {isRequired(q.required) && (
                      <p className="mt-2 text-[0.6em] font-semibold uppercase tracking-[0.12em] text-[#CE3B3B]">
                        Required
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:pl-12">
                  <QuestionInput
                    q={q}
                    value={surveyAnswers[q.id]}
                    onAnswerChange={(next) => handleAnswerChange(q.id, next)}
                  />
                </div>
              </section>
            ))}
          </div>
        )}

        {submitError && (
          <p className="mt-6 rounded-xl bg-[#FEEBED] px-4 py-3 text-sm font-medium text-[#B1223C]">
            {submitError}
          </p>
        )}

        {submitSuccess && (
          <p className="mt-6 rounded-xl bg-[#EAF7EF] px-4 py-3 text-sm font-medium text-[#186A3B]">
            {submitSuccess}
          </p>
        )}

        {sourceMode === "hash" &&
          !questionLoadError &&
          data.questions.length > 0 && (
            <div className="mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl bg-white px-5 py-5 sm:px-8 sm:py-6 sm:flex sm:items-center sm:justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <p className="text-xs sm:text-sm text-[#67758A]">
                <span className="font-bold text-[#CE3B3B]">*</span> Required
                questions must be filled.
              </p>
              <button
                type="button"
                onClick={handleSubmitSurvey}
                disabled={
                  isSubmitting ||
                  !respondentCustomerId ||
                  !activeSurveyId ||
                  !isRespondentVerified
                }
                className="mt-3 sm:mt-0 w-full rounded-xl sm:rounded-2xl bg-[#206AB5] px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit response"}
              </button>
            </div>
          )}

        {data.questions.length === 0 &&
          !questionLoadError &&
          !isLoadingQuestions && (
            <div className="mt-8 rounded-2xl sm:rounded-3xl bg-white px-6 py-10 sm:px-8 sm:py-12 text-center text-sm sm:text-base text-[#6B788D] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              No questions added yet.
            </div>
          )}
      </div>
    </div>
  );
}
