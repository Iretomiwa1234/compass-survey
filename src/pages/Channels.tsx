import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MessageSquare,
  QrCode,
  Link2,
  Share2,
  Globe,
  Upload,
  Search,
  Check,
  Download,
  X,
  Inbox,
  Smartphone,
  Copy,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getSurveys, SurveyListItemApi } from "@/lib/auth";
import whatsappChat from "/assets/Whatsapp Chat.png?url";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const Channels = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Mobile App — demographic targeting
  const [showDemographics, setShowDemographics] = useState(false);
  const [demoAgeMin, setDemoAgeMin] = useState("");
  const [demoAgeMax, setDemoAgeMax] = useState("");
  const [demoGenders, setDemoGenders] = useState<string[]>([]);
  const [demoMaritalStatus, setDemoMaritalStatus] = useState<string[]>([]);
  const [demoLocations, setDemoLocations] = useState<string[]>([]);
  const [demoLanguages, setDemoLanguages] = useState<string[]>([]);
  const [demoEducation, setDemoEducation] = useState<string[]>([]);
  const [demoEmployment, setDemoEmployment] = useState<string[]>([]);
  const [demoOccupation, setDemoOccupation] = useState("");
  const [demoIndustry, setDemoIndustry] = useState<string[]>([]);
  const [demoDeviceType, setDemoDeviceType] = useState<string[]>([]);
  const [demoDeviceOS, setDemoDeviceOS] = useState<string[]>([]);

  const toggleDemoItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );

  const toggleGender = (g: string) => toggleDemoItem(setDemoGenders, g);
  const toggleLocation = (l: string) => toggleDemoItem(setDemoLocations, l);

  // Upload states
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailFileName, setEmailFileName] = useState("");
  const [smsNumbers, setSmsNumbers] = useState("");
  const [smsFileName, setSmsFileName] = useState("");
  const [whatsappNumbers, setWhatsappNumbers] = useState("");
  const [whatsappFileName, setWhatsappFileName] = useState("");

  // File input refs
  const emailFileRef = useRef<HTMLInputElement>(null);
  const smsFileRef = useRef<HTMLInputElement>(null);
  const whatsappFileRef = useRef<HTMLInputElement>(null);

  const surveyLink = "https://msurvey123.com/customerfeedback";
  const websiteUrl = "https://msurvey123.com";

  useEffect(() => {
    let isActive = true;
    setIsLoadingSurveys(true);

    getSurveys(1)
      .then((response) => {
        if (!isActive) return;
        const items = response?.data?.survey?.data ?? [];
        setSurveys(items);
        setIsLoadingSurveys(false);
      })
      .catch(() => {
        if (!isActive) return;
        setSurveys([]);
        setIsLoadingSurveys(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!showSuggestions) return;
    setIsSearchLoading(true);
    const timer = window.setTimeout(() => {
      setIsSearchLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm, showSuggestions]);

  const sortedSurveys = useMemo(() => {
    return [...surveys].sort((a, b) => b.survey_id - a.survey_id);
  }, [surveys]);

  const selectedSurvey = useMemo(() => {
    if (selectedSurveyId === null) return null;
    return (
      surveys.find((survey) => survey.survey_id === selectedSurveyId) || null
    );
  }, [selectedSurveyId, surveys]);

  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return surveys
      .filter((survey) => survey.title.toLowerCase().includes(query))
      .sort((a, b) => b.survey_id - a.survey_id)
      .slice(0, 10);
  }, [searchTerm, surveys]);

  const handleSelectSurvey = (surveyId: number) => {
    const survey = surveys.find((item) => item.survey_id === surveyId);
    setSelectedSurveyId(surveyId);
    setSearchTerm(survey?.title ?? "");
    setShowSuggestions(false);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "email" | "sms" | "whatsapp",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split(/[\r\n]+/).filter((line) => line.trim());
      const data = lines.join(", ");

      switch (type) {
        case "email":
          setEmailRecipients(data);
          setEmailFileName(file.name);
          break;
        case "sms":
          setSmsNumbers(data);
          setSmsFileName(file.name);
          break;
        case "whatsapp":
          setWhatsappNumbers(data);
          setWhatsappFileName(file.name);
          break;
      }

      toast({
        title: "File uploaded!",
        description: `${lines.length} entries loaded from ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const clearUpload = (type: "email" | "sms" | "whatsapp") => {
    switch (type) {
      case "email":
        setEmailRecipients("");
        setEmailFileName("");
        if (emailFileRef.current) emailFileRef.current.value = "";
        break;
      case "sms":
        setSmsNumbers("");
        setSmsFileName("");
        if (smsFileRef.current) smsFileRef.current.value = "";
        break;
      case "whatsapp":
        setWhatsappNumbers("");
        setWhatsappFileName("");
        if (whatsappFileRef.current) whatsappFileRef.current.value = "";
        break;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyLink);
      setLinkCopied(true);
      toast({
        title: "Link Copied!",
        description: "Survey link has been copied to clipboard.",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Customer Satisfaction Survey",
          text: "Please take a moment to complete our survey",
          url: surveyLink,
        });
        toast({
          title: "Shared successfully!",
          description: "Survey link has been shared.",
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
      toast({
        title: "Link Copied!",
        description:
          "Share not supported on this browser. Link copied instead.",
      });
    }
  };

  const handleOpenWebsite = () => {
    window.open(websiteUrl, "_blank", "noopener,noreferrer");
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
    toast({
      title: "QR Code Generated!",
      description: "Your QR code is ready for download.",
    });
  };

  const handleDownloadQR = (format: "png" | "svg") => {
    if (!qrGenerated) {
      toast({
        title: "Generate QR Code First",
        description: "Please generate the QR code before downloading.",
        variant: "destructive",
      });
      return;
    }

    // Create a simple QR-like SVG for download
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="60" height="60" fill="#206AB5"/>
      <rect x="120" y="20" width="60" height="60" fill="#206AB5"/>
      <rect x="20" y="120" width="60" height="60" fill="#206AB5"/>
      <rect x="40" y="40" width="20" height="20" fill="white"/>
      <rect x="140" y="40" width="20" height="20" fill="white"/>
      <rect x="40" y="140" width="20" height="20" fill="white"/>
      <rect x="90" y="20" width="20" height="20" fill="#206AB5"/>
      <rect x="90" y="50" width="20" height="20" fill="#206AB5"/>
      <rect x="90" y="90" width="20" height="20" fill="#206AB5"/>
      <rect x="120" y="90" width="20" height="20" fill="#206AB5"/>
      <rect x="150" y="90" width="20" height="20" fill="#206AB5"/>
      <rect x="90" y="120" width="20" height="20" fill="#206AB5"/>
      <rect x="120" y="150" width="60" height="30" fill="#206AB5"/>
      <rect x="90" y="160" width="20" height="20" fill="#206AB5"/>
    </svg>`;

    if (format === "svg") {
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "survey-qr-code.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Convert SVG to PNG
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svgContent], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = "survey-qr-code.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
          }
        }, "image/png");
      };
      img.src = url;
    }

    toast({
      title: `QR Code Downloaded!`,
      description: `Your QR code has been saved as ${format.toUpperCase()}.`,
    });
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
          <DashboardHeader headerTitle="Social Listening" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            {/* Survey Selection Bar */}
            <div className="bg-card rounded-lg p-4 mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {selectedSurvey?.title ?? "Select a survey"}
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for survey"
                    className="pl-9 h-9 bg-white border border-primary/5"
                    value={searchTerm}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      window.setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                  />
                  {showSuggestions &&
                    (isSearchLoading || searchTerm.trim()) && (
                      <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-white p-1 shadow-md">
                        {isSearchLoading ? (
                          <div className="space-y-2 p-2">
                            {Array.from({ length: 3 }).map((_, idx) => (
                              <Skeleton
                                key={`survey-search-skeleton-${idx}`}
                                className="h-6 w-full"
                              />
                            ))}
                          </div>
                        ) : searchSuggestions.length > 0 ? (
                          searchSuggestions.map((survey) => (
                            <button
                              key={survey.survey_id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() =>
                                handleSelectSurvey(survey.survey_id)
                              }
                              className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm text-foreground hover:bg-accent"
                            >
                              {survey.title}
                            </button>
                          ))
                        ) : (
                          <div className="px-2 py-2 text-sm text-muted-foreground">
                            No matching surveys
                          </div>
                        )}
                      </div>
                    )}
                </div>
                <Select
                  value={
                    selectedSurveyId ? String(selectedSurveyId) : undefined
                  }
                  onValueChange={(value) => handleSelectSurvey(Number(value))}
                >
                  <SelectTrigger className="w-[150px] h-9 bg-card border border-border">
                    <SelectValue placeholder="Select Survey" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSurveys && (
                      <SelectItem value="loading" disabled>
                        Loading surveys...
                      </SelectItem>
                    )}
                    {!isLoadingSurveys && sortedSurveys.length === 0 && (
                      <SelectItem value="empty" disabled>
                        No surveys found
                      </SelectItem>
                    )}
                    {!isLoadingSurveys &&
                      sortedSurveys.map((survey) => (
                        <SelectItem
                          key={survey.survey_id}
                          value={String(survey.survey_id)}
                        >
                          {survey.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!selectedSurvey ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <Card className="max-w-md border border-border bg-white shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Inbox className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Select a survey to work on
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Choose a survey from the dropdown or search to continue.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Tabs and Action Buttons Row */}
                <div className="mb-6  bg-white p-4 rounded-lg">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col min-[1090px]:flex-row min-[1090px]:items-center min-[1090px]:justify-between gap-3">
                      <TabsList className="bg-transparent p-0 h-auto gap-1 flex-wrap">
                        <TabsTrigger
                          value="email"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </TabsTrigger>
                        <TabsTrigger
                          value="sms"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <MessageSquare className="w-4 h-4" />
                          SMS
                        </TabsTrigger>
                        <TabsTrigger
                          value="whatsapp"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          WhatsApp
                        </TabsTrigger>
                        <TabsTrigger
                          value="qrcode"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <QrCode className="w-4 h-4" />
                          QR Code
                        </TabsTrigger>
                        <TabsTrigger
                          value="mobileapp"
                          className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                        >
                          <Smartphone className="w-4 h-4" />
                          Mobile App
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex items-center gap-2 flex-wrap border-t border-border pt-3 min-[1090px]:border-t-0 min-[1090px]:pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyLink}
                          className="gap-2 bg-card border border-border text-foreground hover:bg-accent h-9 px-4"
                        >
                          {linkCopied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Link2 className="w-4 h-4 text-primary" />
                          )}
                          {linkCopied ? "Copied!" : "Link"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="gap-2 bg-card border border-border text-foreground hover:bg-accent h-9 px-4"
                        >
                          <Share2 className="w-4 h-4 text-primary" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenWebsite}
                          className="gap-2 bg-card border border-border text-foreground hover:bg-accent h-9 px-4"
                        >
                          <Globe className="w-4 h-4 text-primary" />
                          Website
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="email" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Email Campaign</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Subject
                              </label>
                              <Input
                                placeholder="Help Us with this Quick Survey - 2 Mins Max"
                                defaultValue="Help Us with this Quick Survey - 2 Mins Max"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Email Message
                              </label>
                              <Textarea
                                placeholder="Enter your email message..."
                                className="min-h-[180px]"
                                defaultValue="Dear valued customer,&#10;&#10;Your feedback is important to us. Please take a moment to complete this short survey about your recent experience.&#10;&#10;Thank you!"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Recipient List
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Upload CSV or enter emails"
                                    value={emailRecipients}
                                    onChange={(e) =>
                                      setEmailRecipients(e.target.value)
                                    }
                                  />
                                  {emailFileName && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#206AB5]/10 px-2 py-0.5 rounded text-xs">
                                      <span className="text-primary">
                                        {emailFileName}
                                      </span>
                                      <button
                                        onClick={() => clearUpload("email")}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={emailFileRef}
                                  accept=".csv,.xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, "email")}
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => emailFileRef.current?.click()}
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                              <Mail className="w-4 h-4" />
                              Send Email Campaign
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                  Customer Satisfaction Survey
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  customerservice@riddle.com
                                </p>
                              </div>

                              <div className="border-t pt-4">
                                <p className="text-sm text-foreground whitespace-pre-line">
                                  Dear valued customer,{"\n\n"}
                                  Your feedback is important to us. Please take
                                  a moment to complete this short survey about
                                  your recent experience.{"\n\n"}
                                  Thank you!
                                </p>
                              </div>

                              <Button className="bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                                <Share2 className="w-4 h-4" />
                                Go to survey
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="sms" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>SMS Campaign</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                SMS Message
                              </label>
                              <Textarea
                                className="min-h-[180px]"
                                defaultValue={`Dear valued customer,

Your feedback is important to us. Please take a moment to complete this short survey about your recent experience.

Link: Msurvey123.com/customerfeedback

Thank you!`}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Phone Numbers
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Upload CSV or enter numbers"
                                    value={smsNumbers}
                                    onChange={(e) =>
                                      setSmsNumbers(e.target.value)
                                    }
                                  />
                                  {smsFileName && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#206AB5]/10 px-2 py-0.5 rounded text-xs">
                                      <span className="text-primary">
                                        {smsFileName}
                                      </span>
                                      <button
                                        onClick={() => clearUpload("sms")}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={smsFileRef}
                                  accept=".csv,.xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, "sms")}
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => smsFileRef.current?.click()}
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Send SMS Campaign
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>

                          <CardContent>
                            <div className="border rounded-lg bg-green-50 p-4 text-sm leading-relaxed">
                              <p className="text-foreground">
                                Dear valued customer,
                              </p>
                              <p className="mt-3">
                                Your feedback is important to us. Please take a
                                moment to complete this short survey about your
                                recent experience.
                              </p>
                              <p className="mt-3 text-primary underline">
                                Msurvey123.com/customerfeedback
                              </p>
                              <p className="mt-3">Thank you!</p>

                              <p className="text-xs text-muted-foreground mt-4">
                                02:25 PM
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="whatsapp" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Whatsapp Campaign</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Whatsapp Message
                              </label>
                              <Textarea
                                className="min-h-[180px]"
                                defaultValue={`Dear valued customer,

Your feedback is important to us. Please take a moment to complete this short survey about your recent experience.

Thank you!`}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Whatsapp Numbers
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Upload CSV or enter numbers"
                                    value={whatsappNumbers}
                                    onChange={(e) =>
                                      setWhatsappNumbers(e.target.value)
                                    }
                                  />
                                  {whatsappFileName && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#206AB5]/10 px-2 py-0.5 rounded text-xs">
                                      <span className="text-primary">
                                        {whatsappFileName}
                                      </span>
                                      <button
                                        onClick={() => clearUpload("whatsapp")}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={whatsappFileRef}
                                  accept=".csv,.xlsx,.xls"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e, "whatsapp")
                                  }
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() =>
                                    whatsappFileRef.current?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Send Whatsapp Campaign
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle>Preview</CardTitle>
                          </CardHeader>

                          <CardContent>
                            <div className="border rounded-lg bg-green-50 p-4 text-sm leading-relaxed">
                              <img src={whatsappChat} alt="WhatsApp Preview" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="qrcode" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              QR Code
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium block text-foreground">
                                QR Code Style
                              </label>

                              <Select defaultValue="branded">
                                <SelectTrigger className="w-full h-10 bg-card border border-border">
                                  <SelectValue placeholder="Select Style" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="branded">
                                    Branded
                                  </SelectItem>
                                  <SelectItem value="classic">
                                    Classic
                                  </SelectItem>
                                  <SelectItem value="rounded">
                                    Rounded
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium block text-foreground">
                                Call to Action Text
                              </label>

                              <Input
                                placeholder="Scan to share your feedback"
                                defaultValue="Scan to share your feedback"
                                className="h-10 bg-card border border-border"
                              />
                            </div>

                            <Button
                              onClick={handleGenerateQR}
                              className="w-full h-10 bg-[#206AB5] hover:bg-[#206AB5]/90 text-primary-foreground gap-2 font-medium"
                            >
                              <QrCode className="w-4 h-4" />
                              Generate QR Code
                            </Button>

                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => handleDownloadQR("png")}
                                className="flex-1 h-10 gap-2 border-primary text-primary hover:bg-[#206AB5]/5"
                              >
                                <Download className="w-4 h-4" />
                                Download PNG
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleDownloadQR("svg")}
                                className="flex-1 h-10 gap-2 border-primary text-primary hover:bg-[#206AB5]/5"
                              >
                                <Download className="w-4 h-4" />
                                Download SVG
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              QR Code Preview
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                              <div
                                className={`p-2 transition-opacity ${
                                  qrGenerated ? "opacity-100" : "opacity-50"
                                }`}
                              >
                                <QrCode
                                  className="w-40 h-40 text-primary"
                                  strokeWidth={1}
                                />
                              </div>

                              <p className="text-sm text-muted-foreground">
                                Scan to share your feedback
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {surveyLink.replace("https://", "")}
                              </p>

                              {!qrGenerated && (
                                <p className="text-xs text-muted-foreground italic">
                                  Click "Generate QR Code" to create your code
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="mobileapp" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              Mobile App Distribution
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-5">
                            {/* Status banner */}
                            <div className="flex items-start gap-3 rounded-xl bg-[#206AB5]/8 border border-[#206AB5]/20 px-4 py-3">
                              <Smartphone className="w-4 h-4 text-[#206AB5] shrink-0 mt-0.5" />
                              <p className="text-sm text-[#185287]">
                                Once published, this survey is automatically
                                available in the Compass mobile app. Control who
                                can see and take it below.
                              </p>
                            </div>

                            {/* Audience visibility */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium block text-foreground">
                                Who can see this survey?
                              </label>
                              <Select defaultValue="all">
                                <SelectTrigger className="w-full h-10 bg-card border border-border">
                                  <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">
                                    All mobile app users
                                  </SelectItem>
                                  <SelectItem value="registered">
                                    Registered users only
                                  </SelectItem>
                                  <SelectItem value="segment">
                                    Specific user segment
                                  </SelectItem>
                                  <SelectItem value="invite">
                                    Invited users only
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                This controls which users will see the survey
                                card in the app's survey feed.
                              </p>
                            </div>

                            {/* Demographic targeting */}
                            <div className="rounded-xl border border-border overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setShowDemographics((v) => !v)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-foreground"
                              >
                                <span className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#206AB5]" />
                                  Demographic targeting
                                  {[
                                    demoGenders.length > 0,
                                    demoMaritalStatus.length > 0,
                                    demoLocations.length > 0,
                                    demoLanguages.length > 0,
                                    demoEducation.length > 0,
                                    demoEmployment.length > 0,
                                    !!demoOccupation,
                                    demoIndustry.length > 0,
                                    demoDeviceType.length > 0,
                                    demoDeviceOS.length > 0,
                                    !!(demoAgeMin || demoAgeMax),
                                  ].filter(Boolean).length > 0 && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#206AB5] text-white text-[9px] font-bold">
                                      {
                                        [
                                          demoGenders.length > 0,
                                          demoMaritalStatus.length > 0,
                                          demoLocations.length > 0,
                                          demoLanguages.length > 0,
                                          demoEducation.length > 0,
                                          demoEmployment.length > 0,
                                          !!demoOccupation,
                                          demoIndustry.length > 0,
                                          demoDeviceType.length > 0,
                                          demoDeviceOS.length > 0,
                                          !!(demoAgeMin || demoAgeMax),
                                        ].filter(Boolean).length
                                      }
                                    </span>
                                  )}
                                </span>
                                {showDemographics ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>

                              {showDemographics && (
                                <div className="px-4 py-4 space-y-5 border-t border-border bg-white">
                                  {/* Age range */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Age range
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min={0}
                                        max={120}
                                        placeholder="Min"
                                        value={demoAgeMin}
                                        onChange={(e) =>
                                          setDemoAgeMin(e.target.value)
                                        }
                                        className="h-9 w-full bg-card border border-border text-sm"
                                      />
                                      <span className="text-muted-foreground text-sm shrink-0">
                                        –
                                      </span>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={120}
                                        placeholder="Max"
                                        value={demoAgeMax}
                                        onChange={(e) =>
                                          setDemoAgeMax(e.target.value)
                                        }
                                        className="h-9 w-full bg-card border border-border text-sm"
                                      />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Leave blank to include all ages.
                                    </p>
                                  </div>

                                  {/* Gender */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Gender
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Male",
                                        "Female",
                                        "Non-binary",
                                        "Prefer not to say",
                                      ].map((g) => {
                                        const active = demoGenders.includes(g);
                                        return (
                                          <button
                                            key={g}
                                            type="button"
                                            onClick={() => toggleGender(g)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {g}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all genders.
                                    </p>
                                  </div>

                                  {/* Marital status */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Marital status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Single",
                                        "Married",
                                        "Divorced",
                                        "Widowed",
                                        "Separated",
                                      ].map((m) => {
                                        const active =
                                          demoMaritalStatus.includes(m);
                                        return (
                                          <button
                                            key={m}
                                            type="button"
                                            onClick={() =>
                                              toggleDemoItem(
                                                setDemoMaritalStatus,
                                                m,
                                              )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {m}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all.
                                    </p>
                                  </div>

                                  {/* Location — country & state */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Location (Country / State)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Nigeria",
                                        "Ghana",
                                        "Kenya",
                                        "South Africa",
                                        "United States",
                                        "United Kingdom",
                                        "Canada",
                                        "India",
                                        "Other",
                                      ].map((loc) => {
                                        const active =
                                          demoLocations.includes(loc);
                                        return (
                                          <button
                                            key={loc}
                                            type="button"
                                            onClick={() => toggleLocation(loc)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {loc}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all locations.
                                    </p>
                                  </div>

                                  {/* Language */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Language
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "English",
                                        "French",
                                        "Arabic",
                                        "Spanish",
                                        "Portuguese",
                                        "Swahili",
                                        "Hausa",
                                        "Yoruba",
                                        "Igbo",
                                      ].map((lang) => {
                                        const active =
                                          demoLanguages.includes(lang);
                                        return (
                                          <button
                                            key={lang}
                                            type="button"
                                            onClick={() =>
                                              toggleDemoItem(
                                                setDemoLanguages,
                                                lang,
                                              )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {lang}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all languages.
                                    </p>
                                  </div>

                                  {/* Education level */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Education level
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "No formal education",
                                        "Primary",
                                        "Secondary / High school",
                                        "Vocational / Technical",
                                        "Undergraduate",
                                        "Postgraduate",
                                        "PhD",
                                      ].map((edu) => {
                                        const active =
                                          demoEducation.includes(edu);
                                        return (
                                          <button
                                            key={edu}
                                            type="button"
                                            onClick={() =>
                                              toggleDemoItem(
                                                setDemoEducation,
                                                edu,
                                              )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {edu}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all education
                                      levels.
                                    </p>
                                  </div>

                                  {/* Employment status */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Employment status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Employed (full-time)",
                                        "Employed (part-time)",
                                        "Self-employed",
                                        "Freelancer",
                                        "Unemployed",
                                        "Student",
                                        "Retired",
                                      ].map((emp) => {
                                        const active =
                                          demoEmployment.includes(emp);
                                        return (
                                          <button
                                            key={emp}
                                            type="button"
                                            onClick={() =>
                                              toggleDemoItem(
                                                setDemoEmployment,
                                                emp,
                                              )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {emp}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all employment
                                      statuses.
                                    </p>
                                  </div>

                                  {/* Occupation (free text) */}
                                  {/* <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Occupation
                                    </label>
                                    <Input
                                      placeholder="e.g. Software Engineer, Teacher, Doctor…"
                                      value={demoOccupation}
                                      onChange={(e) =>
                                        setDemoOccupation(e.target.value)
                                      }
                                      className="h-9 bg-card border border-border text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Leave blank to include all occupations.
                                    </p>
                                  </div> */}

                                  {/* Industry */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Industry
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Technology",
                                        "Healthcare",
                                        "Finance / Banking",
                                        "Education",
                                        "Retail / E-commerce",
                                        "Agriculture",
                                        "Manufacturing",
                                        "Media / Entertainment",
                                        "Government / Public sector",
                                        "NGO / Non-profit",
                                        "Hospitality / Tourism",
                                        "Other",
                                      ].map((ind) => {
                                        const active =
                                          demoIndustry.includes(ind);
                                        return (
                                          <button
                                            key={ind}
                                            type="button"
                                            onClick={() =>
                                              toggleDemoItem(
                                                setDemoIndustry,
                                                ind,
                                              )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {ind}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all industries.
                                    </p>
                                  </div>

                                  {/* Device type */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Device type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {["Mobile", "Tablet", "Desktop"].map(
                                        (dt) => {
                                          const active =
                                            demoDeviceType.includes(dt);
                                          return (
                                            <button
                                              key={dt}
                                              type="button"
                                              onClick={() =>
                                                toggleDemoItem(
                                                  setDemoDeviceType,
                                                  dt,
                                                )
                                              }
                                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                            >
                                              {active && (
                                                <Check className="inline w-3 h-3 mr-1" />
                                              )}
                                              {dt}
                                            </button>
                                          );
                                        },
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all device types.
                                    </p>
                                  </div>

                                  {/* Device OS / brand */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Device OS / Platform
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Android",
                                        "iOS",
                                        "Windows",
                                        "macOS",
                                        "Linux",
                                        "HarmonyOS",
                                      ].map((os) => {
                                        const active =
                                          demoDeviceOS.includes(os);
                                        return (
                                          <button
                                            key={os}
                                            type="button"
                                            onClick={() =>
                                              toggleDemoItem(
                                                setDemoDeviceOS,
                                                os,
                                              )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#206AB5] border-[#206AB5] text-white" : "bg-white border-border text-muted-foreground hover:border-[#206AB5]/50"}`}
                                          >
                                            {active && (
                                              <Check className="inline w-3 h-3 mr-1" />
                                            )}
                                            {os}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Select none to include all platforms.
                                    </p>
                                  </div>

                                  {/* Clear all */}
                                  {[
                                    demoGenders,
                                    demoMaritalStatus,
                                    demoLocations,
                                    demoLanguages,
                                    demoEducation,
                                    demoEmployment,
                                    demoIndustry,
                                    demoDeviceType,
                                    demoDeviceOS,
                                  ].some((a) => a.length > 0) ||
                                  demoAgeMin ||
                                  demoAgeMax ||
                                  demoOccupation ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDemoGenders([]);
                                        setDemoMaritalStatus([]);
                                        setDemoLocations([]);
                                        setDemoLanguages([]);
                                        setDemoEducation([]);
                                        setDemoEmployment([]);
                                        setDemoOccupation("");
                                        setDemoIndustry([]);
                                        setDemoDeviceType([]);
                                        setDemoDeviceOS([]);
                                        setDemoAgeMin("");
                                        setDemoAgeMax("");
                                      }}
                                      className="text-xs text-red-500 hover:text-red-600 underline"
                                    >
                                      Clear all filters
                                    </button>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-border bg-card shadow-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                              Preview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex items-center justify-center py-10">
                            <div className="flex flex-col items-center gap-5">
                              {/* Phone mockup */}
                              <div className="relative w-[160px] h-[290px] rounded-[28px] border-[6px] border-slate-800 bg-white shadow-xl overflow-hidden flex flex-col">
                                {/* Status bar */}
                                <div className="bg-slate-800 h-5 w-full flex items-center justify-center shrink-0">
                                  <div className="w-10 h-1.5 bg-slate-600 rounded-full" />
                                </div>
                                {/* App chrome */}
                                <div className="bg-[#206AB5] px-3 py-2 shrink-0">
                                  <p className="text-white text-[9px] font-semibold">
                                    Survey
                                  </p>
                                </div>
                                {/* Content */}
                                <div className="flex-1 bg-[#F7FBFF] p-2.5 overflow-hidden space-y-2">
                                  <div className="bg-white rounded-lg p-2 shadow-sm">
                                    <div className="h-1.5 bg-[#206AB5] rounded-full mb-1.5 w-3/4" />
                                    <div className="h-1 bg-slate-200 rounded-full w-full" />
                                    <div className="h-1 bg-slate-200 rounded-full w-2/3 mt-1" />
                                  </div>
                                  <div className="bg-white rounded-lg p-2 shadow-sm">
                                    <div className="h-1 bg-slate-300 rounded-full w-1/2 mb-2" />
                                    <div className="space-y-1">
                                      {[1, 2, 3].map((i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-1.5"
                                        >
                                          <div className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                                          <div className="h-1 bg-slate-200 rounded-full flex-1" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="bg-[#206AB5] rounded-lg p-1.5 text-center">
                                    <p className="text-white text-[8px] font-semibold">
                                      Submit
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground text-center max-w-[180px]">
                                The survey opens in-app via a WebView or
                                external browser link.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Channels;
