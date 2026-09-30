from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FareObservation(BaseModel):
    id: str
    source: str
    source_type: str  # "AIRLINE" or "OTA"
    airline: str
    origin: str
    destination: str
    route: str
    flight_number: str
    departure_datetime: str
    booking_window: str  # T+1, T+7, T+15, T+30, T+45
    fare_class: str = "Economy"
    base_fare: float
    taxes: float
    fees: float
    total_fare: float
    baggage: str = "15 kg"
    refundability: str = "Non-Refundable"
    availability: str = "Available"
    observed_at: str
    fingerprint_hash: str
    # Trust metadata joined for convenience
    trust_score: Optional[float] = None
    status: Optional[str] = "VALID"  # VALID, REVIEW, REJECTED
    quality_breakdown: Optional[Dict[str, Any]] = None

class FareQuality(BaseModel):
    observation_id: str
    freshness_score: float
    completeness_score: float
    consistency_score: float
    source_agreement_score: float
    anomaly_score: float
    trust_score: float
    status: str
    quality_reasons: List[str]

class RouteWeight(BaseModel):
    route: str
    origin_city: str
    dest_city: str
    weight: float
    pax_share_pct: float
    distance_km: int

class StratumPrice(BaseModel):
    route: str
    booking_window: str
    representative_fare: float
    base_period_fare: float
    price_relative: float
    weight: float
    observations_count: int

class APIxCurrent(BaseModel):
    index_value: float
    change_percent_30d: float
    change_percent_24h: float
    base_index: float = 100.0
    base_period_date: str
    current_date: str
    total_observations: int
    valid_observations: int
    high_quality_percentage: float
    monitored_routes_count: int
    active_sources_count: int
    formula: str
    methodology_disclaimer: str

class APIxHistoricalPoint(BaseModel):
    date: str
    index_value: float
    change_percent: float
    representative_avg_fare: float
    valid_observations: int

class RouteDNA(BaseModel):
    route: str
    origin_city: str
    dest_city: str
    average_fare: float
    movement_30d: float
    volatility: float
    lead_time_pressure: str  # "High", "Moderate", "Low"
    lead_time_pressure_pct: float
    source_agreement: float
    observation_quality: float
    sample_size: int
    fare_curve: Dict[str, float]  # window -> avg fare
    carrier_contribution: List[Dict[str, Any]]
    source_dispersion: List[Dict[str, Any]]

class LeadTimePoint(BaseModel):
    booking_window: str
    days_out: int
    comparable_fare: float
    change_vs_t45_pct: float
    sample_count: int

class InflationDecompositionItem(BaseModel):
    category: str
    label: str
    contribution_pct: float
    weight_pct: float
    fare_change_pct: float
    drilldown_route: Optional[str] = None

class CollectionRunRecord(BaseModel):
    run_id: str
    started_at: str
    completed_at: str
    sources: int
    routes: int
    observations: int
    valid_count: int
    flagged_count: int
    rejected_count: int
    duration_str: str
    status: str
