import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, MessageSquare, Hash, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mentions = [
  { platform: "Twitter", author: "@user1", content: "Absolutely loving the new features! Great work on the update.", sentiment: "positive", engagement: 245, time: "2h ago" },
  { platform: "Facebook", author: "Jane Smith", content: "Having some issues with the mobile app. Needs improvement.", sentiment: "negative", engagement: 89, time: "4h ago" },
  { platform: "Instagram", author: "@brand_fan", content: "This product changed my workflow completely! Highly recommend.", sentiment: "positive", engagement: 512, time: "6h ago" },
  { platform: "LinkedIn", author: "Michael Chen", content: "Interesting approach to solving this problem. Worth exploring.", sentiment: "neutral", engagement: 156, time: "1d ago" },
];

const trendingTopics = [
  { topic: "#ProductLaunch", mentions: 1250, trend: "up", change: "+45%" },
  { topic: "#CustomerService", mentions: 890, trend: "down", change: "-12%" },
  { topic: "#Innovation", mentions: 2100, trend: "up", change: "+78%" },
  { topic: "#UserExperience", mentions: 650, trend: "up", change: "+23%" },
];

const SocialListening = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-16">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader />
          
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Social Listening</h1>
                <p className="text-muted-foreground mt-1">Monitor brand mentions and conversations</p>
              </div>
              <Button className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4,823</div>
                  <p className="text-xs text-muted-foreground mt-1">+18% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">62%</div>
                  <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">+2% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground mt-1">All platforms active</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Mentions</CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="Search mentions..." className="pl-10 w-64" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="positive">Positive</TabsTrigger>
                        <TabsTrigger value="negative">Negative</TabsTrigger>
                        <TabsTrigger value="neutral">Neutral</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="space-y-4">
                        {mentions.map((mention, idx) => (
                          <div key={idx} className="border-b pb-4 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{mention.platform}</Badge>
                                <span className="font-semibold text-sm">{mention.author}</span>
                                <Badge variant={
                                  mention.sentiment === "positive" ? "success" : 
                                  mention.sentiment === "negative" ? "destructive" : 
                                  "secondary"
                                }>
                                  {mention.sentiment}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{mention.time}</span>
                            </div>
                            <p className="text-sm text-foreground mb-2">{mention.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {mention.engagement} engagements
                              </span>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                  <CardDescription>Most discussed hashtags this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trendingTopics.map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-semibold text-sm">{topic.topic}</p>
                          <p className="text-xs text-muted-foreground">{topic.mentions} mentions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`w-4 h-4 ${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm font-semibold ${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {topic.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SocialListening;
