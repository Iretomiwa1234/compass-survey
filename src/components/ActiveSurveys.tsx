import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Link2,
  TrendingUp,
  ClipboardList,
  BarChart3,
  Grid3x3,
  Eye,
  Users,
  Calendar,
  Target,
  CheckCircle2,
} from "lucide-react";
import { SurveyListItemApi } from "@/lib/auth";
import { EmptyState } from "./survey/EmptyState";

interface Survey {
  id: number;
  name: string;
  status: string;
  responses: string;
  responseRate: string;
  created: string;
  description?: string;
  targetAudience?: string;
  completedResponses?: number;
  inProgressResponses?: number;
}

type ActiveSurveysProps = {
  surveys?: SurveyListItemApi[];
};

export function ActiveSurveys({ surveys = [] }: ActiveSurveysProps) {
  const navigate = useNavigate();
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const displaySurveys = useMemo(() => {
    const sorted = [...surveys].sort((a, b) => b.survey_id - a.survey_id);
    return sorted.slice(0, 4).map((survey) => {
      const completion = Number.parseFloat(survey.completion_percentage || "0");
      const status = survey.status?.toLowerCase() || "draft";
      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

      return {
        id: survey.survey_id,
        name: survey.title,
        status: formattedStatus,
        responses: `${survey.total_responses.toLocaleString()} Total Response`,
        responseRate: `Response rate: ${completion}%`,
        created: `Created: ${survey.created_at}`,
        completedResponses: survey.total_responses,
        inProgressResponses: Number.parseInt(
          survey.pending_responses || "0",
          10,
        ),
      };
    });
  }, [surveys]);

  const handleView = (survey: Survey) => {
    setSelectedSurvey(survey);
    setDetailsOpen(true);
  };

  const handleAnalytics = () => {
    navigate("/survey-analysis");
  };

  const handleEdit = (survey: Survey) => {
    navigate("/create-survey", {
      state: {
        surveyId: survey.id,
        title: survey.name,
      },
    });
  };

  const handleCreateNew = () => {
    navigate("/create-survey");
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Active surveys
            </CardTitle>
            <Button
              variant="link"
              className="text-primary h-auto p-0"
              onClick={() => navigate("/survey-research")}
            >
              View all Surveys
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {displaySurveys.length > 0 ? (
            displaySurveys.map((survey, idx) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">
                        {survey.name}
                      </h4>
                      <Badge
                        variant={
                          survey.status === "Active" ? "success" : "secondary"
                        }
                      >
                        {survey.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {survey.responses}
                      </span>
                      <span>{survey.responseRate}</span>
                      <span>{survey.created}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {survey.status.toLowerCase() === "draft" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-primary border-primary"
                        onClick={() => handleEdit(survey)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-primary border-primary"
                          onClick={() => handleView(survey)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-primary border-primary"
                          onClick={handleAnalytics}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No active surveys"
              description="You don't have any surveys yet. Create one to start collecting insights."
              action={{
                label: "Create Survey",
                onClick: handleCreateNew,
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Survey Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSurvey?.name}
              <Badge
                variant={
                  selectedSurvey?.status === "Active" ? "success" : "secondary"
                }
              >
                {selectedSurvey?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedSurvey && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Description
                </h4>
                <p className="text-sm text-foreground">
                  {selectedSurvey.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Audience
                </h4>
                <p className="text-sm text-foreground">
                  {selectedSurvey.targetAudience}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Completed
                  </div>
                  <p className="text-xl font-semibold text-foreground">
                    {selectedSurvey.completedResponses?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    In Progress
                  </div>
                  <p className="text-xl font-semibold text-foreground">
                    {selectedSurvey.inProgressResponses?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {selectedSurvey.created}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setDetailsOpen(false);
                    handleAnalytics();
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
