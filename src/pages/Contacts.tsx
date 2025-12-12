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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Upload, Download, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactGroups = [
  {
    name: "Marketing List",
    count: 720,
    description: "Main Market Comms List",
    created: "20/09/2025",
  },
  {
    name: "VIP Customers",
    count: 420,
    description: "High Value Clients",
    created: "20/09/2025",
  },
  {
    name: "General",
    count: 2560,
    description: "General List",
    created: "20/09/2025",
  },
];

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
];

const Contacts = () => {
  const [importOpen, setImportOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false); // FIXED

  const handleExport = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Group", "Tag", "Status"];
    const csvContent = [
      headers.join(","),
      ...contacts.map(
        (c) =>
          `"${c.name}","${c.email}","${c.phone}","${c.group}","${c.tag}","${c.status}"`
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `contacts_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-16">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Contacts" />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 rounded-md">
              <div className="relative flex-1 min-w-[180px] max-w-[280px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for Contact"
                  className="pl-10 bg-white border border-[#6A9CCE] h-9"
                />
              </div>
              <Select defaultValue="all-group">
                <SelectTrigger className="w-[140px] bg-white border border-[#6A9CCE] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-group">All Group</SelectItem>
                  <SelectItem value="marketing">Marketing List</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-tag">
                <SelectTrigger className="w-[120px] bg-white border border-[#6A9CCE] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-tag">All Tag</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">Whatsapp</SelectItem>
                  <SelectItem value="qr">QR-Code</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => setImportOpen(true)}
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-3"
                >
                  <Download className="w-4 h-4" />
                  Import
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setExportModalOpen(true)}
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-3"
                >
                  <Upload className="w-4 h-4" />
                  Export
                </Button>

                <Button
                  onClick={() => setAddContactOpen(true)}
                  className="bg-[#206AB5] hover:bg-[#1a5a9a] text-white h-9 px-3"
                >
                  + Add Contact
                </Button>
              </div>
            </div>

            <div className="mb-6 bg-white rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Contact Groups</h2>
                <Button
                  variant="outline"
                  onClick={() => setNewGroupOpen(true)}
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-9"
                >
                  <Download className="w-4 h-4" />
                  New Group
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactGroups.map((group, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex gap-4 items-center mb-3">
                      <h3 className="font-semibold text-base text-foreground">
                        {group.name}
                      </h3>
                      <span className="text-xs font-bold text-[#6C6C6C] bg-[#F2F2F2] py-1 px-2 rounded-full">
                        {group.count}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{group.description}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {group.created}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto bg-background p-3 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-[#F8FBFF]">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm text-gray-600">
                          Name
                        </th>
                        <th className="text-left p-4 font-medium text-sm text-gray-600">
                          Email Address
                        </th>
                        <th className="text-left p-4 font-medium text-sm text-gray-600">
                          Phone Number
                        </th>
                        <th className="text-left p-4 font-medium text-sm text-gray-600">
                          Group
                        </th>
                        <th className="text-left p-4 font-medium text-sm text-gray-600">
                          Tag
                        </th>
                        <th className="text-left p-4 font-medium text-sm text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 odd:bg-white even:bg-[#F8FBFF] hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="p-4 font-normal text-gray-900">
                            {contact.name}
                          </td>
                          <td className="p-4 text-gray-600">{contact.email}</td>
                          <td className="p-4 text-gray-600">{contact.phone}</td>
                          <td className="p-4">{contact.group}</td>
                          <td className="p-4 text-gray-600">{contact.tag}</td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-medium px-3 py-0.5 rounded-full">
                              {contact.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-center gap-1 p-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &lt;
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#206AB5] text-white hover:bg-[#1a5a9a] min-w-[32px]"
                  >
                    1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:bg-gray-100 min-w-[32px]"
                  >
                    2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:bg-gray-100 min-w-[32px]"
                  >
                    3
                  </Button>
                  <span className="px-2 text-gray-400">......</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:bg-gray-100 min-w-[32px]"
                  >
                    50
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &gt;
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>

      {/* Import Contacts Modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
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
      <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter the contact details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="John Doe" className="mt-2" />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="john@company.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="+234 60876081" className="mt-2" />
            </div>
            <div>
              <Label>Tag</Label>
              <Input placeholder="your tag" className="mt-2" />
            </div>
            <div>
              <Select defaultValue="All Group">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_group">All Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setAddContactOpen(false)}
              >
                Cancel
              </Button>
              <Button>Add Contact</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Group Modal */}
      <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a group to organize your contacts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Group Name</Label>
              <Input placeholder="Enterprise Customers" className="mt-2" />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="w-full border rounded-md p-2 mt-2 h-24 bg-background text-foreground"
                placeholder="Add a description for this group..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setNewGroupOpen(false)}>
                Cancel
              </Button>
              <Button>Create Group</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Contacts;
