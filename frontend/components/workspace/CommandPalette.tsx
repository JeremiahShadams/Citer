"use client";

import { useEffect, useState } from "react";
import { Search, FileCode, FunctionSquare, Layers, ArrowRight, X } from "lucide-react";

type SearchItem = {
  id: string;
  name: string;
  category: "symbol" | "file" | "endpoint" | "service";
  path: string;
  detail?: string;
};

const SAMPLE_COMMANDS: SearchItem[] = [
  { id: "1", name: "AuthService", category: "service", path: "src/services/auth.ts", detail: "47 references" },
  { id: "2", name: "middleware()", category: "symbol", path: "src/middleware.ts", detail: "Edge token inspection" },
  { id: "3", name: "createSession()", category: "symbol", path: "src/lib/session.ts", detail: "12 callers" },
  { id: "4", name: "POST /api/login", category: "endpoint", path: "src/routes/auth.ts", detail: "Route handler" },
  { id: "5", name: "UserService", category: "service", path: "src/services/user.ts", detail: "34 callers" },
  { id: "6", name: "VectorRepository", category: "service", path: "src/db/vector.ts", detail: "pgvector HNSW" },
  { id: "7", name: "chunker.ts", category: "file", path: "src/ingestion/chunker.ts", detail: "Tree-sitter AST" },
];

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile?: (path: string) => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        isOpen ? onClose() : {};
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SAMPLE_COMMANDS.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.path.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="w-full max-w-xl rounded-xl border border-hairline-bright bg-surface-1 shadow-2xl overflow-hidden font-mono">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-hairline bg-surface-0 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search symbols, files, endpoints, or services... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching symbols or files found.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectFile) onSelectFile(item.path);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-lg p-2.5 text-left hover:bg-surface-2 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded p-1.5 bg-surface-3 text-zinc-400 group-hover:text-white transition-colors">
                      {item.category === "symbol" && <FunctionSquare className="h-3.5 w-3.5" />}
                      {item.category === "file" && <FileCode className="h-3.5 w-3.5" />}
                      {item.category === "service" && <Layers className="h-3.5 w-3.5" />}
                      {item.category === "endpoint" && <ArrowRight className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-zinc-500">{item.path}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 font-sans">
                    {item.detail}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Shortcut Tips */}
        <div className="border-t border-hairline bg-surface-0 px-4 py-2 text-[11px] text-zinc-500 flex justify-between">
          <span>&uarr;&darr; Navigate</span>
          <span>&crarr; Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
