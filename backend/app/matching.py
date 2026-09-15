"""Volunteer-to-beneficiary matching.

Two-sided preference matching (Gale-Shapley) doesn't fit this problem --
beneficiaries never submit ranked preferences over volunteers. What we
actually have is a weighted bipartite assignment problem: score every
volunteer-beneficiary pair by compatibility, then assign pairs by
descending score. Greedy assignment isn't guaranteed to maximize total
score across all matches (the Hungarian algorithm would be); it's a
fast, deterministic, easy-to-explain baseline that's the right size for
a small volunteer pool.

Pure functions, no DB/ORM dependency, so they're unit-testable with plain
fixtures instead of a database.

Eligibility is enforced before scoring: a minor beneficiary can only be
paired with a volunteer whose background check is on file as cleared (see
is_eligible()). That's a hard gate, not something skill overlap can
outscore.
"""

from dataclasses import dataclass
from typing import Iterable, Protocol


class HasSkills(Protocol):
    id: int
    skills: list[str]
    location: str
    background_check_status: str


class HasNeeds(Protocol):
    id: int
    needs: list[str]
    location: str
    is_minor: bool


CLEARED = "cleared"


@dataclass(frozen=True)
class MatchCandidate:
    volunteer_id: int
    beneficiary_id: int
    score: float
    shared: tuple[str, ...]


def _normalize(values: Iterable[str]) -> set[str]:
    return {v.strip().lower() for v in values if v and v.strip()}


def is_eligible(volunteer: HasSkills, beneficiary: HasNeeds) -> bool:
    """Hard safety gate, not a scoring preference.

    A volunteer can only be matched with a minor beneficiary once an admin
    has recorded a cleared background check. This app never performs or
    judges that check itself -- see models.py -- it only refuses to ever
    propose the match without one on file.
    """
    if beneficiary.is_minor:
        return volunteer.background_check_status == CLEARED
    return True


def compatibility_score(volunteer: HasSkills, beneficiary: HasNeeds) -> tuple[float, tuple[str, ...]]:
    """Higher is better. Skill/need overlap dominates; same location is a tiebreaker bonus.

    Returns (0, ()) outright when is_eligible() fails -- an ineligible pair
    is never a candidate, no matter how well skills/location line up.
    """
    if not is_eligible(volunteer, beneficiary):
        return 0.0, ()

    skills = _normalize(volunteer.skills)
    needs = _normalize(beneficiary.needs)
    shared = tuple(sorted(skills & needs))

    score = 3.0 * len(shared)
    if volunteer.location.strip().lower() == beneficiary.location.strip().lower():
        score += 1.0
    return score, shared


def greedy_match(volunteers: Iterable[HasSkills], beneficiaries: Iterable[HasNeeds]) -> list[MatchCandidate]:
    """Weighted bipartite assignment via greedy descending-score selection.

    O(n*m log(n*m)), deterministic (ties broken by id), and skips any pair
    that shares nothing and isn't even co-located -- a zero-score match
    isn't a match worth proposing.
    """
    volunteers = list(volunteers)
    beneficiaries = list(beneficiaries)

    candidates: list[MatchCandidate] = []
    for v in volunteers:
        for b in beneficiaries:
            score, shared = compatibility_score(v, b)
            if score <= 0:
                continue
            candidates.append(MatchCandidate(volunteer_id=v.id, beneficiary_id=b.id, score=score, shared=shared))

    candidates.sort(key=lambda c: (-c.score, c.volunteer_id, c.beneficiary_id))

    matched_volunteers: set[int] = set()
    matched_beneficiaries: set[int] = set()
    result: list[MatchCandidate] = []

    for c in candidates:
        if c.volunteer_id in matched_volunteers or c.beneficiary_id in matched_beneficiaries:
            continue
        result.append(c)
        matched_volunteers.add(c.volunteer_id)
        matched_beneficiaries.add(c.beneficiary_id)

    return result
