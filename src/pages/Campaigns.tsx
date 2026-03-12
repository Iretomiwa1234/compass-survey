import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Plus, Users, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getSurveys, SurveyListItemApi } from "@/lib/auth";

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

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
};

const Campaigns = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(true);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let page = 1;
    const all: SurveyListItemApi[] = [];
    const fetchAll = async () => {
      try {
        while (true) {
          const res = await getSurveys(page);
          const items: SurveyListItemApi[] =
            (res as any)?.data?.survey?.data ?? [];
          if (!items.length) break;
          all.push(...items);
          if (items.length < 10) break;
          page++;
        }
        setSurveys(all);
      } finally {
        setIsLoadingSurveys(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectSurvey = (id: number) => {
    setSelectedSurveyId(id);
    const match = surveys.find((s) => s.survey_id === id);
    if (match) setSearchTerm(match.title);
    setShowSuggestions(false);
  };

  const filteredSurveys = useMemo(() => {
    if (!searchTerm.trim()) return surveys;
    return surveys.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [surveys, searchTerm]);

  const selectedSurvey = useMemo(
    () => surveys.find((s) => s.survey_id === selectedSurveyId) ?? null,
    [surveys, selectedSurveyId],
  );

  const surveyStatus = selectedSurvey
    ? selectedSurvey.is_published
      ? {
          label: "Active",
          className: "bg-green-100 text-green-700 hover:bg-green-200",
        }
      : selectedSurvey.status === "draft"
        ? {
            label: "Draft",
            className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
          }
        : {
            label: selectedSurvey.status,
            className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
          }
    : null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 h-12">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <DashboardHeader headerTitle="Distribution Campaigns" hideGreeting />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-8">
              {/* Survey search bar */}
              <div className="rounded-xl flex items-center justify-between border border-[#dce8f5] bg-white px-2 py-2 shadow-sm sm:px-3 sm:py-3 mb-6">
                <h2 className="text-md font-normal text-[#2b3a4f] hidden md:block">
                  {selectedSurvey ? selectedSurvey.title : "Select a Survey"}
                </h2>

                <div className="flex items-center gap-2 ml-auto">
                  <div className="relative w-[200px]" ref={searchRef}>
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for survey…"
                      className="pl-9 bg-background h-9"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        window.setTimeout(() => setShowSuggestions(false), 150)
                      }
                    />
                    {showSuggestions && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingSurveys ? (
                          <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ) : filteredSurveys.length === 0 ? (
                          <p className="p-3 text-sm text-muted-foreground">
                            No surveys found
                          </p>
                        ) : (
                          filteredSurveys.map((s) => (
                            <button
                              key={s.survey_id}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectSurvey(s.survey_id)}
                            >
                              {s.title}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Select
                    value={
                      selectedSurveyId ? String(selectedSurveyId) : undefined
                    }
                    onValueChange={(v) => handleSelectSurvey(Number(v))}
                  >
                    <SelectTrigger className="w-[160px] h-9 bg-white border border-border">
                      <SelectValue placeholder="Select Survey" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingSurveys && (
                        <SelectItem value="loading" disabled>
                          Loading…
                        </SelectItem>
                      )}
                      {!isLoadingSurveys && surveys.length === 0 && (
                        <SelectItem value="empty" disabled>
                          No surveys found
                        </SelectItem>
                      )}
                      {surveys.map((s) => (
                        <SelectItem
                          key={s.survey_id}
                          value={String(s.survey_id)}
                        >
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Survey detail + table */}
              {!selectedSurvey ? (
                <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center py-18 text-center max-w-md border border-border shadow-sm mx-auto mt-[8%]">
                  <Inbox className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
                  <p className="text-muted-foreground text-sm">
                    Search and select a survey above to view its campaign
                    performance.
                  </p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg">
                  <Card className="mb-8">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-md font-normal text-foreground">
                            {selectedSurvey.title}
                          </h2>
                          {surveyStatus && (
                            <Badge className={surveyStatus.className}>
                              {surveyStatus.label}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>
                              {(
                                selectedSurvey.total_responses ?? 0
                              ).toLocaleString()}{" "}
                              Total Response
                            </span>
                          </div>
                          <span>
                            Response rate:{" "}
                            {selectedSurvey.completion_percentage != null
                              ? `${selectedSurvey.completion_percentage}%`
                              : "—"}
                          </span>
                          <span>
                            Created:{" "}
                            {selectedSurvey.created_at
                              ? formatDate(selectedSurvey.created_at)
                              : "—"}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          navigate(
                            `/channels?survey_id=${selectedSurvey.survey_id}`,
                          )
                        }
                        className="gap-2 bg-[#206AB5]"
                      >
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
                            <TableHead className="text-center">
                              Viewed
                            </TableHead>
                            <TableHead className="text-center">
                              Responses
                            </TableHead>
                            <TableHead className="text-center">
                              Conversion Rate
                            </TableHead>
                            <TableHead className="text-center">
                              Status
                            </TableHead>
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
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 font-normal">
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
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Campaigns;
