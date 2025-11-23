import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Edit, Users } from "lucide-react";

export interface Survey {
  id: string;
  title: string;
  status: "Active" | "Draft" | "Closed";
  totalResponse: number;
  responseRate: number;
  createdDate: string;
}

interface SurveyListItemProps {
  survey: Survey;
}

export function SurveyListItem({ survey }: SurveyListItemProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Draft":
        return "warning";
      case "Closed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground truncate">
              {survey.title}
            </h3>
            <Badge
              variant={getStatusVariant(survey.status)}
              className="shrink-0"
            >
              {survey.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>
                {survey.totalResponse.toLocaleString()} Total Response
              </span>
            </div>
            <div>Response rate: {survey.responseRate}%</div>
            <div>Created: {survey.createdDate}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {survey.status === "Draft" ? (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                <Eye className="w-3.5 h-3.5" />
                View
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
