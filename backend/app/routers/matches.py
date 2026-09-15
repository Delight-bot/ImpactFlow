from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_user, require_role
from ..database import get_db
from ..matching import greedy_match

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("", response_model=list[schemas.MatchOut])
def list_matches(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    query = db.query(models.Match)
    if user.role == models.Role.ADMIN:
        return query.all()
    if user.role == models.Role.VOLUNTEER:
        return query.filter(models.Match.volunteer_id == user.volunteer_id).all()
    if user.role == models.Role.BENEFICIARY:
        return query.filter(models.Match.beneficiary_id == user.beneficiary_id).all()
    return []


@router.post("/generate", response_model=schemas.GenerateMatchesResult)
def generate_matches(
    db: Session = Depends(get_db),
    _admin: models.User = Depends(require_role(models.Role.ADMIN)),
):
    """Run the greedy weighted matcher over everyone not already matched.

    See app/matching.py for why this is a weighted-assignment approach
    rather than Gale-Shapley-style stable matching.
    """
    already_matched_volunteers = {m.volunteer_id for m in db.query(models.Match).all()}
    already_matched_beneficiaries = {m.beneficiary_id for m in db.query(models.Match).all()}

    # Only people an admin has approved are eligible -- otherwise someone
    # could be matched (and see another person's info via that match)
    # before anyone reviewed their submission.
    volunteers = [
        v
        for v in db.query(models.Volunteer).all()
        if v.id not in already_matched_volunteers and v.status == "approved"
    ]
    beneficiaries = [
        b
        for b in db.query(models.Beneficiary).all()
        if b.id not in already_matched_beneficiaries and b.status == "approved"
    ]

    candidates = greedy_match(volunteers, beneficiaries)

    created: list[models.Match] = []
    for c in candidates:
        match = models.Match(
            volunteer_id=c.volunteer_id,
            beneficiary_id=c.beneficiary_id,
            program=", ".join(c.shared) or "General Support",
            date=date.today(),
            status="proposed",
            score=c.score,
        )
        db.add(match)
        created.append(match)

    db.commit()
    for match in created:
        db.refresh(match)

    matched_volunteer_ids = {c.volunteer_id for c in candidates}
    matched_beneficiary_ids = {c.beneficiary_id for c in candidates}

    return schemas.GenerateMatchesResult(
        created=created,
        unmatched_volunteers=[v.id for v in volunteers if v.id not in matched_volunteer_ids],
        unmatched_beneficiaries=[b.id for b in beneficiaries if b.id not in matched_beneficiary_ids],
    )


@router.patch("/{match_id}", response_model=schemas.MatchOut)
def update_match(
    match_id: int,
    payload: schemas.MatchUpdate,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(require_role(models.Role.ADMIN)),
):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
    match.status = payload.status
    db.commit()
    db.refresh(match)
    return match
