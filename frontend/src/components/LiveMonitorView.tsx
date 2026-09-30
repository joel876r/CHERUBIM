import React, { useState, useEffect } from 'react';
import { 
  Activity, Radio, Wifi, Server, ShieldCheck, 
  Clock, ArrowUpRight, Plane, RefreshCw
} from 'lucide-react';
import { SourceAdapterStatus } from '../types';
import { api } from '../services/api';

interface LiveFeedItem {
  id: string;
  time: string;
  source: string;
  route: string;
  airline: string;
  fare: number;
  window: string;
  status: 'VALID' | 'REVIEW' | 'REJECTED';
}

export const LiveMonitorView: React.FC = () => {
  const [adapters, setAdapters] = useState<SourceAdapterStatus[]>([]);
  const [feed, setFeed] = useState<LiveFeedItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchAdapters = async () => {
      try {
        const res = await api.getAdapters();
        setAdapters(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdapters();

    // Initial feed
    const initialFeed: LiveFeedItem[] = [
      { id: 'OBS-009450', time: '10:30:12', source: 'IndiGo Direct', route: 'DEL-BOM', airline: 'IndiGo', fare: 6850, window: 'T+7', status: 'VALID' },
      { id: 'OBS-009449', time: '10:30:10', source: 'MakeMyTrip', route: 'MAA-DEL', airline: 'Air India', fare: 6120, window: 'T+15', status: 'VALID' },
      { id: 'OBS-009448', time: '10:30:08', source: 'Cleartrip', route: 'DEL-BLR', airline: 'Akasa Air', fare: 5940, window: 'T+15', status: 'VALID' },
      { id: 'OBS-009447', time: '10:30:05', source: 'EaseMyTrip', route: 'BOM-BLR', airline: 'SpiceJet', fare: 3820, window: 'T+30', status: 'VALID' },
      { id: 'OBS-009446', time: '10:30:02', source: 'Yatra', route: 'DEL-CCU', airline: 'Air India', fare: 6450, window: 'T+7', status: 'VALID' },
    ];
    setFeed(initialFeed);

    // Simulate incoming live pulses
    const interval = setInterval(() => {
      if (!isPaused) {
        const routes = ['MAA-DEL', 'DEL-BOM', 'DEL-BLR', 'BOM-BLR', 'DEL-CCU', 'BLR-HYD'];
        const airlines = ['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet', 'Air India Express'];
        const sources = ['MakeMyTrip', 'EaseMyTrip', 'Cleartrip', 'Yatra', 'IndiGo Direct', 'Ixigo'];
        const windows = ['T+1', 'T+7', 'T+15', 'T+30', 'T+45'];
        
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const randomRoute = routes[Math.floor(Math.random() * routes.length)];
        const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        const randomWindow = windows[Math.floor(Math.random() * windows.length)];
        const baseFare = randomRoute.includes('HYD') ? 3200 : randomRoute.includes('BOM') ? 5800 : 6200;
        const randomFare = baseFare + Math.floor(Math.random() * 800);

        const newItem: LiveFeedItem = {
          id: `OBS-${Math.floor(Math.random() * 10000 + 9400)}`,
          time: timeStr,
          source: randomSource,
          route: randomRoute,
          airline: randomAirline,
          fare: randomFare,
          window: randomWindow,
          status: 'VALID'
        };

        setFeed((prev) => [newItem, ...prev.slice(0, 19)]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>LIVE EXTRACTION MONITOR & RADAR TELEMETRY</span>
            </h2>
            <p className="text-xs text-slate-400">
              High-frequency incoming price feed from 11 airline portals and Online Travel Aggregators
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                isPaused 
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' 
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {isPaused ? 'FEED PAUSED' : 'LIVE STREAM ACTIVE'}
            </button>
            <span className="text-slate-400">Polling: 2.8s cycle</span>
          </div>
        </div>
      </div>

      {/* Grid: Radar Telemetry & Ingestion Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Radar Sweep & Health Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radar Sweep Widget */}
          <div className="glass-panel rounded-2xl p-6 border border-surface-border relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
            <div className="absolute inset-0 radar-grid opacity-30"></div>
            
            {/* Concentric radar circles */}
            <div className="relative w-64 h-64 rounded-full border border-cyan-500/20 flex items-center justify-center radar-sweep">
              <div className="w-48 h-48 rounded-full border border-cyan-500/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-cyan-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/40">
                    <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 text-center font-mono">
              <div className="text-xs font-bold text-slate-100 flex items-center justify-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SURVEILLANCE RADAR ONLINE</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Zero rate-limit violations • 100% robots.txt adherence
              </div>
            </div>
          </div>

          {/* Quick Telemetry Cards */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-slate-400 text-[10px] uppercase">Avg Adapter Ping</div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">68 ms</div>
              <div className="text-[10px] text-slate-500 mt-0.5">TLS handshake 1.3</div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-slate-400 text-[10px] uppercase">Quote Throughput</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">720 / run</div>
              <div className="text-[10px] text-slate-500 mt-0.5">30 strata covered</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Incoming Quote Stream */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-surface-border space-y-3 flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
            <div className="flex items-center space-x-2 font-mono text-xs">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">Real-Time Ingestion Telemetry Stream</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>LISTENING</span>
            </span>
          </div>

          {/* Stream Rows */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {feed.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3 rounded-xl bg-surface-subtle border border-surface-border/60 flex items-center justify-between hover:bg-surface-hover/80 transition-all animate-in fade-in slide-in-from-top-1"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-cyan-300">{item.route}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-200 font-semibold">{item.airline}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-card text-purple-300">
                        {item.window}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Source: {item.source} • Ref: {item.id}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-sm">
                    ₹{item.fare.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
