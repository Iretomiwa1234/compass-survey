import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    name: "Optimal Brand",
    mentions: "200 New mentions",
    created: "Created: 20/09/2025",
  },
  {
    name: "Tesla",
    mentions: "20 New mentions",
    created: "Created: 22/09/2025",
  },
  {
    name: "Oks",
    mentions: "157 New mentions",
    created: "Created: 20/09/2025",
  },
];

export function RecentProjects() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
          <Button variant="link" className="text-primary h-auto p-0">
            New Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project, idx) => (
          <div 
            key={idx}
            className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <h4 className="font-semibold text-foreground mb-1">{project.name}</h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{project.mentions}</span>
              <span>{project.created}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
