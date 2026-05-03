"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";

type CreateWorkspaceProps = {
  onCreate: (name: string) => Promise<void>;
};

export function CreateWorkspace({ onCreate }: CreateWorkspaceProps) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setError(null);
    setIsCreating(true);

    try {
      await onCreate(name.trim());
      setName("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create workspace");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <Input
          placeholder="Enter workspace name..."
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isCreating}
          className="h-14 px-6 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all w-full sm:flex-1"
        />

        <button 
          type="submit" 
          disabled={isCreating} 
          className="h-14 px-8 rounded-2xl bg-zinc-900 text-white text-sm font-black uppercase tracking-widest transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50 w-full sm:w-auto shadow-xl shadow-zinc-200"
        >
          {isCreating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            "Create"
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
