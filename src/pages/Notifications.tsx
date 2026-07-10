import { Bell } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Notifications() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F7FAFE]">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader headerTitle="Notifications" hideGreeting />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 max-w-sm text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  No notifications yet
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When you get notifications, they'll show up here. Stay tuned!
                </p>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
