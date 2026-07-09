"use client";

import { motion } from "framer-motion";
import { Briefcase, HeartHandshake, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tracks = [
  {
    id: "flow",
    title: "Nexus Flow",
    track: "New Slack Agent",
    icon: Briefcase,
    color: "from-blue-500/20 to-blue-500/0",
    iconColor: "text-blue-400",
    description: "For Engineering & Product teams. Captures decisions from threads, auto-creates Jira/Linear tickets, and uses RTS to prevent duplicate questions before they're even asked.",
    tools: ["create_task", "fetch_status", "search_kb"],
  },
  {
    id: "impact",
    title: "Nexus Impact",
    track: "Slack Agent for Good",
    icon: HeartHandshake,
    color: "from-emerald-500/20 to-emerald-500/0",
    iconColor: "text-emerald-400",
    description: "For Non-profits & Disaster Relief. Turns multi-channel chaos into assigned tasks and live resource ledgers. Uses cross-channel RTS to detect conflicting instructions.",
    tools: ["assign_volunteer", "log_resource"],
  },
  {
    id: "enterprise",
    title: "Nexus Enterprise",
    track: "Slack Agent for Orgs",
    icon: Building2,
    color: "from-purple-500/20 to-purple-500/0",
    iconColor: "text-purple-400",
    description: "For IT / Operations Admins. The same engine, packaged for org-wide install. Features org-ready RTS configuration, usage dashboards, and live Marketplace submission.",
    tools: ["provision_workspace", "manage_billing"],
  },
];

export function TracksShowcase() {
  return (
    <section id="tracks" className="relative pt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">One Engine. <span className="text-[var(--color-nexus-cyan)]">Three Apps.</span></h2>
        <p className="text-[var(--color-nexus-text-muted)] text-lg max-w-2xl mx-auto">
          Nexus uses a single core architecture instantiated into three legitimately distinct submissions, targeting every track of the hackathon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tracks.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="glass relative overflow-hidden rounded-3xl p-8 group hover:border-[var(--color-nexus-cyan)]/50 transition-colors"
          >
            <div className={cn("absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b opacity-50 pointer-events-none", t.color)} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-xl bg-white/5", t.iconColor)}>
                  <t.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70">
                  {t.track}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{t.title}</h3>
              <p className="text-[var(--color-nexus-text-muted)] mb-8 leading-relaxed">
                {t.description}
              </p>
              
              <div>
                <p className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">MCP Tools Used</p>
                <div className="flex flex-wrap gap-2">
                  {t.tools.map(tool => (
                    <span key={tool} className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-[var(--color-nexus-cyan)] border border-[var(--color-nexus-cyan)]/20">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
