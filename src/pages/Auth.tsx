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

function capitalizeNamePart(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ").toLowerCase();

  if (!cleaned) return "";

  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
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
    .trim()
    .min(1, "First name is required")
    .max(80, "First name is too long")
    .transform(capitalizeNamePart),
  sname: z
    .string()
    .trim()
    .min(1, "Surname is required")
    .max(80, "Surname is too long")
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
  const { refetch } = useCurrentUser();

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
    onSuccess: (response) => {
      toast({
        title: "Welcome aboard!",
        description:
          "Your account has been created successfully. Please check your email to verify your account.",
      });
      navigate("/verification");
    },
    onError: (error: unknown) => {
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
    onError: (error: unknown) => {
      toast({
        title: "Couldn't sign you in",
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
              <a
                href="#"
                className="text-[#206AB5] font-medium text-sm px-3 sm:p-4 hover:underline"
              >
                Fill the form to get started
              </a>
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
                        onBlur={(e) => {
                          fnameField.onBlur(e);
                          const formatted = capitalizeNamePart(e.target.value);
                          registerForm.setValue("fname", formatted, {
                            shouldValidate: true,
                          });
                        }}
                        className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
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
                        onBlur={(e) => {
                          snameField.onBlur(e);
                          const formatted = capitalizeNamePart(e.target.value);
                          registerForm.setValue("sname", formatted, {
                            shouldValidate: true,
                          });
                        }}
                        className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
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
                    className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
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
