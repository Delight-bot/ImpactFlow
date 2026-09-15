"""FastAPI app for the Impact Project admin dashboard.

Route handlers stay thin; role scoping lives in the routers and the
matching algorithm lives in matching.py as pure, DB-free functions.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, beneficiaries, matches, volunteers

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Impact Project API", description="Volunteer/beneficiary matching backend.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://delight-bot.github.io",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(volunteers.router)
app.include_router(beneficiaries.router)
app.include_router(matches.router)


@app.get("/api/health")
def health():
    return {"ok": True}
