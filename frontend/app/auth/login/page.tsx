"use client";

import { useAuth } from "@/components/AuthProvider";
import { devLogin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { refresh } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleDevLogin() {
    setBusy(true);
    setError("");
    try {
      await devLogin();
      await refresh();
      router.push("/dashboard");
    } catch {
      setError("Login failed — is the backend running?");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Codebase Intelligence</h1>
          <p className="mt-1 text-sm text-zinc-400">Sign in to manage your repositories</p>
        </div>

        {error && (
          <p className="rounded bg-red-900/30 px-3 py-2 text-center text-sm text-red-400">{error}</p>
        )}

        <button
          className="w-full rounded-md bg-white px-4 py-2.5 font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          onClick={handleDevLogin}
          disabled={busy}
        >
          {busy ? "Signing in..." : "Dev Login (no GitHub)"}
        </button>
      </div>
    </main>
  );
}