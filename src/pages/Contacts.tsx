import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
  { name: "Marketing List", count: 720, description: "Main Market Comms List", created: "20/09/2025" },
  { name: "VIP Customers", count: 420, description: "High Value Clients", created: "20/09/2025" },
  { name: "General", count: 2560, description: "General List", created: "20/09/2025" },
];

const contacts = [
  { name: "Ronald Richards", email: "michelle.rivera@example.com", phone: "(208) 555-0112", group: "VIP Customers", tag: "Email", status: "Active" },
  { name: "Jerome Bell", email: "alma.lawson@example.com", phone: "(219) 555-0114", group: "General", tag: "SMS", status: "Active" },
  { name: "Floyd Miles", email: "michael.mitc@example.com", phone: "(270) 555-0117", group: "Marketing List", tag: "Whatsapp", status: "Active" },
  { name: "Brooklyn Simmons", email: "nathan.roberts@example.com", phone: "(405) 555-0128", group: "VIP Customers", tag: "QR-Code", status: "Active" },
  { name: "Darlene Robertson", email: "georgia.young@example.com", phone: "(229) 555-0109", group: "Marketing List", tag: "Email", status: "Active" },
  { name: "Robert Fox", email: "dolores.chambers@example.com", phone: "(316) 555-0116", group: "General", tag: "SMS", status: "Active" },
  { name: "Guy Hawkins", email: "debbie.baker@example.com", phone: "(704) 555-0127", group: "General", tag: "Whatsapp", status: "Active" },
  { name: "Savannah Nguyen", email: "jessica.hanson@example.com", phone: "(406) 555-0120", group: "General", tag: "QR-Code", status: "Active" },
];

const Contacts = () => {
  const [importOpen, setImportOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Group', 'Tag', 'Status'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(c => `"${c.name}","${c.email}","${c.phone}","${c.group}","${c.tag}","${c.status}"`)
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
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
          <DashboardHeader />
          
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setImportOpen(true)} className="gap-2">
                  <Download className="w-4 h-4" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExport} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Export
                </Button>
                <Button onClick={() => setAddContactOpen(true)}>
                  + Add Contact
                </Button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search for Contact" className="pl-10" />
              </div>
              <Select defaultValue="all-group">
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
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
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Contact Groups</h2>
                <Button variant="outline" onClick={() => setNewGroupOpen(true)} className="gap-2">
                  <Download className="w-4 h-4" />
                  New Group
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactGroups.map((group, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <span className="text-2xl font-bold">{group.count}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{group.description}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Created: {group.created}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">Name</th>
                        <th className="text-left p-4 font-medium text-sm">Email Address</th>
                        <th className="text-left p-4 font-medium text-sm">Phone Number</th>
                        <th className="text-left p-4 font-medium text-sm">Group</th>
                        <th className="text-left p-4 font-medium text-sm">Tag</th>
                        <th className="text-left p-4 font-medium text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">{contact.name}</td>
                          <td className="p-4 text-muted-foreground">{contact.email}</td>
                          <td className="p-4 text-muted-foreground">{contact.phone}</td>
                          <td className="p-4 text-muted-foreground">{contact.group}</td>
                          <td className="p-4 text-muted-foreground">{contact.tag}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                              {contact.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-center gap-2 p-4 border-t">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <span className="px-2">......</span>
                  <Button variant="outline" size="sm">50</Button>
                  <Button variant="outline" size="sm">Next</Button>
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
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">CSV or XLSX (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
              <Button>Import</Button>
            </div>
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
              <Input type="email" placeholder="john@company.com" className="mt-2" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="+1 555-0101" className="mt-2" />
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="New York, NY" className="mt-2" />
            </div>
            <div>
              <Label>Segment</Label>
              <Select defaultValue="smb">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="mid-market">Mid-Market</SelectItem>
                  <SelectItem value="smb">SMB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAddContactOpen(false)}>Cancel</Button>
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
            <div>
              <Label>Group Type</Label>
              <Select defaultValue="manual">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="dynamic">Dynamic (Auto-Update)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setNewGroupOpen(false)}>Cancel</Button>
              <Button>Create Group</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Contacts;
