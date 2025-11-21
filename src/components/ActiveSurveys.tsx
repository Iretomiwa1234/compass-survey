import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Link2, TrendingUp, ClipboardList, BarChart3, Grid3x3 } from "lucide-react";

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
          <CardTitle className="text-base font-semibold">Active surveys</CardTitle>
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
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">{survey.name}</h4>
                  <Badge variant={survey.status === "Active" ? "success" : "secondary"}>
                    {survey.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4">👥</span>
                    {survey.responses}
                  </span>
                  <span>{survey.responseRate}</span>
                  <span>{survey.created}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Link2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <TrendingUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ClipboardList className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <span className="w-px h-8 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-primary border-primary">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-primary border-primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
