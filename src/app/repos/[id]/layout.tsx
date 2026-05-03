import { DashboardProvider } from "@/src/lib/DashboardContext";
import { PublicTopNavbar } from "@/src/components/navigation/PublicTopNavbar";

export default function PublicRepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-zinc-50/50">
        <div className="flex-1 flex flex-col w-full transition-all">
          <PublicTopNavbar />
          <main className="flex-1 p-6 md:p-10 w-full max-w-[1400px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
