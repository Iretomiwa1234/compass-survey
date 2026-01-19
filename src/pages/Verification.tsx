import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { verifyUser } from "@/lib/auth";
import maaLogo from "/assets/MAA-Logo.png?url";

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCode = (() => {
    const state = location.state as { verificationCode?: string } | null;
    return typeof state?.verificationCode === "string"
      ? state.verificationCode
      : "";
  })();
  const [otp, setOtp] = useState(initialCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    const code = otp.trim();
    if (!code) {
      toast({
        title: "Enter your verification code",
        description: "Please paste the code from your email to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await verifyUser(code);
      toast({
        title: "Account verified",
        description: "You can now log in with your credentials.",
      });
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification failed";
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Blue gradient with diagonal stripes */}
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
                Account Creation Survey
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Welcome! 🎉 After signing up, you'll be able to create engaging
                surveys, share them across multiple channels, collect responses
                anywhere—even offline—and instantly turn feedback into real-time
                insights with smart analytics
              </p>
              <a
                href="#"
                className="text-[#206AB5] font-medium text-sm hover:underline"
              >
                Fill the form to get started
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Verification Form */}
        <div className="lg:w-[52%] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src={maaLogo}
              alt="MAA - Marketing Analytics Africa"
              className="h-16 sm:h-20 mx-auto object-contain"
            />
          </div>{" "}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2">
            Verify your Account
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            We've sent a verification code to your mail. Enter it below to
            continue.
          </p>
          <div className="space-y-6 max-w-md mx-auto w-full">
            <div className="text-center">
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Enter Verification Code
              </label>
              <div className="flex justify-center">
                <Input
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  placeholder="Enter your code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="h-12 sm:h-14 text-base sm:text-lg text-center tracking-[0.3em] uppercase"
                />
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Didn't get code?{" "}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`font-medium ${
                  resendTimer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#206AB5] hover:underline cursor-pointer"
                }`}
              >
                Resend
              </button>
              {resendTimer > 0 && (
                <span className="text-gray-500"> ({resendTimer}s)</span>
              )}
            </p>

            <Button
              onClick={handleVerify}
              disabled={isVerifying || otp.trim().length === 0}
              className="w-full h-12 bg-[#6A9FCA] hover:bg-[#5A8FBA] text-white text-base font-medium disabled:opacity-60"
            >
              {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify and Continue
            </Button>

            <p className="text-center text-sm text-gray-600 pt-2">
              Already Have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#206AB5] font-semibold hover:underline"
              >
                LOGIN
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
