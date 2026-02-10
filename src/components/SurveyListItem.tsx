import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Pencil, Users, X } from "lucide-react";

export interface Survey {
  id: string;
  title: string;
  status: string;
  isPublished?: number;
  displayStatus?: string;
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
  onClose?: (survey: Survey) => void;
}

// export const SurveyListItem = ({
//   survey,
//   onView,
//   onAnalytics,
//   onEdit,
// }: SurveyListItemProps) => {
export const SurveyListItem = memo(
  ({ survey, onView, onAnalytics, onEdit, onClose }: SurveyListItemProps) => {
    const getDisplayStatus = (status: string, isPublished: boolean) => {
      // Priority: is_published takes precedence
      if (isPublished) return "Published";

      // If not published, check status
      switch (status) {
        case "draft":
          return "Draft";
        case "active":
          return "Template";
        case "close":
          return "Closed";
        case "pending":
          return "Pending";
        default:
          return status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Draft";
      }
    };

    const getStatusColor = (status: string, isPublished: boolean) => {
      if (isPublished) {
        return "bg-green-100 text-green-600 border-green-200";
      }
      if (!status && !isPublished) {
        return "bg-orange-100 text-orange-600 border-orange-200";
      }

      switch (status) {
        case "draft":
          return "bg-orange-100 text-orange-600 border-orange-200";
        case "active":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "close":
          return "bg-gray-100 text-gray-600 border-gray-200";
        case "pending":
          return "bg-blue-100 text-blue-600 border-blue-200";
        default:
          return "bg-gray-100 text-gray-600 border-gray-200";
      }
    };

    const normalizedStatus = survey.status?.trim().toLowerCase() ?? "";
    const isPublished = Number(survey.isPublished ?? 0) === 1;
    const displayStatus =
      survey.displayStatus ?? getDisplayStatus(normalizedStatus, isPublished);
    const statusClass = getStatusColor(normalizedStatus, isPublished);
    const isDraft = normalizedStatus === "draft" && !isPublished;
    const isClosed = normalizedStatus === "close";

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
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${statusClass}`}
                >
                  {displayStatus}
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
                    // className="gap-2 bg-[#EDF3FF] hover:bg-muted text-[#185287]"
                    className="gap-2 bg-[#206AB5] hover:bg-[#185287] text-white"
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
              {!isClosed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-transparent"
                  onClick={() => onClose?.(survey)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);
