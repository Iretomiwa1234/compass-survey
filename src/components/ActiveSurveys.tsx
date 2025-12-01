import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Link2,
  TrendingUp,
  ClipboardList,
  BarChart3,
  Grid3x3,
  Users,
  Eye,
} from "lucide-react";

const surveys = [
  {
    name: "Customer Satisfaction Survey",
    status: "Active",
    responses: "1,520 Total Response",
    responseRate: "Response rate: 68%",
    created: "Created: 20/09/2025",
  },
  {
    name: "Product Feedback Collection",
    status: "Active",
    responses: "0 Total Response",
    responseRate: "Response rate: 0%",
    created: "Created: 22/09/2025",
  },
  {
    name: "Employee Engagement Study",
    status: "Active",
    responses: "1,520 Total Response",
    responseRate: "Response rate: 68%",
    created: "Created: 20/09/2025",
  },
  {
    name: "Product Market Survey",
    status: "Closed",
    responses: "1,520 Total Response",
    responseRate: "Response rate: 68%",
    created: "Created: 20/09/2025",
  },
];

export function ActiveSurveys() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Active surveys
          </CardTitle>
          <Button variant="link" className="text-primary h-auto p-0">
            View all Surveys
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {surveys.map((survey, idx) => (
          <div
            key={idx}
            className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
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

              <div className="flex gap-2 ml-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
