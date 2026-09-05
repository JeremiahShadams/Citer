"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getRepository,
  listFiles,
  getFileContent,
  type RepoDetail,
  type FileEntry,
  type FileContent,
} from "@/lib/repositories";
import ChatWindow from "@/app/chat/components/ChatWindow";

export default function RepoWorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const repoId = Number(params.id);

  const [repo, setRepo] = useState<RepoDetail | null>(null);
  const [tree, setTree] = useState<FileEntry[]>([]);
  const [activeFile, setActiveFile] = useState<FileContent | null>(null);
  const [openFile, setOpenFile] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && repoId) {
      getRepository(repoId).then(setRepo).catch(() => router.push("/dashboard"));
      listFiles(repoId).then((r) => setTree(r.tree)).catch(() => {});
    }
  }, [user, repoId, router]);

  async function handleOpenFile(path: string) {
    setOpenFile(path);
    try {
      const content = await getFileContent(repoId, path);
      setActiveFile(content);
    } catch {
      setActiveFile(null);
    }
  }

  if (loading || !user || !repo) return null;

  return (
    <main className="flex h-screen">
      {/* Sidebar: file tree */}
      <aside className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
        <div className="p-4 border-b border-zinc-800">
          <button onClick={() => router.push("/dashboard")} className="text-xs text-blue-400 hover:text-blue-300">
            &larr; Dashboard
          </button>
          <h2 className="mt-2 text-sm font-semibold truncate">{repo.owner}/{repo.name}</h2>
          <div className="mt-1 flex gap-2">
            <StatusDot status={repo.status} />
            {repo.stats && (
              <span className="text-xs text-zinc-500">
                {repo.stats.files} files &middot; {repo.stats.chunks} chunks
              </span>
            )}
          </div>
        </div>
        <div className="p-2">
          {tree.length === 0 && <p className="p-2 text-xs text-zinc-600">No files indexed yet</p>}
          {tree.map((entry) => (
            <FileNode key={entry.name} entry={entry} depth={0} onSelect={handleOpenFile} activePath={openFile} />
          ))}
        </div>
      </aside>

      {/* Main area: code viewer + chat */}
      <div className="flex flex-1 flex-col">
        {/* Code viewer or placeholder */}
        <div className="flex-1 overflow-hidden">
          {activeFile ? (
            <CodeViewer file={activeFile} />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-600">
              Select a file from the sidebar to view its contents
            </div>
          )}
        </div>

        {/* Chat bar pinned to bottom */}
        <div className="h-72 border-t border-zinc-800">
          <ChatWindow
            repoUrl={repo.url}
            sessionId={null}
            onSessionChange={() => {}}
          />
        </div>
      </div>
    </main>
  );
}

function FileNode({
  entry,
  depth,
  onSelect,
  activePath,
}: {
  entry: FileEntry;
  depth: number;
  onSelect: (path: string) => void;
  activePath: string | null;
}) {
  const [open, setOpen] = useState(depth < 1);

  if (entry.type === "file") {
    const isActive = activePath === entry.name;
    return (
      <button
        onClick={() => onSelect(entry.name)}
        className={`block w-full text-left rounded px-2 py-0.5 text-xs hover:bg-zinc-800 ${
          isActive ? "bg-zinc-800 text-white" : "text-zinc-400"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {entry.name}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <span className="text-zinc-600">{open ? "▾" : "▸"}</span>
        {entry.name}
      </button>
      {open &&
        entry.children?.map((child) => (
          <FileNode
            key={child.name}
            entry={child}
            depth={depth + 1}
            onSelect={(path) => onSelect(`${entry.name}/${path}`)}
            activePath={activePath?.startsWith(`${entry.name}/`) ? activePath.slice(entry.name.length + 1) : null}
          />
        ))}
    </div>
  );
}

function CodeViewer({ file }: { file: FileContent }) {
  const lines = file.content.split("\n");
  return (
    <div className="h-full overflow-auto bg-zinc-950 font-mono text-sm">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <span className="text-xs text-zinc-400">{file.path}</span>
        {file.language && (
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">{file.language}</span>
        )}
      </div>
      <div className="flex">
        <div className="select-none border-r border-zinc-800 py-2 pr-3 text-right">
          {lines.map((_, i) => (
            <div key={i} className="px-2 text-xs text-zinc-600">{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 overflow-x-auto p-2">
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "ready"
      ? "bg-green-400"
      : status === "failed"
        ? "bg-red-400"
        : "bg-yellow-400 animate-pulse";
  return <span className={`mt-1 h-2 w-2 rounded-full ${color}`} />;
}