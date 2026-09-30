# CHERUBIM System Architecture

## Overview
CHERUBIM is a government-grade airfare statistical intelligence and price index construction platform designed for the **Ministry of Statistics and Programme Implementation (MoSPI) - Data Informatics & Innovation Division (DIID)** to augment the 'Transport and Communication' sub-group of the Consumer Price Index (CPI) under Smart India Hackathon Problem Statement **SIH26056**.

## Core Product Philosophy
```
COLLECT → TRUST → INDEX → EXPLAIN
```
A raw airfare quote enters CHERUBIM as an unverified observation, undergoes automated unbundling, 5-pillar statistical quality gating, deterministic deduplication, and anomaly rejection, and then contributes to the official **Airfare Price Index (APIx)** with complete cryptographic reproducibility.

---

## Architectural Block Diagram

```text
       ┌──────────────────────────────────────────────────────────┐
       │         AIRLINE PORTALS & ONLINE TRAVEL AGGREGATORS       │
       │  Airlines: IndiGo, Air India, AI Express, Akasa, SpiceJet │
       │  OTAs: MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo... │
       └─────────────────────────────┬────────────────────────────┘
                                     │ (Token-Bucket Rate Limited)
                                     ▼
                       ┌────────────────────────────┐
                       │   SOURCE ADAPTER LAYER     │
                       │  - Robots.txt Enforcement  │
                       │  - Rate Limiter (2-3 rps)  │
                       │  - Partner API Connectors  │
                       │  - Zero CAPTCHA Bypass     │
                       └─────────────┬──────────────┘
                                     ▼
                       ┌────────────────────────────┐
                       │     DATA EXTRACTION        │
                       │  - Playwright / Scrapy     │
                       │  - Deterministic Demo Seed │
                       └─────────────┬──────────────┘
                                     ▼
                       ┌────────────────────────────┐
                       │   RAW FARE OBSERVATIONS    │
                       └─────────────┬──────────────┘
                                     ▼
                       ┌────────────────────────────┐
                       │    STATUTORY UNBUNDLING    │
                       │  Base Fare + Taxes (UDF/   │
                       │  PSF/GST) + Convenience Fee│
                       │  = Comparable Total Fare   │
                       └─────────────┬──────────────┘
                                     ▼
                       ┌────────────────────────────┐
                       │   DETERMINISTIC IDENTITY   │
                       │  Route | Flight | Window | │
                       │  Date | SHA-256 Fingerprint│
                       └─────────────┬──────────────┘
                                     ▼
                       ┌────────────────────────────┐
                       │    TRUST & QUALITY GATE    │
                       │  1. Freshness Score        │
                       │  2. Completeness Score     │
                       │  3. Consistency Check      │
                       │  4. MAD Anomaly Detection  │
                       │  5. Cross-Source Consensus │
                       └─────────────┬──────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
                 ▼                                       ▼
       ┌─────────────────────┐                 ┌─────────────────────┐
       │     VALID QUOTES    │                 │   FLAGGED / OUTLIER  │
       │    (Trust 80-100)   │                 │    (Trust < 80)     │
       └─────────┬───────────┘                 │  Excluded from CPI  │
                 │                             └─────────────────────┘
                 ▼
       ┌──────────────────────────────────────────────────────────┐
       │                  APIx INDEX ENGINE                       │
       │    Jevons Geometric Stratum Price Relative Aggregation   │
       │        APIx_t = 100 * exp( ∑ w_s * ln( P_s,t / P_s,0 ) ) │
       └─────────────────────────────┬────────────────────────────┘
                                     ▼
       ┌──────────────────────────────────────────────────────────┐
       │              ANALYTICS & EXPLANATION LAYER               │
       │  • Route Airfare DNA       • Lead-Time Pressure Index    │
       │  • Cross-Source Consensus  • Inflation Decomposition     │
       │  • Reproducibility Ledger  • REST API & Data Export      │
       └──────────────────────────────────────────────────────────┘
```

---

## Subsystems

### 1. Ingestion & Source Adapter Framework
- Located in `backend/app/adapters.py`.
- Features an abstract base class `SourceAdapter` defining standard lifecycles: `collect()`, `parse()`, `normalize()`, `validate()`.
- Implements 11 source adapters for Indian aviation.
- **Ethical Collection Safeguards**:
  - Rate limiting via token-bucket algorithm (2-3 req/sec).
  - Explicit compliance with `robots.txt` disallow parameters.
  - Zero CAPTCHA / WAF circumvention.
  - Graceful fallback to permitted partner API endpoints.

### 2. Trust Engine & Statistical Quality Gating
- Located in `backend/app/trust_engine.py`.
- Evaluates every fare quote against 5 dimensions:
  1. **Freshness:** Temporal validity within 4-hour cycle.
  2. **Completeness:** Statutory presence of base fare, airport fees (UDF/PSF), GST, and booking fees.
  3. **Consistency:** Absence of duplicate quote injection or sudden fare spikes.
  4. **Anomaly Resistance:** Median Absolute Deviation (MAD) & Modified Z-Score ($|Z| > 3.5$).
  5. **Cross-Source Agreement:** Multi-source clustering within $\pm 8\%$ of stratum median.

### 3. APIx Index Construction Engine
- Located in `backend/app/apix_engine.py`.
- Uses the standard international Jevons elementary index formula recommended by the ILO/IMF Consumer Price Index Manual:
  $$APIx_t = 100 \times \exp\left( \sum_{s} w_s \ln\left( \frac{P_{s,t}}{P_{s,0}} \right) \right)$$
- Stratum structure: 6 DGCA Trunk Corridors $\times$ 5 Advance Booking Horizons ($T+1, T+7, T+15, T+30, T+45$) = 30 individual strata.

### 4. Inflation Decomposition
- Log-linearized contribution decomposition answering **"Why did APIx move?"**:
  $$\Delta APIx \approx \sum w_s \left( \frac{P_{s,t}}{P_{s,0}} - 1 \right)$$
- Guarantees exact additivity across routes and booking horizons.
