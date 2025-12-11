import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Pencil, Users } from "lucide-react";

export interface Survey {
  id: string;
  title: string;
  status: string;
  totalResponse: number;
  responseRate: number;
  createdDate: string;
  description?: string;
  targetAudience?: string;
}

interface SurveyListItemProps {
  survey: Survey;
  onView?: (survey: Survey) => void;
  onAnalytics?: (survey: Survey) => void;
  onEdit?: (survey: Survey) => void;
}

<<<<<<< Updated upstream
export const SurveyListItem = ({
  survey,
  onView,
  onAnalytics,
  onEdit,
}: SurveyListItemProps) => {
=======
export const SurveyListItem = ({ survey, onView, onAnalytics, onEdit }: SurveyListItemProps) => {
>>>>>>> Stashed changes
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600 border-green-200";
      case "draft":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "closed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const isDraft = survey.status.toLowerCase() === "draft";

  return (
    <Card className="hover:shadow-md transition-shadow border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-foreground truncate">
                {survey.title}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                  survey.status
                )}`}
              >
                {survey.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {survey.totalResponse.toLocaleString()} Total Response
              </span>
              <span>Response rate: {survey.responseRate}%</span>
              <span>Created: {survey.createdDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDraft ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground border-border hover:bg-muted"
                onClick={() => onEdit?.(survey)}
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
<<<<<<< Updated upstream
                  className="gap-2 bg-[#EDF3FF] hover:bg-muted text-[#185287]"
=======
                  className="gap-2 bg-[#206AB5] hover:bg-[#185287] text-white"
>>>>>>> Stashed changes
                  onClick={() => onView?.(survey)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-muted-foreground border-border hover:bg-muted"
                  onClick={() => onAnalytics?.(survey)}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Analytics
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
