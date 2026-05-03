import { apiRequest } from "@/src/lib/api/client";

type AuthResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

export function signup(payload: { name: string; email: string; password: string }) {
  return apiRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}
