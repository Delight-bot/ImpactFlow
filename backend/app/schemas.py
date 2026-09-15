from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr

from .models import Role

# ---------------------------------------------------------------- volunteers


class VolunteerCreate(BaseModel):
    name: str
    email: EmailStr
    skills: list[str] = []
    location: str
    status: str = "pending"


class VolunteerUpdate(BaseModel):
    status: str


class BackgroundCheckUpdate(BaseModel):
    status: str


class VolunteerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    skills: list[str]
    location: str
    applied: date
    status: str
    background_check_status: str


# ---------------------------------------------------------------- beneficiaries


class BeneficiaryCreate(BaseModel):
    name: str
    needs: list[str] = []
    location: str
    status: str = "pending"
    is_minor: bool = False


class BeneficiaryUpdate(BaseModel):
    status: str


class BeneficiaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    needs: list[str]
    location: str
    submitted: date
    status: str
    is_minor: bool


# ---------------------------------------------------------------- matches


class MatchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    volunteer_id: int
    beneficiary_id: int
    program: str
    date: date
    status: str
    score: float


class MatchUpdate(BaseModel):
    status: str


class GenerateMatchesResult(BaseModel):
    created: list[MatchOut]
    unmatched_volunteers: list[int]
    unmatched_beneficiaries: list[int]


# ---------------------------------------------------------------- auth


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Role = Role.VOLUNTEER
    volunteer_id: int | None = None
    beneficiary_id: int | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: Role
    volunteer_id: int | None
    beneficiary_id: int | None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
