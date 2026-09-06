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
import InvestigationStream from "@/components/workspace/InvestigationStream";
import CodeInspector from "@/components/workspace/CodeInspector";
import CommandPalette from "@/components/workspace/CommandPalette";
import ArchitectureModeDemo from "@/components/landing/ArchitectureModeDemo";
import CodeGalaxyScene from "@/components/3d/CodeGalaxyScene";
import {
  Folder,
  FileCode,
  Search,
  Layers,
  Sparkles,
  Terminal,
  ArrowLeft,
  Share2,
  SlidersHorizontal,
} from "lucide-react";

type ViewMode = "cockpit" | "architecture" | "galaxy";

export default function RepoWorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const repoId = Number(params.id);

  const [repo, setRepo] = useState<RepoDetail | null>(null);
  const [tree, setTree] = useState<FileEntry[]>([]);
  const [activeFile, setActiveFile] = useState<FileContent | null>(null);
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cockpit");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [fileFilter, setFileFilter] = useState("");
  const [highlightRange, setHighlightRange] = useState<{ start: number; end: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && repoId) {
      getRepository(repoId).then(setRepo).catch(() => router.push("/dashboard"));
      listFiles(repoId).then((r) => setTree(r.tree)).catch(() => {});
    }
  }, [user, repoId, router]);

  async function handleOpenFile(path: string, startLine?: number, endLine?: number) {
    setOpenFile(path);
    if (startLine && endLine) {
      setHighlightRange({ start: startLine, end: endLine });
    } else {
      setHighlightRange(null);
    }

    try {
      const content = await getFileContent(repoId, path);
      setActiveFile(content);
    } catch {
      setActiveFile(null);
    }
  }

  const handleSelectCitation = async (filePath: string, startLine?: number, endLine?: number) => {
    if (viewMode !== "cockpit") setViewMode("cockpit");
    await handleOpenFile(filePath, startLine, endLine);
  };

  if (loading || !user || !repo) return null;

  return (
    <main className="flex h-screen flex-col bg-void text-zinc-100 font-sans overflow-hidden">
      {/* Top Cockpit Header Bar */}
      <header className="h-12 border-b border-hairline bg-surface-0 px-4 flex items-center justify-between shrink-0 select-none z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="font-mono hidden sm:inline">Dashboard</span>
          </button>

          <span className="text-zinc-600">/</span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-white">
              {repo.owner}/{repo.name}
            </span>
            <StatusDot status={repo.status} />
            {repo.stats && (
              <span className="font-mono text-[10px] text-zinc-500 hidden md:inline">
                {repo.stats.files} files &middot; {repo.stats.chunks} chunks
              </span>
            )}
          </div>
        </div>

        {/* Center View Mode Switcher */}
        <div className="flex items-center rounded-lg border border-hairline bg-surface-1 p-0.5 text-xs font-mono">
          <button
            onClick={() => setViewMode("cockpit")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              viewMode === "cockpit"
                ? "bg-surface-3 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-brand-blue" />
            <span className="hidden sm:inline">Cockpit</span>
          </button>
          <button
            onClick={() => setViewMode("architecture")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              viewMode === "architecture"
                ? "bg-surface-3 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-brand-violet" />
            <span className="hidden sm:inline">Architecture</span>
          </button>
          <button
            onClick={() => setViewMode("galaxy")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              viewMode === "galaxy"
                ? "bg-surface-3 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
            <span className="hidden sm:inline">3D Galaxy</span>
          </button>
        </div>

        {/* Right Search & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 rounded border border-hairline bg-surface-1 px-2.5 py-1 font-mono text-xs text-zinc-400 hover:border-hairline-bright hover:text-zinc-200 transition-colors"
          >
            <Search className="h-3 w-3" />
            <span className="hidden md:inline">Quick Search</span>
            <kbd className="rounded bg-surface-2 px-1 text-[10px] text-zinc-500 border border-hairline">
              &#8984;K
            </kbd>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === "cockpit" && (
          <>
            {/* Panel 1 (Left): File Tree & Repository Outline */}
            <aside className="w-64 shrink-0 border-r border-hairline bg-surface-0 flex flex-col overflow-hidden select-none">
              {/* Filter Search */}
              <div className="p-2.5 border-b border-hairline">
                <input
                  type="text"
                  placeholder="Filter repository..."
                  value={fileFilter}
                  onChange={(e) => setFileFilter(e.target.value)}
                  className="w-full rounded border border-hairline bg-surface-1 px-2.5 py-1 font-mono text-xs text-zinc-200 placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              {/* File Nodes Tree */}
              <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
                {tree.length === 0 && (
                  <p className="p-3 text-[11px] text-zinc-600">
                    No files indexed yet
                  </p>
                )}
                {tree.map((entry) => (
                  <FileNode
                    key={entry.name}
                    entry={entry}
                    depth={0}
                    onSelect={(p) => handleOpenFile(p)}
                    activePath={openFile}
                    filter={fileFilter}
                  />
                ))}
              </div>

              {/* Telemetry Footer */}
              <div className="border-t border-hairline bg-surface-1 p-2 font-mono text-[10px] text-zinc-500 flex justify-between">
                <span>Branch: main</span>
                <span className="text-emerald-400">AST Indexed</span>
              </div>
            </aside>

            {/* Panel 2 (Center): AI Investigation Stream */}
            <div className="w-[440px] shrink-0 border-r border-hairline flex flex-col overflow-hidden">
              <InvestigationStream
                repoUrl={repo.url}
                sessionId={sessionId}
                onSessionChange={setSessionId}
                onSelectCitation={handleSelectCitation}
              />
            </div>

            {/* Panel 3 (Right): Code Inspector with Line Illumination */}
            <div className="flex-1 flex flex-col overflow-hidden bg-surface-0">
              <CodeInspector
                file={activeFile}
                highlightRange={highlightRange}
                onClearHighlight={() => setHighlightRange(null)}
              />
            </div>
          </>
        )}

        {viewMode === "architecture" && (
          <div className="flex-1 overflow-y-auto p-6 bg-void">
            <ArchitectureModeDemo />
          </div>
        )}

        {viewMode === "galaxy" && (
          <div className="relative flex-1 bg-void overflow-hidden">
            <CodeGalaxyScene interactive={true} />
            <div className="absolute top-4 left-4 z-20 font-mono text-xs text-zinc-400 bg-surface-1/80 border border-hairline p-3 rounded-lg backdrop-blur-md">
              <div className="text-white font-semibold mb-1">Interactive 3D Galaxy</div>
              <div>Hover nodes to inspect symbol callers and file dependencies.</div>
            </div>
          </div>
        )}
      </div>

      {/* Global ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectFile={(path) => handleOpenFile(path)}
      />
    </main>
  );
}

function FileNode({
  entry,
  depth,
  onSelect,
  activePath,
  filter,
}: {
  entry: FileEntry;
  depth: number;
  onSelect: (path: string) => void;
  activePath: string | null;
  filter: string;
}) {
  const [open, setOpen] = useState(depth < 1);

  if (filter && !entry.name.toLowerCase().includes(filter.toLowerCase())) {
    if (entry.type === "file") return null;
  }

  if (entry.type === "file") {
    const isActive = activePath === entry.name;
    return (
      <button
        onClick={() => onSelect(entry.name)}
        className={`flex items-center gap-1.5 w-full text-left rounded px-2 py-1 text-xs transition-colors ${
          isActive
            ? "bg-brand-blue/20 text-white font-semibold border-l-2 border-brand-blue"
            : "text-zinc-400 hover:bg-surface-2 hover:text-zinc-200"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <FileCode className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        <span className="truncate">{entry.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-surface-2 transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <span className="text-zinc-600 text-[10px] w-3">{open ? "▾" : "▸"}</span>
        <Folder className="h-3.5 w-3.5 shrink-0 text-brand-blue/70" />
        <span className="truncate">{entry.name}</span>
      </button>
      {open &&
        entry.children?.map((child) => (
          <FileNode
            key={child.name}
            entry={child}
            depth={depth + 1}
            onSelect={(path) => onSelect(`${entry.name}/${path}`)}
            activePath={
              activePath?.startsWith(`${entry.name}/`)
                ? activePath.slice(entry.name.length + 1)
                : null
            }
            filter={filter}
          />
        ))}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "ready"
      ? "bg-emerald-400"
      : status === "failed"
      ? "bg-red-400"
      : "bg-yellow-400 animate-pulse";
  return <span className={`h-2 w-2 rounded-full ${color}`} />;
}