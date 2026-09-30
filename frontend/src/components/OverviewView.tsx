import React, { useState } from 'react';
import { 
  Plane, Search, ShieldCheck, PieChart, Database, 
  ArrowRight, ArrowUpRight, TrendingUp, TrendingDown, 
  Compass, Radio, Clock, Layers, ChevronRight, CheckCircle2,
  Calendar, Users, Plus, FileText, ChevronLeft
} from 'lucide-react';
import { 
  APIxCurrent, HistoricalPoint, RouteMeta, 
  LeadTimeData, InflationDecomposition, QualitySummary, FareObservation 
} from '../types';
import { TabId } from './Navbar';
import { CorridorDetailModal } from './CorridorDetailModal';

interface OverviewViewProps {
  currentAPIx: APIxCurrent | null;
  history: HistoricalPoint[];
  routes: RouteMeta[];
  leadTime: LeadTimeData | null;
  inflation: InflationDecomposition | null;
  quality: QualitySummary | null;
  onNavigate: (tab: TabId) => void;
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
  onSelectObservation?: (obs: FareObservation) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentAPIx,
  history,
  routes,
  leadTime,
  inflation,
  quality,
  onNavigate,
  selectedRoute,
  onSelectRoute,
  onSelectObservation,
}) => {
  const [selectedCorridorModal, setSelectedCorridorModal] = useState<any | null>(null);
  const [fleetPageIndex, setFleetPageIndex] = useState(0);

  const activeRouteObj = routes.find(r => r.route === selectedRoute) || routes[0] || {
    route: 'DEL-BOM',
    origin_city: 'Delhi',
    dest_city: 'Mumbai',
    weight: 0.24,
    distance_km: 1148,
    current_avg_fare: 5840,
    movement_30d: 3.7
  };

  // Full corridor list (all 6 trunk corridors)
  const allFleetCards = [
    {
      id: 'DEL-BOM',
      name: 'IndiGo A321neo',
      corridor: 'New Delhi ⇄ Mumbai',
      routeCode: 'DEL ⇄ BOM',
      img: '/images/fleet1.jpg',
      status: 'Available',
      fare: '₹5,840',
      shift: '+3.7%',
      speed: '510 kts',
      range: '1,148 km',
      weight: '24% Pax'
    },
    {
      id: 'MAA-DEL',
      name: 'Air India B787 Dreamliner',
      corridor: 'Chennai ⇄ New Delhi',
      routeCode: 'MAA ⇄ DEL',
      img: '/images/fleet2.jpg',
      status: 'Available',
      fare: '₹6,120',
      shift: '+5.1%',
      speed: '495 kts',
      range: '1,760 km',
      weight: '18% Pax'
    },
    {
      id: 'DEL-BLR',
      name: 'Akasa Air B737 MAX',
      corridor: 'Delhi ⇄ Bengaluru',
      routeCode: 'DEL ⇄ BLR',
      img: '/images/fleet3.jpg',
      status: 'Available',
      fare: '₹6,450',
      shift: '+2.8%',
      speed: '505 kts',
      range: '1,740 km',
      weight: '19% Pax'
    },
    {
      id: 'BOM-BLR',
      name: 'SpiceJet Q400 / B737',
      corridor: 'Mumbai ⇄ Bengaluru',
      routeCode: 'BOM ⇄ BLR',
      img: '/images/fleet1.jpg',
      status: 'Available',
      fare: '₹3,920',
      shift: '-0.9%',
      speed: '470 kts',
      range: '840 km',
      weight: '15% Pax'
    },
    {
      id: 'DEL-CCU',
      name: 'Air India Express B737',
      corridor: 'Delhi ⇄ Kolkata',
      routeCode: 'DEL ⇄ CCU',
      img: '/images/fleet2.jpg',
      status: 'Available',
      fare: '₹5,680',
      shift: '+4.2%',
      speed: '490 kts',
      range: '1,305 km',
      weight: '13% Pax'
    },
    {
      id: 'BLR-HYD',
      name: 'IndiGo ATR 72-600',
      corridor: 'Bengaluru ⇄ Hyderabad',
      routeCode: 'BLR ⇄ HYD',
      img: '/images/fleet3.jpg',
      status: 'Available',
      fare: '₹3,410',
      shift: '+1.4%',
      speed: '320 kts',
      range: '500 km',
      weight: '11% Pax'
    },
  ];

  // Pagination for fleet cards (show 4 at a time)
  const visibleCards = allFleetCards.slice(fleetPageIndex, fleetPageIndex + 4);

  const handleNextPage = () => {
    if (fleetPageIndex + 4 < allFleetCards.length) {
      setFleetPageIndex(fleetPageIndex + 1);
    } else {
      setFleetPageIndex(0); // loop around
    }
  };

  const handlePrevPage = () => {
    if (fleetPageIndex > 0) {
      setFleetPageIndex(fleetPageIndex - 1);
    } else {
      setFleetPageIndex(allFleetCards.length - 4); // loop back
    }
  };

  // Sparkline coordinates for right panel
  const sparklinePts = history.slice(-16);
  const sparkWidth = 280;
  const sparkHeight = 55;
  const minSpark = Math.min(...sparklinePts.map(p => p.index_value), 100.0);
  const maxSpark = Math.max(...sparklinePts.map(p => p.index_value), 103.0);
  const rangeSpark = maxSpark - minSpark || 1;

  const sparkPath = sparklinePts.map((pt, i) => {
    const x = (i / (sparklinePts.length - 1 || 1)) * sparkWidth;
    const y = sparkHeight - ((pt.index_value - minSpark) / rangeSpark) * (sparkHeight - 12) - 6;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Upcoming flight quotes
  const upcomingQuotes: Array<{
    code: string;
    carrier: string;
    route: string;
    time: string;
    status: string;
    fare: number;
    obsId: string;
    raw: FareObservation;
  }> = [
    {
      code: '6E-204',
      carrier: 'IndiGo A321',
      route: 'DEL ✈ BOM',
      time: 'May 14, 2026 • 08:45 AM',
      status: 'VALID',
      fare: 5840,
      obsId: 'OBS-009450',
      raw: {
        id: 'OBS-009450',
        source: 'IndiGo Direct',
        source_type: 'AIRLINE',
        airline: 'IndiGo',
        origin: 'DEL',
        destination: 'BOM',
        route: 'DEL-BOM',
        flight_number: '6E-204',
        departure_datetime: '2026-05-14 08:45',
        booking_window: 'T+15',
        fare_class: 'Economy',
        base_fare: 4650,
        taxes: 990,
        fees: 200,
        total_fare: 5840,
        baggage: '15 kg',
        refundability: 'Non-Refundable',
        availability: 'Available',
        observed_at: '2026-09-30 10:30:00',
        fingerprint_hash: '9a72b8d0c24e12f689cba531238914bca89d1234',
        trust_score: 95,
        status: 'VALID',
      }
    },
    {
      code: 'AI-805',
      carrier: 'Air India B787',
      route: 'MAA ✈ DEL',
      time: 'May 14, 2026 • 10:30 AM',
      status: 'VALID',
      fare: 6120,
      obsId: 'OBS-009449',
      raw: {
        id: 'OBS-009449',
        source: 'MakeMyTrip',
        source_type: 'OTA',
        airline: 'Air India',
        origin: 'MAA',
        destination: 'DEL',
        route: 'MAA-DEL',
        flight_number: 'AI-805',
        departure_datetime: '2026-05-14 10:30',
        booking_window: 'T+15',
        fare_class: 'Economy',
        base_fare: 4850,
        taxes: 1020,
        fees: 250,
        total_fare: 6120,
        baggage: '25 kg',
        refundability: 'Non-Refundable',
        availability: 'Available',
        observed_at: '2026-09-30 10:30:00',
        fingerprint_hash: '8f63c7e1b54a23d578cba421127813ab98e21456',
        trust_score: 94,
        status: 'VALID',
      }
    },
    {
      code: 'QP-1102',
      carrier: 'Akasa Air B737',
      route: 'DEL ✈ BLR',
      time: 'May 15, 2026 • 08:20 AM',
      status: 'VALID',
      fare: 6450,
      obsId: 'OBS-009448',
      raw: {
        id: 'OBS-009448',
        source: 'Cleartrip',
        source_type: 'OTA',
        airline: 'Akasa Air',
        origin: 'DEL',
        destination: 'BLR',
        route: 'DEL-BLR',
        flight_number: 'QP-1102',
        departure_datetime: '2026-05-15 08:20',
        booking_window: 'T+15',
        fare_class: 'Economy',
        base_fare: 5100,
        taxes: 1050,
        fees: 300,
        total_fare: 6450,
        baggage: '15 kg',
        refundability: 'Non-Refundable',
        availability: 'Available',
        observed_at: '2026-09-30 10:29:00',
        fingerprint_hash: '7e52b6d0a43f12c467bad310916712bc87d31234',
        trust_score: 92,
        status: 'VALID',
      }
    },
    {
      code: 'SG-234',
      carrier: 'SpiceJet Q400',
      route: 'BOM ✈ BLR',
      time: 'May 15, 2026 • 11:45 AM',
      status: 'VALID',
      fare: 3920,
      obsId: 'OBS-009447',
      raw: {
        id: 'OBS-009447',
        source: 'EaseMyTrip',
        source_type: 'OTA',
        airline: 'SpiceJet',
        origin: 'BOM',
        destination: 'BLR',
        route: 'BOM-BLR',
        flight_number: 'SG-234',
        departure_datetime: '2026-05-15 11:45',
        booking_window: 'T+30',
        fare_class: 'Economy',
        base_fare: 2950,
        taxes: 770,
        fees: 200,
        total_fare: 3920,
        baggage: '15 kg',
        refundability: 'Non-Refundable',
        availability: 'Available',
        observed_at: '2026-09-30 10:28:00',
        fingerprint_hash: '6d41a5c0f32e01b356adc209805601ab76c20123',
        trust_score: 91,
        status: 'VALID',
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* 3-Column Cockpit Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ================= LEFT & CENTER MAIN STAGE (8 COLS) ================= */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Main Active Flight / Corridor Panel */}
          <div className="bg-[#11141D] rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden shadow-2xl">
            
            {/* Header: Tag + Route Title + Status Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-widest mb-1">
                  ACTIVE FLIGHT / CORRIDOR SURVEILLANCE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 font-sans">
                  <span>{activeRouteObj.origin_city}, {activeRouteObj.route.split('-')[0]}</span>
                  <span className="text-amber-400 font-light text-xl">⇄</span>
                  <span>{activeRouteObj.dest_city}, {activeRouteObj.route.split('-')[1]}</span>
                </h2>
              </div>

              {/* Status Pill on the Right */}
              <div className="flex items-center space-x-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#14261C] border border-emerald-500/40 text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>IN FLIGHT / SURVEILLANCE</span>
                </span>
              </div>
            </div>

            {/* Exact 6-Item Telemetry Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 py-3 px-4 rounded-xl bg-[#0B0E16] border border-white/[0.06] font-mono text-[11px] mb-5">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-sans">Scheduled Flight</div>
                <div className="font-bold text-slate-100 truncate mt-0.5">6E-204 IndiGo</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-sans">Departure</div>
                <div className="font-bold text-slate-100 mt-0.5">08:45 AM</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-sans">Est. Arrival</div>
                <div className="font-bold text-slate-100 mt-0.5">11:05 AM</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-sans">Total Time</div>
                <div className="font-bold text-slate-100 mt-0.5">2h 20m</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-sans">Altitude</div>
                <div className="font-bold text-slate-100 mt-0.5">38,000 ft</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-sans">Speed</div>
                <div className="font-bold text-amber-300 mt-0.5">510 kts</div>
              </div>
            </div>

            {/* Dark Earth Night View with Glowing Parabolic Golden Arc */}
            <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden bg-gradient-to-b from-[#070A12] via-[#05070E] to-[#030408] border border-white/[0.06] flex items-center justify-center">
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[220px] bg-amber-500/[0.06] blur-3xl rounded-full"></div>
                <div className="absolute bottom-4 left-1/4 w-32 h-16 bg-blue-500/[0.08] blur-2xl rounded-full"></div>
                <div className="absolute bottom-4 right-1/4 w-32 h-16 bg-amber-500/[0.08] blur-2xl rounded-full"></div>
              </div>

              {/* Glowing Curved Parabolic Flight Arc SVG */}
              <svg viewBox="0 0 740 300" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <filter id="aerGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur1" />
                    <feGaussianBlur stdDeviation="3" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur1" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient id="goldArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                    <stop offset="45%" stopColor="#FDE047" stopOpacity="1" />
                    <stop offset="55%" stopColor="#FBBF24" stopOpacity="1" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
                  </linearGradient>

                  <pattern id="nightGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="14" cy="14" r="0.6" fill="rgba(255, 255, 255, 0.08)" />
                  </pattern>
                </defs>

                <rect x="0" y="0" width="740" height="300" fill="url(#nightGrid)" />

                {/* Curved Earth Horizon Line */}
                <path
                  d="M 40 280 Q 370 215 700 280"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.5"
                />

                {/* City Lights Clusters */}
                <g opacity="0.7">
                  <circle cx="110" cy="240" r="18" fill="rgba(245, 158, 11, 0.15)" />
                  <circle cx="110" cy="240" r="8" fill="rgba(253, 224, 71, 0.3)" />
                  <circle cx="630" cy="240" r="18" fill="rgba(56, 189, 248, 0.15)" />
                  <circle cx="630" cy="240" r="8" fill="rgba(56, 189, 248, 0.3)" />
                </g>

                {/* 1. Golden Glowing Shadow Arc */}
                <path
                  d="M 110 240 Q 370 30 630 240"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  opacity="0.25"
                  filter="url(#aerGlow)"
                />

                {/* 2. Main High-Intensity Golden Flight Arc */}
                <path
                  d="M 110 240 Q 370 30 630 240"
                  fill="none"
                  stroke="url(#goldArcGrad)"
                  strokeWidth="2.8"
                />

                {/* 3. Dashed Trajectory Indicator */}
                <path
                  d="M 110 240 Q 370 30 630 240"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeDasharray="5 7"
                  opacity="0.45"
                />

                {/* 4. Glowing Airplane Icon at the Apex */}
                <g filter="url(#aerGlow)">
                  <circle r="7" fill="#FDE047">
                    <animateMotion
                      path="M 110 240 Q 370 30 630 240"
                      dur="3.8s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                  <circle r="3" fill="#FFFFFF">
                    <animateMotion
                      path="M 110 240 Q 370 30 630 240"
                      dur="3.8s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                </g>

                {/* Departure City Beacon */}
                <g transform="translate(110, 240)">
                  <circle r="6" fill="#F59E0B" filter="url(#aerGlow)" />
                  <circle r="2.5" fill="#FFFFFF" />
                  <text x="0" y="24" fill="#FDE047" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    {activeRouteObj.route.split('-')[0]}
                  </text>
                  <text x="0" y="38" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="middle">
                    {activeRouteObj.origin_city}
                  </text>
                </g>

                {/* Arrival City Beacon */}
                <g transform="translate(630, 240)">
                  <circle r="6" fill="#38BDF8" filter="url(#aerGlow)" />
                  <circle r="2.5" fill="#FFFFFF" />
                  <text x="0" y="24" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    {activeRouteObj.route.split('-')[1]}
                  </text>
                  <text x="0" y="38" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="middle">
                    {activeRouteObj.dest_city}
                  </text>
                </g>
              </svg>

              {/* Bottom Left: "View Flight Details ▾" (opens Corridor Detail Modal!) */}
              <div className="absolute bottom-3 left-4">
                <button
                  onClick={() => {
                    const card = allFleetCards.find(c => c.id === activeRouteObj.route) || allFleetCards[0];
                    setSelectedCorridorModal(card);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#141824]/90 hover:bg-[#1E2436] border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
                >
                  <span>View Flight Details</span>
                  <span className="text-[10px] text-amber-400">▾</span>
                </button>
              </div>

              {/* Bottom Right: Route Telemetry Note */}
              <div className="absolute bottom-3 right-4 hidden sm:block font-mono text-[10px] text-slate-400 bg-black/50 px-2.5 py-1 rounded border border-white/[0.05]">
                {activeRouteObj.distance_km} km Air Corridor • DGCA Weight {(activeRouteObj.weight * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* ================= FLEET / CORRIDOR BASKET OVERVIEW ================= */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                FLEET / CORRIDOR BASKET OVERVIEW
              </h3>
              
              <div className="flex items-center space-x-3 text-xs font-mono">
                {/* View All button: jumps to Route Intelligence */}
                <button
                  onClick={() => onNavigate('route_dna')}
                  className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold flex items-center space-x-1 active:scale-95"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {/* Interactive < > Pagination Arrows (cycle through 6 routes) */}
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={handlePrevPage}
                    className="w-6 h-6 rounded-full bg-[#11141D] hover:bg-[#181D2B] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90"
                    title="Previous Corridors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleNextPage}
                    className="w-6 h-6 rounded-full bg-[#11141D] hover:bg-[#181D2B] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90"
                    title="Next Corridors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Interactive Photo Cards Side-by-Side (CLICKING OPENS CORRIDOR MODAL!) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {visibleCards.map((card) => {
                const isSelected = selectedRoute === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      onSelectRoute(card.id);
                      setSelectedCorridorModal(card);
                    }}
                    className={`rounded-xl overflow-hidden bg-[#11141D] border transition-all cursor-pointer group active:scale-[0.98] ${
                      isSelected 
                        ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-lg shadow-amber-500/15' 
                        : 'border-white/[0.08] hover:border-white/[0.25] hover:bg-[#151924]'
                    }`}
                  >
                    {/* Aircraft Photo Thumbnail */}
                    <div className="h-28 w-full overflow-hidden relative bg-slate-900">
                      <img
                        src={card.img}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#11141D] via-transparent to-transparent"></div>
                      
                      {/* Weight pill on top right */}
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-amber-300 border border-white/[0.1]">
                        {card.weight}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-3 font-mono space-y-1.5">
                      <div className="text-xs font-bold text-slate-100 truncate flex items-center justify-between">
                        <span>{card.name}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="text-emerald-400 font-bold">{card.status}</span>
                      </div>

                      {/* Speed & Range Specs */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                        <div>
                          <span>Speed </span>
                          <strong className="text-slate-200">{card.speed}</strong>
                        </div>
                        <div>
                          <span>Range </span>
                          <strong className="text-slate-200">{card.range}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (4 COLS) ================= */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 1. UPCOMING FLIGHTS / QUOTES (Clicking any quote opens Fare Fingerprint Modal!) */}
          <div className="bg-[#11141D] rounded-2xl p-5 border border-white/[0.08] space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 font-mono text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                UPCOMING FLIGHTS / QUOTES
              </span>
              <button 
                onClick={() => onNavigate('fare_explorer')}
                className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {upcomingQuotes.map((flight) => (
                <div
                  key={flight.code}
                  onClick={() => {
                    if (onSelectObservation) {
                      onSelectObservation(flight.raw);
                    } else {
                      onNavigate('fare_explorer');
                    }
                  }}
                  className="p-2.5 rounded-xl bg-[#0B0E16] hover:bg-[#151926] border border-white/[0.05] hover:border-amber-400/40 transition-all cursor-pointer flex items-center justify-between group active:scale-95"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                        {flight.code}
                      </span>
                      <span className="text-[10px] text-slate-400">• {flight.carrier}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{flight.time}</div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#14261C] text-emerald-400 border border-emerald-500/30">
                      ● ₹{flight.fare.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. QUICK ACTIONS (Every button is fully functional!) */}
          <div className="bg-[#11141D] rounded-2xl p-5 border border-white/[0.08] space-y-3 font-mono text-xs shadow-xl">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-white/[0.06] pb-2">
              QUICK ACTIONS
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('fare_explorer')}
                className="p-3 rounded-xl bg-[#0B0E16] hover:bg-[#161B29] border border-white/[0.07] text-left transition-all hover:border-amber-400/40 group active:scale-95"
              >
                <div className="text-amber-400 font-bold text-sm mb-1 group-hover:translate-x-0.5 transition-transform">+ Book Booking</div>
                <div className="text-[10px] text-slate-400">Search observations</div>
              </button>

              <button
                onClick={() => onNavigate('route_dna')}
                className="p-3 rounded-xl bg-[#0B0E16] hover:bg-[#161B29] border border-white/[0.07] text-left transition-all hover:border-amber-400/40 group active:scale-95"
              >
                <div className="text-slate-200 font-bold text-sm mb-1 group-hover:translate-x-0.5 transition-transform">Assign Aircraft</div>
                <div className="text-[10px] text-slate-400">DGCA Route Basket</div>
              </button>

              <button
                onClick={() => onNavigate('consensus')}
                className="p-3 rounded-xl bg-[#0B0E16] hover:bg-[#161B29] border border-white/[0.07] text-left transition-all hover:border-amber-400/40 group active:scale-95"
              >
                <div className="text-slate-200 font-bold text-sm mb-1 group-hover:translate-x-0.5 transition-transform">Add Client</div>
                <div className="text-[10px] text-slate-400">11 Ecosystem OTAs</div>
              </button>

              <button
                onClick={() => onNavigate('pipeline')}
                className="p-3 rounded-xl bg-[#0B0E16] hover:bg-[#161B29] border border-white/[0.07] text-left transition-all hover:border-amber-400/40 group active:scale-95"
              >
                <div className="text-slate-200 font-bold text-sm mb-1 group-hover:translate-x-0.5 transition-transform">Flight Release</div>
                <div className="text-[10px] text-slate-400">Run Ingestion Pulse</div>
              </button>
            </div>
          </div>

          {/* 3. PERFORMANCE OVERVIEW with Golden Sparkline */}
          <div className="bg-[#11141D] rounded-2xl p-5 border border-white/[0.08] space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                PERFORMANCE OVERVIEW
              </span>
              <span className="text-[10px] text-amber-400 font-bold">This Month ▾</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div>
                <div className="text-[10px] text-slate-400">Flight Hours</div>
                <div className="text-lg font-black text-white mt-0.5">245h 30m</div>
                <div className="text-[9px] text-emerald-400 font-bold mt-0.5">+12.5%</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400">Headline APIx</div>
                <div className="text-lg font-black text-amber-300 mt-0.5">
                  {currentAPIx?.index_value.toFixed(1) || '102.4'}
                </div>
                <div className="text-[9px] text-emerald-400 font-bold mt-0.5">+2.4% 30d</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400">Total Quotes</div>
                <div className="text-lg font-black text-cyan-300 mt-0.5">
                  {(currentAPIx?.valid_observations || 9308).toLocaleString()}
                </div>
                <div className="text-[9px] text-emerald-400 font-bold mt-0.5">98.5% Trust</div>
              </div>
            </div>

            {/* Glowing Golden Sparkline */}
            <div className="pt-2">
              <svg viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} className="w-full h-14 overflow-visible">
                <defs>
                  <filter id="goldenGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <path
                  d={sparkPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="5"
                  opacity="0.3"
                  filter="url(#goldenGlow)"
                />

                <path
                  d={sparkPath}
                  fill="none"
                  stroke="#FDE047"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx={sparkWidth}
                  cy={sparkHeight - ((sparklinePts[sparklinePts.length - 1]?.index_value - minSpark) / rangeSpark) * (sparkHeight - 12) - 6}
                  r="4.5"
                  fill="#FDE047"
                  stroke="#080B11"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Detail Modal when user clicks any fleet card or View Flight Details */}
      <CorridorDetailModal
        corridor={selectedCorridorModal}
        onClose={() => setSelectedCorridorModal(null)}
        onInspectFares={(route) => {
          onSelectRoute(route);
          onNavigate('fare_explorer');
        }}
        onViewDNA={(route) => {
          onSelectRoute(route);
          onNavigate('route_dna');
        }}
      />
    </div>
  );
};
