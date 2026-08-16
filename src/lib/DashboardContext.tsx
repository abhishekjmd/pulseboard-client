"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
export type TimeWindow = "overall" | 7 | 14 | 30;

interface DashboardContextType {
  window: TimeWindow;
  setWindow: (window: TimeWindow) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Default to Overall per the new requirement
  const [window, setWindow] = useState<TimeWindow>("overall");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ window, setWindow, isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}


export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
