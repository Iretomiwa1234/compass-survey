import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { clearAuthSession, onSessionExpired } from "@/lib/session";

const AUTH_PAGES = new Set(["/login", "/register", "/verification", "/auth"]);

export function SessionExpiredModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSessionExpired(() => {
      if (AUTH_PAGES.has(window.location.pathname)) return;
      setOpen(true);
    });

    return unsubscribe;
  }, []);

  const handleLoginAgain = () => {
    clearAuthSession();
    setOpen(false);
    navigate("/login?sessionExpired=true", { replace: true });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Session expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please log in again to continue using
            Compass Survey.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="w-full bg-[#206AB5] hover:bg-[#185287]"
            onClick={handleLoginAgain}
          >
            Login again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
