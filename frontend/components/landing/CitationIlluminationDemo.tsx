"use client";

import { useState } from "react";
import { Sparkles, FileCode, Check, ArrowRight } from "lucide-react";

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
    explanation: "Enforces session validation at edge before routing to dashboard.",
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
    explanation: "Issues cryptographically signed token and persists session store record.",
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
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-widest mb-3">
            <FileCode className="h-3.5 w-3.5 text-zinc-400" />
            Verification Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Every statement backed by exact source lines.
          </h2>
          <p className="mt-2 text-zinc-400 max-w-xl text-sm font-sans">
            Select a citation to inspect the illuminated line spans. The surrounding code dims, isolating exact ground truth in the repository.
          </p>
        </div>

        {/* Interactive Layout: Left Side (Report Citation Pills) | Right Side (Illuminated Code Viewer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Answer & Sources */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-lg">
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Verified Output
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                Authentication relies on high-speed edge token inspection in{" "}
                <span className="text-white font-mono bg-surface-2 px-1.5 py-0.5 rounded">middleware.ts</span>{" "}
                and database-backed session creation in{" "}
                <span className="text-white font-mono bg-surface-2 px-1.5 py-0.5 rounded">auth.ts</span>.
              </p>

              <div className="mt-6 border-t border-hairline pt-4">
                <div className="text-xs font-mono text-zinc-400 mb-3">
                  Select citation to inspect:
                </div>
                <div className="space-y-2">
                  {CITATION_EXAMPLES.map((ex, i) => {
                    const isSelected = activeIdx === i;
                    return (
                      <button
                        key={ex.id}
                        onClick={() => setActiveIdx(i)}
                        className={`w-full text-left rounded-lg border p-3.5 transition-all ${
                          isSelected
                            ? "border-zinc-500 bg-zinc-800 text-white shadow-md"
                            : "border-hairline bg-surface-2/60 text-zinc-300 hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                            <FileCode className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{ex.file}</span>
                            <span className="text-zinc-400">:{ex.lines}</span>
                          </div>
                          {isSelected && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-300 uppercase">
                              <Check className="h-3 w-3" />
                              Inspecting
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 text-xs text-zinc-400 font-sans">
                          {ex.explanation}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: High-Precision Code Viewer with Line Illumination */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-hairline-bright bg-surface-0 shadow-2xl overflow-hidden">
              {/* Code Viewer Header */}
              <div className="flex items-center justify-between border-b border-hairline bg-surface-1 px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                  <FileCode className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{activeExample.file}</span>
                  <span className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] text-zinc-400">
                    TypeScript
                  </span>
                </div>
                <div className="font-mono text-[11px] text-zinc-400">
                  Lines {activeExample.lines} cited
                </div>
              </div>

              {/* Code Snippet with Spotlight Dimming */}
              <div className="p-4 font-mono text-xs overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {activeExample.snippet.map((row) => (
                      <tr
                        key={row.lineNum}
                        className={`transition-all duration-200 ${
                          row.isCited
                            ? "bg-zinc-800/90 border-l-2 border-white text-white"
                            : "opacity-35 hover:opacity-75"
                        }`}
                      >
                        {/* Line Number */}
                        <td className="w-10 select-none py-1 pr-4 text-right font-mono text-[11px] text-zinc-600">
                          {row.lineNum}
                        </td>
                        {/* Code Line */}
                        <td className="py-1 pl-2 text-zinc-200 whitespace-pre">
                          {row.code}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Inspector Status Footer */}
              <div className="border-t border-hairline bg-surface-1 px-4 py-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Symbol: {activeExample.symbol}</span>
                <span className="text-emerald-400 font-medium">Verified in Repo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
