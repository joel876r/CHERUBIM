import React, { useState } from 'react';
import { 
  Search, CloudSun, Bell, RefreshCw, User, 
  LogOut, Shield, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopHeaderProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  isLiveMode,
  setIsLiveMode,
  onRefresh,
  isRefreshing,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0E1119] px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Welcome Title */}
      <div>
        <h1 className="text-sm font-bold text-white tracking-tight">
          Welcome back, {currentUser ? currentUser.name : 'Officer'}
        </h1>
        <p className="text-[11px] text-slate-400">
          {currentUser ? `${currentUser.department} • ${currentUser.role}` : 'Airfare Price Index Surveillance Operations'}
        </p>
      </div>

      {/* Right Controls: Search + Weather + Alerts + User Profile */}
      <div className="flex items-center space-x-3.5">
        {/* Search Input */}
        <div className="hidden md:flex items-center w-56 lg:w-64 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search flights, routes..."
            className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        {/* Weather Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs font-mono text-slate-300 px-2 py-1 rounded-lg bg-[#141824] border border-white/[0.06]">
          <CloudSun className="w-4 h-4 text-amber-400" />
          <span className="font-bold">28°C</span>
          <span className="text-[10px] text-slate-400 font-sans">New Delhi</span>
        </div>

        {/* Notifications */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-slate-300 px-2 py-1 rounded-lg bg-[#141824] border border-white/[0.06]">
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold">1</span>
          <span className="text-[10px] text-slate-400 font-sans">Alert</span>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1E2436] border border-white/[0.08] text-slate-300"
            title="Refresh Ingestion"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        )}

        {/* User Profile or Sign In Button */}
        <div className="relative">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 ring-2 ring-amber-400/30 flex items-center justify-center text-slate-950 font-bold text-xs font-mono shadow-md">
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono leading-none">
                    {currentUser.role.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </button>

              {/* Profile Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F131D] border border-white/[0.1] shadow-2xl p-3 space-y-2 z-50 animate-in fade-in font-mono text-xs">
                  <div className="p-2 rounded-xl bg-[#141824] border border-white/[0.05]">
                    <div className="font-bold text-white text-xs">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                    <div className="text-[10px] text-amber-400 mt-1">{currentUser.department}</div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.05] text-slate-300 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch Officer Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 transition-colors flex items-center space-x-2 border-t border-white/[0.05]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Officer Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
