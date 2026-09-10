"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { askStream, type Citation } from "@/lib/api";
import {
  Terminal,
  FileCode,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export type InvestigationItem = {
  id: string;
  question: string;
  answer: string;
  steps: string[];
  citations?: Citation[];
  timestamp: string;
};

export default function InvestigationStream({
  repoUrl,
  sessionId,
  onSessionChange,
  onSelectCitation,
}: {
  repoUrl: string;
  sessionId: string | null;
  onSessionChange: (id: string) => void;
  onSelectCitation?: (filePath: string, startLine?: number, endLine?: number) => void;
}) {
  const [items, setItems] = useState<InvestigationItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<string[]>([]);
  const [liveAnswer, setLiveAnswer] = useState("");
  const [liveCitations, setLiveCitations] = useState<Citation[]>([]);
  const [openTraces, setOpenTraces] = useState<Record<string, boolean>>({});

  const streamEndRef = useRef<HTMLDivElement>(null);

  const toggleTrace = (id: string) => {
    setOpenTraces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, liveAnswer, currentSteps]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setLoading(true);
    setCurrentSteps([]);
    setLiveAnswer("");
    setLiveCitations([]);

    const itemId = `inv-${Date.now()}`;
    let accumulatedAnswer = "";
    let accumulatedCitations: Citation[] = [];
    const accumulatedSteps: string[] = [];

    try {
      for await (const ev of askStream(question, sessionId ?? undefined, repoUrl || undefined)) {
        if (ev.event === "node") {
          const nodeName = (ev.data as { node: string }).node;
          accumulatedSteps.push(nodeName);
          setCurrentSteps([...accumulatedSteps]);
        } else if (ev.event === "token") {
          accumulatedAnswer += (ev.data as { text: string }).text;
          setLiveAnswer(accumulatedAnswer);
        } else if (ev.event === "citations") {
          accumulatedCitations = ev.data as Citation[];
          setLiveCitations(accumulatedCitations);
        } else if (ev.event === "done") {
          const sid = (ev.data as { session_id: string }).session_id;
          if (sid) onSessionChange(sid);
        }
      }

      setItems((prev) => [
        ...prev,
        {
          id: itemId,
          question,
          answer: accumulatedAnswer,
          steps: accumulatedSteps,
          citations: accumulatedCitations,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setOpenTraces((prev) => ({ ...prev, [itemId]: false }));
    } catch {
      setItems((prev) => [
        ...prev,
        {
          id: itemId,
          question,
          answer: "An error occurred during investigation. Please verify backend connection and API keys.",
          steps: accumulatedSteps,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLiveAnswer("");
      setLiveCitations([]);
      setCurrentSteps([]);
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-surface-1 border-r border-hairline overflow-hidden font-sans">
      {/* Investigation Reports Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {items.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 text-zinc-500">
            <div className="rounded-full border border-hairline bg-surface-2 p-3 mb-4 text-zinc-400">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300 font-mono mb-1">
              AI Codebase Analyst
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
              Ask questions about cross-file data flows, symbol callers, route invariants, or architecture. Every assertion is verified with exact citations.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs text-left">
              <button
                onClick={() => {
                  setInput("How does authentication and session validation work?");
                }}
                className="rounded border border-hairline bg-surface-0 px-3 py-2 text-xs text-zinc-400 hover:border-brand-blue/50 hover:text-zinc-200 transition-colors"
              >
                &ldquo;How does authentication work?&rdquo;
              </button>
              <button
                onClick={() => {
                  setInput("What is the database schema and vector configuration?");
                }}
                className="rounded border border-hairline bg-surface-0 px-3 py-2 text-xs text-zinc-400 hover:border-brand-blue/50 hover:text-zinc-200 transition-colors"
              >
                &ldquo;What is the DB schema and vector config?&rdquo;
              </button>
            </div>
          </div>
        )}

        {/* Persisted Investigation Reports */}
        {items.map((item) => {
          const isTraceOpen = openTraces[item.id] ?? false;
          return (
            <article
              key={item.id}
              className="rounded-xl border border-hairline bg-surface-0/90 shadow-lg overflow-hidden animate-in fade-in duration-200"
            >
              {/* Question Header */}
              <div className="border-b border-hairline bg-surface-2/40 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-blue" />
                  <span className="font-mono text-xs font-semibold text-white">
                    {item.question}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">
                  {item.timestamp}
                </span>
              </div>

              {/* Reasoning Trace Toggle */}
              {item.steps.length > 0 && (
                <div className="border-b border-hairline bg-surface-0 px-4 py-2 text-xs font-mono">
                  <button
                    onClick={() => toggleTrace(item.id)}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {isTraceOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                    <span>
                      Investigation Trace ({item.steps.length} stages)
                    </span>
                  </button>

                  {isTraceOpen && (
                    <div className="mt-2.5 pl-4 border-l border-hairline space-y-1.5 text-[11px] text-zinc-400">
                      {item.steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>Executed node: <strong className="text-zinc-200">{s}</strong></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Report Markdown Answer */}
              <div className="p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.answer}
                </ReactMarkdown>
              </div>

              {/* Source-Level Citations */}
              {item.citations && item.citations.length > 0 && (
                <div className="border-t border-hairline bg-surface-2/20 px-4 py-3">
                  <div className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileCode className="h-3 w-3 text-brand-cyan" />
                    <span>Evidence Citations (Click to inspect code):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.citations.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          onSelectCitation?.(c.file_path, c.start_line, c.end_line)
                        }
                        className="flex items-center gap-1.5 rounded border border-hairline bg-surface-2 px-2.5 py-1 font-mono text-xs text-brand-blue hover:border-brand-blue hover:bg-brand-blue/10 transition-colors"
                      >
                        <span>{c.file_path}</span>
                        <span className="text-zinc-400">
                          :{c.start_line}–{c.end_line}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {/* Live Active Investigation Stepper */}
        {loading && (
          <div className="rounded-xl border border-brand-blue/30 bg-surface-0 p-4 shadow-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan mb-3">
              <span className="h-2 w-2 rounded-full bg-brand-cyan animate-ping" />
              <span>Investigating codebase...</span>
            </div>

            {/* Stages */}
            {currentSteps.length > 0 && (
              <div className="mb-3 space-y-1 font-mono text-xs text-zinc-400 border-l border-hairline pl-3">
                {currentSteps.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-zinc-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>Phase: {s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Live Streaming Answer */}
            {liveAnswer ? (
              <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                {liveAnswer}
                <span className="terminal-cursor" />
              </div>
            ) : (
              <div className="text-xs font-mono text-zinc-500">
                Traversing AST and executing multi-hop retrieval...
              </div>
            )}

            {/* Live Citations */}
            {liveCitations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-hairline flex flex-wrap gap-2">
                {liveCitations.map((c, i) => (
                  <span
                    key={i}
                    className="font-mono text-[11px] text-zinc-400 bg-surface-2 px-2 py-0.5 rounded border border-hairline"
                  >
                    {c.file_path}:{c.start_line}-{c.end_line}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div ref={streamEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-hairline bg-surface-0 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-hairline bg-surface-2 px-3.5 py-2 font-mono text-xs text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
            placeholder="Ask anything about the codebase... (Press Enter)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-40 transition-all"
          >
            <span>Ask</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>&crarr; Submit query</span>
          <span>&#8984;K Command palette</span>
        </div>
      </div>
    </div>
  );
}
