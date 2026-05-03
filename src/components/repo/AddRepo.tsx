"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";

type AddRepoProps = {
  onAdd: (owner: string, name: string) => Promise<void>;
};

export function AddRepo({ onAdd }: AddRepoProps) {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!owner.trim() || !name.trim()) {
      setError("Owner and repository name are required");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onAdd(owner.trim(), name.trim());
      setOwner("");
      setName("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to add repository");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Owner (e.g. facebook)"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          disabled={isSubmitting}
          className="h-14 px-6 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all"
        />

        <Input
          placeholder="Repository name (e.g. react)"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isSubmitting}
          className="h-14 px-6 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all"
        />

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="sm:col-span-2 h-14 px-8 rounded-2xl bg-zinc-900 text-white text-sm font-black uppercase tracking-widest transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50 shadow-xl shadow-zinc-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Connecting...</span>
            </div>
          ) : (
            "Connect Repository"
          )}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-rose-600 animate-in shake-in duration-500">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
           </svg>
           <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}
    </div>
  );
}
