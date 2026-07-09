"use client";

import { motion } from "framer-motion";

export function NexusDescription() {
  return (
    <section className="py-20 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl bg-white/[0.02] border border-white/10 rounded-3xl p-10 md:p-14 text-center glass-glow relative overflow-hidden"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">What is <span className="text-[var(--color-nexus-cyan)]">Nexus?</span></h2>
        
        <p className="text-lg text-[var(--color-nexus-text-muted)] leading-relaxed mb-8">
          Nexus is a single, powerful AI agent architecture designed to solve three completely different enterprise challenges. Instead of building a basic chatbot, we built a <strong>Unified Context Layer</strong> that connects Slack directly to external tools using the Model Context Protocol (MCP).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <h3 className="text-blue-400 font-bold text-xl mb-3">1. Nexus Flow</h3>
            <p className="text-sm text-white/70">
              Built for Engineering. It tracks technical decisions, turns chat into Jira tickets, and searches GitHub docs seamlessly in Slack.
            </p>
          </div>
          
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <h3 className="text-purple-400 font-bold text-xl mb-3">2. Nexus Impact</h3>
            <p className="text-sm text-white/70">
              Built for Non-profits. It orchestrates disaster relief by assigning volunteers and tracking resources across chaotic emergency channels.
            </p>
          </div>
          
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <h3 className="text-emerald-400 font-bold text-xl mb-3">3. Nexus Enterprise</h3>
            <p className="text-sm text-white/70">
              Built for IT Admins. It securely provisions new workspaces and monitors AI agent usage across the entire organization.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
