"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/src/lib/api";
import { LandingNav } from "@/src/app/_landing/LandingNav";
import { HeroSection } from "@/src/app/_landing/HeroSection";
import { PreviewSection } from "@/src/app/_landing/PreviewSection";
import { HowItWorksSection } from "@/src/app/_landing/HowItWorksSection";
import { WorkspaceCTA } from "@/src/app/_landing/WorkspaceCTA";

type AnalyzeResult = { success: boolean; repoId?: number; message?: string };

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [activeRepo, setActiveRepo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAnalyze = useCallback(async (url: string) => {
    setLoading(true);
    setError("");
    setActiveRepo(url);

    try {
      const data = await apiRequest<AnalyzeResult>("/api/public/analyze", {
        method: "POST",
        body: { url },
      });

      if (data.success && data.repoId) {
        router.push(`/repos/${data.repoId}`);
      } else {
        setError(data.message || "Failed to analyze repository. Please try again.");
        setActiveRepo(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setActiveRepo(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingNav />
      <HeroSection onAnalyze={handleAnalyze} loading={loading} activeRepo={activeRepo} error={error} />
      <PreviewSection />
      <HowItWorksSection />
      <WorkspaceCTA />
    </div>
  );
}
