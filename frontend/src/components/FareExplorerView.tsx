import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, ShieldCheck, 
  AlertTriangle, AlertCircle, RefreshCw, Fingerprint
} from 'lucide-react';
import { FareObservation } from '../types';
import { api } from '../services/api';

interface FareExplorerViewProps {
  onSelectObservation: (obs: FareObservation) => void;
  initialRoute?: string;
}

export const FareExplorerView: React.FC<FareExplorerViewProps> = ({
  onSelectObservation,
  initialRoute
}) => {
  const [observations, setObservations] = useState<FareObservation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedRoute, setSelectedRoute] = useState<string>(initialRoute || '');
  const [selectedAirline, setSelectedAirline] = useState<string>('');
  const [selectedWindow, setSelectedWindow] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchObservations = async () => {
    setLoading(true);
    try {
      const res = await api.getObservations({
        route: selectedRoute || undefined,
        airline: selectedAirline || undefined,
        window: selectedWindow || undefined,
        status: selectedStatus || undefined,
        search: searchQuery || undefined,
        page,
        page_size: pageSize
      });
      setObservations(res.observations);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservations();
  }, [page, selectedRoute, selectedAirline, selectedWindow, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchObservations();
  };

  const handleResetFilters = () => {
    setSelectedRoute('');
    setSelectedAirline('');
    setSelectedWindow('');
    setSelectedStatus('');
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search Filter Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <Search className="w-5 h-5 text-cyan-400" />
              <span>FARE EXPLORER & OBSERVATION AUDIT</span>
            </h2>
            <p className="text-xs text-slate-400">
              Filter and inspect individual quotes, unbundled statutory components, and validation trust scores
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Showing {observations.length} of {total.toLocaleString()} records</span>
            <button
              onClick={fetchObservations}
              className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300"
              title="Refresh Quotes"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* Search Input */}
          <div className="col-span-2 sm:col-span-1 md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search OBS-ID, Flight (6E-1234)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Route Filter */}
          <div>
            <select
              value={selectedRoute}
              onChange={(e) => { setSelectedRoute(e.target.value); setPage(1); }}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="">All Corridors</option>
              <option value="MAA-DEL">MAA-DEL</option>
              <option value="DEL-BOM">DEL-BOM</option>
              <option value="DEL-BLR">DEL-BLR</option>
              <option value="BOM-BLR">BOM-BLR</option>
              <option value="DEL-CCU">DEL-CCU</option>
              <option value="BLR-HYD">BLR-HYD</option>
            </select>
          </div>

          {/* Booking Window */}
          <div>
            <select
              value={selectedWindow}
              onChange={(e) => { setSelectedWindow(e.target.value); setPage(1); }}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="">All Windows</option>
              <option value="T+1">T+1 (1 Day)</option>
              <option value="T+7">T+7 (7 Days)</option>
              <option value="T+15">T+15 (15 Days)</option>
              <option value="T+30">T+30 (30 Days)</option>
              <option value="T+45">T+45 (45 Days)</option>
            </select>
          </div>

          {/* Airline */}
          <div>
            <select
              value={selectedAirline}
              onChange={(e) => { setSelectedAirline(e.target.value); setPage(1); }}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="">All Carriers</option>
              <option value="IndiGo">IndiGo</option>
              <option value="Air India">Air India</option>
              <option value="Air India Express">Air India Express</option>
              <option value="Akasa Air">Akasa Air</option>
              <option value="SpiceJet">SpiceJet</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="">All Statuses</option>
              <option value="VALID">VALID (Passed)</option>
              <option value="REVIEW">REVIEW (Flagged)</option>
              <option value="REJECTED">REJECTED (Outlier)</option>
            </select>
          </div>
        </form>
      </div>

      {/* Observation Table */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-surface-subtle border-b border-surface-border text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Observation ID</th>
                <th className="py-3 px-3">Corridor</th>
                <th className="py-3 px-3">Carrier / Flight</th>
                <th className="py-3 px-3">Horizon</th>
                <th className="py-3 px-3 text-right">Base Fare</th>
                <th className="py-3 px-3 text-right">Taxes</th>
                <th className="py-3 px-3 text-right">Fees</th>
                <th className="py-3 px-4 text-right">Comparable Fare</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3 text-center">Trust</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400 mb-2" />
                    Loading verified observations...
                  </td>
                </tr>
              ) : observations.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    No airfare quotes matched your filter criteria.
                  </td>
                </tr>
              ) : (
                observations.map((obs) => {
                  const isRejected = obs.status === 'REJECTED';
                  const isReview = obs.status === 'REVIEW';
                  const isValid = obs.status === 'VALID' || (!isRejected && !isReview);

                  return (
                    <tr
                      key={obs.id}
                      onClick={() => onSelectObservation(obs)}
                      className="hover:bg-surface-hover/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-4 font-bold text-cyan-300 flex items-center space-x-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-cyan-500 opacity-60 group-hover:opacity-100" />
                        <span>{obs.id}</span>
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-slate-100">
                        {obs.route}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-slate-200">{obs.airline}</div>
                        <div className="text-[10px] text-slate-400">{obs.flight_number}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-purple-300 font-bold">
                          {obs.booking_window}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-300">
                        ₹{obs.base_fare?.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-400">
                        ₹{obs.taxes?.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-400">
                        ₹{obs.fees?.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-4 text-right font-bold text-sm text-slate-100">
                        ₹{obs.total_fare?.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-slate-200">{obs.source}</div>
                        <div className="text-[10px] text-slate-400">{obs.source_type}</div>
                      </td>

                      <td className="py-2.5 px-3 text-center font-bold">
                        <span className={
                          isValid ? 'text-emerald-400' : isReview ? 'text-amber-400' : 'text-rose-400'
                        }>
                          {obs.trust_score || 94}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isValid
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : isReview
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                        }`}>
                          {obs.status || 'VALID'}
                        </span>
                      </td>

                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectObservation(obs);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-cyan-500/20 hover:text-cyan-300 border border-surface-border hover:border-cyan-500/40 text-[11px] text-slate-300 transition-all"
                        >
                          Fingerprint
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-surface-border bg-surface-subtle/50 flex items-center justify-between text-xs font-mono">
          <div className="text-slate-400">
            Page {page} of {totalPages} ({total.toLocaleString()} observations)
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border disabled:opacity-40 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-surface-card border border-surface-border text-cyan-300 font-bold">
              {page}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border disabled:opacity-40 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
