"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { apiRequest } from "@/src/lib/api";

type RepoItem = {
  githubId: string;
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
};

type AddRepoProps = {
  workspaceId: number | null;
  githubConnected: boolean;
  onAdd: (githubId: string) => Promise<void>;
  onClose?: () => void;
};

export function AddRepo({ workspaceId, githubConnected, onAdd, onClose }: AddRepoProps) {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(30);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!githubConnected) return;
    loadRepos(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [githubConnected, page]);

  async function loadRepos(nextPage: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; repositories: RepoItem[]; page: number; perPage: number; hasNextPage: boolean }>(`/api/github/repositories?page=${nextPage}&per_page=${perPage}`);
      setRepos(res.repositories);
      setHasNext(res.hasNextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load repositories");
    } finally {
      setLoading(false);
    }
  }

  const handleConnectGitHub = async () => {
    setLoading(true);
    try {
      const resp = await apiRequest<{ success: boolean; url: string }>("/api/github/oauth/start");
      window.location.href = resp.url;
    } catch (err) {
      setError("Failed to start GitHub OAuth");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selected || !workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      await onAdd(selected);
      if (onClose) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect repository");
    } finally {
      setLoading(false);
    }
  };

  if (!githubConnected) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-lg font-black">Connect GitHub</h3>
          <p className="text-sm text-zinc-500">Connect your GitHub account to browse and add repositories.</p>
          <div>
            <Button onClick={handleConnectGitHub} disabled={loading}>Connect GitHub</Button>
          </div>
          {error && <p className="text-rose-600">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-black">Select a repository</h3>
        <p className="text-sm text-zinc-500">Pick a repository to connect to this workspace.</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-rose-600">{error}</p>
        ) : repos.length === 0 ? (
          <p className="text-zinc-500">No repositories found.</p>
        ) : (
          repos.map((r) => (
            <div key={r.githubId} className={`p-3 border rounded-md flex items-center justify-between ${selected === r.githubId ? 'border-zinc-900' : 'border-zinc-100'}`}>
              <div>
                <div className="font-bold">{r.fullName}</div>
                <div className="text-xs text-zinc-500">{r.defaultBranch} • {r.htmlUrl}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-zinc-500">{r.private ? '🔒 Private' : '🌐 Public'}</div>
                <input type="radio" name="repo" checked={selected === r.githubId} onChange={() => setSelected(r.githubId)} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>Prev</Button>
          <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNext || loading}>Next</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleConnect} disabled={!selected || loading}>Connect</Button>
        </div>
      </div>
    </div>
  );
}
