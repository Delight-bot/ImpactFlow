import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.auth import hash_password
from app.database import Base, get_db
from app.main import app
from app.models import Role, User


@pytest.fixture()
def client():
    # A fresh in-memory DB per test -- isolated from dev.db and from other tests.
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        test_client.session = TestingSession
        yield test_client
    app.dependency_overrides.clear()


def make_user(client, email, password, role, volunteer_id=None, beneficiary_id=None):
    db = client.session()
    try:
        user = User(
            email=email,
            hashed_password=hash_password(password),
            role=role,
            volunteer_id=volunteer_id,
            beneficiary_id=beneficiary_id,
        )
        db.add(user)
        db.commit()
    finally:
        db.close()


def login(client, email, password):
    res = client.post("/auth/login", data={"username": email, "password": password})
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


@pytest.fixture()
def admin_token(client):
    make_user(client, "admin@test.org", "adminpass", Role.ADMIN)
    return login(client, "admin@test.org", "adminpass")
