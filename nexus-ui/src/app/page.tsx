import { HeroSection } from "@/components/HeroSection";
import { TracksShowcase } from "@/components/TracksShowcase";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Navbar } from "@/components/Navbar";
import { NexusDescription } from "@/components/NexusDescription";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Navbar />
      <HeroSection />
      
      <div className="container mx-auto px-6 max-w-6xl space-y-32">
        <NexusDescription />
        <TracksShowcase />
        <ArchitectureDiagram />
        <AdminDashboard />
      </div>
      
      <footer className="mt-32 border-t border-[rgba(255,255,255,0.1)] w-full py-12 text-center text-[var(--color-nexus-text-muted)]">
        <p>© 2026 Nexus. Submitted for the Slack Agent Builder Challenge.</p>
        <p className="mt-2 text-sm">Powered by Slack AI, Agent Builder, MCP, and RTS.</p>
      </footer>
    </main>
  );
}
