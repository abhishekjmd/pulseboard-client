"use client";

import { useEffect, useState, useCallback } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };

    const onAuthChanged = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("pb-auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pb-auth-changed", onAuthChanged);
    };
  }, []);

  const login = useCallback((nextToken: string) => {
    localStorage.setItem("token", nextToken);
    document.cookie = "pb_auth=1; path=/; max-age=86400; SameSite=Lax";
    // notify same-tab listeners
    window.dispatchEvent(new Event("pb-auth-changed"));
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    document.cookie = "pb_auth=; path=/; max-age=0; SameSite=Lax";
    window.dispatchEvent(new Event("pb-auth-changed"));
    setToken(null);
  }, []);

  return {
    isAuthenticated: Boolean(token),
    login,
    logout,
    token,
  };
}
