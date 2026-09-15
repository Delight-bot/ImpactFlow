# Impact Project — Admin Dashboard

Full-stack admin dashboard for managing volunteers, beneficiaries, and matches. React/Vite/Tailwind
frontend, FastAPI/SQLAlchemy backend, JWT auth with role-based access control, and a weighted
bipartite matching algorithm that proposes volunteer-beneficiary pairs instead of requiring manual
assignment. See [`backend/README.md`](backend/README.md) for the API, the RBAC model, and why the
matcher uses weighted assignment instead of Gale-Shapley-style stable matching.

## Getting Started

Backend (see [`backend/README.md`](backend/README.md) for details):

```bash
cd backend
python -m venv .venv
./.venv/Scripts/pip install -r requirements.txt
./.venv/Scripts/python -m app.seed
./.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173) with hot reload, and talks to the
API at `http://127.0.0.1:8000` (override with a `VITE_API_URL` env var). Sign in with the seeded
demo admin: `admin@impactproject.org` / `admin123`.

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production into `dist/`
- `npm run preview` — preview the production build locally
- `npm test` — run the test suite (Vitest + Testing Library)
- `npm run lint` — lint the source with ESLint

## Project Structure

```
backend/
  app/
    matching.py       # weighted bipartite assignment algorithm (pure, no DB)
    models.py          # SQLAlchemy models
    auth.py             # JWT + password hashing + role-based access dependencies
    routers/            # auth, volunteers, beneficiaries, matches
    seed.py              # demo data loader
  tests/                  # pytest: matching unit tests + RBAC integration tests
src/
  api.js               # fetch wrapper for the backend API
  auth/
    AuthContext.jsx    # login/logout state, current user
  components/
    icons.jsx           # inline SVG icon set
    layout/               # Sidebar, Topbar, Layout shell
    ui/                    # Button, Badge, Avatar, Card, Table, StatCard, Modal
  pages/
    Login.jsx
    Overview.jsx
    Volunteers.jsx
    Beneficiaries.jsx
    Matches.jsx           # includes the "Generate Matches" trigger
  App.jsx
  main.jsx
```

`src/data/mockData.js` is no longer used by the app (kept only for reference) — every page fetches
from the FastAPI backend through `src/api.js`.
