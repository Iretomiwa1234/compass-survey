import { Search, Bell, ChevronDown, LogOut, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { clearAuthSession } from "@/lib/session";

function getInitials(fname: string, sname: string): string {
  return `${fname.charAt(0)}${sname.charAt(0)}`.toUpperCase();
}

type DashboardHeaderProps = {
  headerTitle?: string;
  hideGreeting?: boolean;
};

export function DashboardHeader({
  headerTitle,
  hideGreeting = false,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { user, error, refetch } = useCurrentUser();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const handleRetryProfile = () => {
    refetch();
  };

  const userInitials = user ? getInitials(user.fname, user.sname) : "??";
  const userDisplayName = user ? `${user.fname} ${user.sname}` : "User";
  const userEmail = user?.email || "";

  const hasProfileError = Boolean(error && !user);
  return (
    <>
      <header className="h-16 bg-[#F7FAFE] px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex-1 max-w-xl">
          {!headerTitle ? (
            <div
              className={`${hideGreeting ? "hidden md:flex" : "flex"} flex-col`}
            >
              <h2 className="text-base font-semibold text-foreground">
                Good Morning, {user?.fname || "Guest"}
              </h2>
              <p className="text-xs text-muted-foreground">
                What do you want to do today?
              </p>
            </div>
          ) : (
            <h2 className="font-semibold text-xl text-[#48556B]">
              {headerTitle}
            </h2>
          )}
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search anything"
              className="pl-10 pr-24 bg-white border-border"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Cmd/Ctrl + K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#206AB5] rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="w-9 h-9 bg-[#206AB5]/10">
                  <AvatarFallback className="text-primary text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {userDisplayName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={8}>
              <DropdownMenuItem onSelect={handleLogout}>
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {hasProfileError && (
        <div className="sticky top-16 z-10 flex items-center justify-between gap-3 px-6 py-2 text-sm text-amber-900 bg-amber-100 border border-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-900" />
            <span>
              We couldn’t load your profile details. Please try again.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetryProfile}
            className="text-amber-900"
          >
            Retry
          </Button>
        </div>
      )}
    </>
  );
}
