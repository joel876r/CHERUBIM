# ◈ CHERUBIM
### Trust-Aware Real-Time Airfare Intelligence & Price Index (APIx)
**Smart India Hackathon 2026 • Problem Statement ID: SIH26056**  
**Organization:** Ministry of Statistics and Programme Implementation (MoSPI)  
**Department:** Data Informatics & Innovation Division (DIID)  
**Category:** Software | **Theme:** Smart Automation  

---

> **Core Philosophy:**
> ```text
> COLLECT → TRUST → INDEX → EXPLAIN
> ```
> *"CHERUBIM does not merely collect airfare. It measures the reliability, comparability and contribution of every observation."*

---

## 1. Executive Summary
The Consumer Price Index (CPI) released by the National Statistical Office (NSO), MoSPI, is the primary measure of retail inflation in India and guides the Reserve Bank of India (RBI) in setting monetary policy. The current CPI framework, however, collects air travel prices primarily through manual sampling from airline offices. With over 90% of domestic air tickets sold dynamically online, manual collection fails to capture time-sensitive variations (200–400% intra-day swings, advance-booking discounts, fuel surcharges, and airport development fees).

**CHERUBIM** solves this challenge by delivering an end-to-end statistical intelligence platform that ingests airfare data from major Indian airlines (IndiGo, Air India, Air India Express, Akasa Air, SpiceJet) and leading Online Travel Aggregators (MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo, Goibibo), validates each quote through a **5-Pillar Trust Engine**, constructs the **Airfare Price Index (APIx)** using Jevons geometric stratum aggregation, and explains the inflation dynamics through **Inflation Decomposition**.

---

## 2. Key Differentiators

| Capability | What It Does | Why It Matters for MoSPI / RBI |
|---|---|---|
| **Fare Fingerprint** | Unbundles base fare, taxes (UDF/PSF/GST), and convenience fees with SHA-256 provenance hash | Guarantees auditability and comparability across disparate OTAs and direct airlines |
| **Trust Engine** | 5-pillar statistical score (0–100) assessing Freshness, Completeness, Consistency, MAD, and Consensus | Prevents web scraping noise, promotional gimmicks, or pricing glitches from polluting official CPI |
| **Cross-Source Consensus** | Clusters quotes across 11 ecosystem sources for each flight/window to determine Market Consensus | Eliminates single-source bias without simply taking the cheapest misleading fare |
| **Route Airfare DNA** | Computes 30-day movement, price volatility, lead-time elasticity, and carrier mix per corridor | Provides macroeconomic sector surveillance on major domestic passenger corridors |
| **Lead-Time Pressure Index** | Tracks fare curvature from T+45 down to T+1 (+57.6% surge) | Quantifies urgent consumer distress pricing vs advance planned travel |
| **Inflation Decomposition** | Log-linearized additive breakdown answering *"Why did APIx move by +X%?"* | Enables RBI monetary policy committee to isolate exact drivers (e.g. MAA-DEL route vs T+1 surge) |
| **Reproducibility Ledger** | 7-step deterministic audit trail from headline index to raw scraped packet | Enables independent academic and institutional verification |

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Custom SVG Flight Arc Radar Map.
- **Backend:** Python 3.11, FastAPI, Pandas, NumPy, Pydantic, Uvicorn.
- **Database:** SQLite (file-backed, reproducible, zero-setup, PostgreSQL/Supabase ready).
- **Package Managers:** Astral `uv` for lightning-fast Python virtual environments; Node.js v20.
- **Visual Design:** Dark obsidian aerospace theme inspired by modern digital public infrastructure and financial terminals.

---

## 4. Quick Start (Running Locally)

### Prerequisites
- Node.js (v18+) and Python (v3.10+) installed.
*(Note: If running on this machine, Node.js and Python 3.11 with `uv` are already configured in `C:\Users\acer\tools` and `.local\bin`).*

### 1. Start the Backend API (FastAPI)
```powershell
cd d:\CHERUBIM\backend
# If using uv:
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
# Or with standard python venv:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend initializes the SQLite database with 9,450 observations and synchronizes the 30-day APIx index.
Interactive API documentation will be available at: **http://127.0.0.1:8000/docs**.

### 2. Start the Frontend (Vite + React)
```powershell
cd d:\CHERUBIM\frontend
npm run dev -- --host 127.0.0.1 --port 3000
```
Open your browser at: **http://127.0.0.1:3000**.

---

## 5. Winning Judge Demonstration Flow (5-Minute Walkthrough)

1. **Overview Dashboard:**
   - Notice the simple top hero: **`APIx 102.4 ↑ +2.4%`** with `6 Routes | 5 Booking Windows | 9,308 Valid Quotes | 11 Sources`.
   - Interact with the **India Air Network Radar Map**: click between **DEL-BOM**, **MAA-DEL**, and **DEL-BLR** to watch the golden flight arcs and radar telemetry animate.
   - Point out the 30-Day APIx historical trajectory and the Lead-Time Elasticity curve (+57.6% pressure).

2. **Explore Fares & Fare Fingerprint:**
   - Click the prominent **Explore Fares** action button.
   - Filter by Corridor (`MAA-DEL`) or search for an observation.
   - Click an observation row (e.g. `OBS-000481`) to open the **Fare Fingerprint Modal**.
   - Show the judge the statutory unbundling: Base Fare (₹4,850) + Taxes (₹1,020) + Fees (₹130) = Comparable Fare (₹6,000).
   - Point out the **5-Pillar Trust Score (94/100 VALID)** and the cryptographic **SHA-256 Fingerprint Hash**.

3. **Trust Engine & Anomaly Gating:**
   - Click **Understand Trust** in the top navigation.
   - Show the quality distribution: 98.5% Valid, 1.5% Review, 0.1% Rejected.
   - Show the **Anomaly Detection Case Study**: demonstrate how an outlier quote of **₹35,900** on MAA-DEL was automatically flagged by the Median Absolute Deviation (MAD) gating and excluded from CPI inputs.

4. **Cross-Source Consensus:**
   - Navigate to **Cross-Source Consensus**.
   - Show how 11 sources (IndiGo, Air India, MakeMyTrip, Cleartrip, etc.) are cross-referenced to discover the **Market Consensus Fare (₹6,027)** with a 91% Source Agreement Rate.

5. **Route Airfare DNA:**
   - Select **Route Intelligence**.
   - Inspect the **Route Airfare DNA** for `MAA-DEL`: Average Fare (₹6,120), 30-Day Movement (+5.1%), Volatility (18.4%), and Carrier Contribution.

6. **Explain Inflation (Inflation Decomposition):**
   - Click **Explain Inflation**.
   - View the mathematical decomposition answering: *"Why did APIx shift by +2.4%?"*
   - See the exact corridor breakdown: MAA-DEL contributed +0.9%, DEL-BOM +0.8%, while T+1 near-departure pressure contributed +0.9%.
   - Click any corridor to drill directly into its DNA.

7. **Reproducibility Ledger:**
   - Open **Reproducibility Ledger**.
   - Walk through the 7-step provenance chain from headline index down to raw scraped packet.
   - Click **Export Audit CSV** or **Export Audit JSON** to demonstrate direct compatibility with the MoSPI *eSankhyiki* portal and RBI Macroeconomic Database.

---

## 6. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/apiX/current` | Headline APIx index, 30d change, valid quotes count |
| `GET` | `/api/apiX/history` | Historical time-series with `daily`, `weekly`, or `monthly` aggregation |
| `GET` | `/api/routes` | Monitored trunk corridors, weights, and average fares |
| `GET` | `/api/routes/{route}/dna` | Route Airfare DNA, volatility, lead-time curve, carrier mix |
| `GET` | `/api/lead-time/pressure` | Booking horizon price curve (T+45 down to T+1) |
| `GET` | `/api/observations` | Filterable quotes by route, airline, window, status, search |
| `GET` | `/api/observations/{id}` | Detailed Fare Fingerprint, statutory components, SHA-256 hash |
| `GET` | `/api/quality/summary` | 5-pillar trust score breakdown and quality distribution |
| `GET` | `/api/consensus/{route}/{window}` | Multi-source consensus matrix and market price |
| `GET` | `/api/contributions` | Inflation decomposition by route corridor and booking window |
| `GET` | `/api/pipeline/status` | Ingestion status, 11 source adapters health, ethical safeguards |
| `POST` | `/api/pipeline/run` | Simulates multi-source collection run |
| `POST` | `/api/index/recalculate` | Recalculates Jevons geometric price index across all dates |
| `GET` | `/api/export/{csv\|json}` | Exports full provenance audit ledger |
| `GET` | `/api/health` | System health and compliance metadata |

---

## 7. Ethical Scraping & Legal Safeguards
- **Zero Anti-Bot Circumvention:** No CAPTCHA bypass, no WAF evasion. If a portal restricts automated crawling, CHERUBIM falls back to permitted partner API connectors.
- **Strict Rate-Limiting:** Token-bucket governor enforces a ceiling of 2–3 requests per second per domain.
- **Robots.txt Adherence:** Automated validation against robots.txt policies.
- **Public Data Only:** Scrapes only publicly accessible one-way adult economy search results without logging into personal consumer accounts or carts.

---

## 8. Documentation Index
- [System Architecture](docs/architecture.md)
- [Index Methodology & Mathematical Formulation](docs/index-methodology.md)
- [Data Model & Schema Specification](docs/data-model.md)
