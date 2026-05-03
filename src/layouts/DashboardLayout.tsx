import type { ReactNode } from "react";
import { Sidebar } from "@/src/components/navigation/Sidebar";
import { TopNavbar } from "@/src/components/navigation/TopNavbar";
import { ProtectedRoute } from "@/src/components/navigation/ProtectedRoute";
import { DashboardProvider } from "@/src/lib/DashboardContext";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <div className="flex min-h-screen bg-zinc-50/50">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64 w-full transition-all">
            <TopNavbar />
            <main className="flex-1 p-6 md:p-10 w-full max-w-[1400px] mx-auto">
              {children}
            </main>
          </div>
        </div>
      </DashboardProvider>
    </ProtectedRoute>
  );
}
