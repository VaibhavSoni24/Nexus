"use client";

import { motion } from "framer-motion";
import { Activity, Users, Zap, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Poll the Next.js memory for actual live tool invocations from Slack
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/mcp?logs=true");
        const data = await res.json();
        setLogs(data.logs);
      } catch (e) {
        console.error("Failed to fetch live logs");
      }
    }, 1000); // 1 second polling for real-time demo

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleManageListing = () => {
    toast.success("Marketplace Listing Updated", {
      description: "Your RTS scopes have been synchronized with the Slack App Directory.",
    });
  };

  return (
    <section id="admin" className="pt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Enterprise <span className="text-emerald-400">Admin Console</span></h2>
        <p className="text-[var(--color-nexus-text-muted)] text-lg max-w-2xl mx-auto">
          Govern agent usage, monitor MCP tool calls, and control org-ready RTS permissions across all connected workspaces.
        </p>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2rem] p-6 md:p-10 border border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(52,211,153,0.05)]">
        {/* Subtle glowing orb in background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Workspaces", value: "1", icon: Users, color: "text-blue-400" },
            { label: "Real-time Queries", value: logs.length.toString(), icon: SearchCode, color: "text-emerald-400" },
            { label: "MCP Invocations", value: logs.length.toString(), icon: Zap, color: "text-purple-400" },
            { label: "Data Leakage", value: "0", icon: ShieldCheck, color: "text-red-400" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
            >
              <stat.icon className={`w-7 h-7 mb-4 ${stat.color}`} />
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-sm font-medium text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Logs */}
          <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Live MCP Tool Audit Log
            </h3>
            <div className="space-y-1">
              {logs.map((log: any, i: number) => {
                // Calculate relative time roughly
                const secondsAgo = Math.floor((new Date().getTime() - new Date(log.time).getTime()) / 1000);
                const timeString = isNaN(secondsAgo) ? log.time : secondsAgo < 5 ? "Just now" : secondsAgo < 60 ? `${secondsAgo}s ago` : "A while ago";

                return (
                  <motion.div 
                    key={log.time + i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-3 px-4 hover:bg-white/[0.02] rounded-lg transition-colors text-sm border-b border-white/[0.02] last:border-0"
                  >
                    <div className="flex gap-4 items-center w-1/3">
                      <span className="text-xs text-white/40 w-16">{timeString}</span>
                      <span className="font-mono text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-md">
                        {log.action}
                      </span>
                    </div>
                    <div className="text-white/60 w-1/4 font-medium">{log.user}</div>
                    <div className="text-white/40 w-1/4 hidden sm:block font-mono text-xs">{log.workspace}</div>
                    <div className="text-emerald-400 font-medium text-right w-1/4 flex justify-end items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {log.status}
                    </div>
                  </motion.div>
                );
              })}
              {logs.length === 0 && (
                <div className="py-10 text-center text-white/30 text-sm">Waiting for live tool invocations from Slack...</div>
              )}
            </div>
          </div>

          {/* RTS Status */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-6 text-emerald-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                RTS Engine Status
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-white/70">Index Freshness</span>
                    <span className="text-emerald-400">Real-time</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-emerald-500/50 to-emerald-400 w-full h-full relative">
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-white/70">Search Scope Enforced</span>
                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs">Active</span>
                  </div>
                  <div className="text-xs text-white/40 leading-relaxed mt-2">
                    Queries strictly bound to caller's <code className="text-purple-300 bg-purple-500/10 px-1 rounded font-mono">search:read.public</code> capability via OAuth.
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleManageListing}
              className="w-full py-3.5 mt-8 bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              Manage Marketplace Listing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchCode(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m13 13-3-3" />
      <path d="m14 14 6 6" />
      <path d="m18 9 2.1-2.1a1.5 1.5 0 0 0-2.1-2.1L15.9 7" />
      <path d="m4 12.1 2.1 2.1a1.5 1.5 0 0 0 2.1-2.1L6.1 10" />
      <path d="M10 2 2 10l8 8" />
    </svg>
  );
}
