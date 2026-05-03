"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_ROUTES } from "@/src/routes/routes";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(APP_ROUTES.login);
    }
  }, [isAuthenticated, router, pathname, mounted]);

  // Prevent hydration mismatch by rendering nothing (or a consistent loader) on server
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50/50" />;
  }

  if (!isAuthenticated) {
    return <div className="p-6 text-sm text-slate-600">Redirecting to login...</div>;
  }

  return <>{children}</>;
}

