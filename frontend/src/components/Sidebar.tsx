import React from 'react';
import { 
  LayoutDashboard, Plane, Users, Compass, 
  ShieldCheck, Wrench, BarChart2, MessageSquare, 
  Settings, HelpCircle, ChevronRight, Activity, Database
} from 'lucide-react';
import { TabId } from './Navbar';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  // Navigation for CHERUBIM
  const navItems: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fare_explorer', label: 'Flights & Fares', icon: <Plane className="w-4 h-4" /> },
    { id: 'route_dna', label: 'Corridor Fleet', icon: <Compass className="w-4 h-4" /> },
    { id: 'consensus', label: 'Consensus Matrix', icon: <Users className="w-4 h-4" /> },
    { id: 'trust_engine', label: 'Trust Engine', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'pipeline', label: 'Data Ingestion', icon: <Wrench className="w-4 h-4" /> },
    { id: 'apix_index', label: 'Airfare Index', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'ledger', label: 'Audit Ledger', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 bg-[#0E1119] border-r border-white/[0.06] flex flex-col justify-between shrink-0 h-screen sticky top-0 p-4 select-none">
      {/* Brand Header: ◈ CHERUBIM (Purely CHERUBIM, no AER!) */}
      <div>
        <div className="flex items-center space-x-3 px-2 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/20 font-mono">
            ◈
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-base text-white font-mono leading-none">
              CHERUBIM
            </div>
            <div className="text-[9px] text-amber-400/90 font-mono tracking-widest uppercase mt-1 font-semibold">
              AIR INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-[#1C212E] text-white border border-white/[0.1] font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Support Card & Settings */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        {/* Support Card */}
        <div className="p-3 rounded-xl bg-[#141822] border border-white/[0.06] text-xs">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Need Support?</span>
          </div>
          <div className="text-[10px] text-slate-400">
            MoSPI DIID Helpdesk
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={() => setActiveTab('system_health')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs transition-all ${
            activeTab === 'system_health'
              ? 'bg-[#1C212E] text-white border border-white/[0.1] font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
