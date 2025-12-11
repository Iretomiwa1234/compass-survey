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
import { Search, UserPlus, Upload, Download, Users, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface InsightRow {
  date: string;
  respondent: string;
  channel: string;
  status: string;
  action: string;
}

const AudienceInsights = () => {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InsightRow | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleImport = () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    toast.success("Contacts imported successfully");
    setImportModalOpen(false);
    setImportFile(null);
  };

  const handleExport = () => {
    const headers = ["Date", "Respondent", "Channel", "Status"];

    const csvContent = [
      headers.join(","),
      ...insights.map(
        (c) => `"${c.date}","${c.respondent}","${c.channel}","${c.status}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `audience_export_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onSubmitContact = (data: any) => {
    console.log(data);
    toast.success("Contact added successfully");
    setAddContactModalOpen(false);
    reset();
  };

  const handleViewRow = (row: InsightRow) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  const insights: InsightRow[] = [
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

  function setImportOpen(open: boolean): void {
    setImportModalOpen(open);
    if (!open) {
      setImportFile(null);
    }
  }

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

          <main className="flex-1 p-6 overflow-y-auto mt-[var(--nav-height)]">
            <div className="mb-8">
              <h1 className="text-xl font-semibold text-foreground mb-6">
                Audience Insights
              </h1>

              <div className="flex flex-col lg:flex-row gap-3 mb-6 items-start lg:items-center">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for Contact"
                      className="pl-9 bg-background"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full sm:w-[130px]">
                      <SelectValue placeholder="All Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Group</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="marketing">Marketing List</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full sm:w-[130px]">
                      <SelectValue placeholder="All Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tag</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 lg:flex-none text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setImportModalOpen(true)}
                  >
                    <Download className="w-4 h-4" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 lg:flex-none text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setExportModalOpen(true)}
                  >
                    <Upload className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    className="gap-2 flex-1 lg:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setAddContactModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Contact
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-card mb-6 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-background hover:bg-background">
                      <TableHead className="text-center font-medium text-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-center font-medium text-foreground">
                        Respondent
                      </TableHead>
                      <TableHead className="text-center font-medium text-foreground">
                        Channel
                      </TableHead>
                      <TableHead className="text-center font-medium text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-center font-medium text-foreground">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights.map((row, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/30">
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
                          <div className="flex justify-center">
                            <Badge
                              className={`font-normal border-0 ${
                                row.status === "Complete"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : "bg-red-50 text-red-700 hover:bg-red-50"
                              }`}
                            >
                              {row.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="link"
                            className="text-primary h-auto p-0 font-medium hover:text-primary/80"
                            onClick={() => handleViewRow(row)}
                          >
                            {row.action}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center">
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
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* View Row Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Respondent Details</DialogTitle>
            <DialogDescription>
              View the details of this survey respondent.
            </DialogDescription>
          </DialogHeader>
          {selectedRow && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Date</Label>
                  <p className="font-medium">{selectedRow.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Status</Label>
                  <div className="mt-1">
                    <Badge
                      className={`font-normal border-0 ${
                        selectedRow.status === "Complete"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {selectedRow.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Respondent</Label>
                <p className="font-medium">{selectedRow.respondent}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Channel</Label>
                <p className="font-medium">{selectedRow.channel}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import your contacts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Upload File</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV or XLSX (MAX. 5MB)
                    </p>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setImportOpen(false)}>
                Cancel
              </Button>
              <Button>Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Contacts</DialogTitle>
            <DialogDescription>
              Export your audience insights as a CSV file.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Contact Modal */}
      <Dialog open={addContactModalOpen} onOpenChange={setAddContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new contact to your audience
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmitContact)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Preferred Channel *</Label>
              <Select
                {...register("channel", { required: "Channel is required" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="qr-code">QR Code</SelectItem>
                </SelectContent>
              </Select>
              {errors.channel && (
                <p className="text-sm text-destructive">
                  {errors.channel.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select {...register("group")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="marketing">Marketing List</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                {...register("tags")}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddContactModalOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Contact</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AudienceInsights;

