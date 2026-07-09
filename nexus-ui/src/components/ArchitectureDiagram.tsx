"use client";

import { BrainCircuit, Plug, SearchCode } from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="pt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Core <span className="text-[var(--color-nexus-purple)]">Architecture</span></h2>
        <p className="text-[var(--color-nexus-text-muted)] text-lg max-w-2xl mx-auto">
          How the required Slack technologies stack up in the Nexus engine.
        </p>
      </div>

      <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                <BrainCircuit className="w-8 h-8 text-[var(--color-nexus-cyan)]" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Agent Reasoning Layer</h4>
                <p className="text-[var(--color-nexus-text-muted)] leading-relaxed">
                  The LLM core wrapped in a Bolt app. It decides per-turn whether to answer directly, call the MCP server for a tool, or search the workspace via the RTS API.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                <Plug className="w-8 h-8 text-[var(--color-nexus-purple)]" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Nexus MCP Server</h4>
                <p className="text-[var(--color-nexus-text-muted)] leading-relaxed">
                  A custom Model Context Protocol server exposing track-specific tools (e.g. create_task, assign_volunteer, provision_workspace) with strict authorization checks.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                <SearchCode className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Real-Time Search (RTS)</h4>
                <p className="text-[var(--color-nexus-text-muted)] leading-relaxed">
                  Executes semantic search strictly within the requesting user&apos;s permission boundary (`search:read.public`). No customer data leaks externally.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col justify-center border-white/10">
            <h4 className="text-lg font-bold mb-6 text-center text-white/80 uppercase tracking-widest">Data Flow (Single Turn)</h4>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
              {[
                "User @mentions Nexus in a thread",
                "Bolt routes event to Reasoning Layer",
                "Reasoning Layer queries RTS API for context",
                "Reasoning Layer invokes MCP tools if needed",
                "Nexus replies with Block Kit UI"
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#030014] bg-[var(--color-nexus-accent)] text-white font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    {idx + 1}
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl shadow-lg border border-white/10 text-sm font-medium text-white/90">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
