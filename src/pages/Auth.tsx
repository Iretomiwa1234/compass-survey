import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

    // Simulate successful auth
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: isLogin ? "You have successfully logged in." : "Your account has been created successfully.",
    });
    
    navigate(isLogin ? "/" : "/verification");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-5xl bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Blue gradient with diagonal stripes */}
        <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[600px] bg-gradient-to-br from-[#7EB6E8] via-[#5A9BD4] to-[#4A8BC2] overflow-hidden">
          {/* Diagonal stripes pattern */}
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
          
          {/* Content card */}
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

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary tracking-wider">MAA</h1>
            <p className="text-xs text-muted-foreground tracking-widest">MARKETING ANALYTICS AFRICA</p>
          </div>

          <h2 className="text-2xl font-semibold text-center text-foreground mb-8">
            {isLogin ? "Welcome Back" : "Create your Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Full Name</Label>
                  <div className="relative mt-1">
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pr-10 border-border"
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email Address</Label>
                  <div className="relative mt-1">
                    <Input
                      type="email"
                      placeholder="Johndoe@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pr-10 border-border"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}

            {isLogin && (
              <div>
                <Label className="text-sm text-muted-foreground">Email Address</Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    placeholder="Johndoe@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pr-10 border-border"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm text-muted-foreground">
                {isLogin ? "Password" : "Create Password"}
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="@jondoe.22"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10 border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the terms of service and privacy policy
                </label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#6B9DC4] hover:bg-[#5A8BB4] text-white py-6"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            {!isLogin && (
              <p className="text-center text-xs text-muted-foreground">
                by signing up you are agreeing to our terms and privacy policy
              </p>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account? " : "Already Have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
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