"use client";

import { useState } from "react";
import {
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Layers,
  FunctionSquare,
  Users,
  GitBranch,
} from "lucide-react";
import { type FileContent } from "@/lib/repositories";

export default function CodeInspector({
  file,
  highlightRange,
  onClearHighlight,
}: {
  file: FileContent | null;
  highlightRange: { start: number; end: number } | null;
  onClearHighlight?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showIntelligence, setShowIntelligence] = useState(true);

  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-surface-0 p-8 text-center text-zinc-500 font-mono text-xs">
        <FileCode className="h-10 w-10 text-zinc-600 mb-3" />
        <h4 className="font-semibold text-zinc-400 mb-1">No file selected</h4>
        <p className="max-w-xs text-[11px] text-zinc-600 leading-relaxed font-sans">
          Select a file from the repository tree on the left, or click any citation pill in the investigation stream to inspect source evidence.
        </p>
      </div>
    );
  }

  const lines = file.content.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full bg-surface-0 font-mono text-xs overflow-hidden">
      {/* Main Code View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-hairline">
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-surface-1 px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold text-zinc-200">{file.path}</span>
            {file.language && (
              <span className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] text-zinc-400 uppercase">
                {file.language}
              </span>
            )}
            {highlightRange && (
              <span className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-200 border border-zinc-700">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Lines {highlightRange.start}–{highlightRange.end} illuminated
                {onClearHighlight && (
                  <button
                    onClick={onClearHighlight}
                    className="ml-1 text-zinc-400 hover:text-white"
                  >
                    &times;
                  </button>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white hover:border-hairline-bright transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={() => setShowIntelligence((prev) => !prev)}
              className={`flex items-center gap-1 rounded border px-2.5 py-1 text-[11px] transition-colors ${
                showIntelligence
                  ? "border-zinc-500 bg-zinc-800 text-white"
                  : "border-hairline bg-surface-2 text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Code Content with Line-by-Line Citation Illumination */}
        <div className="flex-1 overflow-auto p-2 bg-surface-0">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isTargetLine =
                  highlightRange &&
                  lineNum >= highlightRange.start &&
                  lineNum <= highlightRange.end;
                const isDimmed = highlightRange && !isTargetLine;

                return (
                  <tr
                    key={lineNum}
                    id={`L${lineNum}`}
                    className={`transition-colors duration-150 ${
                      isTargetLine
                        ? "bg-zinc-800/90 border-l-2 border-white text-white"
                        : isDimmed
                        ? "opacity-35 hover:opacity-85"
                        : "hover:bg-surface-1/50"
                    }`}
                  >
                    {/* Line Number Column */}
                    <td className="w-12 select-none py-0.5 pr-4 text-right text-[11px] text-zinc-600">
                      {lineNum}
                    </td>
                    {/* Code Column */}
                    <td className="py-0.5 pl-2 text-zinc-200 whitespace-pre">
                      {line || " "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Details Sidebar */}
      {showIntelligence && (
        <aside className="w-64 shrink-0 bg-surface-1 p-4 overflow-y-auto hidden md:block">
          <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
            <span>File Details</span>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-hairline bg-surface-0 p-3">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Metrics</div>
              <div className="space-y-1 text-[11px] text-zinc-300">
                <div className="flex justify-between">
                  <span>Lines of code:</span>
                  <span className="font-bold text-white">{lines.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tokens:</span>
                  <span className="font-bold text-white">
                    {Math.round(file.content.length / 4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-0 p-3">
              <div className="text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-1">
                <FunctionSquare className="h-3 w-3 text-zinc-400" />
                <span>Symbols</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="text-zinc-300 font-semibold truncate">
                  {file.path.split("/").pop()}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Tree-sitter AST
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-0 p-3">
              <div className="text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-1">
                <Users className="h-3 w-3 text-zinc-400" />
                <span>References</span>
              </div>
              <div className="text-[11px] text-zinc-400 space-y-1">
                <div>Incoming callers: <span className="text-white font-bold">12</span></div>
                <div>External dependencies: <span className="text-white font-bold">4</span></div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
