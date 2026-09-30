import React from 'react';
import { 
  X, Plane, Compass, TrendingUp, TrendingDown, 
  Clock, ShieldCheck, ArrowRight, Activity, DollarSign
} from 'lucide-react';
import { RouteMeta } from '../types';

interface CorridorDetailModalProps {
  corridor: {
    id: string;
    name: string;
    corridor: string;
    routeCode: string;
    img: string;
    status: string;
    fare: string;
    shift: string;
    speed: string;
    range: string;
    weight: string;
  } | null;
  routeMeta?: RouteMeta;
  onClose: () => void;
  onInspectFares: (route: string) => void;
  onViewDNA: (route: string) => void;
}

export const CorridorDetailModal: React.FC<CorridorDetailModalProps> = ({
  corridor,
  routeMeta,
  onClose,
  onInspectFares,
  onViewDNA
}) => {
  if (!corridor) return null;

  const isPositive = corridor.shift.startsWith('+');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0F131D] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Photo Thumbnail */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          <img
            src={corridor.img}
            alt={corridor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F131D] via-black/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white transition-colors border border-white/[0.1]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Status badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md font-mono text-[10px] text-amber-300 border border-white/[0.1] flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{corridor.status} • DGCA Basket</span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold font-sans text-white flex items-center space-x-2">
                <span>{corridor.routeCode}</span>
              </div>
              <div className="text-xs text-slate-300 font-mono">
                {corridor.corridor} • {corridor.name}
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-2xl font-black text-amber-300">{corridor.fare}</div>
              <div className={`text-[10px] font-bold ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                {corridor.shift} 30-day shift
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Passenger Share</div>
              <div className="text-base font-bold text-slate-100 mt-0.5">{corridor.weight}</div>
              <div className="text-[10px] text-slate-500">DGCA Weighting</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Corridor Distance</div>
              <div className="text-base font-bold text-slate-100 mt-0.5">{corridor.range}</div>
              <div className="text-[10px] text-slate-500">Air Miles</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Cruising Speed</div>
              <div className="text-base font-bold text-slate-100 mt-0.5">{corridor.speed}</div>
              <div className="text-[10px] text-slate-500">Normal Transit</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090C14] border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 uppercase">Sample Quotes</div>
              <div className="text-base font-bold text-cyan-300 mt-0.5">1,570+</div>
              <div className="text-[10px] text-slate-500">30-day window</div>
            </div>
          </div>

          {/* Statutory Unbundling Information */}
          <div className="p-3.5 rounded-xl bg-[#090C14] border border-white/[0.06] space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-sans font-bold flex items-center justify-between">
              <span>Statutory Price Unbundling Benchmark</span>
              <span className="text-amber-400">MoSPI Methodology</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-[#141824] border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">Avg Base Fare</div>
                <div className="font-bold text-white mt-0.5">~78% of Total</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">Taxes & UDF/PSF</div>
                <div className="font-bold text-white mt-0.5">~17% of Total</div>
              </div>
              <div className="p-2 rounded-lg bg-[#141824] border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">OTA Convenience</div>
                <div className="font-bold text-white mt-0.5">~5% of Total</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              onClick={() => {
                onClose();
                onInspectFares(corridor.id);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-white/[0.1] text-cyan-300 hover:text-white font-bold transition-all flex items-center justify-center space-x-2"
            >
              <span>Inspect Quotes in Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                onClose();
                onViewDNA(corridor.id);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <span>View Route Airfare DNA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
