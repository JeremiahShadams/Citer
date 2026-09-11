"use client";

import { useState } from "react";
import { Sparkles, FileCode, Check } from "lucide-react";

type CitationExample = {
  id: string;
  file: string;
  lines: string;
  symbol: string;
  lineStart: number;
  lineEnd: number;
  snippet: { lineNum: number; code: string; isCited: boolean }[];
  explanation: string;
};

const CITATION_EXAMPLES: CitationExample[] = [
  {
    id: "middleware",
    file: "src/middleware.ts",
    lines: "12–20",
    symbol: "export async function middleware()",
    lineStart: 12,
    lineEnd: 20,
    explanation: "Enforces edge cryptographic session validation before routing to dashboard.",
    snippet: [
      { lineNum: 10, code: "import { getSession } from '@/lib/session';", isCited: false },
      { lineNum: 11, code: "", isCited: false },
      { lineNum: 12, code: "export async function middleware(req: NextRequest) {", isCited: true },
      { lineNum: 13, code: "  const token = req.cookies.get('session_token')?.value;", isCited: true },
      { lineNum: 14, code: "  if (!token) {", isCited: true },
      { lineNum: 15, code: "    return NextResponse.redirect(new URL('/login', req.url));", isCited: true },
      { lineNum: 16, code: "  }", isCited: true },
      { lineNum: 17, code: "  const session = await getSession(token);", isCited: true },
      { lineNum: 18, code: "  if (!session?.isValid) {", isCited: true },
      { lineNum: 19, code: "    return NextResponse.redirect(new URL('/login', req.url));", isCited: true },
      { lineNum: 20, code: "  }", isCited: true },
      { lineNum: 21, code: "  return NextResponse.next();", isCited: false },
      { lineNum: 22, code: "}", isCited: false },
    ],
  },
  {
    id: "auth_service",
    file: "src/services/auth.ts",
    lines: "28–34",
    symbol: "AuthService.createSession()",
    lineStart: 28,
    lineEnd: 34,
    explanation: "Issues cryptographically signed token and persists session store record in Postgres.",
    snippet: [
      { lineNum: 26, code: "export class AuthService {", isCited: false },
      { lineNum: 27, code: "  static async createSession(userId: string): Promise<Session> {", isCited: false },
      { lineNum: 28, code: "    const token = crypto.randomUUID();", isCited: true },
      { lineNum: 29, code: "    const expiresAt = new Date(Date.now() + 86400000);", isCited: true },
      { lineNum: 30, code: "    await db.sessions.create({", isCited: true },
      { lineNum: 31, code: "      data: { userId, token, expiresAt },", isCited: true },
      { lineNum: 32, code: "    });", isCited: true },
      { lineNum: 33, code: "    return { token, expiresAt, userId };", isCited: true },
      { lineNum: 34, code: "  }", isCited: true },
      { lineNum: 35, code: "}", isCited: false },
    ],
  },
];

export default function CitationIlluminationDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeExample = CITATION_EXAMPLES[activeIdx];

  return (
    <section id="evidence" className="py-24 bg-void border-t border-hairline">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-hover uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Evidence-First UX
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The AI shows you why it believes something.
          </h2>
          <p className="mt-2 text-zinc-400 max-w-xl text-sm">
            Select a citation to spotlight the precise line spans. The surrounding code aggressively dims, bringing ground truth into immediate focus.
          </p>
        </div>

        {/* Interactive Layout: Left Side (Report Citation Pills) | Right Side (Illuminated Code Viewer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Answer & Sources */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-lg">
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Investigation Output
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed">
                Authentication relies on high-speed edge token inspection in{" "}
                <span className="text-brand-hover font-mono">middleware.ts</span>{" "}
                and database-backed session creation in{" "}
                <span className="text-brand-hover font-mono">auth.ts</span>.
              </p>
            </div>

            {/* Clickable Citation Pills */}
            <div className="space-y-2">
              <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                Extracted Evidence Citations
              </div>
              {CITATION_EXAMPLES.map((item, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                      isActive
                        ? "border-brand-primary/60 bg-surface-2 glow-indigo"
                        : "border-hairline bg-surface-1/60 hover:bg-surface-1 hover:border-hairline-bright"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        isActive
                          ? "border-brand-hover/60 bg-brand-primary/20 text-brand-hover"
                          : "border-hairline bg-surface-2 text-zinc-500"
                      }`}
                    >
                      {isActive ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <FileCode className="h-3 w-3" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-medium text-white truncate">
                          {item.file}
                        </span>
                        <span className="font-mono text-[11px] text-brand-hover tabular-nums">
                          Lines {item.lines}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                        {item.explanation}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Illuminated Monaco-Style Code Viewer */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-hairline bg-surface-1 overflow-hidden shadow-2xl">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-hairline bg-surface-2 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-brand-hover" />
                  <span className="font-mono text-xs text-zinc-300">
                    {activeExample.file}
                  </span>
                  <span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] text-brand-hover tabular-nums">
                    {activeExample.lines} illuminated
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-surface-3" />
                  <span className="h-2 w-2 rounded-full bg-surface-3" />
                  <span className="h-2 w-2 rounded-full bg-surface-3" />
                </div>
              </div>

              {/* Code Gutter & Lines */}
              <div className="p-4 font-mono text-xs overflow-x-auto bg-surface-0">
                <table className="w-full border-collapse">
                  <tbody>
                    {activeExample.snippet.map((row) => (
                      <tr
                        key={row.lineNum}
                        className={`transition-all duration-200 ${
                          row.isCited
                            ? "bg-brand-primary/15 border-l-2 border-brand-hover text-white font-medium"
                            : "opacity-35 hover:opacity-80 text-zinc-400"
                        }`}
                      >
                        <td className="w-8 select-none pr-3 text-right text-[11px] text-zinc-600 tabular-nums">
                          {row.lineNum}
                        </td>
                        <td className="py-0.5 pl-2 whitespace-pre">
                          {row.code || " "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
