import {
  APIxCurrent, HistoricalPoint, RouteMeta, RouteDNA,
  LeadTimeData, QualitySummary, CrossSourceConsensus,
  InflationDecomposition, FareObservation, CollectionRun, SourceAdapterStatus
} from '../types';

const API_BASE = '/api';

export const api = {
  async getCurrentAPIx(): Promise<APIxCurrent> {
    const res = await fetch(`${API_BASE}/apiX/current`);
    if (!res.ok) throw new Error('Failed to fetch current APIx');
    return res.json();
  },

  async getHistoricalAPIx(frequency: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<HistoricalPoint[]> {
    const res = await fetch(`${API_BASE}/apiX/history?frequency=${frequency}`);
    if (!res.ok) throw new Error('Failed to fetch historical APIx');
    return res.json();
  },

  async getRoutes(): Promise<RouteMeta[]> {
    const res = await fetch(`${API_BASE}/routes`);
    if (!res.ok) throw new Error('Failed to fetch routes');
    return res.json();
  },

  async getRouteDNA(route: string): Promise<RouteDNA> {
    const res = await fetch(`${API_BASE}/routes/${route}/dna`);
    if (!res.ok) throw new Error('Failed to fetch route DNA');
    return res.json();
  },

  async getLeadTimePressure(): Promise<LeadTimeData> {
    const res = await fetch(`${API_BASE}/lead-time/pressure`);
    if (!res.ok) throw new Error('Failed to fetch lead-time pressure');
    return res.json();
  },

  async getObservations(params: {
    route?: string;
    airline?: string;
    source?: string;
    window?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<{
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    observations: FareObservation[];
  }> {
    const query = new URLSearchParams();
    if (params.route) query.set('route', params.route);
    if (params.airline) query.set('airline', params.airline);
    if (params.source) query.set('source', params.source);
    if (params.window) query.set('window', params.window);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page.toString());
    if (params.page_size) query.set('page_size', params.page_size.toString());

    const res = await fetch(`${API_BASE}/observations?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch observations');
    return res.json();
  },

  async getObservationDetail(id: string): Promise<FareObservation> {
    const res = await fetch(`${API_BASE}/observations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch observation detail');
    return res.json();
  },

  async getQualitySummary(): Promise<QualitySummary> {
    const res = await fetch(`${API_BASE}/quality/summary`);
    if (!res.ok) throw new Error('Failed to fetch quality summary');
    return res.json();
  },

  async getCrossSourceConsensus(route: string = 'MAA-DEL', window: string = 'T+15'): Promise<CrossSourceConsensus> {
    const res = await fetch(`${API_BASE}/consensus/${route}/${window}`);
    if (!res.ok) throw new Error('Failed to fetch cross source consensus');
    return res.json();
  },

  async getInflationDecomposition(): Promise<InflationDecomposition> {
    const res = await fetch(`${API_BASE}/contributions`);
    if (!res.ok) throw new Error('Failed to fetch inflation decomposition');
    return res.json();
  },

  async getPipelineStatus(): Promise<{
    status: string;
    last_run: CollectionRun;
    recent_runs: CollectionRun[];
    active_adapters: SourceAdapterStatus[];
    schedule: string;
    safeguards: Record<string, string>;
  }> {
    const res = await fetch(`${API_BASE}/pipeline/status`);
    if (!res.ok) throw new Error('Failed to fetch pipeline status');
    return res.json();
  },

  async runDemoCollection(): Promise<any> {
    const res = await fetch(`${API_BASE}/pipeline/run`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run collection simulation');
    return res.json();
  },

  async recalculateAPIx(): Promise<any> {
    const res = await fetch(`${API_BASE}/index/recalculate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to recalculate APIx');
    return res.json();
  },

  async getAdapters(): Promise<SourceAdapterStatus[]> {
    const res = await fetch(`${API_BASE}/adapters`);
    if (!res.ok) throw new Error('Failed to fetch adapters');
    return res.json();
  },

  getExportUrl(format: 'csv' | 'json'): string {
    return `${API_BASE}/export/${format}`;
  }
};
