import { apiRequest } from "@/src/lib/api/client";

export type Workspace = {
  id: number;
  name: string;
};

type WorkspacesResponse = {
  success: boolean;
  data: Workspace[];
};

export function getWorkspaces() {
  return apiRequest<WorkspacesResponse>("/api/workspaces", {
    method: "GET",
  });
}

export type WorkspaceRepo = {
  id: number;
  name: string;
  owner: string;
};

type WorkspaceReposResponse = {
  success: boolean;
  repos: WorkspaceRepo[];
};

export function getWorkspaceRepos(workspaceId: number) {
  return apiRequest<WorkspaceReposResponse>(`/api/workspaces/${workspaceId}/repos`, {
    method: "GET",
  });
}
