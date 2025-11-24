import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export interface Survey {
  id: string;
  title: string;
  status: string;
  totalResponse: number;
  responseRate: number;
  createdDate: string;
}

interface SurveyListItemProps {
  survey: Survey;
}

export const SurveyListItem = ({ survey }: SurveyListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-orange-100 text-orange-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 truncate">
              {survey.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  survey.status
                )}`}
              >
                {survey.status}
              </span>
              <span>{survey.totalResponse} Total Response</span>
              <span>Response rate {survey.responseRate}%</span>
              <span>Created {survey.createdDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:text-blue-700"
            >
              <Eye className="w-3 h-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 bg-red-50 border-red-100 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
