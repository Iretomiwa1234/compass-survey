import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSocialListenings, SocialListening } from "@/lib/auth";

export function RecentProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<SocialListening[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    getSocialListenings()
      .then((data) => {
        if (!isActive) return;
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setProjects(sorted.slice(0, 3));
      })
      .catch(() => {
        if (!isActive) return;
        setProjects([]);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Recent Projects
          </CardTitle>
          <Button
            variant="link"
            className="text-primary h-auto p-0"
            onClick={() => navigate("/social-listening")}
          >
            New Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-lg space-y-2"
              >
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No projects yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate("/social-listening")}
            >
              <h4 className="font-semibold text-foreground mb-1">
                {project.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {project.mentions != null
                    ? `${Number(project.mentions).toLocaleString()} mentions`
                    : "—"}
                </span>
                <span>Created: {formatDate(project.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
