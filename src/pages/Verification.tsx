import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Verification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      navigate("/");
    }, 10000);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-5xl bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Blue gradient with diagonal stripes */}
        <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[600px] bg-gradient-to-br from-[#7EB6E8] via-[#5A9BD4] to-[#4A8BC2] overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                135deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.05) 10px,
                rgba(255, 255, 255, 0.05) 20px
              )`,
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Account Creation Survey
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Welcome! 🎉 After signing up, you'll be able to create engaging surveys, share them across multiple channels, collect responses anywhere—even offline—and instantly turn feedback into real-time insights with smart analytics
              </p>
              <p className="text-primary font-medium text-sm">
                Fill the form to get started
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Verification Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary tracking-wider">MAA</h1>
            <p className="text-xs text-muted-foreground tracking-widest">MARKETING ANALYTICS AFRICA</p>
          </div>

          <h2 className="text-2xl font-semibold text-center text-foreground mb-2">
            Verify your Account
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            We've sent a 6-digit code to your mail. Enter it below to continue.
          </p>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground block mb-3">
                Enter Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Didn't get code?{" "}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`font-medium ${
                  resendTimer > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:underline cursor-pointer"
                }`}
              >
                Resend
              </button>
              {resendTimer > 0 && (
                <span className="text-muted-foreground"> ({resendTimer}s)</span>
              )}
            </p>

            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full bg-[#6B9DC4] hover:bg-[#5A8BB4] text-white py-6"
            >
              {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify to continue
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already Have an account?{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-primary font-semibold hover:underline"
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
