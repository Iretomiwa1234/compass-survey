import { useState } from "react";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Channels = () => {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Distribution Channels" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Customer Satisfaction Survey
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for survey" className="pl-9" />
                  </div>
                  <Select defaultValue="customer-satisfaction">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Survey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-satisfaction">
                        Customer Satisfaction
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

              <div className="flex items-center justify-end gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 bg-white border border-border"
                >
                  <Link2 className="w-4 h-4 text-[#206AB5]" />
                  Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 bg-white border border-border"
                >
                  <Share2 className="w-4 h-4 text-[#206AB5]" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 bg-white border border-border"
                >
                  <Globe className="w-4 h-4 text-[#206AB5]" />
                  Website
                </Button>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList className="bg-white p-2 rounded-md shadow-sm inline-flex">
                  <TabsTrigger
                    value="email"
                    className="gap-2 px-4 py-2 rounded-md data-[state=active]:bg-[#206AB5] data-[state=active]:text-white"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger
                    value="sms"
                    className="gap-2 px-4 py-2 rounded-md data-[state=active]:bg-[#206AB5] data-[state=active]:text-white"
                  >
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </TabsTrigger>
                  <TabsTrigger
                    value="whatsapp"
                    className="gap-2 px-4 py-2 rounded-md data-[state=active]:bg-[#206AB5] data-[state=active]:text-white"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </TabsTrigger>
                  <TabsTrigger
                    value="qrcode"
                    className="gap-2 px-4 py-2 rounded-md data-[state=active]:bg-[#206AB5] data-[state=active]:text-white"
                  >
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-border bg-white shadow-sm">
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
                            <Input
                              placeholder="Upload CSV or enter emails"
                              className="flex-1"
                            />
                            <Button variant="outline" className="gap-2">
                              <Upload className="w-4 h-4" />
                              Upload
                            </Button>
                          </div>
                        </div>

                        <Button className="w-full bg-[#206AB5] hover:bg-[#185287] text-white gap-2">
                          <Mail className="w-4 h-4" />
                          Send Email Campaign
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-border bg-white shadow-sm">
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

                          <Button className="bg-[#206AB5] hover:bg-[#185287] text-white gap-2">
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
                    {/* LEFT PANEL — SMS FORM */}
                    <Card className="border border-border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>SMS Campaign</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* SMS Message */}
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

                        {/* PHONE NUMBER INPUT OR UPLOAD */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Phone Numbers
                          </label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Upload CSV or enter numbers"
                              className="flex-1"
                            />
                            <Button variant="outline" className="gap-2">
                              <Upload className="w-4 h-4" />
                              Upload
                            </Button>
                          </div>
                        </div>

                        {/* SEND BUTTON */}
                        <Button className="w-full bg-[#206AB5] hover:bg-[#185287] text-white gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Send SMS Campaign
                        </Button>
                      </CardContent>
                    </Card>

                    {/* RIGHT PANEL — PREVIEW */}
                    <Card className="border border-border bg-white shadow-sm">
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
                          <p className="mt-3 text-blue-600 underline">
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
                    {/* LEFT PANEL — SMS FORM */}
                    <Card className="border border-border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Whatsapp Campaign</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* SMS Message */}
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

                        {/* PHONE NUMBER INPUT OR UPLOAD */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Whatsapp Numbers
                          </label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Upload CSV or enter emailss"
                              className="flex-1"
                            />
                            <Button variant="outline" className="gap-2">
                              <Upload className="w-4 h-4" />
                              Upload
                            </Button>
                          </div>
                        </div>

                        {/* SEND BUTTON */}
                        <Button className="w-full bg-[#206AB5] hover:bg-[#185287] text-white gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Send Whatsapp Campaign
                        </Button>
                      </CardContent>
                    </Card>

                    {/* RIGHT PANEL — PREVIEW */}
                    <Card className="border border-border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Preview</CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div className="border rounded-lg bg-green-50 p-4 text-sm leading-relaxed">
                          <img src="/assets/Whatsapp Chat.png" alt="" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="qrcode" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT — QR Code Settings */}
                    <Card className="border border-border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>QR Code</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-5">
                        {/* QR Code Style */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium block">
                            QR Code Style
                          </label>

                          <Select defaultValue="branded">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Style" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="branded">Branded</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* CTA Text */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium block">
                            Call to Action Text
                          </label>

                          <Input
                            placeholder="Scan to share your feedback"
                            defaultValue="Scan to share your feedback"
                          />
                        </div>

                        {/* Generate QR Button */}
                        <Button className="w-full bg-[#206AB5] hover:bg-[#185287] text-white gap-2">
                          <QrCode className="w-4 h-4" />
                          Generate QR Code
                        </Button>

                        {/* Download Buttons */}
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 gap-2">
                            Download PNG
                          </Button>
                          <Button variant="outline" className="flex-1 gap-2">
                            Download SVG
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* RIGHT — QR Code Preview */}
                    <Card className="border border-border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>QR Code Preview</CardTitle>
                      </CardHeader>

                      <CardContent className="flex items-center justify-center py-10">
                        <div className="flex flex-col items-center space-y-3">
                          {/* Placeholder QR */}
                          <div className="p-4 border rounded-lg bg-muted flex items-center justify-center">
                            <QrCode className="w-30 h-30 text-foreground opacity-50" />
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Scan to share your feedback
                          </p>

                          <p className="text-xs text-muted-foreground">
                            survey.link/abc123
                          </p>
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
