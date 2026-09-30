import React, { useState, useEffect } from 'react';
import { 
  Database, Play, RefreshCw, CheckCircle2, ShieldCheck, 
  Clock, Server, AlertTriangle, Layers, Activity, FileCheck
} from 'lucide-react';
import { CollectionRun, SourceAdapterStatus } from '../types';
import { api } from '../services/api';

export const DataPipelineView: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<{
    status: string;
    last_run: CollectionRun;
    recent_runs: CollectionRun[];
    active_adapters: SourceAdapterStatus[];
    schedule: string;
    safeguards: Record<string, string>;
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.getPipelineStatus();
      setPipelineData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRunCollection = async () => {
    setIsRunning(true);
    setActionMessage('Initiating simulated ingestion across 11 source adapters...');
    try {
      const res = await api.runDemoCollection();
      setActionMessage(`Collection Complete: ${res.new_observations_collected} quotes ingested (${res.valid_quotes} valid, ${res.flagged_quotes} flagged).`);
      await fetchStatus();
    } catch (err) {
      setActionMessage('Collection execution failed');
    } finally {
      setIsRunning(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleRecalculateAPIx = async () => {
    setIsRecalculating(true);
    setActionMessage('Recalculating Jevons/Tornqvist stratum relatives and APIx index...');
    try {
      await api.recalculateAPIx();
      setActionMessage('APIx index re-synchronized successfully across 30 historical days.');
      await fetchStatus();
    } catch (err) {
      setActionMessage('Recalculation failed');
    } finally {
      setIsRecalculating(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Simulation Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>DATA INGESTION PIPELINE & SOURCE ADAPTERS</span>
            </h2>
            <p className="text-xs text-slate-400">
              Automated scheduled extraction, ethical rate-limiting, and resilient multi-source ingestion
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunCollection}
              disabled={isRunning || isRecalculating}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-glow-cyan transition-all disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'COLLECTING...' : 'RUN DEMO COLLECTION'}</span>
            </button>

            <button
              onClick={handleRecalculateAPIx}
              disabled={isRunning || isRecalculating}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-cyan-300 font-mono text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRecalculating ? 'CALCULATING...' : 'RECALCULATE APIx'}</span>
            </button>
          </div>
        </div>

        {/* Action Status Toast */}
        {actionMessage && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Ethical Safeguards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="glass-panel rounded-xl p-4 border border-surface-border">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical Rate-Limiting</span>
          </div>
          <div className="text-slate-300">Token-bucket algorithm (max 2-3 req/s)</div>
          <div className="text-[10px] text-slate-500 mt-1">Prevents server overload on public airline endpoints</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-surface-border">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Robots.txt & ToS Adherence</span>
          </div>
          <div className="text-slate-300">Automated policy validation</div>
          <div className="text-[10px] text-slate-500 mt-1">Only collects publicly available pricing quotes</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-surface-border">
          <div className="flex items-center space-x-2 text-purple-400 font-bold mb-1">
            <Server className="w-4 h-4" />
            <span>Zero Anti-Bot Bypass</span>
          </div>
          <div className="text-slate-300">No CAPTCHA / WAF circumvention</div>
          <div className="text-[10px] text-slate-500 mt-1">Direct fallback to permitted MoSPI partner API gateways</div>
        </div>
      </div>

      {/* Collection Runs Ledger */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        <div className="p-4 border-b border-surface-border bg-surface-subtle flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Ingestion Run Ledger (Recent Surveillance Cycles)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Schedule: 4-Hour Daily Pulses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-surface-subtle/50 border-b border-surface-border text-slate-400 text-[11px] uppercase">
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-3">Started</th>
                <th className="py-3 px-3 text-center">Sources</th>
                <th className="py-3 px-3 text-center">Corridors</th>
                <th className="py-3 px-3 text-right">Raw Quotes</th>
                <th className="py-3 px-3 text-right text-emerald-400">Valid</th>
                <th className="py-3 px-3 text-right text-amber-400">Review</th>
                <th className="py-3 px-3 text-right text-rose-400">Rejected</th>
                <th className="py-3 px-3 text-center">Duration</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {pipelineData?.recent_runs.map((run) => (
                <tr key={run.run_id} className="hover:bg-surface-hover/70 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-cyan-300">{run.run_id}</td>
                  <td className="py-2.5 px-3 text-slate-400">{run.started_at}</td>
                  <td className="py-2.5 px-3 text-center">{run.sources}</td>
                  <td className="py-2.5 px-3 text-center">{run.routes}</td>
                  <td className="py-2.5 px-3 text-right font-bold">{run.observations}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{run.valid_count}</td>
                  <td className="py-2.5 px-3 text-right text-amber-400">{run.flagged_count}</td>
                  <td className="py-2.5 px-3 text-right text-rose-400">{run.rejected_count}</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">
                    {run.duration_sec ? `${run.duration_sec.toFixed(1)}s` : '02:18'}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 11 Source Adapters Grid */}
      <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Aviation Ecosystem Adapters (11 Active Integrations)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Modular adapter abstraction layer ready for permitted source gateways
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">11/11 CONNECTED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {pipelineData?.active_adapters.map((adapter) => {
            const isAirline = adapter.type === 'AIRLINE';

            return (
              <div key={adapter.source_name} className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{adapter.source_name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isAirline ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {adapter.type}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 truncate">{adapter.domain}</div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-surface-border/50 text-slate-400">
                  <span>Ping: <strong className="text-slate-200">{adapter.latency_ms}ms</strong></span>
                  <span>Limit: <strong className="text-slate-200">{adapter.rate_limit_rps} rps</strong></span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
