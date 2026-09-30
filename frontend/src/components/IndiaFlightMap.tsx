import React, { useState } from 'react';
import { Plane, Compass, Navigation } from 'lucide-react';
import { RouteMeta } from '../types';

interface IndiaFlightMapProps {
  routes: RouteMeta[];
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
}

interface AirportNode {
  code: string;
  name: string;
  x: number; // SVG viewBox coordinates (0-1000, 0-1000)
  y: number;
}

const AIRPORTS: Record<string, AirportNode> = {
  DEL: { code: 'DEL', name: 'New Delhi (IGI)', x: 420, y: 260 },
  BOM: { code: 'BOM', name: 'Mumbai (CSMIA)', x: 300, y: 550 },
  BLR: { code: 'BLR', name: 'Bengaluru (KIA)', x: 410, y: 770 },
  MAA: { code: 'MAA', name: 'Chennai (MAA)', x: 480, y: 760 },
  CCU: { code: 'CCU', name: 'Kolkata (NSCB)', x: 740, y: 440 },
  HYD: { code: 'HYD', name: 'Hyderabad (RGIA)', x: 440, y: 620 },
};

export const IndiaFlightMap: React.FC<IndiaFlightMapProps> = ({
  routes,
  selectedRoute,
  onSelectRoute,
}) => {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  // Compute curved SVG path (quadratic curve)
  const getArcPath = (fromCode: string, toCode: string) => {
    const from = AIRPORTS[fromCode];
    const to = AIRPORTS[toCode];
    if (!from || !to) return '';

    // Midpoint with curve offset
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Normal vector for curve curvature
    const nx = -dy / dist;
    const ny = dx / dist;
    const curveHeight = Math.min(dist * 0.22, 60);

    const mx = (from.x + to.x) / 2 + nx * curveHeight;
    const my = (from.y + to.y) / 2 + ny * curveHeight;

    return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
  };

  const activeRouteObj = routes.find(r => r.route === selectedRoute) || routes[0];

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#070B14] rounded-2xl border border-surface-border overflow-hidden flex flex-col justify-between p-4">
      {/* Top Map Header */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
              <span>National Air Network Telemetry</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-400">
                DGCA TRUNK BASKET
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive high-frequency surveillance across 6 key domestic airline corridors
            </p>
          </div>
        </div>

        {/* Selected Route Quick Badge */}
        {activeRouteObj && (
          <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-surface-card border border-surface-border font-mono text-xs">
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
              <span>{activeRouteObj.route}</span>
              <Plane className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-slate-500">|</div>
            <div className="text-slate-300">
              ₹{activeRouteObj.current_avg_fare?.toLocaleString() || '6,120'}
            </div>
            <div className={`font-semibold ${
              (activeRouteObj.movement_30d || 0) >= 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {(activeRouteObj.movement_30d || 0) >= 0 ? '↑' : '↓'} {Math.abs(activeRouteObj.movement_30d || 3.5)}%
            </div>
          </div>
        )}
      </div>

      {/* SVG Canvas Map */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center">
        <svg
          viewBox="150 150 700 700"
          className="w-full h-full max-h-[380px] drop-shadow-2xl"
        >
          <defs>
            {/* Background Radar Grid Pattern */}
            <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.8" />
              <circle cx="20" cy="20" r="1" fill="rgba(56, 189, 248, 0.15)" />
            </pattern>

            {/* Glowing Golden / Cyan Arc Gradients */}
            <linearGradient id="activeArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="inactiveArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.3" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Radar background grid */}
          <rect x="150" y="150" width="700" height="700" fill="url(#radarGrid)" />

          {/* Decorative Radar Concentric Circles */}
          <circle cx="440" cy="520" r="160" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="440" cy="520" r="280" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" strokeDasharray="6 6" />

          {/* India Coastline Outline Silhouette (Geometric Stylized) */}
          <path
            d="M 320 220 
               L 420 200 L 520 210 L 600 280 L 740 370 L 760 480 
               L 680 540 L 560 620 L 510 760 L 460 840 L 410 820 
               L 360 740 L 290 600 L 270 500 L 280 400 L 320 300 Z"
            fill="rgba(13, 19, 34, 0.45)"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth="1.2"
          />

          {/* Flight Corridors / Route Arcs */}
          {routes.map((r) => {
            const [orig, dest] = r.route.split('-');
            const pathData = getArcPath(orig, dest);
            const isSelected = selectedRoute === r.route;
            const isHovered = hoveredRoute === r.route;

            return (
              <g 
                key={r.route} 
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectRoute(r.route)}
                onMouseEnter={() => setHoveredRoute(r.route)}
                onMouseLeave={() => setHoveredRoute(null)}
              >
                {/* Halo line for click targets */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                />
                
                {/* Background Shadow line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSelected || isHovered ? "rgba(56, 189, 248, 0.3)" : "rgba(30, 41, 59, 0.4)"}
                  strokeWidth={isSelected ? 4 : 2}
                  filter={isSelected ? "url(#glow)" : undefined}
                />

                {/* Visible Main Arc */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSelected ? "url(#activeArcGrad)" : isHovered ? "#38BDF8" : "rgba(100, 116, 139, 0.45)"}
                  strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                  strokeDasharray={isSelected ? "none" : "5 5"}
                />

                {/* Animated Flying Pulse for Selected Route */}
                {isSelected && (
                  <circle r="4" fill="#F59E0B" filter="url(#glow)">
                    <animateMotion
                      path={pathData}
                      dur="3.2s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Airport City Nodes */}
          {Object.entries(AIRPORTS).map(([code, airport]) => {
            const isAssociatedWithActive = selectedRoute.includes(code);

            return (
              <g key={code} transform={`translate(${airport.x}, ${airport.y})`}>
                {/* Radar Ripple */}
                {isAssociatedWithActive && (
                  <circle r="14" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1">
                    <animate attributeName="r" from="6" to="22" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Outer halo */}
                <circle
                  r="6"
                  fill={isAssociatedWithActive ? '#0284C7' : '#1E293B'}
                  stroke={isAssociatedWithActive ? '#38BDF8' : '#475569'}
                  strokeWidth="2"
                  filter={isAssociatedWithActive ? 'url(#glow)' : undefined}
                />

                {/* Inner center dot */}
                <circle
                  r="2.5"
                  fill={isAssociatedWithActive ? '#FFFFFF' : '#94A3B8'}
                />

                {/* Airport Label */}
                <text
                  x="12"
                  y="4"
                  fill={isAssociatedWithActive ? '#38BDF8' : '#94A3B8'}
                  fontSize="12"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={isAssociatedWithActive ? 'bold' : 'normal'}
                >
                  {airport.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Route Quick Selector Pills */}
      <div className="z-10 flex items-center justify-between pt-2 border-t border-surface-border/50 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-mono text-slate-400 mr-1">CORRIDORS:</span>
          {routes.map((r) => {
            const isSel = selectedRoute === r.route;
            return (
              <button
                key={r.route}
                onClick={() => onSelectRoute(r.route)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all flex items-center space-x-1.5 ${
                  isSel
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-bold'
                    : 'bg-surface-subtle text-slate-400 hover:text-slate-200 hover:bg-surface-hover border border-transparent'
                }`}
              >
                <span>{r.route}</span>
                <span className="text-[10px] text-slate-400 font-normal">({(r.weight * 100).toFixed(0)}%)</span>
              </button>
            );
          })}
        </div>
        <div className="text-[11px] text-slate-400 font-mono hidden md:block">
          SURVEILLANCE FREQUENCY: 4-HOUR HIGH RES
        </div>
      </div>
    </div>
  );
};
