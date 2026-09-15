"""Demo data loader. Run with: python -m app.seed

Volunteer/beneficiary skill and need vocab overlaps deliberately, so
POST /matches/generate has real matches to find -- including a case where
the greedy assignment leaves someone unmatched even though a different
assignment order could have included them (Amara Okafor, see README).

Only "approved" people are eligible for matching, so Amara and the Nguyen
Household are seeded as "pending" -- there's something real to review on
the Volunteers/Beneficiaries pages, not just a pre-solved demo. Approving
Amara won't change the outcome (see README) since she has no compatible
partner among the approved set.

The Nguyen Household is also seeded with is_minor=True. Nia Washington is
a perfect skill+location match for them (Childcare Support, Chicago) but
starts with background_check_status="not_started", so even after
approving the household, /matches/generate still won't pair them -- the
safety gate in matching.py blocks it regardless of fit. Clearing Nia's
background check (PATCH /volunteers/{id}/background-check) is what
finally lets that match through.
"""

from .auth import hash_password
from .database import Base, SessionLocal, engine
from .models import Beneficiary, Role, User, Volunteer

VOLUNTEERS = [
    dict(name="Amara Okafor", email="amara.okafor@example.com", skills=["Tutoring", "Mentorship"], location="Austin, TX", status="pending"),
    dict(name="Daniel Reyes", email="daniel.reyes@example.com", skills=["Logistics", "Food Distribution"], location="Denver, CO", status="approved"),
    dict(name="Priya Nair", email="priya.nair@example.com", skills=["Healthcare Outreach", "Senior Care"], location="Chicago, IL", status="approved"),
    dict(name="Marcus Webb", email="marcus.webb@example.com", skills=["Mentorship", "Job Placement"], location="Atlanta, GA", status="approved"),
    dict(name="Sofia Marin", email="sofia.marin@example.com", skills=["Food Distribution", "Food Security"], location="Phoenix, AZ", status="approved"),
    dict(name="Grace Kim", email="grace.kim@example.com", skills=["Housing Assistance", "Logistics"], location="Austin, TX", status="approved"),
    dict(name="Nia Washington", email="nia.washington@example.com", skills=["Childcare Support"], location="Chicago, IL", status="approved"),
]

BENEFICIARIES = [
    dict(name="Wilson Family", needs=["Housing Assistance"], location="Austin, TX", status="approved"),
    dict(name="James Turner", needs=["Job Placement", "Mentorship"], location="Denver, CO", status="approved"),
    dict(name="Nguyen Household", needs=["Childcare Support"], location="Chicago, IL", status="pending", is_minor=True),
    dict(name="Elena Petrova", needs=["Senior Care", "Healthcare Outreach"], location="Atlanta, GA", status="approved"),
    dict(name="Ahmed Family", needs=["Food Security", "Food Distribution"], location="Phoenix, AZ", status="approved"),
    dict(name="Ortiz Family", needs=["Logistics"], location="Austin, TX", status="approved"),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == "admin@impactproject.org").first():
            print("Already seeded, skipping.")
            return

        for row in VOLUNTEERS:
            db.add(Volunteer(**row))
        for row in BENEFICIARIES:
            db.add(Beneficiary(**row))

        db.add(
            User(
                email="admin@impactproject.org",
                hashed_password=hash_password("admin123"),
                role=Role.ADMIN,
            )
        )
        db.commit()
        print(f"Seeded {len(VOLUNTEERS)} volunteers, {len(BENEFICIARIES)} beneficiaries, 1 admin user.")
        print("Login: admin@impactproject.org / admin123 (change this before deploying anywhere real)")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
