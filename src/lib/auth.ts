import { fetchJson, ApiError } from "./api";
import { getAuthToken } from "./session";

export type CurrentUser = {
  id: number;
  fname: string;
  sname: string;
  email: string;
  business_id: number | null;
  type: string | null;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CurrentUserResponse = {
  status?: string;
  data?: {
    user?: CurrentUser;
  };
};

export type RegisterPayload = {
  fname: string;
  sname: string;
  email: string;
  phone: string;
  password: string;
  user_type: "customer" | "admin" | "business";
};

export type RegisterResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    fname?: string;
    sname?: string;
    email?: string;
    status?: string;
    verification_code?: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status?: string;
  data?: {
    token?: string;
    expires_at?: number;
  };
};

export type VerifyResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    fname?: string;
    sname?: string;
    email?: string;
  };
};

export type ForgotPasswordPayload = {
  email: string;
  user_type?: "business";
};

export type ForgotPasswordResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    email?: string;
  };
};

export type ResetPasswordPayload = {
  email: string;
  code: string;
  password: string;
};

export type ResetPasswordResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    email?: string;
  };
};

export type SurveyQuestionPayload = {
  id: number;
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
  label: string;
  placeholder?: string;
  required?: boolean;
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
};

export type CreateSurveyPayload = {
  title: string;
  description: string;
  survey_group: string;
  status: "draft" | "active" | "close" | "pending" | "";
  is_published: 0 | 1;
  max_responses: number;
  single_response: boolean;
  end_date: string;
  allow_edit_after_submit: boolean;
  questions: SurveyQuestionPayload[];
};

export type EditSurveyPayload = CreateSurveyPayload;

export type CreateSurveyResponse = {
  status?: string;
  message?: string;
  code?: string;
  error?: string;
  data?: unknown;
};

export type GetSurveysResponse = {
  status?: string;
  message?: string;
  code?: string;
  error?: string;
  data?: {
    survey?: {
      data?: SurveyListItemApi[];
      total?: number;
      per_page?: number;
      current_page?: number;
      last_page?: number;
      [key: string]: unknown;
    };
  };
};

export type SurveyListItemApi = {
  survey_id: number;
  title: string;
  status: string;
  is_published?: 0 | 1;
  business_id: string | null;
  created_at: string;
  total_responses: number;
  completed_responses: string;
  abandoned_responses: string;
  pending_responses: string;
  completion_percentage: string;
};

export type SurveyDetail = {
  survey_id: number;
  title: string;
  description?: string;
  survey_group?: string;
  status?: string;
  is_published?: 0 | 1;
  max_responses?: number;
  single_response?: boolean;
  end_date?: string;
  allow_edit_after_submit?: boolean;
  questions?: SurveyQuestionPayload[];
};

export type GetSurveyDetailResponse = {
  status?: string;
  message?: string;
  code?: string;
  error?: string;
  data?: {
    survey?: SurveyDetail;
  };
};

export type RespondentLookupResponse = {
  status?: string;
  data?: {
    user_id?: string;
    name?: string;
    phone_number?: string;
    email?: string;
    details?: {
      survey_id?: number;
      views?: number;
      status?: string;
      survey?: Record<string, unknown>;
    };
  };
};

export type CustomerSurveySubmitPayload = {
  customer_id: string;
  survey_id: string | number;
  answers: Array<{
    question_id: string;
    answer: string | number | string[] | Record<string, string>;
  }>;
};

export type CustomerSurveySubmitResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: unknown;
};

export type RespondentCheckPayload = {
  hash: string;
  email: string;
};

export type RespondentCreatePayload = RespondentCheckPayload & {
  fname: string;
  sname: string;
  phone: string;
};

export type RespondentTokenVerifyPayload = {
  hash: string;
  token: string;
};

export type RespondentChannelDetails = {
  hash?: string;
  email?: string;
  fname?: string;
  sname?: string;
  phone?: string;
  token?: string;
  user_exists?: number;
};

export type RespondentChannelResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    message?: string;
    user_exists?: number;
    hash?: string;
    email?: string;
    details?: RespondentChannelDetails;
  };
};

export type RespondentSession = {
  hash: string;
  email: string;
  fname?: string;
  sname?: string;
  phone?: string;
  token?: string;
  user_exists?: number;
  verification_pending?: boolean;
};

export type DashboardMentionsResponse = {
  status?: string;
  data?: {
    cards?: {
      total_projects?: number | string;
      total_mentions?: number | string;
    };
  };
};

export type DashboardSentimentResponse = {
  status?: string;
  data?: {
    cards?: {
      positive?: number | string;
      neutral?: number | string;
      negative?: number | string;
    };
  };
};

export type DashboardMentionsCard = {
  totalProjects: number;
  totalMentions: number;
};

export type DashboardSentimentCard = {
  positive: number;
  neutral: number;
  negative: number;
};

function getBaseUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing BASE_URL.");
  }
  return baseUrl;
}

function toSafeNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Register User
export async function registerUser(payload: RegisterPayload) {
  return fetchJson<RegisterResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/register",
    method: "POST",
    body: payload,
  });
}

// Login User
export async function loginUser(payload: LoginPayload) {
  return fetchJson<LoginResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/login",
    method: "POST",
    body: {
      ...payload,
      user_type: "business",
    },
  });
}

// verify Code
export async function verifyUser(code: string) {
  const trimmed = code.trim();
  return fetchJson<VerifyResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/verify/${encodeURIComponent(trimmed)}`,
    method: "GET",
  });
}

// Forgot Password
export async function forgotPassword(payload: ForgotPasswordPayload) {
  return fetchJson<ForgotPasswordResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/forgot-password",
    method: "POST",
    body: {
      email: payload.email,
      user_type: "business",
    },
  });
}

// Reset Password
export async function resetPassword(payload: ResetPasswordPayload) {
  return fetchJson<ResetPasswordResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/reset-password",
    method: "POST",
    body: payload,
  });
}

// Get current signed in User
export async function getCurrentUser(): Promise<CurrentUser> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await fetchJson<CurrentUserResponse>({
      baseUrl: getBaseUrl(),
      path: "/v1/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response?.data?.user;
    if (!user) {
      throw new Error("No user data returned");
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
}

// Create Survey
export async function createSurvey(payload: CreateSurveyPayload) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  return fetchJson<CreateSurveyResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/survey/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

// Edit Survey
export async function editSurvey(surveyId: number, payload: EditSurveyPayload) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  return fetchJson<CreateSurveyResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/edit/${surveyId}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

// Get Surveys List
export async function getSurveys(page = 1) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  return fetchJson<GetSurveysResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey?page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get Survey Detail
export async function getSurveyDetail(surveyId: number) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  return fetchJson<GetSurveyDetailResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/questions/${surveyId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get Survey Detail (public)
export async function getPublicSurveyDetail(surveyId: number) {
  return fetchJson<GetSurveyDetailResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/questions/${surveyId}`,
    method: "GET",
  });
}

// =========================
// Survey Cards / Stats
// =========================

export type SurveyCardsData = {
  totalResponses: number;
  completed: number;
  inProgress: number;
  abandoned: number;
};

export type SurveyCompletionRateData = {
  completionRatePercentage: number;
  completed: number;
  abandoned: number;
  inProgress: number;
};

export type SurveyAverageRateData = {
  avgResponseRatePercentage: number;
  totalInviteSent: number;
  totalResponds: number;
};

export type CountryReachItem = {
  countryId: number;
  countryName: string;
  totalResponses: number;
};

export type SurveyCountryReachData = {
  totalCountries: number;
  top4: CountryReachItem[];
};

function parsePercentageStr(value: unknown): number {
  const parsed = parseFloat(String(value ?? "0").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

// GET /v1/survey/cards
export async function getSurveyCards(
  surveyId?: number,
): Promise<SurveyCardsData> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/cards${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const cards = response?.data?.cards ?? {};
  return {
    totalResponses: toSafeNumber(cards.total_responses),
    completed: toSafeNumber(cards.completed),
    inProgress: toSafeNumber(cards.in_progress),
    abandoned: toSafeNumber(cards.abandoned),
  };
}

// GET /v1/survey/cards/completion-rate
export async function getSurveyCompletionRate(
  surveyId?: number,
): Promise<SurveyCompletionRateData> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/cards/completion-rate${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const stats = response?.data?.completion_stats ?? {};
  return {
    completionRatePercentage: parsePercentageStr(stats.completion_rate),
    completed: toSafeNumber(stats.completed),
    abandoned: toSafeNumber(stats.abandoned),
    inProgress: toSafeNumber(stats.in_progress),
  };
}

// GET /v1/survey/cards/average-rate
export async function getSurveyAverageRate(
  surveyId?: number,
): Promise<SurveyAverageRateData> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/cards/average-rate${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const metrics = response?.data?.metrics ?? {};
  return {
    avgResponseRatePercentage: parsePercentageStr(metrics.avg_response_rate),
    totalInviteSent: toSafeNumber(metrics.total_invite_sent),
    totalResponds: toSafeNumber(metrics.total_responds),
  };
}

// GET /v1/survey/country/reach
export async function getSurveyCountryReach(
  surveyId?: number,
): Promise<SurveyCountryReachData> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/country/reach${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const raw: Array<{
    country_id: number;
    country_name: string;
    total_responses: number;
  }> = response?.data?.cards_by_country ?? [];

  const countries: CountryReachItem[] = raw.map((c) => ({
    countryId: c.country_id,
    countryName: c.country_name,
    totalResponses: toSafeNumber(c.total_responses),
  }));

  const top4 = [...countries]
    .sort((a, b) => b.totalResponses - a.totalResponses)
    .slice(0, 4);

  return {
    totalCountries: countries.length,
    top4,
  };
}

// GET /v1/survey/response-trend
export async function getSurveyResponseTrend(
  surveyId: number,
  start: string,
  end: string,
): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  return fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/response-trend?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&survey_id=${surveyId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// GET /v1/survey/response-trend (dashboard total — no survey_id)
export async function getDashboardResponseTrend(
  start: string,
  end: string,
): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  return fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/response-trend?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type SurveyDeviceUsageData = {
  desktop: number;
  mobile: number;
  tablet: number;
};

// GET /v1/survey/device-usage
export async function getSurveyDeviceUsage(
  surveyId?: number,
): Promise<SurveyDeviceUsageData> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/device-usage${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const cards = response?.data?.cards ?? {};
  return {
    desktop: toSafeNumber(cards.desktop),
    mobile: toSafeNumber(cards.mobile),
    tablet: toSafeNumber(cards.tablet),
  };
}

export type SurveyBrowserUsageData = Record<string, number>;

// GET /v1/survey/browser-usage
export async function getSurveyBrowserUsage(
  surveyId?: number,
): Promise<SurveyBrowserUsageData> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/browser-usage${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const cards = response?.data?.cards ?? {};
  return Object.fromEntries(
    Object.entries(cards).map(([k, v]) => [k, toSafeNumber(v)]),
  ) as SurveyBrowserUsageData;
}

export type SurveyRespondentItem = {
  customerId: string;
  fname: string;
  sname: string;
  totalResponses: number;
};

export type SurveyResponseAnswerItem = {
  questionId: string;
  answer: unknown;
};

export type SurveyResponseQuestionItem = {
  id: string;
  type: string;
  label: string;
  scale?: number;
  required?: boolean;
  placeholder?: string;
};

export type SurveyResponseItem = {
  surveyId: number;
  surveyTitle: string;
  responseId: number;
  customerId: string;
  fname: string;
  sname: string;
  email: string;
  answer: SurveyResponseAnswerItem[];
  question: SurveyResponseQuestionItem[];
};

export type SurveyResponsesPayload = {
  rows: SurveyResponseItem[];
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
};

// GET /v1/survey/respondent
export async function getSurveyRespondents(
  surveyId?: number,
): Promise<SurveyRespondentItem[]> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const qs = surveyId != null ? `?survey_id=${surveyId}` : "";
  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/respondent${qs}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const raw: any[] = response?.data?.top_customers ?? [];
  return raw.map((c) => ({
    customerId: String(c.customer_id ?? ""),
    fname: String(c.fname ?? ""),
    sname: String(c.sname ?? ""),
    totalResponses: toSafeNumber(c.total_responses),
  }));
}

// GET /v1/survey/responses/{survey_id}
export async function getSurveyResponses(
  surveyId: number,
  page = 1,
): Promise<SurveyResponsesPayload> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path:
      page > 1
        ? `/v1/survey/responses/${surveyId}?page=${page}`
        : `/v1/survey/responses/${surveyId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload =
    response?.data?.survey?.reponses ?? response?.data?.survey?.responses ?? {};
  const rows: any[] = Array.isArray(payload?.data) ? payload.data : [];

  return {
    rows: rows.map((r) => ({
      surveyId: toSafeNumber(r?.survey_id),
      surveyTitle: String(r?.survey_title ?? ""),
      responseId: toSafeNumber(r?.response_id),
      customerId: String(r?.customer_id ?? ""),
      fname: String(r?.fname ?? ""),
      sname: String(r?.sname ?? ""),
      email: String(r?.email ?? ""),
      answer: Array.isArray(r?.answer)
        ? r.answer.map((a: any) => ({
            questionId: String(a?.question_id ?? ""),
            answer: a?.answer ?? "",
          }))
        : [],
      question: Array.isArray(r?.question)
        ? r.question.map((q: any) => ({
            id: String(q?.id ?? ""),
            type: String(q?.type ?? ""),
            label: String(q?.label ?? ""),
            scale:
              q?.scale != null && q?.scale !== ""
                ? toSafeNumber(q.scale)
                : undefined,
            required:
              q?.required != null && q?.required !== ""
                ? String(q.required) === "1"
                : undefined,
            placeholder:
              q?.placeholder != null ? String(q.placeholder) : undefined,
          }))
        : [],
    })),
    total: toSafeNumber(payload?.total),
    perPage: toSafeNumber(payload?.per_page),
    currentPage: toSafeNumber(payload?.current_page),
    lastPage: toSafeNumber(payload?.last_page),
  };
}

export type CountryByDayItem = {
  date: string;
  day: string;
  countries: { name: string; value: number }[];
};

// GET /v1/survey/response-by-country
export async function getSurveyResponseByCountry(
  surveyId: number,
  start: string,
  end: string,
): Promise<CountryByDayItem[]> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/survey/response-by-country?survey_id=${surveyId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const raw: any[] = response?.data?.data ?? [];
  return raw.map((entry) => ({
    date: String(entry.date ?? ""),
    day: String(entry.day ?? ""),
    countries: Array.isArray(entry.countries)
      ? entry.countries.map((c: any) => ({
          name: String(c.name ?? ""),
          value: toSafeNumber(c.value),
        }))
      : [],
  }));
}

// Dashboard Mentions Card
export async function getDashboardMentions(): Promise<DashboardMentionsCard> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetchJson<DashboardMentionsResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/dashboard/mentions",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const cards = response?.data?.cards;
  return {
    totalProjects: toSafeNumber(cards?.total_projects),
    totalMentions: toSafeNumber(cards?.total_mentions),
  };
}

// Dashboard Sentiment Card
export async function getDashboardSentiment(): Promise<DashboardSentimentCard> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetchJson<DashboardSentimentResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/dashboard/sentiment",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const cards = response?.data?.cards;
  return {
    positive: toSafeNumber(cards?.positive),
    neutral: toSafeNumber(cards?.neutral),
    negative: toSafeNumber(cards?.negative),
  };
}

// ========================
// CHANNELS
// =======================

// GET /demography/options
export async function getDemographyOptions(): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  return fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: "/v1/demography/options",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type SurveyDemographyPayload = {
  survey_id: number | string;
  gender?: string[];
  age_range_min?: number;
  age_range_max?: number;
  marital_status?: string[];
  language?: string[];
  location?: string[];
  education_level?: string[];
  employment_status?: string[];
  occupation?: string[];
  industry?: string[];
  device_type?: string[];
  platform?: string[];
};

export type SurveyDemographyRecord = {
  survey_id: number;
  gender: string[];
  age_range_min?: number;
  age_range_max?: number;
  marital_status: string[];
  language: string[];
  location: string[];
  education_level: string[];
  employment_status: string[];
  occupation: string[];
  industry: string[];
  device_type: string[];
  platform: string[];
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v ?? "")).filter((v) => v.length > 0);
};

const mapSurveyDemography = (raw: any): SurveyDemographyRecord => ({
  survey_id: toSafeNumber(raw?.survey_id),
  gender: toStringArray(raw?.gender),
  age_range_min:
    raw?.age_range_min != null && raw?.age_range_min !== ""
      ? toSafeNumber(raw?.age_range_min)
      : undefined,
  age_range_max:
    raw?.age_range_max != null && raw?.age_range_max !== ""
      ? toSafeNumber(raw?.age_range_max)
      : undefined,
  marital_status: toStringArray(raw?.marital_status),
  language: toStringArray(raw?.language),
  location: toStringArray(raw?.location),
  education_level: toStringArray(
    raw?.education_level ?? raw?.highest_education_level,
  ),
  employment_status: toStringArray(raw?.employment_status),
  occupation: toStringArray(raw?.occupation),
  industry: toStringArray(raw?.industry),
  device_type: toStringArray(raw?.device_type),
  platform: toStringArray(raw?.platform),
});

// POST /v1/channel/survey-demography
export async function postSurveyDemography(
  payload: SurveyDemographyPayload,
): Promise<SurveyDemographyRecord> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: "/v1/channel/survey-demography",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });

  const raw =
    response?.data?.demography ??
    response?.data?.survey_demography ??
    response?.data ??
    payload;
  return mapSurveyDemography(raw);
}

// GET /v1/channel/survey-demography/by-survey/{survey_id}
export async function getSurveyDemographyBySurvey(
  surveyId: number,
): Promise<SurveyDemographyRecord> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/channel/survey-demography/by-survey/${surveyId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const raw =
    response?.data?.demography ?? response?.data?.survey_demography ?? {};
  return mapSurveyDemography({ ...raw, survey_id: raw?.survey_id ?? surveyId });
}

// PATCH /v1/channel/survey-demography/by-survey/{survey_id}
export async function patchSurveyDemographyBySurvey(
  surveyId: number,
  payload: SurveyDemographyPayload,
): Promise<SurveyDemographyRecord> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<any>({
    baseUrl: getBaseUrl(),
    path: `/v1/channel/survey-demography/by-survey/${surveyId}`,
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });

  const raw =
    response?.data?.demography ??
    response?.data?.survey_demography ??
    response?.data ??
    payload;
  return mapSurveyDemography({ ...raw, survey_id: raw?.survey_id ?? surveyId });
}

// GET /v1/channel/respondent/{hash}
export async function getRespondentUrl(
  hash: string,
  bearerToken?: string,
): Promise<RespondentLookupResponse> {
  const token = bearerToken || getAuthToken();

  const response = await fetchJson<RespondentLookupResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/channel/respondent/${hash}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response;
}

// POST /v1/channels/respondent (check existing user by hash + email)
export async function checkRespondentByHash(
  payload: RespondentCheckPayload,
): Promise<RespondentChannelResponse> {
  const token = getAuthToken();

  try {
    return await fetchJson<RespondentChannelResponse>({
      baseUrl: getBaseUrl(),
      path: "/v1/channels/respondent",
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: payload,
    });
  } catch (error: unknown) {
    if (
      error instanceof ApiError &&
      error.data &&
      typeof error.data === "object"
    ) {
      return error.data as RespondentChannelResponse;
    }
    throw error;
  }
}

// POST /v1/channels/respondent (create user when not found)
export async function createRespondentByHash(
  payload: RespondentCreatePayload,
): Promise<RespondentChannelResponse> {
  const token = getAuthToken();

  try {
    return await fetchJson<RespondentChannelResponse>({
      baseUrl: getBaseUrl(),
      path: "/v1/channels/respondent",
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: payload,
    });
  } catch (error: unknown) {
    if (
      error instanceof ApiError &&
      error.data &&
      typeof error.data === "object"
    ) {
      return error.data as RespondentChannelResponse;
    }
    throw error;
  }
}

// POST /v1/channels/token/verify
export async function verifyRespondentToken(
  payload: RespondentTokenVerifyPayload,
): Promise<RespondentChannelResponse> {
  const token = getAuthToken();

  try {
    return await fetchJson<RespondentChannelResponse>({
      baseUrl: getBaseUrl(),
      path: "/v1/channels/token/verify",
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: payload,
    });
  } catch (error: unknown) {
    if (
      error instanceof ApiError &&
      error.data &&
      typeof error.data === "object"
    ) {
      return error.data as RespondentChannelResponse;
    }
    throw error;
  }
}

// POST /v1/survey/customer/submit
export async function submitCustomerSurveyResponse(
  payload: CustomerSurveySubmitPayload,
  bearerToken?: string,
): Promise<CustomerSurveySubmitResponse> {
  const token = bearerToken || getAuthToken();

  return fetchJson<CustomerSurveySubmitResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/survey/customer/submit",
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: payload,
  });
}

export type QRCodePayload = {
  survey_id: string | number;
  subject: string;
  message: string;
};

export type QRCodeChannel = {
  id: number;
  user_id: string;
  business_id: string;
  survey_id: string;
  subject: string;
  message: string;
  recepient_list: string | null;
  recepient_file: string | null;
  is_sent: number;
  channel: string;
  country_id: number;
  created_at: string;
  updated_at: string;
};

export type QRCodeBySurveyResponse = {
  status?: string;
  message?: string;
  data?: {
    hash?: string;
    channel?: QRCodeChannel;
  };
};

// POST /v1/channel/qrcode (create and edit)
export async function postQRCode(
  payload: QRCodePayload,
): Promise<QRCodeBySurveyResponse> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  return fetchJson<QRCodeBySurveyResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/channel/qrcode",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });
}

// GET /v1/channel/qrcode/{survey_id}
export async function getQRCodeBySurvey(
  surveyId: number | string,
): Promise<QRCodeBySurveyResponse> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  try {
    return await fetchJson<QRCodeBySurveyResponse>({
      baseUrl: getBaseUrl(),
      path: `/v1/channel/qrcode/${surveyId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return fetchJson<QRCodeBySurveyResponse>({
      baseUrl: getBaseUrl(),
      path: `/v1/channel/qrcode/survey_id?survey_id=${surveyId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

// =========================
// Social Listening
// =========================

export type SocialListening = {
  id: number;
  title: string;
  mentions?: number;
  business_id?: string;
  created_at: string;
  updated_at?: string;
};

export type GetSocialListeningResponse = {
  status?: string;
  message?: string;
  data?: SocialListening[];
};

export type CreateSocialListeningPayload = {
  title: string;
  mentions: number;
};

export type CreateSocialListeningResponse = {
  status?: string;
  message?: string;
  data?: SocialListening;
};

export type EditSocialListeningPayload = {
  title?: string;
  mentions?: number;
};

export type EditSocialListeningResponse = {
  status?: string;
  message?: string;
  data?: SocialListening;
};

export type DeleteSocialListeningResponse = {
  status?: string;
  message?: string;
};

export type CountryApiItem = {
  id: number;
  country_code: string;
  country_name: string;
  currency: string;
  language: string;
  timezone: string;
  status: string;
  created_at: string;
};

export type GetCountriesResponse = {
  status?: string;
  data?: {
    country?: {
      data?: CountryApiItem[];
      total?: number;
      per_page?: number;
      current_page?: number;
      last_page?: number;
    };
  };
};

// GET /v1/country
export async function getCountries(page = 1): Promise<CountryApiItem[]> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<GetCountriesResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/country?page=${page}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return response?.data?.country?.data ?? [];
}

// Get all Social Listening projects
export async function getSocialListenings(): Promise<SocialListening[]> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetchJson<
    GetSocialListeningResponse | SocialListening[]
  >({
    baseUrl: getBaseUrl(),
    path: "/v1/project",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("getSocialListenings: Raw response:", response);

  if (!response) {
    console.log("getSocialListenings: No response, returning empty array");
    return [];
  }

  // If it's already an array, return it
  if (Array.isArray(response)) {
    console.log(
      "getSocialListenings: Response is array with length:",
      response.length,
    );
    return response;
  }

  // Check if it's an object with a data property
  if (typeof response === "object" && response !== null) {
    const anyResponse = response as any;

    // Handle nested structure: response.data.survey.data
    if (
      anyResponse.data?.survey?.data &&
      Array.isArray(anyResponse.data.survey.data)
    ) {
      console.log(
        "getSocialListenings: Found nested data.survey.data array with length:",
        anyResponse.data.survey.data.length,
      );
      return anyResponse.data.survey.data;
    }

    // Handle standard wrapped response: response.data
    if (Array.isArray(anyResponse.data)) {
      console.log(
        "getSocialListenings: Response has data array with length:",
        anyResponse.data.length,
      );
      return anyResponse.data;
    }

    // Log the full response structure for debugging
    console.log(
      "getSocialListenings: Unexpected response structure:",
      JSON.stringify(response, null, 2),
    );
  }

  console.error("getSocialListenings: Unexpected response format:", response);
  throw new Error("Invalid data format received from API");
}

// Create a new Social Listening project
export async function createSocialListening(
  payload: CreateSocialListeningPayload,
): Promise<SocialListening> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  console.log("createSocialListening: Sending payload:", payload);

  try {
    const response = await fetchJson<
      CreateSocialListeningResponse | SocialListening
    >({
      baseUrl: getBaseUrl(),
      path: "/v1/project/create",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
    });

    console.log("createSocialListening: Raw response:", response);
    console.log("createSocialListening: Response type:", typeof response);
    console.log(
      "createSocialListening: Response keys:",
      response ? Object.keys(response) : "null",
    );

    if (!response) {
      // API might not return data, construct from payload
      console.log(
        "createSocialListening: No response, returning constructed item",
      );
      return {
        id: Date.now(), // Generate temporary ID
        title: payload.title,
        mentions: payload.mentions,
        created_at: new Date().toISOString(),
      };
    }

    // Handle both wrapped and unwrapped responses
    let data: SocialListening | undefined;
    const anyResponse = response as any;

    // Check for nested structure: response.data.survey.data or response.data
    if (anyResponse.data?.survey?.data && anyResponse.data.survey.data.id) {
      console.log(
        "createSocialListening: Found nested data.survey.data:",
        anyResponse.data.survey.data,
      );
      data = anyResponse.data.survey.data;
    } else if (anyResponse.data?.id) {
      console.log(
        "createSocialListening: Found wrapped data:",
        anyResponse.data,
      );
      data = anyResponse.data;
    } else if ((response as SocialListening).id) {
      console.log("createSocialListening: Found direct response with id");
      data = response as SocialListening;
    }

    // Check for other possible response structures
    if (!data) {
      console.log("createSocialListening: Checking alternative structures...");
      if (anyResponse.project) {
        data = anyResponse.project;
      } else if (anyResponse.item) {
        data = anyResponse.item;
      } else if (anyResponse.result) {
        data = anyResponse.result;
      }
    }

    if (!data || !data.id) {
      // If API returns success but no data object, construct from payload
      console.log("createSocialListening: Constructing response from payload");
      return {
        id: Date.now(), // Generate temporary ID
        title: payload.title,
        mentions: payload.mentions,
        created_at: new Date().toISOString(),
      };
    }

    console.log("createSocialListening: Created item:", data);
    return data;
  } catch (error) {
    console.error("createSocialListening: Error during create:", error);
    throw error;
  }
}

// Edit an existing Social Listening project
export async function editSocialListening(
  projectId: number,
  payload: EditSocialListeningPayload,
): Promise<SocialListening> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  console.log(
    "editSocialListening: Sending payload:",
    payload,
    "for projectId:",
    projectId,
  );

  try {
    const response = await fetchJson<
      EditSocialListeningResponse | SocialListening
    >({
      baseUrl: getBaseUrl(),
      path: `/v1/project/${projectId}`,
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
    });

    console.log("editSocialListening: Raw response:", response);
    console.log("editSocialListening: Response type:", typeof response);
    console.log(
      "editSocialListening: Response keys:",
      response ? Object.keys(response) : "null",
    );

    if (!response) {
      // API might not return data, construct from payload
      console.log(
        "editSocialListening: No response, returning constructed item",
      );
      return {
        id: projectId,
        title: payload.title || "",
        mentions: payload.mentions || 0,
        created_at: new Date().toISOString(),
      };
    }

    // Handle nested response structure like create
    let data: SocialListening | undefined;
    const anyResponse = response as any;

    if (anyResponse.data?.survey?.data && anyResponse.data.survey.data.id) {
      console.log("editSocialListening: Found nested data.survey.data");
      data = anyResponse.data.survey.data;
    } else if (anyResponse.data?.id) {
      console.log("editSocialListening: Found wrapped data");
      data = anyResponse.data;
    } else if ((response as SocialListening).id) {
      console.log("editSocialListening: Found direct response");
      data = response as SocialListening;
    }

    if (!data || !data.id) {
      // If API returns success but no data object, construct from payload
      console.log("editSocialListening: Constructing response from payload");
      return {
        id: projectId,
        title: payload.title || "",
        mentions: payload.mentions || 0,
        created_at: new Date().toISOString(),
      };
    }

    console.log("editSocialListening: Updated item:", data);
    return data;
  } catch (error) {
    console.error("editSocialListening: Error during edit:", error);
    throw error;
  }
}

// Delete a Social Listening project
export async function deleteSocialListening(projectId: number): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  await fetchJson<DeleteSocialListeningResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/project/${projectId}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
