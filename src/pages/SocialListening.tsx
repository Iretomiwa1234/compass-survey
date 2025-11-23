import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SocialListening = () => {
  const monitorItems = [
    {
      title: "Tesla Cyber Truck",
      mentions: "100 New Mentions",
      created: "20/09/2025",
    },
    {
      title: "#Electric Vehicles",
      mentions: "100 New Mentions",
      created: "22/09/2025",
    },
    {
      title: "Lotus Motors",
      mentions: "100 New Mentions",
      created: "20/09/2025",
    },
    {
      title: "#EV",
      mentions: "1,520 Total Response",
      subMentions: "100 New Mentions",
      created: "20/09/2025",
    },
    {
      title: "Zero Emissions",
      mentions: "100 New Mentions",
      created: "19/09/2025",
    },
    {
      title: "#Charging Stations",
      mentions: "100 New Mentions",
      created: "17/09/2025",
    },
  ];

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
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-foreground mb-6">
                Social Listening
              </h1>

              <h2 className="text-lg font-semibold text-foreground mb-6">
                Optimal Brand
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Mentions</p>
                        <p className="text-3xl font-bold text-foreground">2,345</p>
                        <p className="text-xs text-muted-foreground mt-2">+23% vs last week</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2m5-1.5c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5m-10 3c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5m0 1.5c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3"/></svg>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.15 9.95 9.95 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.047-8.733 0-9.633h3.554v1.361c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.681 1.376 3.681 4.314v5.544zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.704 0-.968.771-1.703 1.944-1.703 1.174 0 1.915.735 1.938 1.703 0 .946-.764 1.704-1.938 1.704zm1.581 11.019H3.656V9.82h3.262v10.632zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Engagement Rate</p>
                        <p className="text-3xl font-bold text-foreground">8.7%</p>
                        <p className="text-xs text-red-600 mt-2">+23% vs last week</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2m5-1.5c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5m-10 3c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5m0 1.5c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3"/></svg>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.15 9.95 9.95 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.047-8.733 0-9.633h3.554v1.361c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.681 1.376 3.681 4.314v5.544zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.704 0-.968.771-1.703 1.944-1.703 1.174 0 1.915.735 1.938 1.703 0 .946-.764 1.704-1.938 1.704zm1.581 11.019H3.656V9.82h3.262v10.632zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                        <div className="flex items-end gap-4 mt-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">60%</div>
                            <p className="text-xs text-muted-foreground mt-1">Positive</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-medium">1,404</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-orange-500 font-medium">819</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-600 font-medium">117</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-4">Top Platform</p>
                        <div className="flex items-center gap-3 mb-4">
                          <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2m5-1.5c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5m-10 3c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5m0 1.5c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3"/></svg>
                          <h3 className="font-bold text-foreground">Instagram</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">450 Mentions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-foreground">Monitoring Keywords</h3>
                {monitorItems.map((item, idx) => (
                  <Card
                    key={idx}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {item.subMentions && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{item.mentions}</span>
                            </div>
                          )}
                          <span>{item.subMentions || item.mentions}</span>
                          <span>Created: {item.created}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:text-blue-700"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 bg-red-50 border-red-100 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">50</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SocialListening;
