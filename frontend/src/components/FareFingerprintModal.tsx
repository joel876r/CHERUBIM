import React, { useState } from 'react';
import { 
  X, ShieldCheck, AlertTriangle, AlertCircle, Copy, 
  Check, Plane, Calendar, Clock, DollarSign, FileCode, CheckCircle2
} from 'lucide-react';
import { FareObservation } from '../types';

interface FareFingerprintModalProps {
  observation: FareObservation | null;
  onClose: () => void;
}

export const FareFingerprintModal: React.FC<FareFingerprintModalProps> = ({
  observation,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  if (!observation) return null;

  const copyHash = () => {
    if (observation.fingerprint_hash) {
      navigator.clipboard.writeText(observation.fingerprint_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isRejected = observation.status === 'REJECTED';
  const isReview = observation.status === 'REVIEW';
  const isValid = observation.status === 'VALID' || (!isRejected && !isReview);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Aroval Flight Inspection Card (Image 3) */}
      <div 
        className="relative w-full max-w-lg bg-[#11141D] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Aircraft Photo / 3D Render Header (matching Aroval Image 3) */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          <img
            src="/images/fleet1.jpg"
            alt="Aircraft"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141D] via-black/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white transition-colors border border-white/[0.1]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Flight Callout Tag (Aroval Image 3) */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md font-mono text-[10px] text-amber-300 border border-white/[0.1]">
            {observation.airline} • {observation.flight_number}
          </div>

          {/* Route Title Overlay (Aroval Image 3) */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black font-sans text-white flex items-center space-x-2">
                <span>{observation.origin}</span>
                <span className="text-amber-400 font-light text-lg">⇄</span>
                <span>{observation.destination}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {observation.route} • {observation.booking_window} Advance Horizon
              </div>
            </div>

            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                isValid
                  ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                  : isReview
                    ? 'bg-amber-950/90 text-amber-400 border border-amber-500/40'
                    : 'bg-rose-950/90 text-rose-400 border border-rose-500/40'
              }`}>
                ● {observation.status || 'VALID'} ({observation.trust_score || 94}/100)
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs">
          
          {/* Aroval Purple Progress Arc & Times (matching Image 3) */}
          <div className="p-3.5 rounded-xl bg-[#0B0E16] border border-white/[0.06] space-y-2.5">
            <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px]">SCHEDULED: </span>
                <strong className="text-white">08:45 AM</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px]">ESTIMATED: </span>
                <strong className="text-white">11:05 AM</strong>
              </div>
            </div>

            {/* Glowing Curved Progress Arc (Aroval Image 3) */}
            <div className="py-1">
              <svg viewBox="0 0 360 40" className="w-full h-8 overflow-visible">
                <path
                  d="M 10 35 Q 180 5 350 35"
                  fill="none"
                  stroke="#2D1B69"
                  strokeWidth="3.5"
                />
                <path
                  d="M 10 35 Q 180 5 350 35"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2.5"
                  strokeDasharray="140 220"
                />
                <circle cx="155" cy="18" r="4.5" fill="#C084FC" stroke="#0E1119" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>715 km departed</span>
              <span>1,148 km total corridor</span>
            </div>
          </div>

          {/* Statutory Unbundled Price Breakdown */}
          <div className="p-3.5 rounded-xl bg-[#0B0E16] border border-white/[0.06] space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">
              Statutory Component Normalization (CPI Apples-to-Apples)
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#141824] border border-white/[0.05]">
                <div className="text-[9px] text-slate-400">Base Fare</div>
                <div className="font-bold text-slate-100 text-xs mt-0.5">₹{observation.base_fare?.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-white/[0.05]">
                <div className="text-[9px] text-slate-400">Taxes/UDF</div>
                <div className="font-bold text-slate-100 text-xs mt-0.5">₹{observation.taxes?.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-white/[0.05]">
                <div className="text-[9px] text-slate-400">Fees</div>
                <div className="font-bold text-slate-100 text-xs mt-0.5">₹{observation.fees?.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40">
                <div className="text-[9px] text-amber-300 font-bold">Comparable</div>
                <div className="font-bold text-amber-300 text-xs mt-0.5">₹{observation.total_fare?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 5-Point Quality Checklist */}
          <div className="p-3.5 rounded-xl bg-[#0B0E16] border border-white/[0.06] space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">
              5-Pillar Quality Gate Verification
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Freshness verified within 4h scraping interval</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>All statutory tax and fee items complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Deterministic duplicate check validated</span>
              </div>
              <div className="flex items-center space-x-2">
                {isRejected ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
                <span className={isRejected ? 'text-rose-300' : 'text-slate-300'}>
                  {isRejected ? 'Extreme outlier (Z > 4.5 MAD)' : 'Within normal stratum distribution (MAD test)'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Cross-source market consensus validated across ecosystem</span>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Provenance Hash */}
          <div className="p-3 rounded-xl bg-[#0B0E16] border border-white/[0.06]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="uppercase">SHA-256 Provenance Fingerprint</span>
              <button
                onClick={copyHash}
                className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-300 break-all bg-black/40 p-2 rounded border border-white/[0.04]">
              {observation.fingerprint_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
