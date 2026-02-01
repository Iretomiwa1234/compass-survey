import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users,
  Edit,
  Trash2,
  MessageSquare,
  TrendingUp,
  Smile,
  Award,
  Loader2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/session";
import {
  getSocialListenings,
  createSocialListening,
  editSocialListening,
  deleteSocialListening,
  type SocialListening as SocialListeningType,
} from "@/lib/auth";

const SocialListening = () => {
  const navigate = useNavigate();
  const [monitorItems, setMonitorItems] = useState<SocialListeningType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    mentions: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SocialListeningType | null>(null);
  const [editForm, setEditForm] = useState({ title: "", mentions: "" });

  // Check authentication and fetch data
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const projects = await getSocialListenings();
      setMonitorItems(projects);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch projects";
      toast.error(message);
      if (message.includes("Not authenticated") || message.includes("Session expired")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: SocialListeningType) => {
    setSelectedItem(item);
    setEditForm({ 
      title: item.title, 
      mentions: String(item.mentions) 
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      const updated = await editSocialListening(selectedItem.id, {
        title: editForm.title,
        mentions: parseInt(editForm.mentions) || 0,
      });
      
      setMonitorItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditModalOpen(false);
      toast.success("Project updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update project";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: SocialListeningType) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await deleteSocialListening(selectedItem.id);
      setMonitorItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      toast.success("Project deleted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete project";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newForm.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createSocialListening({
        title: newForm.title,
        mentions: parseInt(newForm.mentions) || 0,
      });
      
      setMonitorItems((prev) => [...prev, created]);
      setNewForm({ title: "", mentions: "" });
      setAddModalOpen(false);
      toast.success("Project created successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return dateString;
    }
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
          <DashboardHeader headerTitle="Social Listening" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="mb-4 sm:mb-6">
                <div className="rounded-xl border border-border bg-card px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                  <h2 className="text-md font-semibold text-foreground">
                    Optimal Brand
                  </h2>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <MessageSquare className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Mentions
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          {monitorItems.reduce((acc, item) => acc + (item.mentions || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 mt-2">
                          +23% vs last week
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Engagement Rate
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-foreground">8.7%</p>
                    <p className="text-xs text-red-600 mt-2">+23% vs last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Smile className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Sentiment</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="8"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="hsl(142 76% 36%)"
                            strokeWidth="8"
                            strokeDasharray="220"
                            strokeDashoffset="88"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">60%</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Positive</span>
                          <span className="font-semibold text-green-600">1,404</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Neutral</span>
                          <span className="font-semibold text-orange-500">819</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Negative</span>
                          <span className="font-semibold text-red-600">117</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Top Platform</p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <h3 className="font-bold text-foreground">Instagram</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">450 Mentions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Projects Section */}
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Projects</h3>
                  <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path strokeLinecap="round" strokeWidth="2" d="M12 8v8M8 12h8"/>
                    </svg>
                    Create new project
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : monitorItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No projects yet. Create your first project!</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {monitorItems.map((item) => (
                      <Card key={item.id} className="hover:bg-accent/5 transition-colors">
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{item.mentions?.toLocaleString() || 0} Mentions</span>
                              </div>
                              <span>Created: {formatDate(item.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-primary bg-primary/5 border-primary/20 hover:bg-primary/10"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-destructive bg-destructive/5 border-destructive/20 hover:bg-destructive/10"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {monitorItems.length > 0 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
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
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Create New Project Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="Enter project title"
              />
            </div>

            <div>
              <Label>Mentions</Label>
              <Input
                type="number"
                value={newForm.mentions}
                onChange={(e) => setNewForm({ ...newForm, mentions: e.target.value })}
                placeholder="e.g. 100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mt-2">Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div>
              <Label className="mt-2">Mentions</Label>
              <Input
                type="number"
                value={editForm.mentions}
                onChange={(e) => setEditForm({ ...editForm, mentions: e.target.value })}
                placeholder="Mentions count"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default SocialListening;
