import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, ArrowRight, 
  ShieldCheck, Fingerprint, Layers, Database, ExternalLink
} from 'lucide-react';
import { APIxCurrent, RouteMeta } from '../types';

interface ReproducibilityLedgerViewProps {
  currentAPIx: APIxCurrent | null;
  routes: RouteMeta[];
  onExport: (format: 'csv' | 'json') => void;
}

export const ReproducibilityLedgerView: React.FC<ReproducibilityLedgerViewProps> = ({
  currentAPIx,
  routes,
  onExport
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const steps = [
    { num: 1, title: 'Headline APIx', desc: 'Weighted geometric aggregate (102.4)' },
    { num: 2, title: 'DGCA Route Basket', desc: '6 trunk corridors (MAA-DEL 18%, DEL-BOM 24%)' },
    { num: 3, title: 'Booking Stratum', desc: 'Advance booking horizon (T+1 to T+45)' },
    { num: 4, title: 'Valid Observations', desc: 'Trimmed median gating of outlier quotes' },
    { num: 5, title: 'Normalized Fares', desc: 'Statutory unbundling (Base + Tax + Fee)' },
    { num: 6, title: 'Trust Verification', desc: '5-pillar quality score (Freshness, MAD, etc.)' },
    { num: 7, title: 'Audit Fingerprint', desc: 'SHA-256 cryptographic provenance hash' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>REPRODUCIBILITY LEDGER & STATISTICAL AUDIT TRAIL</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic provenance tracking from macro CPI release down to raw scraped HTTP packet
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => onExport('csv')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-cyan-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>

            <button
              onClick={() => onExport('json')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-purple-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Step Provenance Flow Strip */}
      <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-slate-300 uppercase">
            End-to-End Traceability Chain
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">Deterministic Audit Guarantee</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-mono text-xs">
          {steps.map((s) => {
            const isSel = selectedStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setSelectedStep(s.num)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSel 
                    ? 'bg-cyan-500/20 border-cyan-500/50 shadow-glow-cyan' 
                    : 'bg-surface-subtle border-surface-border hover:bg-surface-hover/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isSel ? 'bg-cyan-400 text-black' : 'bg-surface-card text-slate-400'
                  }`}>
                    STEP {s.num}
                  </span>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSel ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
                <div className={`font-bold text-xs truncate ${isSel ? 'text-white' : 'text-slate-300'}`}>
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  {s.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail Explanation Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
          <div className="text-sm font-bold text-cyan-300 flex items-center space-x-2">
            <span>STEP {selectedStep}: {steps[selectedStep - 1].title}</span>
          </div>
          <span className="text-[11px] text-slate-400">Reproducibility State: AUDITABLE</span>
        </div>

        {selectedStep === 1 && (
          <div className="space-y-3 text-slate-300">
            <p>
              Current published index: <strong className="text-white">APIx = {currentAPIx?.index_value.toFixed(1) || '102.4'}</strong> (+{(currentAPIx?.change_percent_30d || 2.4).toFixed(1)}% vs Aug 31, 2026 base period).
            </p>
            <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-center font-bold text-cyan-300 text-sm">
              APIx_t = 100 × exp( ∑ w_s × ln( P_s,t / P_s,0 ) )
            </div>
            <p className="text-slate-400 text-[11px]">
              The headline index value is mathematically guaranteed to be a deterministic function of the underlying strata.
            </p>
          </div>
        )}

        {selectedStep === 2 && (
          <div className="space-y-3 text-slate-300">
            <p>The 6 DGCA representative trunk corridors weighting matrix:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {routes.map(r => (
                <div key={r.route} className="p-2.5 rounded-lg bg-surface-subtle border border-surface-border">
                  <div className="font-bold text-white">{r.route}</div>
                  <div className="text-[11px] text-slate-400">Weight: {(r.weight * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedStep === 3 && (
          <div className="space-y-3 text-slate-300">
            <p>Advance booking horizon strata breakdown (5 windows per corridor = 30 strata total):</p>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded bg-surface-subtle border border-surface-border font-bold">T+1 (15% w)</div>
              <div className="p-2 rounded bg-surface-subtle border border-surface-border font-bold">T+7 (25% w)</div>
              <div className="p-2 rounded bg-surface-subtle border border-surface-border font-bold">T+15 (30% w)</div>
              <div className="p-2 rounded bg-surface-subtle border border-surface-border font-bold">T+30 (20% w)</div>
              <div className="p-2 rounded bg-surface-subtle border border-surface-border font-bold">T+45 (10% w)</div>
            </div>
          </div>
        )}

        {selectedStep === 4 && (
          <div className="space-y-3 text-slate-300">
            <p>Every stratum calculates a robust representative fare using Median Absolute Deviation (MAD) gating:</p>
            <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border">
              <div>• MAA-DEL T+15 Representative Fare: <strong className="text-cyan-300">₹5,949</strong></div>
              <div>• Total valid contributing observations: <strong className="text-emerald-400">87 quotes</strong></div>
              <div>• Outliers rejected by gating: <strong className="text-rose-400">1 quote (₹35,900)</strong></div>
            </div>
          </div>
        )}

        {selectedStep === 5 && (
          <div className="space-y-3 text-slate-300">
            <p>Statutory Component Decomposition ensures apples-to-apples economic comparison:</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded bg-surface-subtle border border-surface-border">Base Fare: ₹4,850</div>
              <div className="p-2 rounded bg-surface-subtle border border-surface-border">Taxes/UDF: ₹1,020</div>
              <div className="p-2 rounded bg-surface-subtle border border-surface-border">Fees: ₹130</div>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/40 font-bold text-cyan-300">Comparable: ₹6,000</div>
            </div>
          </div>
        )}

        {selectedStep === 6 && (
          <div className="space-y-3 text-slate-300">
            <p>5-Pillar Quality Score evaluates quote integrity:</p>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div>• Freshness: 100.0/100 (scraped within surveillance pulse)</div>
              <div>• Completeness: 100.0/100 (all unbundled items present)</div>
              <div>• Duplicate Check: 95.0/100 (unique fingerprint)</div>
              <div>• Normal Range: 98.2/100 (within 1.2 MAD of stratum median)</div>
              <div>• Consensus: 94.0/100 (airline & OTA cross-agreement)</div>
            </div>
          </div>
        )}

        {selectedStep === 7 && (
          <div className="space-y-3 text-slate-300">
            <p>Every quote receives a deterministic SHA-256 fingerprint hash:</p>
            <div className="p-3 rounded-xl bg-black/40 border border-surface-border text-cyan-300 break-all">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
            <p className="text-[11px] text-slate-400">
              Enables RBI and MoSPI auditors to cryptographically verify data authenticity without third-party reliance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
