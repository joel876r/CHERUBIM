import React from 'react';
import { 
  Cpu, ShieldCheck, CheckCircle2, AlertCircle, 
  Server, Database, Lock, Globe, FileText
} from 'lucide-react';

export const SystemHealthView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>SYSTEM HEALTH & PRODUCTION SCALING ROADMAP</span>
            </h2>
            <p className="text-xs text-slate-400">
              Operational parameters, compliance verification, and enterprise MoSPI deployment architecture
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>ALL SUBSYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Grid: Prototype vs Production Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Prototype Capabilities */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>SIH 2026 Prototype Specification</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              OPERATIONAL VERTICAL SLICE
            </span>
          </div>

          <div className="space-y-2.5 text-slate-300">
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Route Corridors:</strong> 6 representative trunk routes (MAA-DEL, DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD).
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Advance Purchase Horizons:</strong> T+1, T+7, T+15, T+30, T+45 days.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Source Adapters:</strong> 11 ecosystem sources (5 Airlines + 6 OTAs) with modular interface.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Ingestion Engine:</strong> Deterministic seed demo generator + Live adapter connector interfaces.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Quality & Trust Engine:</strong> 5-pillar statistical score (0-100) + MAD outlier rejection.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Mathematical Core:</strong> Jevons geometric index $APIx_t = 100 \times \exp(\sum w_s \ln(P_t/P_0))$.
            </div>
          </div>
        </div>

        {/* Production Enterprise Roadmap */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
            <h3 className="text-sm font-bold text-purple-300 uppercase flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Production MoSPI / RBI Scaling Path</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              NATIONAL SCALE ARCHITECTURE
            </span>
          </div>

          <div className="space-y-2.5 text-slate-300">
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Nationwide Basket:</strong> Expansion to top 150 domestic routes covering 98% of Indian air passenger volume.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Permitted Direct Gateways:</strong> Official NDC (New Distribution Capability) feeds & MoSPI data-sharing MOUs with airlines.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Distributed Scraping Cluster:</strong> Celery/Redis scheduled workers with IP rotation across national nodes.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Real-time Kafka Streaming:</strong> High-throughput event ingestion from GDS and aggregators.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• Automated RBI Integration:</strong> Direct secure feed into RBI Macroeconomic Database (DBIE) and eSankhyiki portal.
            </div>
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
              <strong className="text-white">• DGCA Passenger Calibration:</strong> Monthly automatic synchronization with DGCA seat-load-factor tables.
            </div>
          </div>
        </div>
      </div>

      {/* Ethical Scraping & Legal Safeguards */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-100 uppercase text-emerald-400 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Ethical Scraping Policy & Legal Compliance Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
          <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
            <div className="font-bold text-white">1. Strict Anti-Bot Respect</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No CAPTCHA bypass, no fingerprint spoofing, no browser emulation intended to breach security perimeters. If a site restricts scraping, system defaults to API connector or partner feed.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
            <div className="font-bold text-white">2. Rate-Limiting Governance</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enforces a strict token-bucket ceiling of 2 requests per second per domain, respecting web server compute resources and preventing unintended denial-of-service pressure.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
            <div className="font-bold text-white">3. Public Data Only</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Captures only publicly accessible consumer prices without accessing authenticated or user-personalized ticket carts, in compliance with IT Act 2000 and global best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
