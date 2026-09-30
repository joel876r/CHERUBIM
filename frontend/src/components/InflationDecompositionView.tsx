import React, { useState } from 'react';
import { 
  PieChart, TrendingUp, ArrowRight, Compass, 
  BarChart3, Layers, Info, ChevronRight, HelpCircle
} from 'lucide-react';
import { InflationDecomposition } from '../types';

interface InflationDecompositionViewProps {
  inflation: InflationDecomposition | null;
  onSelectRoute: (route: string) => void;
  onNavigateToDNA: () => void;
}

export const InflationDecompositionView: React.FC<InflationDecompositionViewProps> = ({
  inflation,
  onSelectRoute,
  onNavigateToDNA
}) => {
  const [activeTab, setActiveTab] = useState<'route' | 'window'>('route');

  const totalMovement = inflation?.total_movement_pct || 2.4;

  return (
    <div className="space-y-6">
      {/* Top Headline Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-purple-400 font-semibold mb-1 flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Statistical Attribution Engine</span>
            </div>
            <div className="flex items-baseline space-x-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                WHY DID APIx MOVE?
              </h2>
              <div className="text-xl font-bold font-mono text-emerald-400">
                +{totalMovement.toFixed(1)}% Total Shift
              </div>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-2">
              {inflation?.explanation || "APIx shifted by +2.4% primarily driven by MAA-DEL corridor surges and intense T+1 near-departure demand."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-surface-border font-mono text-xs">
            <button
              onClick={() => setActiveTab('route')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'route'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BY ROUTE CORRIDOR
            </button>
            <button
              onClick={() => setActiveTab('window')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'window'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BY BOOKING HORIZON
            </button>
          </div>
        </div>
      </div>

      {/* Main Breakdown Waterfall / Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Contribution Bars */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 font-mono">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>
                {activeTab === 'route' ? 'Corridor Contributions to Net Headline Change' : 'Booking Horizon Elasticity Contribution'}
              </span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Additive Linearized Relatives</span>
          </div>

          <div className="space-y-3 pt-2">
            {(activeTab === 'route' ? inflation?.route_contributions : inflation?.window_contributions)?.map((item) => {
              const isPositive = item.contribution_pct >= 0;
              const maxContrib = Math.max(
                ...((activeTab === 'route' ? inflation?.route_contributions : inflation?.window_contributions) || []).map(x => Math.abs(x.contribution_pct))
              ) || 1;
              const barWidth = (Math.abs(item.contribution_pct) / maxContrib) * 100;

              return (
                <div
                  key={item.label}
                  onClick={() => {
                    if (item.drilldown_route) {
                      onSelectRoute(item.drilldown_route);
                      onNavigateToDNA();
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all ${
                    item.drilldown_route 
                      ? 'bg-surface-subtle border-surface-border hover:border-cyan-500/40 hover:bg-surface-hover/80 cursor-pointer group' 
                      : 'bg-surface-subtle border-surface-border'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-100">{item.label}</span>
                      <span className="text-[11px] text-slate-400">(Basket Weight: {item.weight_pct}%)</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 text-[11px]">
                        Underlying Shift: <strong className="text-slate-200">+{item.fare_change_pct}%</strong>
                      </span>
                      <span className={`text-sm font-black ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isPositive ? '+' : ''}{item.contribution_pct.toFixed(2)}%
                      </span>
                      {item.drilldown_route && (
                        <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      )}
                    </div>
                  </div>

                  <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-surface-border/50">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isPositive 
                          ? 'bg-gradient-to-r from-purple-500 to-rose-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mathematical Explanation & Drilldown Guide */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-3 font-mono text-xs">
            <h4 className="text-sm font-bold text-slate-100 uppercase text-cyan-300 flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Decomposition Methodology</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              In standard statistical inflation measurement (MoSPI / RBI), percentage changes are log-linearized:
            </p>
            <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border text-center text-cyan-300 font-bold">
              ∆APIx ≈ ∑ w_i × (P_i,t / P_i,0 - 1)
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              This guarantees exact additivity: the sum of individual route corridor contributions equals the aggregate index movement of +{totalMovement.toFixed(1)}%.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-3 font-mono text-xs">
            <h4 className="text-sm font-bold text-slate-100 uppercase text-purple-300 flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Direct Corridor Drilldown</span>
            </h4>
            <p className="text-slate-300">
              Clicking any corridor allows NSO economists to isolate route-specific pressure:
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] text-slate-400">• High fuel surcharges or airport tariff adjustments</div>
              <div className="text-[11px] text-slate-400">• Route capacity constraints & aircraft groundings</div>
              <div className="text-[11px] text-slate-400">• Seasonal festival surges (e.g. Diwali, Durga Puja)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
