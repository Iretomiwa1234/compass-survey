import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import maaLogo from "/assets/MAA-Logo.png?url";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && !formData.agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms of service and privacy policy",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: isLogin
        ? "You have successfully logged in."
        : "Your account has been created successfully.",
    });

    navigate(isLogin ? "/" : "/verification");
  };

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
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto w-full"
          >
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Johndoe@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                    placeholder="Johndoe@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11 pr-10 bg-white border-gray-200 focus:border-[#206AB5] focus:ring-[#206AB5]"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                {isLogin ? "Password" : "Create Password"}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="@jondoe.22"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agreeTerms: checked as boolean })
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

            <Button
              type="submit"
              className="w-full h-12 bg-[#6A9FCA] hover:bg-[#5A8FBA] text-white text-base font-medium mt-2"
            >
              {isLogin ? "Login" : "Sign Up"}
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
                onClick={() => setIsLogin(!isLogin)}
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
