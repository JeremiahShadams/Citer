"use client";

import { useState } from "react";
import { Layers, Database, Globe, Server, Key, CreditCard, Users, ArrowDown, ExternalLink } from "lucide-react";

type ArchNode = {
  id: string;
  label: string;
  category: "frontend" | "api" | "service" | "db";
  file: string;
  deps: number;
  refs: number;
  callers: number;
  description: string;
};

const ARCH_NODES: ArchNode[] = [
  {
    id: "fe",
    label: "Next.js Web Client",
    category: "frontend",
    file: "frontend/app/page.tsx",
    deps: 12,
    refs: 1,
    callers: 0,
    description: "Server & Client components with App Router.",
  },
  {
    id: "api",
    label: "FastAPI Gateway",
    category: "api",
    file: "backend/app/main.py",
    deps: 18,
    refs: 34,
    callers: 12,
    description: "Routes request traffic to ingestion and LangGraph agents.",
  },
  {
    id: "auth_svc",
    label: "AuthService",
    category: "service",
    file: "backend/app/services/auth.py",
    deps: 4,
    refs: 47,
    callers: 8,
    description: "Session tokens, JWT validation, and RBAC authorization.",
  },
  {
    id: "agent_svc",
    label: "LangGraph Agent",
    category: "service",
    file: "backend/app/agent/graph.py",
    deps: 9,
    refs: 26,
    callers: 5,
    description: "Stateful planner, multi-hop retriever, and answer synthesizer.",
  },
  {
    id: "billing_svc",
    label: "BillingManager",
    category: "service",
    file: "backend/app/services/billing.py",
    deps: 3,
    refs: 19,
    callers: 7,
    description: "Stripe subscription sync and quota enforcement.",
  },
  {
    id: "db",
    label: "PostgreSQL + pgvector",
    category: "db",
    file: "backend/migrations/001_init.sql",
    deps: 0,
    refs: 104,
    callers: 52,
    description: "Stores code chunks, 3072-dim embeddings, and session history.",
  },
];

export default function ArchitectureModeDemo() {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(ARCH_NODES[2]); // AuthService by default

  return (
    <section id="architecture" className="border-t border-hairline bg-void py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-violet uppercase tracking-widest mb-3">
            <Layers className="h-3.5 w-3.5" />
            System-Level Abstraction
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            See your software
            <br />
            <span className="text-brand-blue">like a system.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400">
            Automatically inferred from your repository&apos;s AST symbols, import declarations, and route mappings.
          </p>
        </div>

        {/* Interactive Architecture Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Graph Layout */}
          <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface-1 p-3 sm:p-6 lg:col-span-8">
            <div className="flex flex-col items-center gap-6">
              {/* Layer 1: Client */}
              <div className="w-full flex justify-center">
                <NodeCard
                  node={ARCH_NODES[0]}
                  icon={<Globe className="h-4 w-4 text-brand-cyan" />}
                  selected={selectedNode.id === ARCH_NODES[0].id}
                  onClick={() => setSelectedNode(ARCH_NODES[0])}
                />
              </div>

              <ArrowDown className="h-4 w-4 text-zinc-600" />

              {/* Layer 2: API Gateway */}
              <div className="w-full flex justify-center">
                <NodeCard
                  node={ARCH_NODES[1]}
                  icon={<Server className="h-4 w-4 text-brand-blue" />}
                  selected={selectedNode.id === ARCH_NODES[1].id}
                  onClick={() => setSelectedNode(ARCH_NODES[1])}
                />
              </div>

              <ArrowDown className="h-4 w-4 text-zinc-600" />

              {/* Layer 3: Services Cluster */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <NodeCard
                  node={ARCH_NODES[2]}
                  icon={<Key className="h-4 w-4 text-brand-violet" />}
                  selected={selectedNode.id === ARCH_NODES[2].id}
                  onClick={() => setSelectedNode(ARCH_NODES[2])}
                />
                <NodeCard
                  node={ARCH_NODES[3]}
                  icon={<Layers className="h-4 w-4 text-brand-blue" />}
                  selected={selectedNode.id === ARCH_NODES[3].id}
                  onClick={() => setSelectedNode(ARCH_NODES[3])}
                />
                <NodeCard
                  node={ARCH_NODES[4]}
                  icon={<CreditCard className="h-4 w-4 text-amber-400" />}
                  selected={selectedNode.id === ARCH_NODES[4].id}
                  onClick={() => setSelectedNode(ARCH_NODES[4])}
                />
              </div>

              <ArrowDown className="h-4 w-4 text-zinc-600" />

              {/* Layer 4: Storage */}
              <div className="w-full flex justify-center">
                <NodeCard
                  node={ARCH_NODES[5]}
                  icon={<Database className="h-4 w-4 text-emerald-400" />}
                  selected={selectedNode.id === ARCH_NODES[5].id}
                  onClick={() => setSelectedNode(ARCH_NODES[5])}
                />
              </div>
            </div>
          </div>

          {/* Node Intelligence Inspector Panel */}
          <div className="rounded-xl border border-hairline-bright bg-surface-2 p-4 shadow-xl sm:p-6 lg:sticky lg:top-24 lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-brand-cyan mb-2">
              Node Intelligence
            </div>
            <h3 className="text-xl font-bold text-white mb-1 font-mono">
              {selectedNode.label}
            </h3>
            <div className="font-mono text-xs text-zinc-400 mb-4 truncate">
              {selectedNode.file}
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-6">
              {selectedNode.description}
            </p>

            <div className="border-t border-hairline pt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Dependencies:</span>
                <span className="text-zinc-200 font-semibold">{selectedNode.deps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Symbol References:</span>
                <span className="text-zinc-200 font-semibold">{selectedNode.refs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Incoming Callers:</span>
                <span className="text-zinc-200 font-semibold">{selectedNode.callers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Architecture Tier:</span>
                <span className="text-brand-blue uppercase">{selectedNode.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeCard({
  node,
  icon,
  selected,
  onClick,
}: {
  node: ArchNode;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
        selected
          ? "border-brand-blue bg-brand-blue/15 shadow-lg"
          : "border-hairline bg-surface-0 hover:border-hairline-bright hover:bg-surface-2"
      }`}
    >
      <div className="rounded p-1.5 bg-surface-2 border border-hairline shrink-0">
        {icon}
      </div>
      <div className="overflow-hidden">
        <div className="font-mono text-xs font-semibold text-white truncate">
          {node.label}
        </div>
        <div className="font-mono text-[10px] text-zinc-500 truncate">
          {node.refs} references
        </div>
      </div>
    </button>
  );
}
