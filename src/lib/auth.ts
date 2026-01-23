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
    | "rating"
    | "slider"
    | "date"
    | "time"
    | "date_time"
    | "email"
    | "website"
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
};

export type CreateSurveyPayload = {
  title: string;
  description: string;
  survey_group: string;
  status: "draft" | "published";
  is_published: boolean;
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
  is_published?: boolean;
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

function getBaseUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing BASE_URL.");
  }
  return baseUrl;
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
    body: payload,
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
        "X-Lace-Session": token,
      },
    });

    const user = response?.data?.user;
    if (!user) {
      throw new Error("No user data returned");
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Token expired or invalid, clear session
      localStorage.removeItem("compass.auth.session");
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
      "X-Lace-Session": token,
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
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Lace-Session": token,
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
      "X-Lace-Session": token,
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
    path: `/v1/survey/${surveyId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Lace-Session": token,
    },
  });
}
