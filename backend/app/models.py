import enum
from datetime import date, datetime, timezone

from sqlalchemy import JSON, Date, DateTime, Enum, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Role(str, enum.Enum):
    ADMIN = "admin"
    VOLUNTEER = "volunteer"
    BENEFICIARY = "beneficiary"


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200), unique=True)
    skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    location: Mapped[str] = mapped_column(String(200))
    applied: Mapped[date] = mapped_column(Date, default=date.today)
    status: Mapped[str] = mapped_column(String(50), default="pending")

    # Cleared by an admin only after a real third-party background check --
    # this app never determines the result itself, only gates on it. See
    # matching.py for why a minor beneficiary can't be matched otherwise.
    background_check_status: Mapped[str] = mapped_column(String(20), default="not_started")

    matches: Mapped[list["Match"]] = relationship(back_populates="volunteer")


class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    needs: Mapped[list[str]] = mapped_column(JSON, default=list)
    location: Mapped[str] = mapped_column(String(200))
    submitted: Mapped[date] = mapped_column(Date, default=date.today)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    is_minor: Mapped[bool] = mapped_column(default=False)

    matches: Mapped[list["Match"]] = relationship(back_populates="beneficiary")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(primary_key=True)
    volunteer_id: Mapped[int] = mapped_column(ForeignKey("volunteers.id"))
    beneficiary_id: Mapped[int] = mapped_column(ForeignKey("beneficiaries.id"))
    program: Mapped[str] = mapped_column(String(200))
    date: Mapped[date] = mapped_column(Date, default=date.today)
    status: Mapped[str] = mapped_column(String(50), default="proposed")
    score: Mapped[float] = mapped_column(Float, default=0.0)

    volunteer: Mapped["Volunteer"] = relationship(back_populates="matches")
    beneficiary: Mapped["Beneficiary"] = relationship(back_populates="matches")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(200), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(200))
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.VOLUNTEER)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Links a login to the profile it's allowed to see -- null for admins,
    # who aren't scoped to a single volunteer/beneficiary record.
    volunteer_id: Mapped[int | None] = mapped_column(ForeignKey("volunteers.id"), nullable=True)
    beneficiary_id: Mapped[int | None] = mapped_column(ForeignKey("beneficiaries.id"), nullable=True)
