# APIx Index Methodology & Mathematical Formulation

> **Important Institutional Disclaimer**:  
> *Prototype Index Methodology — subject to statistical calibration and validation with official MoSPI and DGCA micro-data for production release.*

---

## 1. Background & CPI Integration Context
Under the current Consumer Price Index (CPI) framework released by the National Statistical Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI), air travel prices under the 'Transport and Communication' sub-group are collected primarily through manual sampling from airline offices and offline ticketing counters.

With dynamic airline pricing, prices fluctuate by 200–400% depending on:
1. Advance purchase booking window ($T+1$ vs $T+45$ days)
2. Day-of-week and departure time
3. Fuel surcharges (ATF linked)
4. Seat load factor and seasonal spikes

CHERUBIM automates this with high-frequency statistical sampling.

---

## 2. Mathematical Index Formulation

### The Stratum Jevons Aggregate
To satisfy the transitivity and time-reversal tests while mitigating elementary substitution bias, CHERUBIM implements the weighted geometric mean (Jevons elementary aggregator):

$$APIx_t = 100 \times \exp\left( \sum_{s \in S} w_s \ln\left( \frac{P_{s,t}}{P_{s,0}} \right) \right)$$

Where:
- $S$: Set of all strata, defined as the Cartesian product of monitored route corridors $R$ and booking horizons $W$:
  $$S = R \times W \quad (|S| = 6 \times 5 = 30 \text{ strata})$$
- $P_{s,t}$: Representative comparable fare for stratum $s = (r, w)$ at time $t$. Calculated as the **trimmed median** of all VALID observations:
  $$P_{s,t} = \text{median}\left(\{ f_i \in \text{Obs}_{s,t} \mid \text{TrustScore}(f_i) \ge 80 \}\right)$$
- $P_{s,0}$: Base-period representative fare established on **August 31, 2026** ($APIx_0 = 100.0$).
- $w_s$: Normalized stratum weight:
  $$w_s = \frac{w_r \times w_w}{\sum_{s' \in S} (w_{r'} \times w_{w'})}, \quad \sum_{s \in S} w_s = 1.0$$

---

## 3. Stratum Basket Weight Calibration

### Route Weights ($w_r$) — DGCA Trunk Corridors
Weights are calibrated against Directorate General of Civil Aviation (DGCA) monthly city-pair passenger traffic shares:

| Corridor | Origin | Destination | Distance (km) | Traffic Share | Weight ($w_r$) |
|---|---|---|---|---|---|
| **DEL-BOM** | Delhi | Mumbai | 1,148 | 24.0% | 0.24 |
| **DEL-BLR** | Delhi | Bengaluru | 1,740 | 19.0% | 0.19 |
| **MAA-DEL** | Chennai | Delhi | 1,760 | 18.0% | 0.18 |
| **BOM-BLR** | Mumbai | Bengaluru | 840 | 15.0% | 0.15 |
| **DEL-CCU** | Delhi | Kolkata | 1,305 | 13.0% | 0.13 |
| **BLR-HYD** | Bengaluru | Hyderabad | 500 | 11.0% | 0.11 |
| **Total** | | | | **100.0%** | **1.00** |

### Advance Booking Window Weights ($w_w$)
Informed by consumer advance-purchase empirical distributions:
- **T+1 (1 Day Prior):** $15\%$ weight (Urgent business / distress travel)
- **T+7 (7 Days Prior):** $25\%$ weight (Short-lead discretionary travel)
- **T+15 (15 Days Prior):** $30\%$ weight (Standard leisure booking anchor)
- **T+30 (30 Days Prior):** $20\%$ weight (Planned vacation / advance travel)
- **T+45 (45 Days Prior):** $10\%$ weight (Early bird / low-fare baseline anchor)

---

## 4. Lead-Time Pressure Index Formulation
The Lead-Time Pressure metric quantifies the near-departure premium Indian consumers face:

$$\text{Lead-Time Pressure} = \left( \frac{P_{T+1} - P_{T+45}}{P_{T+45}} \right) \times 100\%$$

In our calibrated baseline, $P_{T+45} = ₹5,334$ and $P_{T+1} = ₹8,404$, yielding:
$$\text{Lead-Time Pressure} = \frac{8,404 - 5,334}{5,334} \times 100\% = +57.6\%$$

---

## 5. Anomaly Gating: Median Absolute Deviation (MAD)
To prevent rogue aggregator pricing glitches (e.g. ₹35,900 on MAA-DEL) from distorting official CPI inputs, quotes are evaluated against the stratum MAD:

$$\text{MAD}_s = \text{median}(|f_i - \tilde{f}_s|)$$
$$\text{Modified } Z_i = \frac{0.6745 \times (f_i - \tilde{f}_s)}{\text{MAD}_s}$$

Quotes with $|Z_i| > 3.5$ receive `Trust Score < 50` and are categorized as `REJECTED`, strictly excluding them from the Jevons elementary index calculation.
