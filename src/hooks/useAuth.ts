"use client";

import { useMemo } from "react";

export function useAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const login = (nextToken: string) => {
    localStorage.setItem("token", nextToken);
    document.cookie = "pb_auth=1; path=/; max-age=86400";
  };

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "pb_auth=; path=/; max-age=0";
  };

  return {
    isAuthenticated,
    login,
    logout,
    token,
  };
}
