"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listRepositories, createRepository, type Repo } from "@/lib/repositories";
import { pollIndex, type IndexTask } from "@/lib/api";

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
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Codebase Intelligence</h1>
          <p className="text-sm text-zinc-400">Welcome, {user.name ?? user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/chat" className="text-sm text-blue-400 hover:text-blue-300">Chat</a>
          <button onClick={signOut} className="text-sm text-zinc-400 hover:text-zinc-200">
            Sign out
          </button>
        </div>
      </header>

      <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-3 text-sm font-semibold text-zinc-300">Connect a Repository</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          />
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
            onClick={handleConnect}
            disabled={busy || !repoUrl.trim()}
          >
            {busy ? "Indexing..." : "Connect"}
          </button>
        </div>
        {indexStatus && <p className="mt-2 text-xs text-zinc-400">{indexStatus}</p>}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-300">Your Repositories</h2>
        {repos.length === 0 ? (
          <p className="rounded border border-zinc-800 p-4 text-sm text-zinc-500">
            No repositories connected yet. Paste a GitHub URL above to get started.
          </p>
        ) : (
          <ul className="space-y-2">
            {repos.map((repo) => (
              <li key={repo.id}>
                <button
                  onClick={() => router.push(`/repo/${repo.id}`)}
                  className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left hover:border-zinc-600"
                >
                  <div>
                    <span className="font-medium">{repo.owner}/{repo.name}</span>
                    {repo.description && (
                      <span className="ml-2 text-sm text-zinc-400">{repo.description}</span>
                    )}
                  </div>
                  <StatusBadge status={repo.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "ready"
      ? "bg-green-900 text-green-300"
      : status === "failed"
        ? "bg-red-900 text-red-300"
        : "bg-yellow-900 text-yellow-300";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{status}</span>
  );
}