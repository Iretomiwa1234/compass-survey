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
