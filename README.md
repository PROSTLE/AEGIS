# AEGIS — Startup Terrain Intelligence for India 🛰️

> Built at **Makeathon**. A decision-support platform that scores how ready an Indian city is for a given startup idea — blending curated ecosystem data, ML survival models, and an LLM advisor into a single **Launch Readiness Score**.

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat&logo=googlegemini&logoColor=white)

---

## What it does

A founder enters a startup idea and picks an Indian city. AEGIS computes a set of independent intelligence signals — ecosystem health, survival odds, logistics, workforce, demand, crowding, investor availability — and fuses them into one **Launch Readiness Score**, then has an LLM narrate *why* in plain language.

## Architecture

Decoupled client/server: a React SPA talks to a FastAPI intelligence engine over REST.

```
┌─────────────────────────────┐         ┌──────────────────────────────────────┐
│  Frontend (React 19 + Vite) │         │  Backend (FastAPI, ~3.4k LOC)         │
│  • D3.js city heatmap       │  REST   │  /api/heatmap   /api/survival         │
│  • Recharts dashboards      │ ──────► │  /api/logistics /api/workforce        │
│  • Zustand state            │  JSON   │  /api/location  /api/activity         │
│  • React Router (17 pages)  │ ◄────── │  /api/demand    /api/matchmaking      │
│                             │         │  /api/advisor   + idea-analysis       │
└─────────────────────────────┘         │  • GradientBoosting survival model    │
                                        │  • Gemini LLM advisor (fallback chain)│
                                        │  • Curated Indian-city datasets       │
                                        └──────────────────────────────────────┘
        Hardware demo: Arduino sketches (rover.ino, module.ino) stream
        simulated IoT sensor metrics (footfall, proximity, vibration).
```

## Engineering highlights

### Intelligence modules (FastAPI routers)
Each signal is its own router under `backend/app/routes/`, so modules are independently testable and composable:

| Module | What it computes |
|---|---|
| `heatmap` | City ecosystem-health scores (0–100) for the D3 map |
| `survival` | 3-year startup survival probability + factor breakdown |
| `logistics` | Supplier proximity, delivery density, port/highway access |
| `workforce` | Talent density and salary indices by startup type |
| `location` | Zone-level land/cost/zoning recommendations |
| `activity` | Verified startup counts and a crowding index |
| `demand` | Demand trajectory and lifespan signals |
| `matchmaking` | Founder↔investor ranking via cosine similarity |
| `advisor` / `ai_narrator` / `idea_analysis` | LLM synthesis into the readiness narrative |

### ML survival model
`survival.py` trains a scikit-learn **`GradientBoostingClassifier`** on a **domain-informed synthetic distribution**: features (team size, funding, city ecosystem score, crowding) are sampled and combined through a non-linear survival signal, then passed through a sigmoid to produce labels. This yields an explainable, reproducible model that demonstrates the full train→infer→explain loop without depending on hard-to-source real startup-outcome data. Per-factor scores (Ecosystem, Talent, Funding, Infra, Market) drive a radar breakdown in the UI.

### LLM advisor with graceful degradation
`ai_narrator.py` and `idea_analysis.py` call Google **Gemini** with a resilience chain:

```
gemini-2.0-flash-lite  →  gemini-2.5-flash  →  rule-based fallback
   (fast / cheap)          (if rate-limited)     (if no API key)
```

So the product still returns sensible output when the API key is missing or quota is hit — a deliberate reliability choice for a demo that has to *always* work on stage.

### Launch Readiness Score
A transparent weighted blend of the module outputs:

| Component | Weight |
|---|---|
| Ecosystem | 20% |
| Survival predictor | 20% |
| Logistics | 15% |
| Workforce | 15% |
| Demand forecast | 15% |
| Activity / crowding | 10% |
| Investor availability | 5% |

## Tech Stack

**Frontend** — React 19, React Router, D3.js (heatmap), Recharts, Zustand, Vite
**Backend** — Python 3.11, FastAPI, Pydantic, scikit-learn, pandas/NumPy, `google-generativeai` (Gemini)
**Hardware demo** — Arduino (`hardware/rover.ino`, `hardware/module.ino`) simulating IoT sensor streams
**Tooling** — Docker / docker-compose, Vercel-ready frontend

> The city intelligence is computed from **curated Indian-city datasets** (`backend/app/data_store.py`, `indian_cities_data.py`, `extended_data.py`) plus deterministic scoring. ML and LLM layers sit on top. It's a hackathon prototype — the data pipeline scaffolding (`data_pipeline/scrapers`, `processors`) is stubbed for future live ingestion.

## Getting Started

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # add GEMINI_API_KEY (optional — falls back to rule-based)
python main.py                  # http://localhost:8000  (docs at /docs)
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

## Project layout

```
AEGIS/
├── frontend/        # React 19 + Vite SPA (17 pages, D3/Recharts, Zustand)
│   └── src/{pages,components,hooks,context,utils,styles}
├── backend/         # FastAPI engine (~3.4k LOC)
│   ├── main.py      # app entry, CORS, router registration
│   ├── app/
│   │   ├── routes/  # one router per intelligence module
│   │   ├── data_store.py / indian_cities_data.py / extended_data.py
│   │   └── models/ schemas/ services/
│   └── config/settings.py
├── hardware/        # Arduino sketches for the IoT sensor demo
└── docker-compose.yml
```

## Disclaimer

AEGIS is a hackathon prototype for decision-support and demonstration. Scores are model- and heuristic-driven and should not be the sole basis for real investment or location decisions.
