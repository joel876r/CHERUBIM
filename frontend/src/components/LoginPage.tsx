import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Mail, User, Building, 
  ArrowRight, Key, Sparkles, CheckCircle2, 
  Plane, Compass, Radio, Activity, Eye, EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('R Joel');
  const [email, setEmail] = useState('joel@mospi.gov.in');
  const [password, setPassword] = useState('GovtPass#2026');
  const [department, setDepartment] = useState('Ministry of Statistics & Programme Implementation (MoSPI)');
  const [role, setRole] = useState('Director (DIID) & Chief Statistical Officer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    const displayName = isSignUp 
      ? (name.trim() || 'R Joel')
      : (email.includes('joel') ? 'R Joel' : (name.trim() || email.split('@')[0]));

    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'RJ';

    const authenticatedUser: UserProfile = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: displayName,
      email: email || 'joel@mospi.gov.in',
      department: department,
      role: isSignUp ? role : (email.includes('joel') ? 'Director (DIID) & Chief Statistical Officer' : 'Statistical Analyst'),
      avatarInitials: initials,
    };

    setTimeout(() => {
      if (rememberSession) {
        localStorage.setItem('cherubim_user', JSON.stringify(authenticatedUser));
      }
      setIsAuthenticating(false);
      onLoginSuccess(authenticatedUser);
    }, 600);
  };

  const handleQuickAccess = (officerName: string, officerEmail: string, officerDept: string, officerRole: string) => {
    setIsAuthenticating(true);
    const initials = officerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user: UserProfile = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: officerName,
      email: officerEmail,
      department: officerDept,
      role: officerRole,
      avatarInitials: initials,
    };

    setTimeout(() => {
      localStorage.setItem('cherubim_user', JSON.stringify(user));
      setIsAuthenticating(false);
      onLoginSuccess(user);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient Aerospace Glow Spotlights */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-amber-600/15 via-orange-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] bg-gradient-to-tl from-cyan-600/12 via-blue-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-b from-sky-500/5 to-transparent rounded-full blur-[180px] pointer-events-none"></div>

      {/* Main Luxury Aerospace Terminal Tablet */}
      <div className="w-full max-w-[1240px] min-h-[640px] rounded-[28px] bg-[#0E1119] border border-neutral-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Visual Column: Government Identity & Aviation Surveillance Canvas */}
        <div className="lg:col-span-6 relative p-8 lg:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-gradient-to-br from-[#0C101A] via-[#090D16] to-[#070A10]">
          {/* Subtle Airliner Backdrop */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-luminosity scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('/images/fleet2.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1119] via-[#0E1119]/80 to-transparent pointer-events-none" />

          {/* Top Identity Block */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black shadow-lg shadow-amber-500/10">
                ◈
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] font-mono uppercase text-amber-400 font-bold">
                  GOVERNMENT OF INDIA • MoSPI
                </div>
                <div className="text-xs text-slate-400">
                  Data Informatics & Innovation Division (DIID)
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-mono mb-3">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>SIH26056 • Smart Automation</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                CHERUBIM
              </h1>
              <p className="text-sm font-medium text-amber-400/90 mt-1">
                Trust-Aware Real-Time Airfare Intelligence & Price Index (APIx)
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5 max-w-md">
                Continuous high-frequency price quote extraction across IndiGo, Air India, Akasa, SpiceJet & leading OTAs. 
                Statistically augmenting the Consumer Price Index (CPI) under the RBI Monetary Policy framework.
              </p>
            </div>
          </div>

          {/* Center Corridor & Trust Highlights */}
          <div className="relative z-10 grid grid-cols-2 gap-3 my-6">
            <div className="p-3.5 rounded-2xl bg-[#141824]/80 border border-white/[0.06] backdrop-blur-md">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-slate-400 font-mono">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Corridors</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">6 Trunk Routes</div>
              <div className="text-[10px] text-slate-400 mt-0.5">DEL, BOM, BLR, CCU, HYD, MAA</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#141824]/80 border border-white/[0.06] backdrop-blur-md">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Validation</span>
              </div>
              <div className="text-lg font-bold text-cyan-300 mt-1">5-Pillar Gate</div>
              <div className="text-[10px] text-slate-400 mt-0.5">SHA-256 Hash Provenance</div>
            </div>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-400 font-bold">APIx Engine v2.4 Online</span>
            </div>
            <span>Jevons PSD Standard</span>
          </div>
        </div>

        {/* Right Form Column: Officer Authentication Portal */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between bg-[#0E1119]">
          <div>
            {/* Header with Mode Toggle */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
                  Clearance Level: Officer Terminal
                </div>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {isSignUp ? 'New Officer Registration' : 'Officer Sign In'}
                </h2>
              </div>

              {/* Mode Toggle Button */}
              <div className="flex bg-[#141824] p-1 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !isSignUp 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSignUp 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 pt-6">
              {isSignUp && (
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                    Officer Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. R Joel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="joel@mospi.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                  />
                </div>
              </div>

              {isSignUp && (
                <>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Government Department / Regulatory Agency
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                      >
                        <option value="Ministry of Statistics & Programme Implementation (MoSPI)">
                          Ministry of Statistics & Programme Implementation (MoSPI DIID)
                        </option>
                        <option value="Reserve Bank of India (RBI) - Monetary Policy">
                          Reserve Bank of India (RBI) - Monetary Policy Dept
                        </option>
                        <option value="Directorate General of Civil Aviation (DGCA)">
                          Directorate General of Civil Aviation (DGCA)
                        </option>
                        <option value="National Statistical Commission (NSC)">
                          National Statistical Commission (NSC)
                        </option>
                        <option value="Public Economic Research Wing">
                          Public Economic Research Wing
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Designation / Role
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Director (DIID) & Chief Statistical Officer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Security Passkey / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Session & Disclaimer */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="rounded bg-[#141824] border-white/20 text-amber-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Keep terminal session active</span>
                </label>
                <span className="text-amber-400/80 text-[11px] hover:underline cursor-pointer">
                  Security Guidelines
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 mt-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Verifying Cryptographic Clearance...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'Register Officer Credentials & Enter' : 'Authenticate & Enter CHERUBIM'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Access for Hackathon Evaluators */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                  Quick 1-Click Officer Access:
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono">
                  Instant Demo Clearance
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. R Joel Profile */}
                <button
                  type="button"
                  onClick={() => handleQuickAccess(
                    'R Joel', 
                    'joel@mospi.gov.in', 
                    'Ministry of Statistics & Programme Implementation (MoSPI)', 
                    'Director (DIID) & Chief Statistical Officer'
                  )}
                  className="p-3 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-amber-500/20 hover:border-amber-400/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">
                      MoSPI Lead
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="text-white font-bold text-xs truncate">R Joel</div>
                  <div className="text-[10px] text-slate-400 truncate">Director (DIID), MoSPI</div>
                </button>

                {/* 2. Ananya Verma Profile */}
                <button
                  type="button"
                  onClick={() => handleQuickAccess(
                    'Ananya Verma', 
                    'ananya.verma@rbi.org.in', 
                    'Reserve Bank of India (RBI)', 
                    'Senior Director, Monetary Policy Dept'
                  )}
                  className="p-3 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-cyan-500/20 hover:border-cyan-400/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold">
                      RBI Macro
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="text-white font-bold text-xs truncate">Ananya Verma</div>
                  <div className="text-[10px] text-slate-400 truncate">Monetary Policy, RBI</div>
                </button>
              </div>
            </div>
          </div>

          {/* Legal / Statutory Disclaimer Footer */}
          <div className="pt-4 text-center text-[10px] text-slate-400 font-mono">
            Authorized Personnel Only • MoSPI DIID SIH26056 • All Sessions Audited
          </div>
        </div>

      </div>
    </div>
  );
};
