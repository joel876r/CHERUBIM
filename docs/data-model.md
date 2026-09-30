# CHERUBIM Data Model & Schema Specification

## Database Architecture
CHERUBIM uses a high-performance SQLite engine for local reproducibility, zero-setup portability, and deterministic auditing. The schema maps cleanly to PostgreSQL / Supabase for enterprise deployment.

---

## Entity Relationship Summary

```text
 ┌──────────────────────┐        1:1        ┌──────────────────────┐
 │  fare_observations   ├───────────────────┤     fare_quality     │
 │  (Raw & Normalized)  │                   │ (5 Quality Pillars)  │
 └──────────┬───────────┘                   └──────────────────────┘
            │
            │ N:1
            ▼
 ┌──────────────────────┐
 │    route_weights     │
 │  (DGCA Corridors)    │
 └──────────────────────┘

 ┌──────────────────────┐                   ┌──────────────────────┐
 │     index_values     │                   │ index_contributions  │
 │ (30-Day APIx Series) │                   │ (Decomposition Tree) │
 └──────────────────────┘                   └──────────────────────┘

 ┌──────────────────────┐
 │   collection_runs    │
 │ (Surveillance Logs)  │
 └──────────────────────┘
```

---

## Table Specifications

### 1. `fare_observations`
Contains individual airfare quotes captured across airline portals and OTAs.

| Column | Type | Description |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Formatted identifier (e.g. `OBS-000481`) |
| `source` | `TEXT NOT NULL` | Origin portal (e.g. `IndiGo`, `MakeMyTrip`, `Cleartrip`) |
| `source_type` | `TEXT NOT NULL` | Category (`AIRLINE` or `OTA`) |
| `airline` | `TEXT NOT NULL` | Operating carrier (e.g. `IndiGo`, `Air India`) |
| `origin` | `TEXT NOT NULL` | 3-letter IATA airport code (e.g. `MAA`) |
| `destination` | `TEXT NOT NULL` | 3-letter IATA airport code (e.g. `DEL`) |
| `route` | `TEXT NOT NULL` | Standard corridor format (`MAA-DEL`) |
| `flight_number` | `TEXT NOT NULL` | Carrier flight code (e.g. `6E-1234`) |
| `departure_datetime` | `TEXT NOT NULL` | Scheduled flight departure (`YYYY-MM-DD HH:MM`) |
| `booking_window` | `TEXT NOT NULL` | Advance horizon (`T+1`, `T+7`, `T+15`, `T+30`, `T+45`) |
| `fare_class` | `TEXT` | Travel class (Default: `Economy`) |
| `base_fare` | `REAL NOT NULL` | Statutory unbundled base fare (₹) |
| `taxes` | `REAL NOT NULL` | Airport charges + GST + UDF/PSF (₹) |
| `fees` | `REAL NOT NULL` | Convenience & booking charges (₹) |
| `total_fare` | `REAL NOT NULL` | Comparable total price paid by consumer (₹) |
| `baggage` | `TEXT` | Standard baggage allowance (`15 kg`) |
| `refundability` | `TEXT` | Fare ticket condition (`Non-Refundable`) |
| `availability` | `TEXT` | Inventory status (`Available`, `1 Seat Left`) |
| `observed_at` | `TEXT NOT NULL` | Scraper timestamp (`YYYY-MM-DD HH:MM:SS`) |
| `fingerprint_hash` | `TEXT NOT NULL` | Deterministic SHA-256 fingerprint hash |
| `raw_payload` | `TEXT` | Serialized JSON containing raw DOM selectors & headers |

---

### 2. `fare_quality`
Stores verification scores computed by the Trust Engine.

| Column | Type | Description |
|---|---|---|
| `observation_id` | `TEXT PRIMARY KEY` | References `fare_observations(id)` |
| `freshness_score` | `REAL NOT NULL` | Scraping recency score (0–100) |
| `completeness_score`| `REAL NOT NULL` | Statutory breakdown completeness (0–100) |
| `consistency_score` | `REAL NOT NULL` | Absence of duplicate quote injection (0–100) |
| `source_agreement_score` | `REAL NOT NULL` | Cluster agreement with peer sources (0–100) |
| `anomaly_score` | `REAL NOT NULL` | Median Absolute Deviation resistance (0–100) |
| `trust_score` | `REAL NOT NULL` | Weighted composite score (0–100) |
| `status` | `TEXT NOT NULL` | Gating result: `VALID`, `REVIEW`, `REJECTED` |
| `quality_reasons` | `TEXT` | Serialized JSON array of verification checklist items |

---

### 3. `route_weights`
Defines the representative basket of national air corridors.

| Column | Type | Description |
|---|---|---|
| `route` | `TEXT PRIMARY KEY` | Corridor code (`DEL-BOM`, `MAA-DEL`, etc.) |
| `origin_city` | `TEXT NOT NULL` | Full city name (e.g. `Delhi`) |
| `dest_city` | `TEXT NOT NULL` | Full city name (e.g. `Mumbai`) |
| `weight` | `REAL NOT NULL` | Normalized DGCA traffic weight ($0.11 - 0.24$) |
| `pax_share_pct` | `REAL NOT NULL` | Official domestic passenger volume share |
| `distance_km` | `INTEGER NOT NULL` | Flight distance in kilometers |
| `effective_date` | `TEXT NOT NULL` | Calibration period date |

---

### 4. `index_values`
Contains the calculated daily Airfare Price Index (APIx).

| Column | Type | Description |
|---|---|---|
| `date` | `TEXT PRIMARY KEY` | Index release date (`YYYY-MM-DD`) |
| `index_value` | `REAL NOT NULL` | Headline Jevons index (Base = 100.0) |
| `change_percent` | `REAL NOT NULL` | Daily percentage movement (%) |
| `base_fare_avg` | `REAL NOT NULL` | Average base fare across valid quotes (₹) |
| `comparable_fare_avg`| `REAL NOT NULL` | Average total comparable fare (₹) |
| `valid_observations_count` | `INTEGER NOT NULL` | Number of contributing valid quotes |

---

### 5. `collection_runs`
Maintains operational telemetry for ingestion audits.

| Column | Type | Description |
|---|---|---|
| `run_id` | `TEXT PRIMARY KEY` | Unique cycle ID (e.g. `RUN-000184`) |
| `started_at` | `TEXT NOT NULL` | Extraction cycle start timestamp |
| `completed_at` | `TEXT NOT NULL` | Extraction cycle end timestamp |
| `sources` | `INTEGER NOT NULL` | Number of active source adapters (11) |
| `routes` | `INTEGER NOT NULL` | Number of monitored corridors (6) |
| `observations` | `INTEGER NOT NULL` | Total raw quotes ingested |
| `valid_count` | `INTEGER NOT NULL` | Passed quality verification |
| `flagged_count` | `INTEGER NOT NULL` | Flagged for review |
| `rejected_count` | `INTEGER NOT NULL` | Excluded outliers |
| `duration_sec` | `REAL NOT NULL` | Cycle duration in seconds |
| `status` | `TEXT NOT NULL` | Operational status (`COMPLETE`) |
