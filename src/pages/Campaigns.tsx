import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Campaigns = () => {
  const performanceData = [
    {
      channel: "Email",
      sent: "1,340",
      viewed: "1,278",
      responses: "1,229",
      conversion: "80%",
      status: "Active",
    },
    {
      channel: "SMS",
      sent: "570",
      viewed: "486",
      responses: "476",
      conversion: "76%",
      status: "Active",
    },
    {
      channel: "Whatsapp",
      sent: "256",
      viewed: "230",
      responses: "212",
      conversion: "88%",
      status: "Active",
    },
    {
      channel: "QR-Code",
      sent: "0",
      viewed: "195",
      responses: "184",
      conversion: "96%",
      status: "Active",
    },
  ];

   const [createOpen, setCreateOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Campaigns" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-6">
                Distribution Campaigns
              </h1>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for survey"
                    className="pl-9 bg-background"
                  />
                </div>
                <Select defaultValue="survey1">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select Survey" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="survey1">
                      Customer Satisfaction Survey
                    </SelectItem>
                    <SelectItem value="survey2">Product Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="mb-8">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-md font-normal text-foreground">
                        Customer Satisfaction Survey
                      </h2>
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>1,520 Total Response</span>
                      </div>
                      <span>Response rate: 68%</span>
                      <span>Created: 20/09/2025</span>
                    </div>
                  </div>
                  <Button onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Channel
              </Button>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Distribution Performance
                </h3>
                <div className="rounded-md border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[200px]">Channel</TableHead>
                        <TableHead className="text-center">Sent</TableHead>
                        <TableHead className="text-center">Viewed</TableHead>
                        <TableHead className="text-center">Responses</TableHead>
                        <TableHead className="text-center">
                          Conversion Rate
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.map((row, idx) => (
                        <TableRow key={idx} className="even:bg-muted/50">
                          <TableCell className="font-medium">
                            {row.channel}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {row.sent}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {row.viewed}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {row.responses}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {row.conversion}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="success"
                              className="bg-green-100 text-green-700 hover:bg-green-200 font-normal"
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Create Campaign Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Set up a new campaign to distribute your surveys
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input placeholder="Q1 Customer Feedback" className="mt-2" />
            </div>
            <div>
              <Label>Survey</Label>
              <Select defaultValue="satisfaction">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satisfaction">Customer Satisfaction Survey</SelectItem>
                  <SelectItem value="product">Product Feedback Collection</SelectItem>
                  <SelectItem value="employee">Employee Engagement Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Group</Label>
              <Select defaultValue="all">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="marketing">Marketing List</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" className="mt-2" />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" className="mt-2" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button>Create Campaign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Campaigns;
