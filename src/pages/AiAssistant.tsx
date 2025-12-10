import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Send,
  Users,
  TrendingUp,
  FileText,
  MessageSquare,
  Clock,
  BarChart3,
  Brain,
  Database,
  Languages,
} from "lucide-react";

const quickQuestions = [
  { icon: Users, text: "Show me responses by location", tag: "Location" },
  { icon: TrendingUp, text: "What's the satisfaction trend", tag: "Trends" },
  { icon: FileText, text: "Generate a summary report", tag: "Report" },
  {
    icon: MessageSquare,
    text: "Find common themes in the feedback",
    tag: "Analysis",
  },
  { icon: Clock, text: "Show response times by hours", tag: "Timing" },
];

const aiCapabilities = [
  {
    title: "Data Export",
    description: "Generate reports and charts",
    icon: Database,
  },
  {
    title: "Smart Insights",
    description: "Automatic pattern detection",
    icon: Brain,
  },
  {
    title: "Predictive Analysis",
    description: "Forecast trends and outcomes",
    icon: BarChart3,
  },
  {
    title: "Natural Language Queries",
    description: "Ask questions in plain English",
    icon: Languages,
  },
];

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI survey assistant. I can help you analyze your data, generate insights, and answer questions about your survey responses. Try asking me something like 'Show me responses by location' or 'What's the satisfaction trend?'",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: "user", content: message }]);
    setMessage("");
    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm analyzing your survey data. This is a mock response - AI integration would provide real insights here.",
        },
      ]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setMessages([...messages, { role: "user", content: question }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Processing your request: "${question}". This is a mock response.`,
        },
      ]);
    }, 1000);
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
          <DashboardHeader headerTitle="AI Assistant" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            {/* Survey Selector */}
            <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-lg">
              <h2 className="text-lg font-semibold text-foreground">
                Customer Satisfaction Survey
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for survey"
                    className="pl-9 bg-background"
                  />
                </div>
                <Select defaultValue="customer">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select Survey" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Select Survey</SelectItem>
                    <SelectItem value="satisfaction">
                      Customer Satisfaction
                    </SelectItem>
                    <SelectItem value="feedback">Product Feedback</SelectItem>
                    <SelectItem value="engagement">
                      Employee Engagement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Area */}
              <Card className="lg:col-span-2 flex flex-col min-h-[500px]">
                <CardContent className="flex-1 p-6 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          msg.role === "assistant"
                            ? "bg-[#F2F7FF] text-muted-foreground"
                            : "bg-[#206AB5]/10 text-foreground ml-auto max-w-[80%]"
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Ask any question about your survey"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1 border border-[#6A9CCE]"
                    />
                    <Button
                      onClick={handleSend}
                      className="bg-[#206AB5] hover:bg-[#185287] text-white px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Questions */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Quick Questions
                    </h3>
                    <div className="space-y-3">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickQuestion(q.text)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          <q.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-foreground">
                            {q.text}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {q.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Capabilities */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      AI Capabilities
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {aiCapabilities.map((cap, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            {cap.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cap.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AIAssistant;
