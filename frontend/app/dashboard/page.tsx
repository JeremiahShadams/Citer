"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listRepositories, createRepository, type Repo } from "@/lib/repositories";
import { pollIndex, type IndexTask } from "@/lib/api";
import Link from "next/link";
import {
  Terminal,
  GitBranch,
  ArrowRight,
  Plus,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [indexStatus, setIndexStatus] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      listRepositories().then(setRepos).catch(() => {});
    }
  }, [user]);

  async function handleConnect() {
    if (!repoUrl.trim()) return;
    setBusy(true);
    setIndexStatus("connecting...");
    try {
      const { repo, task_id } = await createRepository(repoUrl.trim());
      setRepos((prev) => {
        if (prev.some((r) => r.id === repo.id)) return prev;
        return [repo, ...prev];
      });
      if (task_id) {
        await pollIndex(repoUrl.trim(), (t) => {
          const msg = t.message ? ` — ${t.message}` : "";
          setIndexStatus(`${t.status}${msg}`);
        });
        setIndexStatus("done");
        const updated = await listRepositories();
        setRepos(updated);
      } else {
        setIndexStatus("already indexed");
      }
      setRepoUrl("");
    } catch {
      setIndexStatus("failed to connect");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) return null;

  return (
    <main className="min-h-screen bg-void text-zinc-100 font-sans selection:bg-brand-primary/30 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-hairline bg-surface-0 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-brand-primary/40 bg-brand-primary/10 text-brand-hover">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Codebase <span className="text-brand-hover">Intelligence</span>
            </span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono text-zinc-400">Repositories</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <Link href="/eval" className="text-zinc-400 hover:text-white transition-colors">
            Evaluations
          </Link>
          <span className="text-zinc-500">
            {user.name ?? user.email}
          </span>
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-zinc-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your Codebases
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-sans">
            Connect any public or private GitHub repository to build a structural AST graph and launch AI investigations.
          </p>
        </div>

        {/* Connect Repository Card */}
        <section className="rounded-xl border border-hairline bg-surface-1 p-6 shadow-xl">
          <div className="flex items-center gap-2 font-mono text-xs text-brand-hover uppercase tracking-wider mb-3">
            <Plus className="h-3.5 w-3.5" />
            <span>Connect Repository</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              className="flex-1 rounded-lg border border-hairline bg-surface-0 px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-brand-primary focus:outline-none"
              placeholder="https://github.com/owner/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 font-mono text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-50 transition-all shadow-md"
              onClick={handleConnect}
              disabled={busy || !repoUrl.trim()}
            >
              <span>{busy ? "Indexing..." : "Connect"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {indexStatus && (
            <div className="mt-3 flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
              <span>Status: {indexStatus}</span>
            </div>
          )}
        </section>

        {/* Repositories List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Connected Repositories ({repos.length})
            </h2>
          </div>

          {repos.length === 0 ? (
            <div className="rounded-xl border border-hairline bg-surface-1/40 p-8 text-center text-xs font-mono text-zinc-500">
              No repositories connected yet. Paste a GitHub repository URL above to index.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => router.push(`/repo/${repo.id}`)}
                  className="group cursor-pointer rounded-xl border border-hairline bg-surface-1 p-5 hover:border-hairline-bright hover:bg-surface-2 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-brand-hover" />
                        <span className="font-mono text-sm font-semibold text-white group-hover:text-brand-accent transition-colors">
                          {repo.owner}/{repo.name}
                        </span>
                      </div>
                      <StatusBadge status={repo.status} />
                    </div>

                    {repo.description && (
                      <p className="text-xs text-zinc-400 font-sans line-clamp-2 mb-4">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-hairline flex items-center justify-between font-mono text-[11px] text-zinc-500">
                    <span>
                      {repo.default_branch ? `branch: ${repo.default_branch}` : "Repository ready"}
                    </span>
                    <span className="text-brand-hover flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isReady = status === "ready";
  const isFailed = status === "failed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        isReady
          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
          : isFailed
          ? "bg-red-950/60 text-red-400 border border-red-900/50"
          : "bg-amber-950/60 text-amber-400 border border-amber-900/50 animate-pulse"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isReady ? "bg-emerald-400" : isFailed ? "bg-red-400" : "bg-amber-400"
        }`}
      />
      <span>{status}</span>
    </span>
  );
}