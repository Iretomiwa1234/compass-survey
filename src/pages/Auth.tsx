import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUser, registerUser } from "@/lib/auth";
import { setAuthSession } from "@/lib/session";
import maaLogo from "/assets/MAA-Logo.png?url";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ApiError } from "@/lib/api";
import { setPendingVerificationLogin } from "@/lib/pendingVerification";

function capitalizeNamePart(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ").toLowerCase();

  if (!cleaned) return "";

  return cleaned
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-"),
    )
    .join(" ");
}

function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

// Strip anything that isn't a letter, hyphen, or space, so numbers/special chars
// can't be typed into name fields. Spaces are kept so the spaced-out
// "did you mean?" suggestion still works.
// Also prevents consecutive hyphens and more than one hyphen total.
function sanitizeNameInput(value: string) {
  const cleaned = value.replace(/[^A-Za-z\s-]/g, "");
  // Remove consecutive hyphens (replace "---" with "")
  const noConsecutive = cleaned.replace(/--+/g, "");
  // If there's already a hyphen, remove any subsequent hyphens
  const parts = noConsecutive.split("-");
  if (parts.length > 2) {
    return parts[0] + "-" + parts.slice(1).join("");
  }
  return noConsecutive;
}

type NameAnalysis = { valid: boolean; message: string };

// Names accept alphabets and hyphens only. A space inside the value is treated as the
// "spaced-out letters" case and produces a "did you mean?" suggestion.
// Only a single hyphen is allowed (e.g. "John-Stone") — multiple hyphens or
// consecutive hyphens are rejected to prevent abuse like "John---stone".
function analyzeName(raw: string): NameAnalysis {
  const value = raw.trim();
  if (!value) return { valid: false, message: "This field is required" };

  // Space(s) inside the name -> suggest the joined version.
  if (/\s/.test(value)) {
    const joined = value.replace(/\s+/g, "");
    if (/^[A-Za-z-]+$/.test(joined)) {
      return {
        valid: false,
        message: `Invalid name format. Did you mean "${joined}"?`,
      };
    }
    return { valid: false, message: "Name can only contain letters and hyphens" };
  }

  if (!/^[A-Za-z-]+$/.test(value)) {
    return { valid: false, message: "Name can only contain letters and hyphens" };
  }

  // Reject multiple consecutive hyphens (e.g. "John---stone")
  if (/--/.test(value)) {
    return { valid: false, message: "Name cannot contain consecutive hyphens" };
  }

  // Reject more than one hyphen total (e.g. "John-Stone-Austin")
  if ((value.match(/-/g) || []).length > 1) {
    return { valid: false, message: "Name can only contain one hyphen" };
  }

  return { valid: true, message: "" };
}

type PasswordStrength = {
  metCount: number;
  level: "poor" | "fair" | "good" | "strong";
  color: string;
  message: string;
  percent: number;
};

// Ordered list of requirements. The live message always points at the first
// unmet requirement so the user knows the single next thing to add.
const passwordChecks: { label: string; test: (v: string) => boolean }[] = [
  { label: "a lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "an uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "a number", test: (v) => /\d/.test(v) },
  { label: "a special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
  { label: "at least 8 characters", test: (v) => v.length >= 8 },
];

function getPasswordStrength(value: string): PasswordStrength {
  const metCount = passwordChecks.filter((c) => c.test(value)).length;
  const next = passwordChecks.find((c) => !c.test(value));

  let level: PasswordStrength["level"] = "poor";
  let color = "bg-red-500";

  if (metCount >= 5) {
    level = "strong";
    color = "bg-green-500";
  } else if (metCount >= 4) {
    level = "fair";
    color = "bg-blue-500";
  } else if (metCount >= 2) {
    level = "fair";
    color = "bg-amber-500";
  }

  const message =
    metCount >= 5 ? "Strong password" : `Must include ${next?.label}`;
  const percent = (metCount / passwordChecks.length) * 100;

  return { metCount, level, color, message, percent };
}

type RegisterFormValues = {
  fname: string;
  sname: string;
  email: string;
  phone: string;
  password: string;
  agreeTerms: boolean;
};

const registerSchema = z.object({
  fname: z
    .string()
    .min(1, "First name is required")
    .max(80, "First name is too long")
    .superRefine((val, ctx) => {
      const result = analyzeName(val);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message,
        });
      }
    })
    .transform(capitalizeNamePart),
  sname: z
    .string()
    .min(1, "Surname is required")
    .max(80, "Surname is too long")
    .superRefine((val, ctx) => {
      const result = analyzeName(val);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message,
        });
      }
    })
    .transform(capitalizeNamePart),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .transform(normalizePhone)
    .refine(
      (v) => {
        // Accept E.164 (+XXXXXXXXXXX) or plain digits (10-15)
        if (v.startsWith("+")) return /^\+\d{10,15}$/.test(v);
        return /^\d{10,15}$/.test(v);
      },
      { message: "Enter a valid phone number" },
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .refine((v) => /[a-z]/.test(v), {
      message: "Password must include a lowercase letter",
    })
    .refine((v) => /[A-Z]/.test(v), {
      message: "Password must include an uppercase letter",
    })
    .refine((v) => /\d/.test(v), {
      message: "Password must include a number",
    })
    .refine((v) => /[^A-Za-z0-9]/.test(v), {
      message: "Password must include a special character",
    }),
  agreeTerms: z.boolean().refine((v) => v === true, {
    message: "Please agree to the terms of service and privacy policy",
  }),
});

type LoginFormValues = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function friendlyAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const msg = error.message || "";
    const lower = msg.toLowerCase();

    if (lower.includes("failed to fetch")) {
      return "We couldn't reach the server (network/CORS). Please try again or contact support.";
    }
    if (lower.includes("timeout")) {
      return "That took too long. Please try again.";
    }
    if (lower.includes("email") && lower.includes("already")) {
      return "This email is already registered. Try logging in instead.";
    }
    if (lower.includes("invalid") || lower.includes("unauthorized")) {
      return "Incorrect email or password.";
    }
    return msg;
  }

  return "Something went wrong. Please try again.";
}

type AuthMode = "login" | "register";

type AuthProps = {
  mode?: AuthMode;
  useSeparateRoutes?: boolean;
};

const Auth = ({ mode, useSeparateRoutes = false }: AuthProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});
  const [shakeRightFields, setShakeRightFields] = useState<Record<string, boolean>>({});
  const { refetch } = useCurrentUser();

  const triggerShake = (field: string) => {
    setShakeFields((prev) => ({ ...prev, [field]: true }));
    window.setTimeout(() => {
      setShakeFields((prev) => ({ ...prev, [field]: false }));
    }, 500);
  };

  const triggerShakeRight = (field: string) => {
    setShakeRightFields((prev) => ({ ...prev, [field]: true }));
    window.setTimeout(() => {
      setShakeRightFields((prev) => ({ ...prev, [field]: false }));
    }, 700);
  };

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const sessionExpired = searchParams.get("sessionExpired");
    const resolvedMode = mode ?? (modeParam === "login" ? "login" : "register");

    setIsLogin(resolvedMode === "login" || sessionExpired === "true");

    if (sessionExpired === "true") {
      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      if (useSeparateRoutes) {
        navigate("/login", { replace: true });
      } else {
        setSearchParams({ mode: "login" }, { replace: true });
      }
    }
  }, [mode, navigate, searchParams, setSearchParams, useSeparateRoutes]);



  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fname: "",
      sname: "",
      email: "",
      phone: "",
      password: "",
      agreeTerms: false,
    },
    mode: "onBlur",
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const watchedPassword = registerForm.watch("password");
  const passwordStrength = getPasswordStrength(watchedPassword ?? "");

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      return registerUser({
        fname: values.fname,
        sname: values.sname,
        email: values.email,
        phone: values.phone,
        password: values.password,
        user_type: "business",
      });
    },
    onSuccess: (_response, values) => {
      const email = values.email;
      setPendingVerificationLogin({
        email: values.email,
        password: values.password,
      });
      toast({
        title: "Welcome aboard!",
        description:
          "Your account has been created successfully. Please check your email to verify your account.",
      });
      navigate("/verification", { state: { email } });
    },
    onError: (error: unknown, values) => {
      toast({
        title: "Couldn't create account",
        description: friendlyAuthErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      return loginUser({
        email: values.email,
        password: values.password,
      });
    },
    onSuccess: async (response) => {
      const token = response?.data?.token;
      const expiresAt = response?.data?.expires_at;

      if (typeof token !== "string" || token.length === 0) {
        toast({
          title: "Login failed",
          description: "No token returned from server.",
          variant: "destructive",
        });
        return;
      }

      setAuthSession({
        token,
        expiresAt: typeof expiresAt === "number" ? expiresAt : undefined,
      });

      const user = await refetch();
      if (!user) {
        toast({
          title: "Signed in, but profile failed to load",
          description: "Please try again or contact support if it persists.",
          variant: "destructive",
        });
      }

      toast({
        title: "Welcome back!",
        description: "You're now signed in.",
      });

      navigate("/");
    },
    onError: (error: unknown, values) => {
      // Check for pending verification (code V0001)
      if (error instanceof ApiError) {
        const data = error.data as Record<string, unknown> | null;
        if (data?.code === "V0001") {
          const email = values.email;
          setPendingVerificationLogin(values);
          navigate("/verification", { state: { email } });
          return;
        }
      }
      toast({
        title: "Account not found",
        description: friendlyAuthErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  const handleRegisterSubmit = registerForm.handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values);
  });

  const handleLoginSubmit = loginForm.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);
  });

  const fnameField = registerForm.register("fname");
  const snameField = registerForm.register("sname");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Blue gradient with diagonal stripes */}
        <div className="relative lg:w-[48%] min-h-[280px] sm:min-h-[320px] lg:min-h-full bg-gradient-to-br from-[#8EC5E8] via-[#6AAFE0] to-[#5BA0D8] overflow-hidden">
          {/* Diagonal stripes pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                135deg,
                transparent,
                transparent 8px,
                rgba(255, 255, 255, 0.08) 8px,
                rgba(255, 255, 255, 0.08) 16px
              )`,
            }}
          />

          {/* Content card */}
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="bg-white rounded-lg pb-5 sm:pb-6 max-w-[380px] w-full shadow-lg overflow-hidden">
              <h3 className="text-lg sm:text-xl p-3 sm:p-4 font-bold bg-slate-200 text-gray-900 mb-4">
                Account Creation Survey
              </h3>
              <p className="text-gray-600 text-sm px-3 sm:p-4 leading-relaxed mb-5">
                Welcome! 🎉 After signing up, you'll be able to create engaging
                surveys, share them across multiple channels, collect responses
                anywhere—even offline—and instantly turn feedback into real-time
                insights with smart analytics
              </p>
              <button
                type="button"
                onClick={() => triggerShakeRight(isLogin ? "email" : "fname")}
                className="text-[#206AB5] font-medium text-sm px-3 sm:p-4 hover:underline text-left cursor-pointer"
              >
                Fill the form to get started
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-[52%] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src={maaLogo}
              alt="MAA - Marketing Analytics Africa"
              className="h-16 sm:h-20 mx-auto object-contain"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6">
            {isLogin ? "Welcome Back" : "Create your Account"}
          </h2>

          <form
            onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
            className="space-y-4 max-w-md mx-auto w-full"
          >
            {!isLogin && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      First Name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="John"
                        {...fnameField}
                        onChange={(e) => {
                          const sanitized = sanitizeNameInput(e.target.value);
                          if (sanitized !== e.target.value) {
                            e.target.value = sanitized;
                          }
                          fnameField.onChange(e);
                        }}
                        onBlur={(e) => {
                          fnameField.onBlur(e);
                          const formatted = capitalizeNamePart(e.target.value);
                          registerForm.setValue("fname", formatted, {
                            shouldValidate: true,
                          });
                          if (!analyzeName(e.target.value).valid) {
                            triggerShake("fname");
                          }
                        }}
                        className={`h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5] ${shakeFields.fname ? "animate-shake" : ""} ${shakeRightFields.fname ? "shake-right" : ""}`}
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {registerForm.formState.errors.fname?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {registerForm.formState.errors.fname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Surname
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Doe"
                        {...snameField}
                        onChange={(e) => {
                          const sanitized = sanitizeNameInput(e.target.value);
                          if (sanitized !== e.target.value) {
                            e.target.value = sanitized;
                          }
                          snameField.onChange(e);
                        }}
                        onBlur={(e) => {
                          snameField.onBlur(e);
                          const formatted = capitalizeNamePart(e.target.value);
                          registerForm.setValue("sname", formatted, {
                            shouldValidate: true,
                          });
                          if (!analyzeName(e.target.value).valid) {
                            triggerShake("sname");
                          }
                        }}
                        className={`h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5] ${shakeFields.sname ? "animate-shake" : ""}`}
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {registerForm.formState.errors.sname?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {registerForm.formState.errors.sname.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...registerForm.register("email")}
                        className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                      />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {registerForm.formState.errors.email?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="080xxxxxxxx"
                        inputMode="tel"
                        {...registerForm.register("phone")}
                        className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                      />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {registerForm.formState.errors.phone?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {registerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isLogin && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...loginForm.register("email")}
                    className={`h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5] ${shakeRightFields.email ? "shake-right" : ""}`}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {loginForm.formState.errors.email?.message && (
                  <p className="text-xs text-red-600 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                {isLogin ? "Password" : "Create Password"}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isLogin ? "••••••••" : "Create a strong password"
                  }
                  {...(isLogin
                    ? loginForm.register("password")
                    : registerForm.register("password"))}
                  className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {!isLogin && (
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      passwordStrength.metCount >= 5
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {watchedPassword ? passwordStrength.message : ""}
                  </p>
                </div>
              )}

              {!isLogin && registerForm.formState.errors.password?.message && (
                <p className="text-xs text-red-600 mt-1">
                  {registerForm.formState.errors.password?.message}
                </p>
              )}

              {isLogin && loginForm.formState.errors.password?.message && (
                <p className="text-xs text-red-600 mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}

              {isLogin && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-[#206AB5] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={registerForm.watch("agreeTerms")}
                  onCheckedChange={(checked) =>
                    registerForm.setValue("agreeTerms", checked as boolean, {
                      shouldValidate: true,
                    })
                  }
                  className="mt-0.5 data-[state=checked]:bg-[#206AB5] data-[state=checked]:border-[#206AB5]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 cursor-pointer leading-tight"
                >
                  I agree to the terms of service and privacy policy
                </label>
              </div>
            )}

            {!isLogin && registerForm.formState.errors.agreeTerms?.message && (
              <p className="text-xs text-red-600 -mt-2">
                {registerForm.formState.errors.agreeTerms.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={
                (!isLogin && registerMutation.isPending) ||
                (isLogin && loginMutation.isPending)
              }
              className="w-full h-12 bg-[#6A9FCA] hover:bg-[#5A8FBA] text-white text-base font-medium mt-2"
            >
              {isLogin
                ? loginMutation.isPending
                  ? "Signing In..."
                  : "Login"
                : registerMutation.isPending
                  ? "Signing Up..."
                  : "Sign Up"}
            </Button>

            {!isLogin && (
              <p className="text-center text-xs text-gray-500 pt-1">
                by signing up you are agreeing to our terms and privacy policy
              </p>
            )}

            <p className="text-center text-sm text-gray-600 pt-2">
              {isLogin
                ? "Don't have an account? "
                : "Already Have an account? "}
              <button
                type="button"
                onClick={() => {
                  if (useSeparateRoutes) {
                    navigate(isLogin ? "/register" : "/login");
                    return;
                  }
                  const next = !isLogin;
                  setIsLogin(next);
                  setSearchParams(next ? { mode: "login" } : {});
                }}
                className="text-[#206AB5] font-semibold hover:underline"
              >
                {isLogin ? "SIGN UP" : "LOGIN"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
