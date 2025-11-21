import React from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Edit, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const SurveyResearch = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-white px-4 h-16 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>

          <DashboardHeader />

          <main className="flex-1 p-8 overflow-y-auto space-y-8">
            {/* PAGE TITLE */}
            <h3 className="text-2xl font-semibold text-slate-700">Customer Satisfaction Survey</h3>

            {/* TOP METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-sm border rounded-2xl">
                <CardHeader>
                  <CardTitle>Total Responses</CardTitle>
                  <CardDescription>Overall responses collected</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">1,500</p>
                  <div className="mt-4 grid grid-cols-3 text-sm text-slate-600">
                    <div>
                      <p className="font-bold text-green-600">1,100</p>
                      <p>Completed</p>
                    </div>
                    <div>
                      <p className="font-bold text-orange-500">200</p>
                      <p>In Progress</p>
                    </div>
                    <div>
                      <p className="font-bold text-red-500">200</p>
                      <p>Abandoned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border rounded-2xl flex flex-col items-center justify-center text-center p-6">
                <p className="text-slate-500 font-medium">Avg Response Rate</p>
                <div className="text-5xl font-bold text-blue-600 my-4">72%</div>
                <p className="text-slate-600">Total Invite Sent: 1,500</p>
                <p className="text-slate-600">Total Responded: 1,300</p>
              </Card>

              <Card className="shadow-sm border rounded-2xl flex flex-col items-center justify-center text-center p-6">
                <p className="text-slate-500 font-medium">Completion Rate</p>
                <div className="text-5xl font-bold text-green-600 my-4">80%</div>
                <p className="text-slate-600">Completed: 1,300</p>
                <p className="text-slate-600">Abandoned: 200</p>
              </Card>

              <Card className="shadow-sm border rounded-2xl">
                <CardHeader>
                  <CardTitle>Country Reach</CardTitle>
                  <CardDescription>Total countries: 16</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 text-center text-sm text-slate-600">
                    <div>
                      <p className="font-bold text-slate-800">5</p>
                      <p>Africa</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">3</p>
                      <p>Asia</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">3</p>
                      <p>Europe</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">4</p>
                      <p>America</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SEARCH + FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
              <div className="relative w-full max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search for survey" className="pl-10" />
              </div>

              <select className="border rounded-lg px-3 py-2 text-slate-700 bg-white shadow-sm">
                <option>All Surveys</option>
                <option>Active</option>
                <option>Closed</option>
                <option>Draft</option>
              </select>

              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3">
                <Plus className="w-4 h-4" /> Create Survey
              </Button>
            </div>

            {/* SURVEY LIST */}
            <div className="space-y-4">
              {[1,2,3,4,5,6,7,8,9].map((i) => (
                <Card key={i} className="border rounded-xl shadow-sm hover:shadow-md transition p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800">Customer Satisfaction Survey</h3>
                      <p className="text-sm text-slate-500 mt-1">1,320 Total Response • Response rate: 65% • Created: 20/09/2025</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="rounded-lg px-4">
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                      <Button variant="outline" className="rounded-lg px-4 border-blue-600 text-blue-600">
                        <BarChart2 className="w-4 h-4 mr-2" /> Analytics
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 pt-6">
              <Button variant="ghost">&lt;</Button>
              <Button variant="outline" className="rounded-lg">1</Button>
              <Button variant="ghost">2</Button>
              <Button variant="ghost">3</Button>
              <span className="text-slate-500">...</span>
              <Button variant="ghost">50</Button>
              <Button variant="ghost">&gt;</Button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default SurveyResearch;