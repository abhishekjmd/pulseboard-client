"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
export type TimeWindowDays = 7 | 14 | 30;

interface DashboardContextType {
  window: TimeWindowDays;
  setWindow: (window: TimeWindowDays) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [window, setWindow] = useState<TimeWindowDays>(7);
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
