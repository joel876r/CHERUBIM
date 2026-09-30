import React from 'react';
import { 
  Plane, Activity, LineChart, Compass, Search, 
  ShieldCheck, GitMerge, PieChart, Database, FileText, 
  Code, Cpu, ExternalLink, RefreshCw
} from 'lucide-react';

export type TabId = 
  | 'overview' 
  | 'live_monitor' 
  | 'apix_index' 
  | 'route_dna' 
  | 'fare_explorer' 
  | 'trust_engine' 
  | 'consensus' 
  | 'inflation' 
  | 'pipeline' 
  | 'ledger' 
  | 'api_explorer' 
  | 'system_health';

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveMode,
  setIsLiveMode,
  onRefresh,
  isRefreshing
}) => {
  const navItems: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <Plane className="w-4 h-4" /> },
    { id: 'live_monitor', label: 'Live Monitor', icon: <Activity className="w-4 h-4" /> },
    { id: 'apix_index', label: 'Airfare Index (APIx)', icon: <LineChart className="w-4 h-4" /> },
    { id: 'route_dna', label: 'Route Intelligence', icon: <Compass className="w-4 h-4" /> },
    { id: 'fare_explorer', label: 'Fare Explorer', icon: <Search className="w-4 h-4" /> },
    { id: 'trust_engine', label: 'Trust Engine', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'consensus', label: 'Cross-Source Consensus', icon: <GitMerge className="w-4 h-4" /> },
    { id: 'inflation', label: 'Inflation Decomposition', icon: <PieChart className="w-4 h-4" /> },
    { id: 'pipeline', label: 'Data Pipeline', icon: <Database className="w-4 h-4" /> },
    { id: 'ledger', label: 'Reproducibility Ledger', icon: <FileText className="w-4 h-4" /> },
    { id: 'api_explorer', label: 'API Explorer', icon: <Code className="w-4 h-4" /> },
    { id: 'system_health', label: 'System Health', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070A11]/90 backdrop-blur-md border-b border-surface-border">
      {/* Top Bar */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between border-b border-surface-border/50">
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-glow-cyan text-base">
            ◈
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-base text-slate-100 font-mono">CHERUBIM</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono font-medium">
                APIx v1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Trust-Aware Real-Time Airfare Intelligence & Price Index
            </div>
          </div>
        </div>

        {/* Center Institutional Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">MoSPI DIID</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">SIH 26056: CPI Transport Basket Augmentation</span>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-cyan-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-surface-subtle border border-surface-border text-xs">
            <button
              onClick={() => setIsLiveMode(false)}
              className={`px-2.5 py-1 rounded-md transition-all font-mono font-medium ${
                !isLiveMode 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DEMO MODE
            </button>
            <button
              onClick={() => setIsLiveMode(true)}
              className={`px-2.5 py-1 rounded-md transition-all font-mono font-medium ${
                isLiveMode 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Permitted Gateway Connectors Architecture"
            >
              LIVE CONNECTORS
            </button>
          </div>

          {/* Operational Pill */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Philosophy Sub-strip */}
      <div className="bg-[#090D17] border-b border-surface-border/40 px-4 lg:px-6 py-1 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 font-mono font-semibold">CORE ARCHITECTURE:</span>
          <span className="text-slate-300 font-medium">COLLECT</span>
          <span className="text-cyan-500">→</span>
          <span className="text-slate-300 font-medium">TRUST</span>
          <span className="text-cyan-500">→</span>
          <span className="text-slate-300 font-medium">INDEX</span>
          <span className="text-cyan-500">→</span>
          <span className="text-slate-300 font-medium">EXPLAIN</span>
        </div>
        <div className="hidden md:block italic text-slate-400 text-[11px]">
          “CHERUBIM does not merely collect airfare. It measures the reliability, comparability and contribution of every observation.”
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 overflow-x-auto scrollbar-none py-1.5 flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover/70'
              }`}
            >
              <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
