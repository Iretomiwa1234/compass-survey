import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Play,
  Save,
  Send,
  ChevronDown,
  CalendarIcon,
} from "lucide-react";

const AiSurvey = () => {
  const navigate = useNavigate();
  const [surveyTitle] = useState("Customer Satisfaction Survey");
  const [publishOpen, setPublishOpen] = useState(false);
  const [restrictions, setRestrictions] = useState("public");
  const [responseLimit, setResponseLimit] = useState("200");
  const [closingDate, setClosingDate] = useState("02/12/2025");
  const [singleResponse, setSingleResponse] = useState(true);
  const [allowEditing, setAllowEditing] = useState(false);

  const handleContinueDistribution = () => {
    setPublishOpen(false);
    navigate("/channels");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Create Survey" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            {/* Top navigation bar */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/survey-research")}
                className="gap-2 text-primary hover:text-primary/80"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Play className="w-4 h-4" />
                <span className="font-medium text-foreground">
                  {surveyTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border-border text-muted-foreground"
                >
                  <Save className="w-4 h-4" />
                  Save
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setPublishOpen(true)}
                  className="gap-2 bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                  Publish
                </Button>
              </div>
            </div>

            {/* Survey Form */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-lg shadow-sm">
                {/* Survey Header */}
                <div className="bg-muted/30 p-6 border-b border-border rounded-t-lg">
                  <h2 className="text-xl font-semibold text-foreground">
                    {surveyTitle}
                  </h2>
                </div>

                {/* Survey Description */}
                <div className="p-6 border-b border-border">
                  <p className="text-muted-foreground">
                    Help us make our product better for you! Share your honest
                    thoughts about what you like, what could be improved, and
                    any features you'd love to see in the future. Your feedback
                    will guide our next updates.
                  </p>
                </div>

                {/* Full Name Field */}
                <div className="p-6 border-b border-border">
                  <Label className="text-sm font-medium text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Jane Doe"
                    className="mt-2 border-primary/30 focus:border-primary"
                  />
                </div>

                {/* Email Address Field */}
                <div className="p-6 border-b border-border">
                  <Label className="text-sm font-medium text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="JaneDoe@gmail.com"
                    className="mt-2 border-primary/30 focus:border-primary"
                  />
                </div>

                {/* Age Field */}
                <div className="p-6">
                  <Label className="text-sm font-medium text-foreground">
                    Age <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup className="mt-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="18-24" id="age-18-24" />
                      <Label
                        htmlFor="age-18-24"
                        className="font-normal cursor-pointer"
                      >
                        18 - 24
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="25-34" id="age-25-34" />
                      <Label
                        htmlFor="age-25-34"
                        className="font-normal cursor-pointer"
                      >
                        25 - 34
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="35-44" id="age-35-44" />
                      <Label
                        htmlFor="age-35-44"
                        className="font-normal cursor-pointer"
                      >
                        35 - 44
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="45-64" id="age-45-64" />
                      <Label
                        htmlFor="age-45-64"
                        className="font-normal cursor-pointer"
                      >
                        45 - 64
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="65+" id="age-65+" />
                      <Label
                        htmlFor="age-65+"
                        className="font-normal cursor-pointer"
                      >
                        65+
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-6 border-b border-border">
                  <Label className="text-sm font-medium text-foreground">
                    State or Residence{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Lagos"
                    className="mt-2 border-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Publish Survey Modal */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Survey</DialogTitle>
            <DialogDescription>
              Set restrictions and response setting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Restrictions</Label>
              <Select value={restrictions} onValueChange={setRestrictions}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select restriction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    Public (everyone with link)
                  </SelectItem>
                  <SelectItem value="private">Private (invite only)</SelectItem>
                  <SelectItem value="password">Password protected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Limit Number of Responses
              </Label>
              <Select value={responseLimit} onValueChange={setResponseLimit}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Survey Closing Date</Label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Single Response</Label>
              <Switch
                checked={singleResponse}
                onCheckedChange={setSingleResponse}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Allow editing after submission
              </Label>
              <Switch
                checked={allowEditing}
                onCheckedChange={setAllowEditing}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleContinueDistribution}
                className="gap-2 bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground"
              >
                <Send className="w-4 h-4" />
                Continue to Distribution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AiSurvey;
