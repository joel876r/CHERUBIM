import React, { useState, useEffect } from 'react';
import { 
  Compass, TrendingUp, TrendingDown, ShieldCheck, 
  Activity, Plane, ArrowRight, BarChart2, Layers
} from 'lucide-react';
import { RouteMeta, RouteDNA } from '../types';
import { api } from '../services/api';

interface RouteIntelligenceViewProps {
  routes: RouteMeta[];
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
}

export const RouteIntelligenceView: React.FC<RouteIntelligenceViewProps> = ({
  routes,
  selectedRoute,
  onSelectRoute
}) => {
  const [dna, setDna] = useState<RouteDNA | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDNA = async () => {
      setLoading(true);
      try {
        const res = await api.getRouteDNA(selectedRoute || 'MAA-DEL');
        setDna(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDNA();
  }, [selectedRoute]);

  const activeRouteObj = routes.find(r => r.route === selectedRoute) || routes[0];

  return (
    <div className="space-y-6">
      {/* Top Route Selector Strip */}
      <div className="glass-panel rounded-2xl p-5 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>ROUTE AIRFARE DNA & CORRIDOR INTELLIGENCE</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deep micro-level price formation, lead-time curvature, and carrier dispersion
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Selected: <strong className="text-cyan-300">{selectedRoute}</strong> ({activeRouteObj?.origin_city} ⇄ {activeRouteObj?.dest_city})
          </div>
        </div>

        {/* Route Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {routes.map((r) => {
            const isSel = selectedRoute === r.route;
            return (
              <button
                key={r.route}
                onClick={() => onSelectRoute(r.route)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSel
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-glow-cyan'
                    : 'bg-surface-subtle border-surface-border hover:bg-surface-hover/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className={`text-sm font-bold ${isSel ? 'text-cyan-300' : 'text-slate-100'}`}>
                    {r.route}
                  </span>
                  <span className="text-[10px] text-slate-400">{(r.weight * 100).toFixed(0)}% w</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {r.origin_city} - {r.dest_city}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Route DNA Card */}
      {dna && (
        <div className="space-y-6">
          {/* Top 6 DNA Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Average Fare</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                ₹{dna.average_fare?.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Comparable basis</div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase">30-Day Movement</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${
                dna.movement_30d >= 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {dna.movement_30d >= 0 ? '+' : ''}{dna.movement_30d}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Corridor inflation</div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Volatility</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {dna.volatility}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Coefficient of var</div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Lead-Time Pressure</div>
              <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                {dna.lead_time_pressure}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">+{dna.lead_time_pressure_pct}% T1/T45</div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Source Agreement</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                {dna.source_agreement}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Cluster consensus</div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Quality Score</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {dna.observation_quality}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{dna.sample_size} observations</div>
            </div>
          </div>

          {/* Middle Two-Column Grid: Fare Curve & Carrier Contribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Window Fare Curve */}
            <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    <span>Booking Window Elasticity Curve</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Lead-time price progression for {selectedRoute}
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  Spread: ₹{((dna.fare_curve?.['T+1'] || 7900) - (dna.fare_curve?.['T+45'] || 4800)).toLocaleString()}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {['T+45', 'T+30', 'T+15', 'T+7', 'T+1'].map((w) => {
                  const fare = dna.fare_curve?.[w] || 5000;
                  const maxFare = Math.max(...Object.values(dna.fare_curve || { 'T+1': 8000 }));
                  const pct = (fare / (maxFare || 1)) * 100;
                  const isT1 = w === 'T+1';

                  return (
                    <div key={w} className="space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-bold flex items-center space-x-2">
                          <span className={isT1 ? 'text-purple-400' : 'text-slate-300'}>{w}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({w === 'T+1' ? '1 day before' : w.replace('T+', '') + ' days before'})
                          </span>
                        </span>
                        <span className="font-bold text-slate-100">₹{fare.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-surface-subtle rounded-full overflow-hidden border border-surface-border/50">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isT1
                              ? 'bg-gradient-to-r from-purple-500 to-rose-500'
                              : 'bg-gradient-to-r from-cyan-600 to-blue-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carrier Contribution to Corridor Inflation */}
            <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
                    <Plane className="w-4 h-4 text-emerald-400" />
                    <span>Carrier Mix & Inflation Contribution</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Airlines operating in the {selectedRoute} corridor
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {dna.carrier_contribution?.map((c) => (
                  <div key={c.airline} className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center font-bold text-slate-300">
                        {c.airline.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{c.airline}</div>
                        <div className="text-[10px] text-slate-400">Market Share: {c.share_pct}%</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-200">₹{c.avg_fare?.toLocaleString()}</div>
                      <div className="text-[10px] text-cyan-400 font-semibold">
                        +{c.contribution_pct}% contribution
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Source Dispersion Table (Demonstrating Cross-Source Consensus) */}
          <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Source Dispersion & Consensus Comparison</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Variance between direct airline portals and Online Travel Aggregators (OTAs)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {dna.source_dispersion?.map((s) => {
                const isDirect = s.source_type === 'AIRLINE';
                const diff = s.diff_from_route_avg || 0;

                return (
                  <div key={s.source} className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200">{s.source}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                        isDirect ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-surface-card text-slate-400'
                      }`}>
                        {s.source_type}
                      </span>
                    </div>

                    <div className="text-base font-bold text-white mt-2">
                      ₹{s.avg_fare?.toLocaleString()}
                    </div>

                    <div className={`text-[10px] mt-1 ${diff >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {diff >= 0 ? '+' : ''}₹{diff.toLocaleString()} vs avg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
