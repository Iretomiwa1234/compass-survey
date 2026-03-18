import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { forgotPassword, resetPassword } from "@/lib/auth";
import maaLogo from "/assets/MAA-Logo.png?url";

type ResetStep = "request" | "reset";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const handleRequestReset = async () => {
    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Enter a valid email",
        description: "Please provide the business account email to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsRequesting(true);
    try {
      const response = await forgotPassword({
        email: trimmedEmail,
        user_type: "business",
      });

      setConfirmedEmail(response?.data?.email?.trim() || trimmedEmail);
      setStep("reset");

      toast({
        title: "Reset code sent",
        description: "Check your email for the password reset code.",
      });
    } catch (error) {
      toast({
        title: "Could not start password reset",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleResetPassword = async () => {
    const trimmedCode = code.trim();
    const trimmedPassword = password.trim();

    if (!confirmedEmail) {
      toast({
        title: "Email is missing",
        description: "Go back and enter your email again.",
        variant: "destructive",
      });
      setStep("request");
      return;
    }

    if (!trimmedCode) {
      toast({
        title: "Enter the reset code",
        description: "Please provide the code sent to your email.",
        variant: "destructive",
      });
      return;
    }

    if (!trimmedPassword) {
      toast({
        title: "Enter a new password",
        description: "Please provide your new password.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword({
        email: confirmedEmail,
        code: trimmedCode,
        password: trimmedPassword,
      });

      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Password reset failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        <div className="relative lg:w-[48%] min-h-[280px] sm:min-h-[320px] lg:min-h-full bg-gradient-to-br from-[#8EC5E8] via-[#6AAFE0] to-[#5BA0D8] overflow-hidden">
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

          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="bg-white rounded-lg p-5 sm:p-6 max-w-[380px] w-full shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Password Recovery
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your business account email to receive a reset code, then
                set a new password securely.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-[52%] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
          <div className="text-center mb-6">
            <img
              src={maaLogo}
              alt="MAA - Marketing Analytics Africa"
              className="h-16 sm:h-20 mx-auto object-contain"
            />
          </div>

          {step === "request" ? (
            <div className="space-y-6 max-w-md mx-auto w-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2">
                  Forgot Password
                </h2>
                <p className="text-center text-sm text-gray-500">
                  Enter your email to get a reset code.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Business Email
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <Button
                onClick={handleRequestReset}
                disabled={isRequesting}
                className="w-full h-12 bg-[#6A9FCA] hover:bg-[#5A8FBA] text-white text-base font-medium"
              >
                {isRequesting ? "Sending..." : "Send Reset Code"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#206AB5] font-semibold hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-w-md mx-auto w-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-center text-sm text-gray-500">
                  Enter the code from your email and set a new password.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={confirmedEmail}
                  disabled
                  className="h-11 bg-gray-100 border-gray-200"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Not the correct email?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(confirmedEmail);
                      setCode("");
                      setPassword("");
                      setStep("request");
                    }}
                    className="text-[#206AB5] font-semibold hover:underline"
                  >
                    Go back
                  </button>
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Reset Code
                </Label>
                <Input
                  type="text"
                  placeholder="Enter code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="h-10 max-w-[180px] bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isResetting}
                className="w-full h-12 bg-[#6A9FCA] hover:bg-[#5A8FBA] text-white text-base font-medium"
              >
                {isResetting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
