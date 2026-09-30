import sqlite3
import os
import shutil
from pathlib import Path
from typing import Any, List, Dict, Optional

_DEFAULT_DB = Path(__file__).resolve().parent.parent / "cherubim.db"

# On Vercel, the file system is read-only except /tmp.
# Copy the seeded SQLite database into /tmp so the app can read/write data seamlessly.
if os.environ.get("VERCEL"):
    _TMP_DB = Path("/tmp/cherubim.db")
    if not _TMP_DB.exists() and _DEFAULT_DB.exists():
        shutil.copy2(_DEFAULT_DB, _TMP_DB)
    DB_PATH = _TMP_DB
else:
    DB_PATH = _DEFAULT_DB

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. fare_observations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fare_observations (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        source_type TEXT NOT NULL,
        airline TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        route TEXT NOT NULL,
        flight_number TEXT NOT NULL,
        departure_datetime TEXT NOT NULL,
        booking_window TEXT NOT NULL,
        fare_class TEXT DEFAULT 'Economy',
        base_fare REAL NOT NULL,
        taxes REAL NOT NULL,
        fees REAL NOT NULL,
        total_fare REAL NOT NULL,
        baggage TEXT DEFAULT '15 kg',
        refundability TEXT DEFAULT 'Non-Refundable',
        availability TEXT DEFAULT 'Available',
        observed_at TEXT NOT NULL,
        fingerprint_hash TEXT NOT NULL,
        raw_payload TEXT
    )
    """)

    # 2. fare_quality
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fare_quality (
        observation_id TEXT PRIMARY KEY,
        freshness_score REAL NOT NULL,
        completeness_score REAL NOT NULL,
        consistency_score REAL NOT NULL,
        source_agreement_score REAL NOT NULL,
        anomaly_score REAL NOT NULL,
        trust_score REAL NOT NULL,
        status TEXT NOT NULL,
        quality_reasons TEXT,
        FOREIGN KEY (observation_id) REFERENCES fare_observations(id)
    )
    """)

    # 3. route_weights
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS route_weights (
        route TEXT PRIMARY KEY,
        origin_city TEXT NOT NULL,
        dest_city TEXT NOT NULL,
        weight REAL NOT NULL,
        pax_share_pct REAL NOT NULL,
        distance_km INTEGER NOT NULL,
        effective_date TEXT NOT NULL
    )
    """)

    # 4. index_values
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS index_values (
        date TEXT PRIMARY KEY,
        index_value REAL NOT NULL,
        change_percent REAL NOT NULL,
        base_fare_avg REAL NOT NULL,
        comparable_fare_avg REAL NOT NULL,
        valid_observations_count INTEGER NOT NULL
    )
    """)

    # 5. index_contributions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS index_contributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        label TEXT NOT NULL,
        contribution_pct REAL NOT NULL,
        weight_pct REAL NOT NULL,
        fare_change_pct REAL NOT NULL,
        drilldown_route TEXT
    )
    """)

    # 6. collection_runs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS collection_runs (
        run_id TEXT PRIMARY KEY,
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        sources INTEGER NOT NULL,
        routes INTEGER NOT NULL,
        observations INTEGER NOT NULL,
        valid_count INTEGER NOT NULL,
        flagged_count INTEGER NOT NULL,
        rejected_count INTEGER NOT NULL,
        duration_sec REAL NOT NULL,
        status TEXT NOT NULL
    )
    """)

    # Create Indexes for fast querying
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_obs_route ON fare_observations(route)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_obs_window ON fare_observations(booking_window)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_obs_date ON fare_observations(observed_at)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_obs_airline ON fare_observations(airline)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_obs_source ON fare_observations(source)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_quality_status ON fare_quality(status)")

    conn.commit()
    conn.close()

def execute_query(sql: str, params: tuple = ()) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, params)
    rows = cursor.fetchall()
    result = [dict(row) for row in rows]
    conn.close()
    return result

def execute_single(sql: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, params)
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None
