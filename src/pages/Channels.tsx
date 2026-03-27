import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MessageSquare,
  QrCode,
  Link2,
  Share2,
  Globe,
  Upload,
  Search,
  Check,
  Download,
  X,
  Inbox,
  Smartphone,
  Copy,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  getSurveys,
  SurveyListItemApi,
  getDemographyOptions,
  getCountries,
  getSurveyDemographyBySurvey,
  patchSurveyDemographyBySurvey,
  postSurveyDemography,
  getRespondentUrl,
  type SurveyDemographyPayload,
} from "@/lib/auth";

const isPublishedSurvey = (survey: SurveyListItemApi) =>
  Number(survey.is_published ?? 0) === 1;

type DemographyFormState = {
  ageMin: string;
  ageMax: string;
  genders: string[];
  maritalStatus: string[];
  locations: string[];
  languages: string[];
  education: string[];
  employment: string[];
  occupation: string[];
  industry: string[];
  deviceType: string[];
  platform: string[];
};

const sortArray = (values: string[]) =>
  [...values].sort((a, b) => a.localeCompare(b));

const normalizeDemographyState = (state: DemographyFormState) => ({
  ...state,
  ageMin: state.ageMin.trim(),
  ageMax: state.ageMax.trim(),
  genders: sortArray(state.genders),
  maritalStatus: sortArray(state.maritalStatus),
  locations: sortArray(state.locations),
  languages: sortArray(state.languages),
  education: sortArray(state.education),
  employment: sortArray(state.employment),
  occupation: sortArray(state.occupation),
  industry: sortArray(state.industry),
  deviceType: sortArray(state.deviceType),
  platform: sortArray(state.platform),
});
import whatsappChat from "/assets/Whatsapp Chat.png?url";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type OptionMap = Record<string, string>;

type DemographyOptionsData = {
  platform?: OptionMap;
  gender?: OptionMap;
  marital_status?: OptionMap;
  language?: OptionMap;
  highest_education_level?: OptionMap;
  employment_status?: OptionMap;
  occupation?: OptionMap;
  industry?: OptionMap;
  device_type?: OptionMap;
};

type SelectOption = {
  value: string;
  label: string;
};

function resolveSelectedLabels(
  selected: string[],
  options: SelectOption[],
): string[] {
  if (!selected.length) return [];
  const optionMap = new Map(options.map((o) => [o.value, o.label]));
  return selected.map((value) => {
    const mapped = optionMap.get(value);
    if (mapped) return mapped;
    return value.replace(/_/g, " ");
  });
}

function mapOptionMap(optionMap?: OptionMap): SelectOption[] {
  if (!optionMap) return [];
  return Object.entries(optionMap).map(([value, label]) => ({ value, label }));
}

function MultiSelectChips({
  label,
  options,
  selected,
  onToggle,
  helperText,
}: {
  label: string;
  options: SelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
            >
              {active && <Check className="inline w-3 h-3 mr-1" />}
              {option.label}
            </button>
          );
        })}
      </div>
      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

function SearchableMultiSelect({
  label,
  options,
  selected,
  onToggle,
  placeholder,
  helperText,
  initialLimit = 0,
}: {
  label: string;
  options: SelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
  placeholder: string;
  helperText?: string;
  initialLimit?: number;
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return initialLimit > 0 ? options.slice(0, initialLimit) : options;
    }
    return options.filter((o) => o.label.toLowerCase().includes(normalized));
  }, [options, query, initialLimit]);

  const addOption = (value: string) => {
    if (!selected.includes(value)) onToggle(value);
    setQuery("");
  };

  const selectedItems = useMemo(
    () => options.filter((o) => selected.includes(o.value)),
    [options, selected],
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-9 bg-card border border-border text-sm"
          onFocus={() => setIsFocused(true)}
          onBlur={() => window.setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered.length > 0) {
                addOption(filtered[0].value);
              }
            }
          }}
        />
        {isFocused ? (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-white p-1 shadow-md max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addOption(option.value)}
                  className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm text-foreground hover:bg-accent"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                No matches found
              </div>
            )}
          </div>
        ) : null}
      </div>

      {selectedItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className="inline-flex items-center gap-1 rounded-full bg-[#206AB5]/10 border border-[#206AB5]/30 text-[#185287] px-2 py-1 text-xs"
            >
              {item.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      ) : null}

      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

const Channels = () => {
  const [activeTab, setActiveTab] = useState("qrcode");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrSubject, setQrSubject] = useState("Scan to share your feedback");
  const [qrMessage, setQrMessage] = useState(
    "Share your honest thoughts in this quick survey.",
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Mobile App — demographic targeting
  const [showDemographics, setShowDemographics] = useState(false);
  const [demoAgeMin, setDemoAgeMin] = useState("");
  const [demoAgeMax, setDemoAgeMax] = useState("");
  const [demoGenders, setDemoGenders] = useState<string[]>([]);
  const [demoMaritalStatus, setDemoMaritalStatus] = useState<string[]>([]);
  const [demoLocations, setDemoLocations] = useState<string[]>([]);
  const [demoLanguages, setDemoLanguages] = useState<string[]>([]);
  const [demoEducation, setDemoEducation] = useState<string[]>([]);
  const [demoEmployment, setDemoEmployment] = useState<string[]>([]);
  const [demoOccupation, setDemoOccupation] = useState<string[]>([]);
  const [demoIndustry, setDemoIndustry] = useState<string[]>([]);
  const [demoDeviceType, setDemoDeviceType] = useState<string[]>([]);
  const [demoDeviceOS, setDemoDeviceOS] = useState<string[]>([]);
  const [demographyOptions, setDemographyOptions] =
    useState<DemographyOptionsData>({});
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
  const [isSavingDemography, setIsSavingDemography] = useState(false);
  const [isLoadingDemography, setIsLoadingDemography] = useState(false);
  const [initialDemographyState, setInitialDemographyState] =
    useState<DemographyFormState | null>(null);

  const [searchParams] = useSearchParams();

  const toggleDemoItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );

  const toggleGender = (g: string) => toggleDemoItem(setDemoGenders, g);
  const toggleLocation = (l: string) => toggleDemoItem(setDemoLocations, l);

  const resetDemographyFilters = useCallback(() => {
    setDemoGenders([]);
    setDemoMaritalStatus([]);
    setDemoLocations([]);
    setDemoLanguages([]);
    setDemoEducation([]);
    setDemoEmployment([]);
    setDemoOccupation([]);
    setDemoIndustry([]);
    setDemoDeviceType([]);
    setDemoDeviceOS([]);
    setDemoAgeMin("");
    setDemoAgeMax("");
  }, []);

  const mapCountrySelections = useCallback(
    (incoming: string[]) => {
      if (!incoming.length) return incoming;
      if (!countryOptions.length) return incoming;

      return incoming.map((value) => {
        const normalized = String(value).trim().toLowerCase();
        const match = countryOptions.find(
          (option) =>
            option.value.toLowerCase() === normalized ||
            option.label.toLowerCase() === normalized,
        );
        return match?.value ?? value;
      });
    },
    [countryOptions],
  );

  // Upload states
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailFileName, setEmailFileName] = useState("");
  const [smsNumbers, setSmsNumbers] = useState("");
  const [smsFileName, setSmsFileName] = useState("");
  const [whatsappNumbers, setWhatsappNumbers] = useState("");
  const [whatsappFileName, setWhatsappFileName] = useState("");

  // File input refs
  const emailFileRef = useRef<HTMLInputElement>(null);
  const smsFileRef = useRef<HTMLInputElement>(null);
  const whatsappFileRef = useRef<HTMLInputElement>(null);

  const surveyLink = "https://msurvey123.com/customerfeedback";
  const websiteUrl = "https://msurvey123.com";

  const platformOptions = useMemo(
    () => mapOptionMap(demographyOptions.platform),
    [demographyOptions.platform],
  );
  const genderOptions = useMemo(
    () => mapOptionMap(demographyOptions.gender),
    [demographyOptions.gender],
  );
  const maritalStatusOptions = useMemo(
    () => mapOptionMap(demographyOptions.marital_status),
    [demographyOptions.marital_status],
  );
  const languageOptions = useMemo(
    () => mapOptionMap(demographyOptions.language),
    [demographyOptions.language],
  );
  const educationOptions = useMemo(
    () => mapOptionMap(demographyOptions.highest_education_level),
    [demographyOptions.highest_education_level],
  );
  const employmentOptions = useMemo(
    () => mapOptionMap(demographyOptions.employment_status),
    [demographyOptions.employment_status],
  );
  const occupationOptions = useMemo(
    () => mapOptionMap(demographyOptions.occupation),
    [demographyOptions.occupation],
  );
  const industryOptions = useMemo(
    () => mapOptionMap(demographyOptions.industry),
    [demographyOptions.industry],
  );
  const deviceTypeOptions = useMemo(
    () => mapOptionMap(demographyOptions.device_type),
    [demographyOptions.device_type],
  );

  const summaryItems = useMemo(() => {
    const genderLabels = resolveSelectedLabels(demoGenders, genderOptions);
    const languageLabels = resolveSelectedLabels(
      demoLanguages,
      languageOptions,
    );
    const maritalLabels = resolveSelectedLabels(
      demoMaritalStatus,
      maritalStatusOptions,
    );
    const deviceLabels = resolveSelectedLabels(
      demoDeviceType,
      deviceTypeOptions,
    );
    const platformLabels = resolveSelectedLabels(demoDeviceOS, platformOptions);

    const ageText =
      demoAgeMin || demoAgeMax
        ? `between ages ${demoAgeMin || "any"} and ${demoAgeMax || "any"}`
        : "across all age groups";

    return [
      `People ${ageText}${genderLabels.length ? `, with gender: ${genderLabels.join(", ")}` : ""}.`,
      `${demoLocations.length ? `People in ${demoLocations.join(", ")}` : "People in all locations"}${languageLabels.length ? ` who speak ${languageLabels.join(", ")}` : ""}.`,
      `${maritalLabels.length ? `People with marital status: ${maritalLabels.join(", ")}` : "People of any marital status"}.`,
      `${deviceLabels.length ? `People using ${deviceLabels.join(", ")}` : "People using any device type"}${platformLabels.length ? ` on ${platformLabels.join(", ")}` : ""}.`,
    ];
  }, [
    demoAgeMax,
    demoAgeMin,
    demoDeviceOS,
    demoDeviceType,
    demoGenders,
    demoLanguages,
    demoLocations,
    demoMaritalStatus,
    deviceTypeOptions,
    genderOptions,
    languageOptions,
    maritalStatusOptions,
    platformOptions,
  ]);

  useEffect(() => {
    let isActive = true;
    setIsLoadingSurveys(true);

    Promise.allSettled([getSurveys(1), getDemographyOptions(), getCountries(1)])
      .then(([surveysRes, demographyRes, countriesRes]) => {
        if (!isActive) return;

        const items =
          surveysRes.status === "fulfilled"
            ? (surveysRes.value?.data?.survey?.data ?? [])
            : [];
        const publishedItems = items.filter(isPublishedSurvey);
        setSurveys(publishedItems);
        setIsLoadingSurveys(false);

        // Auto-select survey from URL param (?survey_id=X)
        const urlSurveyId = searchParams.get("survey_id");
        if (urlSurveyId) {
          const id = Number(urlSurveyId);
          const match = publishedItems.find((s) => s.survey_id === id);
          if (match) {
            setSelectedSurveyId(id);
            setSearchTerm(match.title);
            setActiveTab("mobileapp");
          }
        }

        if (demographyRes.status === "fulfilled") {
          setDemographyOptions(demographyRes.value?.data ?? {});
        }

        if (countriesRes.status === "fulfilled") {
          setCountryOptions(
            (countriesRes.value ?? []).map((country) => ({
              value: country.country_code,
              label: country.country_name,
            })),
          );
        }
      })
      .catch(() => {
        if (!isActive) return;
        setIsLoadingSurveys(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!showSuggestions) return;
    setIsSearchLoading(true);
    const timer = window.setTimeout(() => {
      setIsSearchLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm, showSuggestions]);

  useEffect(() => {
    if (!selectedSurveyId) {
      resetDemographyFilters();
      setInitialDemographyState(null);
      return;
    }

    let isActive = true;
    setIsLoadingDemography(true);

    getSurveyDemographyBySurvey(selectedSurveyId)
      .then((data) => {
        if (!isActive) return;

        setDemoGenders(data.gender ?? []);
        setDemoMaritalStatus(data.marital_status ?? []);
        setDemoLocations(mapCountrySelections(data.location ?? []));
        setDemoLanguages(data.language ?? []);
        setDemoEducation(data.education_level ?? []);
        setDemoEmployment(data.employment_status ?? []);
        setDemoOccupation(data.occupation ?? []);
        setDemoIndustry(data.industry ?? []);
        setDemoDeviceType(data.device_type ?? []);
        setDemoDeviceOS(data.platform ?? []);
        setDemoAgeMin(
          data.age_range_min != null ? String(data.age_range_min) : "",
        );
        setDemoAgeMax(
          data.age_range_max != null ? String(data.age_range_max) : "",
        );

        setInitialDemographyState({
          ageMin: data.age_range_min != null ? String(data.age_range_min) : "",
          ageMax: data.age_range_max != null ? String(data.age_range_max) : "",
          genders: data.gender ?? [],
          maritalStatus: data.marital_status ?? [],
          locations: mapCountrySelections(data.location ?? []),
          languages: data.language ?? [],
          education: data.education_level ?? [],
          employment: data.employment_status ?? [],
          occupation: data.occupation ?? [],
          industry: data.industry ?? [],
          deviceType: data.device_type ?? [],
          platform: data.platform ?? [],
        });
      })
      .catch(() => {
        if (!isActive) return;
        resetDemographyFilters();
        setInitialDemographyState({
          ageMin: "",
          ageMax: "",
          genders: [],
          maritalStatus: [],
          locations: [],
          languages: [],
          education: [],
          employment: [],
          occupation: [],
          industry: [],
          deviceType: [],
          platform: [],
        });
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingDemography(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedSurveyId, mapCountrySelections, resetDemographyFilters]);

  const currentDemographyState = useMemo<DemographyFormState>(
    () => ({
      ageMin: demoAgeMin,
      ageMax: demoAgeMax,
      genders: demoGenders,
      maritalStatus: demoMaritalStatus,
      locations: demoLocations,
      languages: demoLanguages,
      education: demoEducation,
      employment: demoEmployment,
      occupation: demoOccupation,
      industry: demoIndustry,
      deviceType: demoDeviceType,
      platform: demoDeviceOS,
    }),
    [
      demoAgeMin,
      demoAgeMax,
      demoGenders,
      demoMaritalStatus,
      demoLocations,
      demoLanguages,
      demoEducation,
      demoEmployment,
      demoOccupation,
      demoIndustry,
      demoDeviceType,
      demoDeviceOS,
    ],
  );

  const hasDemographyChanges = useMemo(() => {
    if (!initialDemographyState) return false;
    return (
      JSON.stringify(normalizeDemographyState(currentDemographyState)) !==
      JSON.stringify(normalizeDemographyState(initialDemographyState))
    );
  }, [currentDemographyState, initialDemographyState]);

  const sortedSurveys = useMemo(() => {
    return [...surveys].sort((a, b) => b.survey_id - a.survey_id);
  }, [surveys]);

  const selectedSurvey = useMemo(() => {
    if (selectedSurveyId === null) return null;
    return (
      surveys.find((survey) => survey.survey_id === selectedSurveyId) || null
    );
  }, [selectedSurveyId, surveys]);

  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return surveys
      .filter((survey) => survey.title.toLowerCase().includes(query))
      .sort((a, b) => b.survey_id - a.survey_id)
      .slice(0, 10);
  }, [searchTerm, surveys]);

  const handleSelectSurvey = (surveyId: number) => {
    const survey = surveys.find((item) => item.survey_id === surveyId);
    setSelectedSurveyId(surveyId);
    setSearchTerm(survey?.title ?? "");
    setShowSuggestions(false);

    // Test respondent URL endpoint (hash-only)
    getRespondentUrl("ceb85b5f25d274aaabaa34dbbaa5278cd950404a").catch(
      () => {},
    );
  };
  // 3cfee3b6b751e45df312fd38ca959d3fb9a4486c
  // ceb85b5f25d274aaabaa34dbbaa5278cd950404a;
  const handleApplyDemography = async () => {
    if (!selectedSurveyId) {
      toast({
        title: "Select a survey first",
        description: "Choose a survey before applying demographic filters.",
        variant: "destructive",
      });
      return;
    }

    const payload: SurveyDemographyPayload = {
      survey_id: selectedSurveyId,
    };

    const allDeviceTypeValues = deviceTypeOptions.map((o) => o.value);
    const allPlatformValues = platformOptions.map((o) => o.value);

    if (demoGenders.length) payload.gender = demoGenders;
    if (demoMaritalStatus.length) payload.marital_status = demoMaritalStatus;
    if (demoLocations.length) payload.location = demoLocations;
    if (demoLanguages.length) payload.language = demoLanguages;
    if (demoEducation.length) payload.education_level = demoEducation;
    if (demoEmployment.length) payload.employment_status = demoEmployment;
    if (demoOccupation.length) payload.occupation = demoOccupation;
    if (demoIndustry.length) payload.industry = demoIndustry;
    payload.device_type =
      demoDeviceType.length > 0 ? demoDeviceType : allDeviceTypeValues;
    payload.platform =
      demoDeviceOS.length > 0 ? demoDeviceOS : allPlatformValues;

    const ageMin = demoAgeMin.trim();
    const ageMax = demoAgeMax.trim();
    if (ageMin !== "") payload.age_range_min = Number(ageMin);
    if (ageMax !== "") payload.age_range_max = Number(ageMax);

    if (!payload.device_type.length || !payload.platform.length) {
      toast({
        title: "Demography options not ready",
        description:
          "Device type and platform options are required. Please wait for options to load and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingDemography(true);

    try {
      try {
        await patchSurveyDemographyBySurvey(selectedSurveyId, payload);
      } catch {
        await postSurveyDemography(payload);
      }

      setInitialDemographyState(currentDemographyState);

      toast({
        title: "Demography saved",
        description: "Survey demographic filters have been applied.",
      });
    } catch {
      toast({
        title: "Failed to save demography",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDemography(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "email" | "sms" | "whatsapp",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split(/[\r\n]+/).filter((line) => line.trim());
      const data = lines.join(", ");

      switch (type) {
        case "email":
          setEmailRecipients(data);
          setEmailFileName(file.name);
          break;
        case "sms":
          setSmsNumbers(data);
          setSmsFileName(file.name);
          break;
        case "whatsapp":
          setWhatsappNumbers(data);
          setWhatsappFileName(file.name);
          break;
      }

      toast({
        title: "File uploaded!",
        description: `${lines.length} entries loaded from ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const clearUpload = (type: "email" | "sms" | "whatsapp") => {
    switch (type) {
      case "email":
        setEmailRecipients("");
        setEmailFileName("");
        if (emailFileRef.current) emailFileRef.current.value = "";
        break;
      case "sms":
        setSmsNumbers("");
        setSmsFileName("");
        if (smsFileRef.current) smsFileRef.current.value = "";
        break;
      case "whatsapp":
        setWhatsappNumbers("");
        setWhatsappFileName("");
        if (whatsappFileRef.current) whatsappFileRef.current.value = "";
        break;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyLink);
      setLinkCopied(true);
      toast({
        title: "Link Copied!",
        description: "Survey link has been copied to clipboard.",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Customer Satisfaction Survey",
          text: "Please take a moment to complete our survey",
          url: surveyLink,
        });
        toast({
          title: "Shared successfully!",
          description: "Survey link has been shared.",
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
      toast({
        title: "Link Copied!",
        description:
          "Share not supported on this browser. Link copied instead.",
      });
    }
  };

  const handleOpenWebsite = () => {
    window.open(websiteUrl, "_blank", "noopener,noreferrer");
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
    toast({
      title: "QR Code Generated!",
      description: "Your QR code is ready for download.",
    });
  };

  const handleDownloadQR = (format: "png" | "svg") => {
    if (!qrGenerated) {
      toast({
        title: "Generate QR Code First",
        description: "Please generate the QR code before downloading.",
        variant: "destructive",
      });
      return;
    }

    // Create a simple QR-like SVG for download
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="60" height="60" fill="#206AB5"/>
      <rect x="120" y="20" width="60" height="60" fill="#206AB5"/>
      <rect x="20" y="120" width="60" height="60" fill="#206AB5"/>
      <rect x="40" y="40" width="20" height="20" fill="white"/>
      <rect x="140" y="40" width="20" height="20" fill="white"/>
      <rect x="40" y="140" width="20" height="20" fill="white"/>
      <rect x="90" y="20" width="20" height="20" fill="#206AB5"/>
      <rect x="90" y="50" width="20" height="20" fill="#206AB5"/>
      <rect x="90" y="90" width="20" height="20" fill="#206AB5"/>
      <rect x="120" y="90" width="20" height="20" fill="#206AB5"/>
      <rect x="150" y="90" width="20" height="20" fill="#206AB5"/>
      <rect x="90" y="120" width="20" height="20" fill="#206AB5"/>
      <rect x="120" y="150" width="60" height="30" fill="#206AB5"/>
      <rect x="90" y="160" width="20" height="20" fill="#206AB5"/>
    </svg>`;

    if (format === "svg") {
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "survey-qr-code.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Convert SVG to PNG
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svgContent], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = "survey-qr-code.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
          }
        }, "image/png");
      };
      img.src = url;
    }

    toast({
      title: `QR Code Downloaded!`,
      description: `Your QR code has been saved as ${format.toUpperCase()}.`,
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Social Listening" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            {/* Survey Selection Bar */}
            <div className="bg-card rounded-lg p-4 mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {selectedSurvey?.title ?? "Select a survey"}
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for survey"
                    className="pl-9 h-9 bg-white border border-primary/5"
                    value={searchTerm}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      window.setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                  />
                  {showSuggestions &&
                    (isSearchLoading || searchTerm.trim()) && (
                      <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-white p-1 shadow-md">
                        {isSearchLoading ? (
                          <div className="space-y-2 p-2">
                            {Array.from({ length: 3 }).map((_, idx) => (
                              <Skeleton
                                key={`survey-search-skeleton-${idx}`}
                                className="h-6 w-full"
                              />
                            ))}
                          </div>
                        ) : searchSuggestions.length > 0 ? (
                          searchSuggestions.map((survey) => (
                            <button
                              key={survey.survey_id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() =>
                                handleSelectSurvey(survey.survey_id)
                              }
                              className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm text-foreground hover:bg-accent"
                            >
                              {survey.title}
                            </button>
                          ))
                        ) : (
                          <div className="px-2 py-2 text-sm text-muted-foreground">
                            No matching surveys
                          </div>
                        )}
                      </div>
                    )}
                </div>
                <Select
                  value={
                    selectedSurveyId ? String(selectedSurveyId) : undefined
                  }
                  onValueChange={(value) => handleSelectSurvey(Number(value))}
                >
                  <SelectTrigger className="w-[150px] h-9 bg-card border border-border">
                    <SelectValue placeholder="Select Survey" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSurveys && (
                      <SelectItem value="loading" disabled>
                        Loading surveys...
                      </SelectItem>
                    )}
                    {!isLoadingSurveys && sortedSurveys.length === 0 && (
                      <SelectItem value="empty" disabled>
                        No surveys found
                      </SelectItem>
                    )}
                    {!isLoadingSurveys &&
                      sortedSurveys.map((survey) => (
                        <SelectItem
                          key={survey.survey_id}
                          value={String(survey.survey_id)}
                        >
                          {survey.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!selectedSurvey ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <Card className="max-w-md border border-border bg-white shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Inbox className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Select a survey to work on
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Choose a survey from the dropdown or search to continue.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Tabs and Action Buttons Row */}
                <div className="mb-6  bg-white p-4 rounded-lg">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col min-[1090px]:flex-row min-[1090px]:items-center min-[1090px]:justify-between gap-3">
                      <TabsList className="bg-transparent p-0 h-auto gap-1 flex-wrap">
                        <TabsTrigger
                          value="email"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </TabsTrigger>
                        <TabsTrigger value="sms" className="hidden" />
                        <TabsTrigger value="whatsapp" className="hidden" />
                        <TabsTrigger
                          value="qrcode"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <QrCode className="w-4 h-4" />
                          QR Code
                        </TabsTrigger>
                        <TabsTrigger
                          value="mobileapp"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <Smartphone className="w-4 h-4" />
                          Mobile App
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex items-center gap-2 flex-wrap border-t border-border pt-3 min-[1090px]:border-t-0 min-[1090px]:pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyLink}
                          className="gap-2 bg-card border border-border text-foreground hover:bg-accent h-9 px-4"
                        >
                          {linkCopied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Link2 className="w-4 h-4 text-primary" />
                          )}
                          {linkCopied ? "Copied!" : "Link"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="gap-2 bg-card border border-border text-foreground hover:bg-accent h-9 px-4"
                        >
                          <Share2 className="w-4 h-4 text-primary" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenWebsite}
                          className="gap-2 bg-card border border-border text-foreground hover:bg-accent h-9 px-4"
                        >
                          <Globe className="w-4 h-4 text-primary" />
                          Website
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="email">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Email Campaign</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Subject
                              </label>
                              <Input
                                placeholder="Help Us with this Quick Survey - 2 Mins Max"
                                defaultValue="Help Us with this Quick Survey - 2 Mins Max"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Email Message
                              </label>
                              <Textarea
                                placeholder="Enter your email message..."
                                className="min-h-[180px]"
                                defaultValue="Dear valued customer,&#10;&#10;Your feedback is important to us. Please take a moment to complete this short survey about your recent experience.&#10;&#10;Thank you!"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Recipient List
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Upload CSV or enter emails"
                                    value={emailRecipients}
                                    onChange={(e) =>
                                      setEmailRecipients(e.target.value)
                                    }
                                  />
                                  {emailFileName && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#206AB5]/10 px-2 py-0.5 rounded text-xs">
                                      <span className="text-primary">
                                        {emailFileName}
                                      </span>
                                      <button
                                        onClick={() => clearUpload("email")}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={emailFileRef}
                                  accept=".csv,.xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, "email")}
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => emailFileRef.current?.click()}
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                              <Mail className="w-4 h-4" />
                              Send Email Campaign
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                  Customer Satisfaction Survey
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  customerservice@riddle.com
                                </p>
                              </div>

                              <div className="border-t pt-4">
                                <p className="text-sm text-foreground whitespace-pre-line">
                                  Dear valued customer,{"\n\n"}
                                  Your feedback is important to us. Please take
                                  a moment to complete this short survey about
                                  your recent experience.{"\n\n"}
                                  Thank you!
                                </p>
                              </div>

                              <Button className="bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                                <Share2 className="w-4 h-4" />
                                Go to survey
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="sms" className="hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>SMS Campaign</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                SMS Message
                              </label>
                              <Textarea
                                className="min-h-[180px]"
                                defaultValue={`Dear valued customer,

Your feedback is important to us. Please take a moment to complete this short survey about your recent experience.

Link: Msurvey123.com/customerfeedback

Thank you!`}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Phone Numbers
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Upload CSV or enter numbers"
                                    value={smsNumbers}
                                    onChange={(e) =>
                                      setSmsNumbers(e.target.value)
                                    }
                                  />
                                  {smsFileName && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#206AB5]/10 px-2 py-0.5 rounded text-xs">
                                      <span className="text-primary">
                                        {smsFileName}
                                      </span>
                                      <button
                                        onClick={() => clearUpload("sms")}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={smsFileRef}
                                  accept=".csv,.xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, "sms")}
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => smsFileRef.current?.click()}
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Send SMS Campaign
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>

                          <CardContent>
                            <div className="border rounded-lg bg-green-50 p-4 text-sm leading-relaxed">
                              <p className="text-foreground">
                                Dear valued customer,
                              </p>
                              <p className="mt-3">
                                Your feedback is important to us. Please take a
                                moment to complete this short survey about your
                                recent experience.
                              </p>
                              <p className="mt-3 text-primary underline">
                                Msurvey123.com/customerfeedback
                              </p>
                              <p className="mt-3">Thank you!</p>

                              <p className="text-xs text-muted-foreground mt-4">
                                02:25 PM
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="whatsapp" className="hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Whatsapp Campaign</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Whatsapp Message
                              </label>
                              <Textarea
                                className="min-h-[180px]"
                                defaultValue={`Dear valued customer,

Your feedback is important to us. Please take a moment to complete this short survey about your recent experience.

Thank you!`}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Whatsapp Numbers
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Upload CSV or enter numbers"
                                    value={whatsappNumbers}
                                    onChange={(e) =>
                                      setWhatsappNumbers(e.target.value)
                                    }
                                  />
                                  {whatsappFileName && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#206AB5]/10 px-2 py-0.5 rounded text-xs">
                                      <span className="text-primary">
                                        {whatsappFileName}
                                      </span>
                                      <button
                                        onClick={() => clearUpload("whatsapp")}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={whatsappFileRef}
                                  accept=".csv,.xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e, "whatsapp")
                                  }
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() =>
                                    whatsappFileRef.current?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Send Whatsapp Campaign
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>

                          <CardContent>
                            <div className="border rounded-lg bg-green-50 p-4 text-sm leading-relaxed">
                              <img src={whatsappChat} alt="WhatsApp Preview" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="qrcode" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              QR Code
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium block text-foreground">
                                QR Code Subject
                              </label>

                              <Input
                                placeholder="Enter QR code subject"
                                value={qrSubject}
                                onChange={(e) => setQrSubject(e.target.value)}
                                className="h-10 bg-card border border-border"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium block text-foreground">
                                Call to Action Message
                              </label>

                              <Textarea
                                placeholder="Enter your call to action message"
                                value={qrMessage}
                                onChange={(e) => setQrMessage(e.target.value)}
                                className="min-h-[110px] bg-card border border-border"
                              />
                            </div>

                            <Button
                              onClick={handleGenerateQR}
                              className="w-full h-10 bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2 font-medium"
                            >
                              <QrCode className="w-4 h-4" />
                              Generate QR Code
                            </Button>

                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => handleDownloadQR("png")}
                                className="flex-1 h-10 gap-2 border-primary text-primary hover:bg-[#206AB5]/5"
                              >
                                <Download className="w-4 h-4" />
                                Download PNG
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleDownloadQR("svg")}
                                className="flex-1 h-10 gap-2 border-primary text-primary hover:bg-[#206AB5]/5"
                              >
                                <Download className="w-4 h-4" />
                                Download SVG
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              QR Code Preview
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                              <div
                                className={`p-2 transition-opacity ${
                                  qrGenerated ? "opacity-100" : "opacity-50"
                                }`}
                              >
                                <QrCode
                                  className="w-40 h-40 text-primary"
                                  strokeWidth={1}
                                />
                              </div>

                              <p className="text-sm text-muted-foreground">
                                {qrSubject || "QR survey"}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {qrMessage || "Share your feedback"}
                              </p>

                              {!qrGenerated && (
                                <p className="text-xs text-muted-foreground italic">
                                  Click "Generate QR Code" to create your code
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="mobileapp" className="mt-6">
                      <div className="grid grid-cols-1 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              Mobile App Distribution
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-5">
                            {/* Status banner */}
                            <div className="flex items-start gap-3 rounded-xl bg-[#206AB5]/8 border border-[#206AB5]/20 px-4 py-3">
                              <Smartphone className="w-4 h-4 text-[#206AB5] shrink-0 mt-0.5" />
                              <p className="text-sm text-[#185287]">
                                Once published, this survey is automatically
                                available in the Compass mobile app. Control who
                                can see and take it below.
                              </p>
                            </div>

                            {/* Demographic targeting */}
                            <div className="rounded-xl border border-border overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setShowDemographics((v) => !v)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-foreground"
                              >
                                <span className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#206AB5]" />
                                  Demographic targeting
                                  {[
                                    demoDeviceOS.length > 0,
                                    demoGenders.length > 0,
                                    demoMaritalStatus.length > 0,
                                    demoLocations.length > 0,
                                    demoLanguages.length > 0,
                                    demoEducation.length > 0,
                                    demoEmployment.length > 0,
                                    demoOccupation.length > 0,
                                    demoIndustry.length > 0,
                                    demoDeviceType.length > 0,
                                    !!(demoAgeMin || demoAgeMax),
                                  ].filter(Boolean).length > 0 && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#206AB5] text-white text-[9px] font-bold">
                                      {
                                        [
                                          demoDeviceOS.length > 0,
                                          demoGenders.length > 0,
                                          demoMaritalStatus.length > 0,
                                          demoLocations.length > 0,
                                          demoLanguages.length > 0,
                                          demoEducation.length > 0,
                                          demoEmployment.length > 0,
                                          demoOccupation.length > 0,
                                          demoIndustry.length > 0,
                                          demoDeviceType.length > 0,
                                          !!(demoAgeMin || demoAgeMax),
                                        ].filter(Boolean).length
                                      }
                                    </span>
                                  )}
                                </span>
                                {showDemographics ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>

                              {showDemographics && (
                                <div className="px-4 py-4 space-y-5 border-t border-border bg-white">
                                  {/* Age range */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Age range
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min={0}
                                        max={120}
                                        placeholder="Min"
                                        value={demoAgeMin}
                                        onChange={(e) =>
                                          setDemoAgeMin(e.target.value)
                                        }
                                        className="h-9 w-full bg-card border border-border text-sm"
                                      />
                                      <span className="text-muted-foreground text-sm shrink-0">
                                        –
                                      </span>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={120}
                                        placeholder="Max"
                                        value={demoAgeMax}
                                        onChange={(e) =>
                                          setDemoAgeMax(e.target.value)
                                        }
                                        className="h-9 w-full bg-card border border-border text-sm"
                                      />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Leave blank to include all ages.
                                    </p>
                                  </div>

                                  {/* Gender */}
                                  <MultiSelectChips
                                    label="Gender"
                                    options={genderOptions}
                                    selected={demoGenders}
                                    onToggle={toggleGender}
                                    helperText="Select none to include all genders."
                                  />

                                  {/* Marital status */}
                                  <MultiSelectChips
                                    label="Marital status"
                                    options={maritalStatusOptions}
                                    selected={demoMaritalStatus}
                                    onToggle={(value) =>
                                      toggleDemoItem(
                                        setDemoMaritalStatus,
                                        value,
                                      )
                                    }
                                    helperText="Select none to include all."
                                  />

                                  {/* Location — country & state */}
                                  <SearchableMultiSelect
                                    label="Location (Country)"
                                    options={countryOptions}
                                    selected={demoLocations}
                                    onToggle={toggleLocation}
                                    placeholder="Search and select countries"
                                    helperText="Type to filter countries. Press Enter to add first match."
                                  />

                                  {/* Language */}
                                  <MultiSelectChips
                                    label="Language"
                                    options={languageOptions}
                                    selected={demoLanguages}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoLanguages, value)
                                    }
                                    helperText="Select none to include all languages."
                                  />

                                  {/* Education level */}
                                  <MultiSelectChips
                                    label="Education level"
                                    options={educationOptions}
                                    selected={demoEducation}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoEducation, value)
                                    }
                                    helperText="Select none to include all education levels."
                                  />

                                  {/* Employment status */}
                                  <MultiSelectChips
                                    label="Employment status"
                                    options={employmentOptions}
                                    selected={demoEmployment}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoEmployment, value)
                                    }
                                    helperText="Select none to include all employment statuses."
                                  />

                                  <SearchableMultiSelect
                                    label="Occupation"
                                    options={occupationOptions}
                                    selected={demoOccupation}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoOccupation, value)
                                    }
                                    placeholder="Search occupations…"
                                    helperText="Only valid occupations can be selected."
                                    initialLimit={5}
                                  />

                                  {/* Industry */}
                                  <SearchableMultiSelect
                                    label="Industry"
                                    options={industryOptions}
                                    selected={demoIndustry}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoIndustry, value)
                                    }
                                    placeholder="Search industries…"
                                    helperText="Only valid industries can be selected."
                                    initialLimit={5}
                                  />

                                  {/* Device type */}
                                  <MultiSelectChips
                                    label="Device type"
                                    options={deviceTypeOptions}
                                    selected={demoDeviceType}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoDeviceType, value)
                                    }
                                    helperText="Select none to include all device types."
                                  />

                                  {/* Device OS / brand */}
                                  <MultiSelectChips
                                    label="Platform"
                                    options={platformOptions}
                                    selected={demoDeviceOS}
                                    onToggle={(value) =>
                                      toggleDemoItem(setDemoDeviceOS, value)
                                    }
                                    helperText="Select one or both available platforms."
                                  />

                                  {/* Clear all */}
                                  {[
                                    demoGenders,
                                    demoMaritalStatus,
                                    demoLocations,
                                    demoLanguages,
                                    demoEducation,
                                    demoEmployment,
                                    demoIndustry,
                                    demoDeviceType,
                                    demoDeviceOS,
                                  ].some((a) => a.length > 0) ||
                                  demoAgeMin ||
                                  demoAgeMax ||
                                  demoOccupation.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={resetDemographyFilters}
                                      className="text-xs text-red-500 hover:text-red-600 underline"
                                    >
                                      Clear all filters
                                    </button>
                                  ) : null}
                                </div>
                              )}
                            </div>

                            {isLoadingDemography ? (
                              <p className="text-xs text-muted-foreground">
                                Loading existing demography for this survey...
                              </p>
                            ) : null}

                            <Button
                              className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2 mt-4"
                              onClick={handleApplyDemography}
                              disabled={
                                isSavingDemography ||
                                isLoadingDemography ||
                                !selectedSurveyId ||
                                !hasDemographyChanges
                              }
                            >
                              {isSavingDemography
                                ? "Applying Filters..."
                                : "Apply Filters"}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Channels;
