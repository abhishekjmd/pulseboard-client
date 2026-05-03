import { apiRequest } from "@/src/lib/api/client";

export function connectRepository(payload: { workspaceId: number; owner: string; repo: string }) {
  return apiRequest<{ message: string }>("/api/repos/connect", {
    method: "POST",
    body: payload,
  });
}

export function syncRepositoryCommits(repoId: number) {
  return apiRequest<{ success: boolean; message: string; count: number }>(`/api/repos/${repoId}/sync-commits`, {
    method: "POST",
  });
}
