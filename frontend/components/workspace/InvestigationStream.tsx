"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { askStream, type Citation } from "@/lib/api";
import {
  FileCode,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export type InvestigationItem = {
  id: string;
  question: string;
  answer: string;
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
  const [liveAnswer, setLiveAnswer] = useState("");
  const [liveCitations, setLiveCitations] = useState<Citation[]>([]);

  const streamEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, liveAnswer, loading]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setLoading(true);
    setLiveAnswer("");
    setLiveCitations([]);

    const itemId = `inv-${Date.now()}`;
    let accumulatedAnswer = "";
    let accumulatedCitations: Citation[] = [];

    try {
      for await (const ev of askStream(question, sessionId ?? undefined, repoUrl || undefined)) {
        if (ev.event === "token") {
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
          citations: accumulatedCitations,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setItems((prev) => [
        ...prev,
        {
          id: itemId,
          question,
          answer: "An error occurred while querying the codebase. Please verify your backend server and configuration.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLiveAnswer("");
      setLiveCitations([]);
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-surface-1 border-r border-hairline overflow-hidden font-sans">
      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {items.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 text-zinc-500">
            <h3 className="text-sm font-semibold text-zinc-300 font-mono mb-1">
              Codebase Q&amp;A
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
              Ask questions about cross-file data flows, route handlers, or architecture. Every statement is verified with source-level citations.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs text-left">
              <button
                onClick={() => {
                  setInput("How does authentication and session validation work?");
                }}
                className="rounded border border-hairline bg-surface-0 px-3 py-2 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
              >
                &ldquo;How does authentication work?&rdquo;
              </button>
              <button
                onClick={() => {
                  setInput("What is the database schema and vector configuration?");
                }}
                className="rounded border border-hairline bg-surface-0 px-3 py-2 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
              >
                &ldquo;What is the DB schema and vector config?&rdquo;
              </button>
            </div>
          </div>
        )}

        {/* Persisted Q&A Items */}
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-hairline bg-surface-0/90 shadow-md overflow-hidden"
          >
            {/* Question Header */}
            <div className="border-b border-hairline bg-surface-2/40 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span className="font-mono text-xs font-semibold text-white">
                  {item.question}
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                {item.timestamp}
              </span>
            </div>

            {/* Markdown Answer */}
            <div className="p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.answer}
              </ReactMarkdown>
            </div>

            {/* Citations */}
            {item.citations && item.citations.length > 0 && (
              <div className="border-t border-hairline bg-surface-2/20 px-4 py-3">
                <div className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCode className="h-3 w-3 text-zinc-400" />
                  <span>Citations:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.citations.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        onSelectCitation?.(c.file_path, c.start_line, c.end_line)
                      }
                      className="flex items-center gap-1.5 rounded border border-hairline bg-surface-2 px-2.5 py-1 font-mono text-xs text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
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
        ))}

        {/* Live Active Stream */}
        {loading && (
          <div className="rounded-xl border border-zinc-700 bg-surface-0 p-4 shadow-lg">
            {liveAnswer ? (
              <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                {liveAnswer}
                <span className="terminal-cursor" />
              </div>
            ) : (
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
                <span>Searching codebase...</span>
              </div>
            )}

            {/* Live Citations */}
            {liveCitations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-hairline flex flex-wrap gap-2">
                {liveCitations.map((c, i) => (
                  <span
                    key={i}
                    className="font-mono text-[11px] text-zinc-300 bg-surface-2 px-2 py-0.5 rounded border border-hairline"
                  >
                    {c.file_path}:{c.start_line}–{c.end_line}
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
            className="flex-1 rounded-lg border border-hairline bg-surface-2 px-3.5 py-2 font-mono text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            placeholder="Ask about the codebase... (Press Enter)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-zinc-200 disabled:opacity-40 transition-colors"
          >
            <span>Ask</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>&crarr; Submit question</span>
          <span>&#8984;K Quick search</span>
        </div>
      </div>
    </div>
  );
}
