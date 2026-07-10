import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export function NotificationDropdown() {
  const navigate = useNavigate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#206AB5] rounded-full" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 rounded-xl shadow-lg border-border"
      >
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Bell className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Nothing to see here yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your notifications will appear here
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-xs text-primary hover:text-foreground h-auto py-1 px-1"
            onClick={() => navigate("/notifications")}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
