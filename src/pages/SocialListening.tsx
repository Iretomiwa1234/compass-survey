import { useState } from "react";
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
  Plus,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
interface MonitorItem {
  title: string;
  mentions: string;
  subMentions?: string;
  created: string;
}

const SocialListening = () => {
    const [monitorItems, setMonitorItems] = useState<MonitorItem[]>([
    {
      title: "Optimal Brand",
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
    {
      title: "#Charging Speed",
      mentions: "100 New Mentions",
      created: "15/09/2025",
    },
    {
      title: "#Breakfast Meals",
      mentions: "100 New Mentions",
      created: "12/09/2025",
    },
    {
      title: "Method Acting",
      mentions: "100 New Mentions",
      created: "10/09/2025",
    },
    {
      title: "Customer Review",
      mentions: "100 New Mentions",
      created: "6/09/2025",
    },
  ]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    mentions: "",
    created: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MonitorItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", mentions: "", created: "" });

  const handleEdit = (item: MonitorItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setEditForm({ title: item.title, mentions: item.mentions, created: item.created });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedIndex !== null) {
      const updated = [...monitorItems];
      updated[selectedIndex] = { ...updated[selectedIndex], ...editForm };
      setMonitorItems(updated);
      setEditModalOpen(false);
    }
  };

  const handleDelete = (item: MonitorItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIndex !== null) {
      setMonitorItems(monitorItems.filter((_, i) => i !== selectedIndex));
      setDeleteDialogOpen(false);
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
              {/* <h1 className="text-xl font-semibold text-foreground mb-6">
                Social Listening
              </h1> */}
              <div className="mb-4 sm:mb-6">
                <div className="rounded-xl border border-[#dce8f5] bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                  <h2 className="text-md font-semibold text-[#2b3a4f]">
                    Optimal Brand
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <MessageSquare className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Mentions
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          2,345
                        </p>
                        <p className="text-xs text-green-600 mt-2">
                          +23% vs last week
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                      >
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-pink-50"
                      >
                        <svg
                          className="w-4 h-4 text-pink-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 text-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                      >
                        <svg
                          className="w-4 h-4 text-blue-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-orange-50">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Engagement Rate
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          8.7%
                        </p>
                        <p className="text-xs text-red-600 mt-2">
                          +23% vs last week
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                      >
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-pink-50"
                      >
                        <svg
                          className="w-4 h-4 text-pink-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 text-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                      >
                        <svg
                          className="w-4 h-4 text-blue-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-green-50">
                            <Smile className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Sentiment
                          </p>
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
                              <span className="text-muted-foreground">
                                Positive
                              </span>
                              <span className="font-semibold text-green-600">
                                1,404
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Neutral
                              </span>
                              <span className="font-semibold text-orange-500">
                                819
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Negative
                              </span>
                              <span className="font-semibold text-red-600">
                                117
                              </span>
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
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 rounded-lg bg-purple-50">
                            <Award className="w-5 h-5 text-purple-600" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Top Platform
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <svg
                            className="w-8 h-8 text-pink-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          <h3 className="font-bold text-foreground">
                            Instagram
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          450 Mentions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="p-4 rounded-lg bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Projects
                  </h3>
                  <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeWidth="2" d="M12 8v8M8 12h8"/>
                  </svg>
                  Create new project
                </Button>
                </div>

                <div className="space-y-4 mb-8">
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
                          onClick={() => handleEdit(item, idx)}
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 bg-red-50 border-red-100 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleDelete(item, idx)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                {/* Create New Project Modal */}
<Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Create Project</DialogTitle>
      <DialogDescription>Fill in the details to create a new project.</DialogDescription>
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
          value={newForm.mentions}
          onChange={(e) => setNewForm({ ...newForm, mentions: e.target.value })}
          placeholder="e.g. 100 New Mentions"
        />
      </div>

      <div>
        <Label>Created Date</Label>
        <Input
          type="date"
          value={newForm.created}
          onChange={(e) => setNewForm({ ...newForm, created: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => setAddModalOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setMonitorItems([
              ...monitorItems,
              {
                title: newForm.title,
                mentions: newForm.mentions,
                created: newForm.created,
              },
            ]);

            setNewForm({ title: "", mentions: "", created: "" });
            setAddModalOpen(false);
          }}
        >
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
                <DialogDescription>Update the project details below.</DialogDescription>
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
                    value={editForm.mentions}
                    onChange={(e) => setEditForm({ ...editForm, mentions: e.target.value })}
                    placeholder="Mentions count"
                  />
                </div>
                <div>
                  <Label className="mt-2">Created Date</Label>
                  <Input
                    value={editForm.created}
                    onChange={(e) => setEditForm({ ...editForm, created: e.target.value })}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
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
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </SidebarProvider>
  );
};

export default SocialListening;
