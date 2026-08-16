"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/Input";
import { login as loginApi, signup as signupApi } from "@/src/lib/api/auth";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_ROUTES } from "@/src/routes/routes";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signupApi({ name, email, password });
      const loginResponse = await loginApi({ email, password });
      if (!loginResponse.token) {
        throw new Error("Account created, but login token is missing");
      }
      login(loginResponse.token);
      router.push(APP_ROUTES.dashboard);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Left brand panel - Immersive & Premium */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between p-12 relative overflow-hidden shrink-0">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-pulse-slow" 
          style={{ backgroundImage: 'url("/brand-bg.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-zinc-900/80 to-indigo-900/90 z-10" />
        
        {/* Abstract shapes for depth */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] z-20 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-violet-500/20 rounded-full blur-[120px] z-20 animate-blob animation-delay-2000" />

        <div className="relative z-30 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-2xl">
            <span className="text-white font-black text-lg">P</span>
          </div>
          <span className="text-white font-extrabold tracking-tight text-xl">Pulseboard</span>
        </div>

        <div className="relative z-30 space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-[0.2em]">JOIN PULSEBOARD</p>
            </div>
            <h2 className="text-white text-4xl font-bold leading-tight tracking-tight">
              Engineering visibility<br />without the spreadsheet.
            </h2>
            <p className="text-zinc-300 text-base font-normal leading-relaxed">
              Connect GitHub repositories and understand engineering activity, PR health, and repository trends.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3 text-sm text-zinc-200 font-medium">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <span>✓</span>
              <span className="text-zinc-200">Private repository support</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-400">
              <span>✓</span>
              <span className="text-zinc-200">PR + commit analytics</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-400">
              <span>✓</span>
              <span className="text-zinc-200">Historical repository insights</span>
            </div>
          </div>
        </div>

        <div className="relative z-30 flex items-center justify-between">
          <p className="text-zinc-500 text-xs font-medium">© Pulseboard</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-1000">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-black text-2xl text-zinc-900 tracking-tighter">Pulseboard</span>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-zinc-100/50">
            <div className="space-y-3 mb-10 text-center">
              <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Get Started</h1>
              <p className="text-sm font-medium text-zinc-500">Create your free account in seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 px-6 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-14 px-6 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-14 px-6 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 animate-in shake-in duration-500">
                  <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-xs text-rose-700 font-bold leading-tight">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-14 rounded-2xl bg-zinc-900 overflow-hidden transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-zinc-100">
              <p className="text-center text-sm font-medium text-zinc-500">
                Already have an account?{" "}
                <Link href={APP_ROUTES.login} className="font-bold text-zinc-900 hover:text-indigo-600 transition-colors">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
