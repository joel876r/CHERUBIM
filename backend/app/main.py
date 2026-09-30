from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time

from .database import init_db, get_connection, execute_single
from .generator import generate_dataset
from .apix_engine import recalculate_apix_all_days
from .api_routes import router

def populate_initial_dataset():
    conn = get_connection()
    cursor = conn.cursor()

    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM fare_observations")
    count = cursor.fetchone()[0]

    if count == 0:
        print("[CHERUBIM] Initializing deterministic demo dataset (30 days, 6 routes, 5 windows)...")
        observations, quality_records, routes = generate_dataset(days_back=30)

        # 1. Insert route weights
        route_records = [
            (r["route"], r["origin_city"], r["dest_city"], r["weight"], r["pax_share_pct"], r["distance_km"], "2026-08-31")
            for r in routes
        ]
        cursor.executemany("""
            INSERT OR REPLACE INTO route_weights (route, origin_city, dest_city, weight, pax_share_pct, distance_km, effective_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, route_records)

        # 2. Insert fare observations
        obs_tuples = [
            (
                o["id"], o["source"], o["source_type"], o["airline"], o["origin"], o["destination"],
                o["route"], o["flight_number"], o["departure_datetime"], o["booking_window"],
                o["fare_class"], o["base_fare"], o["taxes"], o["fees"], o["total_fare"],
                o["baggage"], o["refundability"], o["availability"], o["observed_at"],
                o["fingerprint_hash"], o["raw_payload"]
            )
            for o in observations
        ]
        cursor.executemany("""
            INSERT INTO fare_observations (
                id, source, source_type, airline, origin, destination, route,
                flight_number, departure_datetime, booking_window, fare_class,
                base_fare, taxes, fees, total_fare, baggage, refundability,
                availability, observed_at, fingerprint_hash, raw_payload
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, obs_tuples)

        # 3. Insert fare quality
        qual_tuples = [
            (
                q["observation_id"], q["freshness_score"], q["completeness_score"],
                q["consistency_score"], q["source_agreement_score"], q["anomaly_score"],
                q["trust_score"], q["status"], q["quality_reasons"]
            )
            for q in quality_records
        ]
        cursor.executemany("""
            INSERT INTO fare_quality (
                observation_id, freshness_score, completeness_score, consistency_score,
                source_agreement_score, anomaly_score, trust_score, status, quality_reasons
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, qual_tuples)

        # 4. Insert initial historical collection runs
        runs = [
            ("RUN-000184", "2026-09-30 10:30:00", "2026-09-30 10:32:18", 11, 6, 720, 681, 27, 12, 138.0, "COMPLETE"),
            ("RUN-000183", "2026-09-30 06:30:00", "2026-09-30 06:32:05", 11, 6, 720, 678, 29, 13, 125.0, "COMPLETE"),
            ("RUN-000182", "2026-09-29 22:30:00", "2026-09-29 22:32:10", 11, 6, 720, 685, 24, 11, 130.0, "COMPLETE"),
            ("RUN-000181", "2026-09-29 18:30:00", "2026-09-29 18:32:15", 11, 6, 720, 680, 26, 14, 135.0, "COMPLETE")
        ]
        cursor.executemany("""
            INSERT OR REPLACE INTO collection_runs (
                run_id, started_at, completed_at, sources, routes,
                observations, valid_count, flagged_count, rejected_count, duration_sec, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, runs)

        conn.commit()
        print(f"[CHERUBIM] Inserted {len(observations)} observations and {len(quality_records)} quality records.")

    conn.close()

    # Recalculate index time-series
    recalculate_apix_all_days()
    print("[CHERUBIM] APIx index engine synchronized.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    populate_initial_dataset()
    yield
    # Shutdown

app = FastAPI(
    title="CHERUBIM API — Trust-Aware Real-Time Airfare Intelligence & Price Index",
    description="Statistical data ingestion, quality validation, and APIx index construction for MoSPI CPI Augmentation.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "system": "CHERUBIM",
        "title": "Trust-Aware Real-Time Airfare Intelligence & Price Index",
        "agency": "Ministry of Statistics and Programme Implementation (MoSPI) - DIID",
        "index_name": "APIx — Airfare Price Index",
        "status": "OPERATIONAL",
        "mode": "DEMO MODE — REPRODUCIBLE PROTOTYPE DATA",
        "api_docs": "/docs",
        "philosophy": "COLLECT -> TRUST -> INDEX -> EXPLAIN"
    }
