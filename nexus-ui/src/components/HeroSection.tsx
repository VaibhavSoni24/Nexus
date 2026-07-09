"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Search, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-32 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-nexus-accent-glow)] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-6 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-nexus-cyan)]/30 bg-[var(--color-nexus-cyan)]/10 text-[var(--color-nexus-cyan)] text-sm mb-8"
        >
          <Zap className="w-4 h-4" />
          <span>Slack Agent Builder Challenge Submission</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 leading-tight"
        >
          The Unified AI Context <br />
          <span className="gradient-text">Layer for Slack</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-[var(--color-nexus-text-muted)] max-w-2xl mb-12"
        >
          One core engine. Three winning tracks. Nexus watches, remembers, and acts on your threads—turning scattered conversations into structured institutional memory.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a href="#tracks" className="bg-[var(--color-nexus-accent)] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-nexus-accent)]/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            Explore Tracks
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 flex flex-wrap justify-center gap-6"
        >
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Agent Builder</p>
              <p className="text-xs text-[var(--color-nexus-text-muted)]">Native workflows</p>
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">MCP Integrated</p>
              <p className="text-xs text-[var(--color-nexus-text-muted)]">Secure tool access</p>
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">RTS API</p>
              <p className="text-xs text-[var(--color-nexus-text-muted)]">Live semantic search</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
