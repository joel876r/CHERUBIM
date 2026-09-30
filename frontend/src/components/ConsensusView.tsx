import React, { useState, useEffect } from 'react';
import { 
  GitMerge, CheckCircle2, AlertTriangle, AlertCircle, 
  RefreshCw, TrendingUp, Layers, Info
} from 'lucide-react';
import { CrossSourceConsensus } from '../types';
import { api } from '../services/api';

export const ConsensusView: React.FC = () => {
  const [route, setRoute] = useState('MAA-DEL');
  const [window, setWindow] = useState('T+15');
  const [consensus, setConsensus] = useState<CrossSourceConsensus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConsensus = async () => {
    setLoading(true);
    try {
      const res = await api.getCrossSourceConsensus(route, window);
      setConsensus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsensus();
  }, [route, window]);

  return (
    <div className="space-y-6">
      {/* Header & Corridor Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <GitMerge className="w-5 h-5 text-cyan-400" />
              <span>CROSS-SOURCE CONSENSUS & DIVERGENCE ENGINE</span>
            </h2>
            <p className="text-xs text-slate-400">
              Synchronizing multi-source price discovery across official airline portals and Online Travel Aggregators
            </p>
          </div>

          {/* Selectors */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="MAA-DEL">MAA-DEL (Chennai - Delhi)</option>
              <option value="DEL-BOM">DEL-BOM (Delhi - Mumbai)</option>
              <option value="DEL-BLR">DEL-BLR (Delhi - Bengaluru)</option>
              <option value="BOM-BLR">BOM-BLR (Mumbai - Bengaluru)</option>
              <option value="DEL-CCU">DEL-CCU (Delhi - Kolkata)</option>
              <option value="BLR-HYD">BLR-HYD (Bengaluru - Hyderabad)</option>
            </select>

            <select
              value={window}
              onChange={(e) => setWindow(e.target.value)}
              className="bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="T+1">T+1 (1 Day)</option>
              <option value="T+7">T+7 (7 Days)</option>
              <option value="T+15">T+15 (15 Days)</option>
              <option value="T+30">T+30 (30 Days)</option>
              <option value="T+45">T+45 (45 Days)</option>
            </select>

            <button
              onClick={fetchConsensus}
              className="p-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Consensus Metrics Banner */}
      {consensus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="glass-panel rounded-xl p-5 border border-cyan-500/30 bg-cyan-950/20">
            <div className="text-[11px] text-cyan-400 uppercase">Market Consensus Fare</div>
            <div className="mt-2 text-3xl font-black text-white">
              ₹{consensus.market_consensus_fare.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Trimmed stratum median of valid ecosystem quotes
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-emerald-500/30 bg-emerald-950/20">
            <div className="text-[11px] text-emerald-400 uppercase">Source Agreement Rate</div>
            <div className="mt-2 text-3xl font-black text-emerald-400">
              {consensus.source_agreement_pct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Quotes clustered within ±8% of median
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-purple-500/30 bg-purple-950/20">
            <div className="text-[11px] text-purple-400 uppercase">Ecosystem Sample Size</div>
            <div className="mt-2 text-3xl font-black text-purple-300">
              {consensus.sample_size} Sources
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Cross-referenced direct airlines + OTAs
            </div>
          </div>
        </div>
      )}

      {/* Consensus Comparison Quotes Table */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        <div className="p-4 border-b border-surface-border bg-surface-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-200">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">Multi-Source Price Discovery Matrix for {route} ({window})</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Rule: {consensus?.consensus_rule}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-surface-subtle/50 border-b border-surface-border text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Carrier / Flight</th>
                <th className="py-3 px-3 text-right">Base Fare</th>
                <th className="py-3 px-3 text-right">Taxes & Fees</th>
                <th className="py-3 px-4 text-right">Quote Fare</th>
                <th className="py-3 px-4 text-right">Deviation vs Consensus</th>
                <th className="py-3 px-3 text-center">Trust</th>
                <th className="py-3 px-4 text-center">Consensus Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {consensus?.quotes.map((q) => {
                const isOutlier = q.is_outlier;
                const isPositive = q.deviation_rs > 0;

                return (
                  <tr 
                    key={q.observation_id}
                    className={`transition-colors ${
                      isOutlier ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-surface-hover/70'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-100 flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isOutlier ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
                      <span>{q.source}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        q.source_type === 'AIRLINE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-surface-card text-slate-400'
                      }`}>
                        {q.source_type}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-200">{q.airline}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({q.flight_number})</span>
                    </td>

                    <td className="py-3 px-3 text-right text-slate-300">
                      ₹{q.base_fare?.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right text-slate-400">
                      ₹{(q.taxes + q.fees)?.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-sm text-slate-100">
                      ₹{q.fare?.toLocaleString()}
                    </td>

                    <td className={`py-3 px-4 text-right font-bold ${
                      isOutlier ? 'text-rose-400' : isPositive ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {isPositive ? '+' : ''}₹{q.deviation_rs?.toLocaleString()} ({isPositive ? '+' : ''}{q.deviation_pct}%)
                    </td>

                    <td className="py-3 px-3 text-center font-bold">
                      <span className={isOutlier ? 'text-rose-400' : 'text-emerald-400'}>
                        {q.trust_score}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isOutlier
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {isOutlier ? 'DIVERGENT OUTLIER ⚠' : 'CONSENSUS VALID ✓'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
