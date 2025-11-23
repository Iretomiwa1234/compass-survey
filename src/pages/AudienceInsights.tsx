import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Upload } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AudienceInsights = () => {
  const insights = [
    {
      date: "07/05/2016",
      respondent: "Ronald Richards",
      channel: "Email",
      status: "Complete",
      action: "View",
    },
    {
      date: "16/08/2013",
      respondent: "Jerome Bell",
      channel: "SMS",
      status: "Complete",
      action: "View",
    },
    {
      date: "07/05/2016",
      respondent: "Floyd Miles",
      channel: "Whatsapp",
      status: "Complete",
      action: "View",
    },
    {
      date: "16/08/2013",
      respondent: "Brooklyn Simmons",
      channel: "QR-Code",
      status: "Complete",
      action: "View",
    },
    {
      date: "15/08/2017",
      respondent: "Darlene Robertson",
      channel: "Email",
      status: "Incomplete",
      action: "View",
    },
    {
      date: "15/08/2017",
      respondent: "Robert Fox",
      channel: "SMS",
      status: "Complete",
      action: "View",
    },
    {
      date: "07/05/2016",
      respondent: "Guy Hawkins",
      channel: "Whatsapp",
      status: "Complete",
      action: "View",
    },
    {
      date: "16/08/2013",
      respondent: "Savannah Nguyen",
      channel: "QR-Code",
      status: "Incomplete",
      action: "View",
    },
    {
      date: "18/09/2016",
      respondent: "Kathryn Murphy",
      channel: "Email",
      status: "Complete",
      action: "View",
    },
    {
      date: "15/08/2017",
      respondent: "Jacob Jones",
      channel: "SMS",
      status: "Incomplete",
      action: "View",
    },
    {
      date: "28/10/2012",
      respondent: "Dianne Russell",
      channel: "Whatsapp",
      status: "Complete",
      action: "View",
    },
    {
      date: "12/06/2020",
      respondent: "Jane Cooper",
      channel: "QR-Code",
      status: "Incomplete",
      action: "View",
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
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-6">
                Audience Insights
              </h1>

              <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for Contact"
                      className="pl-9 bg-background"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-[140px]">
                      <SelectValue placeholder="All Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Group</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="marketing">Marketing List</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-[140px]">
                      <SelectValue placeholder="All Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tag</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 w-full xl:w-auto">
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 xl:flex-none text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100"
                  >
                    <Download className="w-4 h-4" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 xl:flex-none text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100"
                  >
                    <Upload className="w-4 h-4" />
                    Export
                  </Button>
                  <Button className="gap-2 flex-1 xl:flex-none bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4" />
                    Add Contact
                  </Button>
                </div>
              </div>

              <div className="rounded-md border bg-card mb-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Respondent</TableHead>
                      <TableHead className="text-center">Channel</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-center text-muted-foreground">
                          {row.date}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {row.respondent}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {row.channel}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              row.status === "Complete"
                                ? "success"
                                : "destructive"
                            }
                            className={`font-normal ${
                              row.status === "Complete"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="link"
                            className="text-blue-600 h-auto p-0 font-semibold"
                          >
                            {row.action}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

export default AudienceInsights;
