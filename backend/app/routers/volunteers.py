from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/volunteers", tags=["volunteers"])

ALLOWED_STATUSES = {"pending", "review", "approved", "rejected"}
ALLOWED_BACKGROUND_CHECK_STATUSES = {"not_started", "in_review", "cleared", "failed"}


@router.get("", response_model=list[schemas.VolunteerOut])
def list_volunteers(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if user.role == models.Role.ADMIN:
        return db.query(models.Volunteer).all()
    if user.role == models.Role.VOLUNTEER and user.volunteer_id is not None:
        record = db.query(models.Volunteer).filter(models.Volunteer.id == user.volunteer_id).first()
        return [record] if record else []
    # Beneficiaries don't get a broad volunteer directory -- they see matched
    # volunteers only, through /matches.
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted")


@router.post("", response_model=schemas.VolunteerOut, status_code=status.HTTP_201_CREATED)
def create_volunteer(
    payload: schemas.VolunteerCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    if user.role != models.Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    volunteer = models.Volunteer(**payload.model_dump())
    db.add(volunteer)
    db.commit()
    db.refresh(volunteer)
    return volunteer


@router.patch("/{volunteer_id}", response_model=schemas.VolunteerOut)
def update_volunteer_status(
    volunteer_id: int,
    payload: schemas.VolunteerUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    if user.role != models.Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"status must be one of {sorted(ALLOWED_STATUSES)}")

    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer not found")
    volunteer.status = payload.status
    db.commit()
    db.refresh(volunteer)
    return volunteer


@router.patch("/{volunteer_id}/background-check", response_model=schemas.VolunteerOut)
def update_background_check(
    volunteer_id: int,
    payload: schemas.BackgroundCheckUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Record the outcome of a background check run outside this app --
    this endpoint only stores the result an admin attests to; it never
    performs or scores the check itself.
    """
    if user.role != models.Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    if payload.status not in ALLOWED_BACKGROUND_CHECK_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"status must be one of {sorted(ALLOWED_BACKGROUND_CHECK_STATUSES)}",
        )

    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer not found")
    volunteer.background_check_status = payload.status
    db.commit()
    db.refresh(volunteer)
    return volunteer
