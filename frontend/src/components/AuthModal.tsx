import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Building, ShieldCheck, 
  ArrowRight, Key, Sparkles, CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Ministry of Statistics and Programme Implementation (MoSPI)');
  const [role, setRole] = useState('Senior Statistical Analyst');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = name.trim() || (email ? email.split('@')[0] : 'Analyst');
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DI';

    const newUser: UserProfile = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: displayName,
      email: email || 'analyst@mospi.gov.in',
      department: department,
      role: role,
      avatarInitials: initials,
    };

    localStorage.setItem('cherubim_user', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string, demoDept: string, demoRole: string) => {
    const initials = demoName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const demoUser: UserProfile = {
      id: 'USR-0001',
      name: demoName,
      email: demoEmail,
      department: demoDept,
      role: demoRole,
      avatarInitials: initials,
    };

    localStorage.setItem('cherubim_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0F131D] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20">
                ◈
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider text-white">CHERUBIM</span>
                <span className="text-[10px] text-amber-400 block font-normal">AIRFARE PRICE INDEX ACCESS</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-[#141824] p-1 border border-white/[0.06] text-xs mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-1.5 rounded-lg transition-all font-bold ${
                !isSignUp 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-1.5 rounded-lg transition-all font-bold ${
                isSignUp 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isSignUp && (
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. R Joel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="officer@mospi.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  Department / Agency
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#141824] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Ministry of Statistics and Programme Implementation (MoSPI)">
                      MoSPI DIID (Data Informatics & Innovation)
                    </option>
                    <option value="Reserve Bank of India (RBI) - Monetary Policy">
                      Reserve Bank of India (RBI)
                    </option>
                    <option value="Directorate General of Civil Aviation (DGCA)">
                      DGCA Directorate
                    </option>
                    <option value="Public Economic Researcher">
                      Academic / Public Researcher
                    </option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center justify-center space-x-2 mt-4 shadow-lg shadow-amber-500/20"
            >
              <span>{isSignUp ? 'Create Officer Account' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles for Judges */}
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              1-Click Demo Profiles:
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('R Joel', 'joel@mospi.gov.in', 'MoSPI DIID New Delhi', 'Lead Statistical Officer')}
                className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-white/[0.06] text-left transition-all"
              >
                <div className="text-white font-bold text-[11px] truncate">R Joel</div>
                <div className="text-[9px] text-amber-400">MoSPI DIID Officer</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Ananya Verma', 'ananya.verma@rbi.org.in', 'Reserve Bank of India (RBI)', 'Monetary Policy Analyst')}
                className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-white/[0.06] text-left transition-all"
              >
                <div className="text-white font-bold text-[11px] truncate">Ananya Verma</div>
                <div className="text-[9px] text-cyan-400">RBI Macro Analyst</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
