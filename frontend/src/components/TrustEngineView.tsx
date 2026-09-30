import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, Sliders, 
  CheckCircle2, RefreshCw, BarChart, Info, ShieldAlert
} from 'lucide-react';
import { QualitySummary } from '../types';
import { api } from '../services/api';

export const TrustEngineView: React.FC = () => {
  const [quality, setQuality] = useState<QualitySummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Local weights simulation
  const [weights, setWeights] = useState({
    freshness: 20,
    completeness: 20,
    consistency: 20,
    anomaly: 20,
    cross_source: 20
  });

  const fetchQuality = async () => {
    setLoading(true);
    try {
      const res = await api.getQualitySummary();
      setQuality(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuality();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>TRUST ENGINE & DATA QUALITY GATEWAY</span>
            </h2>
            <p className="text-xs text-slate-400">
              Transforming raw web-scraped quotes into statistically verified, comparable observations
            </p>
          </div>

          <div className="text-xs font-mono text-amber-300/80 italic">
            “Prototype Observation Quality Score — configurable statistical calibration”
          </div>
        </div>
      </div>

      {/* Quality Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="glass-panel rounded-xl p-5 border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span className="font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>VALID (80–100)</span>
            </span>
            <span className="text-lg font-black">{quality?.valid_pct.toFixed(1) || 98.5}%</span>
          </div>
          <div className="mt-3 text-2xl font-black text-white">
            {(quality?.valid_count || 9308).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Enters headline APIx index and stratum price relatives
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span className="font-bold flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>REVIEW (50–79)</span>
            </span>
            <span className="text-lg font-black">{quality?.review_pct.toFixed(1) || 1.5}%</span>
          </div>
          <div className="mt-3 text-2xl font-black text-white">
            {(quality?.review_count || 140).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Missing fee unbundling; queued for imputation review
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-rose-500/30 bg-rose-950/20">
          <div className="flex items-center justify-between text-xs text-rose-400">
            <span className="font-bold flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>REJECTED (0–49)</span>
            </span>
            <span className="text-lg font-black">{quality?.rejected_pct.toFixed(1) || 0.1}%</span>
          </div>
          <div className="mt-3 text-2xl font-black text-white">
            {(quality?.rejected_count || 2).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Extreme statistical outliers (MAD test failure)
          </div>
        </div>
      </div>

      {/* Five Pillars of Trust Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pillar Dimension Performance */}
        <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
              <BarChart className="w-4 h-4 text-cyan-400" />
              <span>Five Pillars of Observation Quality</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Average Scores (0-100)</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { key: 'freshness', name: '1. Scraping Freshness', score: quality?.dimension_averages.freshness || 94.1, desc: 'Temporal decay penalty beyond 4-hour collection cycle' },
              { key: 'completeness', name: '2. Statutory Completeness', score: quality?.dimension_averages.completeness || 99.7, desc: 'Presence of base fare, UDF/PSF, GST, and convenience fees' },
              { key: 'consistency', name: '3. Historical Consistency', score: quality?.dimension_averages.consistency || 95.0, desc: 'Absence of duplicate quote injection or sudden fare spikes' },
              { key: 'anomaly_resistance', name: '4. Anomaly Resistance', score: quality?.dimension_averages.anomaly_resistance || 96.3, desc: 'Median Absolute Deviation (MAD) & Modified Z-Score test' },
              { key: 'cross_source_agreement', name: '5. Cross-Source Consensus', score: quality?.dimension_averages.cross_source_agreement || 93.3, desc: 'Agreement with airline direct and peer aggregator pricing' },
            ].map((p) => (
              <div key={p.key} className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">{p.name}</span>
                  <span className="font-bold text-cyan-300">{p.score.toFixed(1)}/100</span>
                </div>
                <div className="h-2.5 bg-surface-subtle rounded-full overflow-hidden border border-surface-border/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${p.score}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Anomaly Detection Showcase */}
        <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Anomaly Detection Case Study (MAD Gating)</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
              DETECTED & EXCLUDED
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-3 font-mono text-xs">
            <div className="text-slate-300">
              On <strong className="text-white">MAA-DEL (T+15)</strong>, our automated ingestion engine captured 5 quotes:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-surface-card border border-surface-border text-slate-300">
                <div className="text-[10px] text-slate-500">Airline Direct</div>
                <div className="font-bold">₹5,980</div>
                <div className="text-[9px] text-emerald-400">✓ Valid</div>
              </div>
              <div className="p-2 rounded bg-surface-card border border-surface-border text-slate-300">
                <div className="text-[10px] text-slate-500">OTA A</div>
                <div className="font-bold">₹6,000</div>
                <div className="text-[9px] text-emerald-400">✓ Valid</div>
              </div>
              <div className="p-2 rounded bg-surface-card border border-surface-border text-slate-300">
                <div className="text-[10px] text-slate-500">OTA B</div>
                <div className="font-bold">₹6,020</div>
                <div className="text-[9px] text-emerald-400">✓ Valid</div>
              </div>
              <div className="p-2 rounded bg-surface-card border border-surface-border text-slate-300">
                <div className="text-[10px] text-slate-500">OTA C</div>
                <div className="font-bold">₹6,110</div>
                <div className="text-[9px] text-emerald-400">✓ Valid</div>
              </div>
              <div className="p-2 rounded bg-rose-950/50 border border-rose-500/50 text-rose-300 sm:col-span-2">
                <div className="text-[10px] text-rose-400 font-bold">OTA D (Aggregator Surge Glitch)</div>
                <div className="font-bold text-base">₹35,900 ⚠</div>
                <div className="text-[9px] text-rose-400">Z = 5.2 (Exceeds 3.5 MAD threshold)</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-1 text-[11px]">
              <div><strong className="text-cyan-300">Statistical Action:</strong> Outlier detected by robust Z-score.</div>
              <div><strong className="text-emerald-400">Gating Result:</strong> Excluded from representative stratum median (Consensus: ₹6,027).</div>
              <div className="text-slate-400">Prevents artificial inflation distortion in official CPI release.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
