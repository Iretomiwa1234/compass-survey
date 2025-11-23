import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
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

const Contacts = () => {
  const contacts = [
    {
      name: "Ronald Richards",
      email: "michelle.rivera@example.com",
      phone: "(208) 555-0112",
      group: "VIP Customers",
      tag: "Email",
      status: "Active",
    },
    {
      name: "Jerome Bell",
      email: "alma.lawson@example.com",
      phone: "(219) 555-0114",
      group: "General",
      tag: "SMS",
      status: "Active",
    },
    {
      name: "Floyd Miles",
      email: "michael.mitc@example.com",
      phone: "(270) 555-0117",
      group: "Marketing List",
      tag: "Whatsapp",
      status: "Active",
    },
    {
      name: "Brooklyn Simmons",
      email: "nathan.roberts@example.com",
      phone: "(405) 555-0128",
      group: "VIP Customers",
      tag: "QR-Code",
      status: "Active",
    },
    {
      name: "Darlene Robertson",
      email: "georgia.young@example.com",
      phone: "(229) 555-0109",
      group: "Marketing List",
      tag: "Email",
      status: "Active",
    },
    {
      name: "Robert Fox",
      email: "dolores.chambers@example.com",
      phone: "(316) 555-0116",
      group: "General",
      tag: "SMS",
      status: "Active",
    },
    {
      name: "Guy Hawkins",
      email: "debbie.baker@example.com",
      phone: "(704) 555-0127",
      group: "General",
      tag: "Whatsapp",
      status: "Active",
    },
    {
      name: "Savannah Nguyen",
      email: "jessica.hanson@example.com",
      phone: "(406) 555-0120",
      group: "General",
      tag: "QR-Code",
      status: "Active",
    },
    {
      name: "Kathryn Murphy",
      email: "bill.sanders@example.com",
      phone: "(319) 555-0115",
      group: "General",
      tag: "Email",
      status: "Active",
    },
    {
      name: "Jacob Jones",
      email: "debra.holt@example.com",
      phone: "(702) 555-0122",
      group: "General",
      tag: "SMS",
      status: "Active",
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
                Contacts
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

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Contact Groups
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">
                          Marketing List
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600"
                        >
                          720
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Main Market Comms List</span>
                        </div>
                        <span>Created: 20/09/2025</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">
                          VIP Customers
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600"
                        >
                          420
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>High Value Clients</span>
                        </div>
                        <span>Created: 20/09/2025</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">General</h3>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600"
                        >
                          2560
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>General List</span>
                        </div>
                        <span>Created: 20/09/2025</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="rounded-md border bg-card mb-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact, idx) => (
                      <TableRow key={idx} className="even:bg-muted/50">
                        <TableCell className="font-medium text-foreground">
                          {contact.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contact.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contact.phone}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contact.group}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contact.tag}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="success"
                            className="bg-green-100 text-green-700 hover:bg-green-200 font-normal"
                          >
                            {contact.status}
                          </Badge>
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

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default Contacts;
