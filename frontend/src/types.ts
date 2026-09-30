export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarInitials: string;
}

export interface FareObservation {
  id: string;
  source: string;
  source_type: 'AIRLINE' | 'OTA';
  airline: string;
  origin: string;
  destination: string;
  route: string;
  flight_number: string;
  departure_datetime: string;
  booking_window: string;
  fare_class: string;
  base_fare: number;
  taxes: number;
  fees: number;
  total_fare: number;
  baggage: string;
  refundability: string;
  availability: string;
  observed_at: string;
  fingerprint_hash: string;
  trust_score?: number;
  status?: 'VALID' | 'REVIEW' | 'REJECTED';
  quality_reasons?: string[];
  freshness_score?: number;
  completeness_score?: number;
  consistency_score?: number;
  source_agreement_score?: number;
  anomaly_score?: number;
  raw_payload?: any;
}

export interface APIxCurrent {
  index_value: number;
  change_percent_30d: number;
  change_percent_24h: number;
  base_index: number;
  base_period_date: string;
  current_date: string;
  total_observations: number;
  valid_observations: number;
  high_quality_percentage: number;
  monitored_routes_count: number;
  active_sources_count: number;
  formula: string;
  methodology_disclaimer: string;
}

export interface HistoricalPoint {
  date: string;
  index_value: number;
  change_percent: number;
  base_fare_avg: number;
  comparable_fare_avg: number;
  valid_observations_count: number;
}

export interface RouteMeta {
  route: string;
  origin_city: string;
  dest_city: string;
  weight: number;
  pax_share_pct: number;
  distance_km: number;
  current_avg_fare?: number;
  movement_30d?: number;
  volatility?: number;
}

export interface RouteDNA {
  route: string;
  origin_city: string;
  dest_city: string;
  distance_km: number;
  pax_share_pct: number;
  weight: number;
  average_fare: number;
  movement_30d: number;
  volatility: number;
  lead_time_pressure: string;
  lead_time_pressure_pct: number;
  source_agreement: number;
  observation_quality: number;
  sample_size: number;
  fare_curve: Record<string, number>;
  carrier_contribution: Array<{
    airline: string;
    avg_fare: number;
    share_pct: number;
    contribution_pct: number;
  }>;
  source_dispersion: Array<{
    source: string;
    source_type: string;
    avg_fare: number;
    diff_from_route_avg: number;
  }>;
}

export interface LeadTimeData {
  lead_time_points: Array<{
    booking_window: string;
    days_out: number;
    comparable_fare: number;
    change_vs_t45_pct: number;
    sample_count: number;
  }>;
  lead_time_pressure_pct: number;
  t45_fare: number;
  t1_fare: number;
  formula: string;
}

export interface QualitySummary {
  total_observations: number;
  valid_count: number;
  review_count: number;
  rejected_count: number;
  valid_pct: number;
  review_pct: number;
  rejected_pct: number;
  dimension_averages: {
    freshness: number;
    completeness: number;
    consistency: number;
    anomaly_resistance: number;
    cross_source_agreement: number;
    composite_trust: number;
  };
  weights_applied: Record<string, number>;
  methodology: string;
}

export interface ConsensusQuote {
  observation_id: string;
  source: string;
  source_type: string;
  airline: string;
  flight_number: string;
  fare: number;
  base_fare: number;
  taxes: number;
  fees: number;
  deviation_rs: number;
  deviation_pct: number;
  trust_score: number;
  status: string;
  is_outlier: boolean;
}

export interface CrossSourceConsensus {
  route: string;
  booking_window: string;
  market_consensus_fare: number;
  source_agreement_pct: number;
  sample_size: number;
  quotes: ConsensusQuote[];
  consensus_rule: string;
}

export interface InflationDecomposition {
  total_movement_pct: number;
  route_contributions: Array<{
    category: string;
    label: string;
    contribution_pct: number;
    weight_pct: number;
    fare_change_pct: number;
    drilldown_route?: string;
  }>;
  window_contributions: Array<{
    category: string;
    label: string;
    contribution_pct: number;
    weight_pct: number;
    fare_change_pct: number;
    drilldown_route?: string;
  }>;
  top_drivers: Array<any>;
  explanation: string;
}

export interface CollectionRun {
  run_id: string;
  started_at: string;
  completed_at: string;
  sources: number;
  routes: number;
  observations: number;
  valid_count: number;
  flagged_count: number;
  rejected_count: number;
  duration_sec: number;
  status: string;
}

export interface SourceAdapterStatus {
  source_name: string;
  type: string;
  domain: string;
  rate_limit_rps: number;
  status: string;
  latency_ms: number;
  robots_txt_status: string;
  anti_bot_policy: string;
  mode: string;
}
