import React, { useState } from 'react';
import { 
  LineChart, TrendingUp, Info, Calendar, Download, 
  HelpCircle, BookOpen, Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { APIxCurrent, HistoricalPoint, RouteMeta } from '../types';

interface AirfareIndexViewProps {
  currentAPIx: APIxCurrent | null;
  history: HistoricalPoint[];
  routes: RouteMeta[];
  onExportLedger: (fmt: 'csv' | 'json') => void;
}

export const AirfareIndexView: React.FC<AirfareIndexViewProps> = ({
  currentAPIx,
  history,
  routes,
  onExportLedger
}) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Filter history based on frequency
  const displayHistory = frequency === 'weekly' 
    ? history.filter((_, i) => i % 7 === 0 || i === history.length - 1)
    : frequency === 'monthly'
      ? [history[0], history[history.length - 1]].filter(Boolean)
      : history;

  // Chart Coordinates
  const chartWidth = 760;
  const chartHeight = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };

  const minVal = Math.min(...displayHistory.map(h => h.index_value), 99.5);
  const maxVal = Math.max(...displayHistory.map(h => h.index_value), 103.5);
  const valRange = maxVal - minVal || 1;

  const getX = (index: number) => {
    return padding.left + (index / (displayHistory.length - 1 || 1)) * (chartWidth - padding.left - padding.right);
  };

  const getY = (val: number) => {
    return chartHeight - padding.bottom - ((val - minVal) / valRange) * (chartHeight - padding.top - padding.bottom);
  };

  const linePath = displayHistory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.index_value)}`).join(' ');
  const areaPath = `${linePath} L ${getX(displayHistory.length - 1)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="space-y-6">
      {/* Top Statistical Summary Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold uppercase mb-1">
              <span>National Airfare Price Index</span>
              <span>•</span>
              <span>CPI Transport Augmentation</span>
            </div>
            <div className="flex items-baseline space-x-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                {currentAPIx?.index_value.toFixed(1) || '102.4'}
              </h2>
              <span className="text-emerald-400 font-bold font-mono text-lg flex items-center space-x-1">
                <TrendingUp className="w-5 h-5" />
                <span>+{(currentAPIx?.change_percent_30d || 2.4).toFixed(1)}% (30-Day Period)</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-2">
              Base Period: <strong className="text-slate-100">{currentAPIx?.base_period_date || '2026-08-31'} = 100.0</strong> | 
              Observed: <strong className="text-slate-100">{currentAPIx?.current_date || '2026-09-30'}</strong>
            </p>
          </div>

          {/* Action and Disclaimer Strip */}
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end space-x-2">
              <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono">
                <button
                  onClick={() => setFrequency('daily')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    frequency === 'daily' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  DAILY
                </button>
                <button
                  onClick={() => setFrequency('weekly')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    frequency === 'weekly' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  WEEKLY
                </button>
                <button
                  onClick={() => setFrequency('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    frequency === 'monthly' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MONTHLY
                </button>
              </div>

              <button
                onClick={() => onExportLedger('csv')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-mono text-cyan-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="text-[11px] text-amber-300/80 font-mono italic max-w-md">
              “Prototype Index Methodology — subject to statistical calibration and validation for production use.”
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center space-x-2 font-mono">
              <LineChart className="w-5 h-5 text-cyan-400" />
              <span>APIx Historical Trajectory & Stratum Relatives</span>
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated across 30 strata (6 DGCA trunk corridors × 5 booking horizons)
            </p>
          </div>
          <button
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mathematical Formula</span>
          </button>
        </div>

        {/* SVG Time Series Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64">
            <defs>
              <linearGradient id="apixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Levels */}
            {[100.0, 101.0, 102.0, 103.0].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={level === 100.0 ? "rgba(56, 189, 248, 0.4)" : "rgba(255, 255, 255, 0.05)"}
                    strokeDasharray={level === 100.0 ? "none" : "3 3"}
                    strokeWidth={level === 100.0 ? "1.5" : "1"}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    fill={level === 100.0 ? "#38BDF8" : "#64748B"}
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    textAnchor="end"
                  >
                    {level.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Area */}
            {displayHistory.length > 0 && (
              <path d={areaPath} fill="url(#apixGrad)" />
            )}

            {/* Line */}
            {displayHistory.length > 0 && (
              <path
                d={linePath}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Nodes */}
            {displayHistory.map((pt, i) => (
              <circle
                key={pt.date}
                cx={getX(i)}
                cy={getY(pt.index_value)}
                r={i === displayHistory.length - 1 ? 5 : 3}
                fill={i === displayHistory.length - 1 ? "#F59E0B" : "#38BDF8"}
                stroke="#070A11"
                strokeWidth="2"
              />
            ))}

            {/* Dates on X Axis */}
            {displayHistory.map((pt, i) => {
              if (displayHistory.length > 10 && i % Math.ceil(displayHistory.length / 8) !== 0 && i !== displayHistory.length - 1) return null;
              return (
                <text
                  key={pt.date}
                  x={getX(i)}
                  y={chartHeight - 12}
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {pt.date.slice(5)}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Formula & Stratum Structure Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-3 font-mono text-xs">
          <h4 className="text-sm font-bold text-slate-100 uppercase text-cyan-300">
            Mathematical Index Formulation
          </h4>
          <p className="text-slate-300 leading-relaxed">
            The Consumer Price Index requires geometric aggregator properties (Jevons elementary index) to prevent substitution bias.
          </p>
          <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-center text-cyan-300 font-bold text-sm">
            APIx_t = 100 × exp( ∑ w_s × ln( P_s,t / P_s,0 ) )
          </div>
          <ul className="space-y-1.5 text-slate-400 text-[11px] pt-1">
            <li>• <strong className="text-slate-200">s:</strong> Stratum defined by (Corridor × Booking Horizon).</li>
            <li>• <strong className="text-slate-200">P_s,t:</strong> Representative fare at day t (Trimmed median of VALID observations).</li>
            <li>• <strong className="text-slate-200">P_s,0:</strong> Base-period representative fare (Aug 31, 2026).</li>
            <li>• <strong className="text-slate-200">w_s:</strong> DGCA passenger traffic weight × Advance purchase window weight.</li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-3 font-mono text-xs">
          <h4 className="text-sm font-bold text-slate-100 uppercase text-purple-300">
            DGCA Route Basket Weights
          </h4>
          <p className="text-slate-300 leading-relaxed">
            Initial representative trunk routes informing 80%+ of domestic revenue passenger kilometers:
          </p>
          <div className="space-y-2">
            {routes.map((r) => (
              <div key={r.route} className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-surface-border">
                <span className="font-bold text-slate-200">{r.route} ({r.origin_city} ⇄ {r.dest_city})</span>
                <span className="text-cyan-300 font-bold">{(r.weight * 100).toFixed(1)}% Weight</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
