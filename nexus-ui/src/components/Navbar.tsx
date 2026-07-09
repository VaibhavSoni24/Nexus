"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4"
    >
      <div className="glass px-6 py-3 rounded-full flex items-center justify-between w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-nexus-cyan)]" />
          <span className="font-bold text-lg tracking-tight">Nexus</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-nexus-text-muted)]">
          <a href="#tracks" className="hover:text-white transition-colors">Tracks</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#admin" className="hover:text-white transition-colors">Admin Dashboard</a>
        </div>
      </div>
    </motion.nav>
  );
}
