import { useState, useRef } from "react";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import whatsappChat from "/assets/Whatsapp Chat.png?url";

const Channels = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "email" | "sms" | "whatsapp"
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
                Customer Satisfaction Survey
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for survey"
                    className="pl-9 h-9 bg-white border border-primary/5"
                  />
                </div>
                <Select defaultValue="customer-satisfaction">
                  <SelectTrigger className="w-[150px] h-9 bg-card border border-border">
                    <SelectValue placeholder="Select Survey" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer-satisfaction">
                      Select Survey
                    </SelectItem>
                    <SelectItem value="product-feedback">
                      Product Feedback
                    </SelectItem>
                    <SelectItem value="employee-engagement">
                      Employee Engagement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs and Action Buttons Row */}
            <div className="mb-6  bg-white p-4 rounded-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                  <TabsList className="bg-transparent p-0 h-auto gap-1">
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
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </TabsTrigger>
                    <TabsTrigger
                      value="qrcode"
                      className="gap-2 px-5 py-2.5 rounded-md bg-white text-gray-600 data-[state=active]:bg-[#206AB5] data-[state=active]:text-white data-[state=active]:border-[#206AB5]"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
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
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-xs">
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

                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
                              Your feedback is important to us. Please take a
                              moment to complete this short survey about your
                              recent experience.{"\n\n"}
                              Thank you!
                            </p>
                          </div>

                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
                                onChange={(e) => setSmsNumbers(e.target.value)}
                              />
                              {smsFileName && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-xs">
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

                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-xs">
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
                              onChange={(e) => handleFileUpload(e, "whatsapp")}
                            />
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={() => whatsappFileRef.current?.click()}
                            >
                              <Upload className="w-4 h-4" />
                              Upload
                            </Button>
                          </div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
                              <SelectItem value="branded">Branded</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
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
                          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-medium"
                        >
                          <QrCode className="w-4 h-4" />
                          Generate QR Code
                        </Button>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleDownloadQR("png")}
                            className="flex-1 h-10 gap-2 border-primary text-primary hover:bg-primary/5"
                          >
                            <Download className="w-4 h-4" />
                            Download PNG
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDownloadQR("svg")}
                            className="flex-1 h-10 gap-2 border-primary text-primary hover:bg-primary/5"
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
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Channels;
