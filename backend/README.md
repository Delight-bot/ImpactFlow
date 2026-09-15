# Impact Project — Backend

FastAPI + SQLAlchemy API for the volunteer/beneficiary matching dashboard.

## Getting started

```bash
python -m venv .venv
./.venv/Scripts/pip install -r requirements.txt   # Windows; use .venv/bin/pip on macOS/Linux
./.venv/Scripts/python -m app.seed                # loads demo volunteers/beneficiaries + an admin login
./.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

Seeded login: `admin@impactproject.org` / `admin123` (change before deploying anywhere real).

Uses a local `dev.db` SQLite file by default — zero setup required. Point `DATABASE_URL` at
Postgres (e.g. `postgresql+psycopg://user:pass@host/db`) for anything beyond local dev; the
SQLAlchemy models don't change.

## Running tests

```bash
./.venv/Scripts/python -m pytest -v
```

`tests/test_matching.py` unit-tests the matching algorithm directly with plain fixtures — no
database or running server needed. `tests/test_api.py` spins up an isolated in-memory SQLite
database per test and drives the real FastAPI app through `TestClient` to check the RBAC rules.

## Why weighted assignment instead of Gale-Shapley

Stable matching (Gale-Shapley) solves the case where **both sides rank every option** — hospitals
ranking applicants, applicants ranking hospitals. That's not this problem: beneficiaries don't
submit ranked preferences over volunteers. What actually exists is a weighted bipartite
**assignment** problem — score every volunteer/beneficiary pair by compatibility (shared
skills/needs, same location) and assign pairs by descending score.

`app/matching.py` implements this as a **greedy** assignment: sort all positive-score candidate
pairs, then walk down the list taking any pair where neither side is already used. It's
`O(n·m log(n·m))`, deterministic, and easy to reason about — but it is *not* guaranteed to
maximize total score across all matches the way the Hungarian algorithm would. The seed data
includes a deliberate example of this: Amara Okafor only overlaps with James Turner on
"Mentorship" (score 3), but Marcus Webb overlaps with James on two categories (score 6) and wins
him first, leaving Amara unmatched even though a different assignment order could have included
her. `tests/test_matching.py::test_greedy_match_can_leave_a_participant_unmatched_even_with_capacity`
pins this down as a known, documented limitation rather than a bug.

## Minor safety gate

A beneficiary can be flagged `is_minor`. `app/matching.py::is_eligible()` enforces a hard rule on
top of the scoring: a volunteer can only be matched with a minor beneficiary once an admin has
recorded their `background_check_status` as `cleared`. This isn't a scoring preference that a
strong skill match can outweigh — an ineligible pair scores exactly 0 and is never a candidate,
however good the fit looks otherwise (`compatibility_score()` checks eligibility before it checks
anything else).

Two things this app deliberately does **not** do, on purpose:

- **It never determines the result of a background check itself.** `PATCH
  /volunteers/{id}/background-check` only records what an admin attests happened via a real
  third-party check (Checkr, Sterling, etc.) — there's no verification logic here, because faking
  one would be worse than having none.
- **It never exposes either side's direct contact info to the other.** Nothing in this API returns
  a beneficiary's address/phone to a volunteer or vice versa; all of that stays behind the
  coordinator (admin) role.

Seed data walks through the whole gate live: the Nguyen Household is `is_minor=True`, and Nia
Washington is a perfect skill+location match for them but starts with
`background_check_status="not_started"`. Running `/matches/generate` leaves them unmatched until
you `PATCH` Nia's background check to `cleared` — see `app/seed.py` for the full walkthrough and
`tests/test_matching.py`'s "minor safety gate" tests for the unit-level version.

## RBAC model

Three roles: `admin`, `volunteer`, `beneficiary`. A `User` row optionally links to one
`Volunteer` or `Beneficiary` record via `volunteer_id`/`beneficiary_id`.

- **admin** — full read/write access to everything, including running the matcher.
- **volunteer** — can only see their own volunteer record (`GET /volunteers` returns just that
  one row) and matches where they're the volunteer. No broad directory access to other
  volunteers or any beneficiary PII.
- **beneficiary** — mirrors volunteer: own record only, plus their own matches.

This is enforced in the router layer (`app/routers/*.py`), not just in the frontend — hitting the
API directly with a non-admin token still gets a 403 on anything out of scope.

## API summary

| Endpoint | Method | Access |
|---|---|---|
| `/auth/login` | POST | public (form: `username`, `password`) |
| `/auth/users` | POST | admin — provisions a login for a volunteer/beneficiary/admin |
| `/auth/me` | GET | any authenticated user |
| `/volunteers` | GET | admin (all) / volunteer (self only) |
| `/volunteers` | POST | admin |
| `/volunteers/{id}` | PATCH | admin — approve/reject |
| `/volunteers/{id}/background-check` | PATCH | admin — record a cleared/failed/in-review check |
| `/beneficiaries` | GET | admin (all) / beneficiary (self only) |
| `/beneficiaries` | POST | admin |
| `/matches` | GET | role-scoped |
| `/matches/generate` | POST | admin — runs the matcher over everyone not already matched |
| `/matches/{id}` | PATCH | admin — update a match's status |
