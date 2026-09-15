from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/beneficiaries", tags=["beneficiaries"])

ALLOWED_STATUSES = {"pending", "review", "approved", "rejected"}


@router.get("", response_model=list[schemas.BeneficiaryOut])
def list_beneficiaries(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if user.role == models.Role.ADMIN:
        return db.query(models.Beneficiary).all()
    if user.role == models.Role.BENEFICIARY and user.beneficiary_id is not None:
        record = db.query(models.Beneficiary).filter(models.Beneficiary.id == user.beneficiary_id).first()
        return [record] if record else []
    # Volunteers don't get a broad beneficiary directory (PII protection) --
    # they see matched beneficiaries only, through /matches.
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not permitted")


@router.post("", response_model=schemas.BeneficiaryOut, status_code=status.HTTP_201_CREATED)
def create_beneficiary(
    payload: schemas.BeneficiaryCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    if user.role != models.Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    beneficiary = models.Beneficiary(**payload.model_dump())
    db.add(beneficiary)
    db.commit()
    db.refresh(beneficiary)
    return beneficiary


@router.patch("/{beneficiary_id}", response_model=schemas.BeneficiaryOut)
def update_beneficiary_status(
    beneficiary_id: int,
    payload: schemas.BeneficiaryUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    if user.role != models.Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"status must be one of {sorted(ALLOWED_STATUSES)}")

    beneficiary = db.query(models.Beneficiary).filter(models.Beneficiary.id == beneficiary_id).first()
    if not beneficiary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficiary not found")
    beneficiary.status = payload.status
    db.commit()
    db.refresh(beneficiary)
    return beneficiary
