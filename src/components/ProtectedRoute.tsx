import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getAuthToken } from "@/lib/session";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, error } = useCurrentUser();
  const token = getAuthToken();
  const navigate = useNavigate();

  // If there's an error indicating session expired
  useEffect(() => {
    if (error && error.includes("Session expired")) {
      navigate("/login?sessionExpired=true", { replace: true });
    }
  }, [error, navigate]);

  // If there's no token, redirect to login
  if (!token && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  // If still loading, show a minimal loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#E2E8F0] border-t-[#206AB5] rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an error and no user, they're not authenticated
  if (error && !user && !token) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return <>{children}</>;
}
