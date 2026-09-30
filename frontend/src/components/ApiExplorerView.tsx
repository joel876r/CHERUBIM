import React, { useState } from 'react';
import { 
  Code, Send, Copy, Check, Terminal, ExternalLink, 
  Layers, CheckCircle2, Clock
} from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
  defaultParams?: Record<string, string>;
}

export const ApiExplorerView: React.FC = () => {
  const endpoints: Endpoint[] = [
    { method: 'GET', path: '/api/apiX/current', desc: 'Returns headline APIx value, 30d change, valid observations count' },
    { method: 'GET', path: '/api/apiX/history?frequency=daily', desc: 'Returns 30-day historical time-series of APIx index' },
    { method: 'GET', path: '/api/routes', desc: 'Returns list of 6 monitored corridors with weights & average fares' },
    { method: 'GET', path: '/api/routes/MAA-DEL/dna', desc: 'Returns comprehensive Route Airfare DNA for specified corridor' },
    { method: 'GET', path: '/api/lead-time/pressure', desc: 'Returns advance booking window elasticity curve (T+45 to T+1)' },
    { method: 'GET', path: '/api/observations?page=1&page_size=5', desc: 'Filterable raw & normalized quotes with trust metadata' },
    { method: 'GET', path: '/api/observations/OBS-000481', desc: 'Detailed Fare Fingerprint, statutory components, SHA-256 hash' },
    { method: 'GET', path: '/api/quality/summary', desc: 'Observation Quality Score distribution and 5-pillar averages' },
    { method: 'GET', path: '/api/consensus/MAA-DEL/T+15', desc: 'Cross-source consensus matrix and market consensus price' },
    { method: 'GET', path: '/api/contributions', desc: 'Inflation decomposition answering "Why did APIx move?"' },
    { method: 'GET', path: '/api/pipeline/status', desc: 'Ingestion pipeline status, adapter health, ethical safeguards' },
    { method: 'POST', path: '/api/pipeline/run', desc: 'Simulates multi-source collection run for prototype demonstration' },
    { method: 'POST', path: '/api/index/recalculate', desc: 'Recalculates Jevons geometric index across all historical days' },
    { method: 'GET', path: '/api/health', desc: 'System health, SQLite engine status, MoSPI compliance info' },
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0]);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const executeCall = async () => {
    setLoading(true);
    setResponseJson(null);
    setStatusCode(null);
    const start = performance.now();
    try {
      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
      });
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setStatusCode(res.status);
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setStatusCode(500);
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (responseJson) {
      navigator.clipboard.writeText(responseJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <Code className="w-5 h-5 text-cyan-400" />
              <span>GOVERNMENT REST API EXPLORER</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive test console for National Statistical Office (NSO) and RBI monetary policy consumers
            </p>
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-mono text-cyan-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open OpenAPI / Swagger Docs</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector & Request/Response Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-4 border border-surface-border space-y-2 max-h-[620px] overflow-y-auto">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase px-2 mb-2">
            Available API Endpoints
          </div>

          {endpoints.map((ep) => {
            const isSel = selectedEndpoint.path === ep.path;
            const isGet = ep.method === 'GET';

            return (
              <div
                key={ep.path}
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setResponseJson(null);
                  setStatusCode(null);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all font-mono text-xs ${
                  isSel 
                    ? 'bg-cyan-500/15 border-cyan-500/50 shadow-glow-cyan' 
                    : 'bg-surface-subtle border-surface-border hover:bg-surface-hover/80 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isGet ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-100 truncate">{ep.path}</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {ep.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Request & Response Console */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Endpoint Runner Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-surface-border flex items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center space-x-2 flex-1 overflow-hidden">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                selectedEndpoint.method === 'GET' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedEndpoint.method}
              </span>
              <span className="font-bold text-slate-100 truncate">{selectedEndpoint.path}</span>
            </div>

            <button
              onClick={executeCall}
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-50 shrink-0 shadow-glow-cyan"
            >
              <Send className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'SENDING...' : 'SEND REQUEST'}</span>
            </button>
          </div>

          {/* Response Payload Box */}
          <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-3 font-mono text-xs min-h-[460px] flex flex-col">
            <div className="flex items-center justify-between border-b border-surface-border/60 pb-2">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-300 uppercase">Response JSON</span>
                {statusCode && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    statusCode === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-rose-950 text-rose-400 border border-rose-700'
                  }`}>
                    HTTP {statusCode}
                  </span>
                )}
                {latencyMs && (
                  <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{latencyMs} ms</span>
                  </span>
                )}
              </div>

              {responseJson && (
                <button
                  onClick={copyResponse}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-black/60 rounded-xl p-4 border border-surface-border/60 overflow-y-auto max-h-[480px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Executing REST request against CHERUBIM backend...
                </div>
              ) : responseJson ? (
                <pre className="text-cyan-300/90 whitespace-pre-wrap leading-relaxed">
                  {responseJson}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600" />
                  <div>Click "SEND REQUEST" to inspect the live response.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
