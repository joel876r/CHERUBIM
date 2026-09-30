from fastapi import APIRouter, HTTPException, Query, Response
from typing import Optional, List, Dict, Any
import json
import csv
import io
import time
from datetime import datetime

from .database import execute_query, execute_single, get_connection
from .models import (
    APIxCurrent, RouteDNA, StratumPrice,
    InflationDecompositionItem, CollectionRunRecord
)
from .apix_engine import (
    get_current_apix, get_historical_apix, get_lead_time_curve,
    get_route_dna, get_inflation_decomposition, recalculate_apix_all_days
)
from .trust_engine import get_quality_summary, get_cross_source_consensus
from .adapters import get_all_adapters_status

router = APIRouter(prefix="/api")

@router.get("/apiX/current")
def api_current_apix():
    return get_current_apix()

@router.get("/apiX/history")
def api_historical_apix(frequency: str = Query("daily", pattern="^(daily|weekly|monthly)$")):
    return get_historical_apix(frequency)

@router.get("/routes")
def api_get_routes():
    routes = execute_query("""
        SELECT rw.*, 
            ROUND(AVG(fo.total_fare), 0) as current_avg_fare,
            COUNT(fo.id) as observation_count
        FROM route_weights rw
        LEFT JOIN fare_observations fo ON rw.route = fo.route AND fo.observed_at LIKE '2026-09-30%'
        GROUP BY rw.route
        ORDER BY rw.weight DESC
    """)
    # Add 30d movement estimate
    for r in routes:
        dna = get_route_dna(r["route"])
        r["movement_30d"] = dna.get("movement_30d", 3.5)
        r["volatility"] = dna.get("volatility", 16.0)
    return routes

@router.get("/routes/{route}")
def api_get_route(route: str):
    r = execute_single("SELECT * FROM route_weights WHERE route = ?", (route,))
    if not r:
        raise HTTPException(status_code=404, detail="Route not found")
    return r

@router.get("/routes/{route}/dna")
def api_route_dna(route: str):
    dna = get_route_dna(route)
    if "error" in dna:
        raise HTTPException(status_code=404, detail=dna["error"])
    return dna

@router.get("/lead-time/pressure")
def api_lead_time():
    return get_lead_time_curve()

@router.get("/observations")
def api_get_observations(
    route: Optional[str] = None,
    airline: Optional[str] = None,
    source: Optional[str] = None,
    window: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=5, le=100)
):
    query = """
        SELECT 
            o.id, o.source, o.source_type, o.airline, o.origin, o.destination,
            o.route, o.flight_number, o.departure_datetime, o.booking_window,
            o.fare_class, o.base_fare, o.taxes, o.fees, o.total_fare,
            o.baggage, o.refundability, o.availability, o.observed_at,
            o.fingerprint_hash,
            q.trust_score, q.status, q.quality_reasons
        FROM fare_observations o
        JOIN fare_quality q ON o.id = q.observation_id
        WHERE 1=1
    """
    params = []

    if route:
        query += " AND o.route = ?"
        params.append(route)
    if airline:
        query += " AND o.airline = ?"
        params.append(airline)
    if source:
        query += " AND o.source = ?"
        params.append(source)
    if window:
        query += " AND o.booking_window = ?"
        params.append(window)
    if status:
        query += " AND q.status = ?"
        params.append(status)
    if search:
        query += " AND (o.id LIKE ? OR o.flight_number LIKE ? OR o.route LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s])

    # Total count for pagination
    count_query = f"SELECT COUNT(*) as cnt FROM ({query})"
    total_count = execute_single(count_query, tuple(params))["cnt"]

    # Sorting and Pagination
    query += " ORDER BY o.observed_at DESC, o.id DESC LIMIT ? OFFSET ?"
    params.extend([page_size, (page - 1) * page_size])

    rows = execute_query(query, tuple(params))
    for r in rows:
        if r.get("quality_reasons"):
            try:
                r["quality_reasons"] = json.loads(r["quality_reasons"])
            except Exception:
                pass

    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size,
        "observations": rows
    }

@router.get("/observations/{obs_id}")
def api_get_observation_detail(obs_id: str):
    query = """
        SELECT 
            o.*, 
            q.freshness_score, q.completeness_score, q.consistency_score,
            q.source_agreement_score, q.anomaly_score, q.trust_score,
            q.status, q.quality_reasons
        FROM fare_observations o
        JOIN fare_quality q ON o.id = q.observation_id
        WHERE o.id = ?
    """
    row = execute_single(query, (obs_id,))
    if not row:
        raise HTTPException(status_code=404, detail="Observation not found")

    if row.get("quality_reasons"):
        try:
            row["quality_reasons"] = json.loads(row["quality_reasons"])
        except Exception:
            pass

    if row.get("raw_payload"):
        try:
            row["raw_payload"] = json.loads(row["raw_payload"])
        except Exception:
            pass

    return row

@router.get("/quality/summary")
def api_quality_summary():
    return get_quality_summary()

@router.get("/consensus/{route}/{window}")
def api_cross_source_consensus(route: str, window: str):
    return get_cross_source_consensus(route, window)

@router.get("/contributions")
def api_contributions():
    return get_inflation_decomposition()

@router.get("/pipeline/status")
def api_pipeline_status():
    runs = execute_query("SELECT * FROM collection_runs ORDER BY started_at DESC LIMIT 10")
    adapters = get_all_adapters_status()
    return {
        "status": "OPERATIONAL",
        "last_run": runs[0] if runs else None,
        "recent_runs": runs,
        "active_adapters": adapters,
        "schedule": "Continuous Daily 4-Hour Cycles (06:00, 10:00, 14:00, 18:00, 22:00 IST)",
        "safeguards": {
            "rate_limiting": "Active (Token-bucket max 2-3 rps)",
            "robots_txt": "Enforced (MoSPI DIID Automated Compliance)",
            "anti_bot_evasion": "Disabled (Zero bypass, strictly public fares / API connectors)"
        }
    }

@router.post("/pipeline/run")
def api_run_collection_simulation():
    """Simulates a live collection cycle for the prototype."""
    run_id = f"RUN-{int(time.time())}"
    started = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    time.sleep(0.5)  # brief simulation delay
    completed = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Count real observations
    tot = execute_single("SELECT COUNT(*) as c FROM fare_observations")["c"]
    val = execute_single("SELECT COUNT(*) as c FROM fare_quality WHERE status = 'VALID'")["c"]
    rev = execute_single("SELECT COUNT(*) as c FROM fare_quality WHERE status = 'REVIEW'")["c"]
    rej = execute_single("SELECT COUNT(*) as c FROM fare_quality WHERE status = 'REJECTED'")["c"]

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO collection_runs (
            run_id, started_at, completed_at, sources, routes,
            observations, valid_count, flagged_count, rejected_count, duration_sec, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (run_id, started, completed, 11, 6, 180, 168, 8, 4, 1.8, "COMPLETE"))
    conn.commit()
    conn.close()

    return {
        "run_id": run_id,
        "status": "COMPLETE",
        "started_at": started,
        "completed_at": completed,
        "new_observations_collected": 180,
        "valid_quotes": 168,
        "flagged_quotes": 8,
        "rejected_quotes": 4,
        "duration": "01.8s",
        "message": "Simulated multi-source collection completed successfully across 11 source adapters."
    }

@router.post("/index/recalculate")
def api_trigger_recalculate():
    res = recalculate_apix_all_days()
    return res

@router.get("/adapters")
def api_adapters():
    return get_all_adapters_status()

@router.get("/export/{fmt}")
def api_export_data(fmt: str):
    """Exports full reproducibility audit ledger in CSV or JSON for MoSPI/RBI integration."""
    rows = execute_query("""
        SELECT 
            o.id as observation_id, o.observed_at, o.route, o.airline, o.flight_number,
            o.booking_window, o.source, o.source_type, o.base_fare, o.taxes, o.fees,
            o.total_fare as comparable_fare, q.trust_score, q.status,
            o.fingerprint_hash
        FROM fare_observations o
        JOIN fare_quality q ON o.id = q.observation_id
        ORDER BY o.observed_at DESC
        LIMIT 1000
    """)

    if fmt.lower() == "csv":
        output = io.StringIO()
        if rows:
            writer = csv.DictWriter(output, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            for r in rows:
                writer.writerow(r)
        
        response = Response(content=output.getvalue(), media_type="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=cherubim_apix_audit_ledger.csv"
        return response
    else:
        return {
            "schema": "MoSPI-DIID-APIx-Audit-Ledger-v1.0",
            "extracted_at": datetime.now().isoformat(),
            "records_count": len(rows),
            "records": rows
        }

@router.get("/health")
def api_health():
    return {
        "status": "HEALTHY",
        "system": "CHERUBIM Statistical Engine",
        "version": "1.0.0-PROTOTYPE",
        "mode": "DEMO MODE — REPRODUCIBLE PROTOTYPE DATA",
        "target_agency": "Ministry of Statistics and Programme Implementation (MoSPI) - DIID",
        "database": "SQLite (Reproducible Local Engine)",
        "memory_status": "NORMAL",
        "timestamp": datetime.now().isoformat()
    }
