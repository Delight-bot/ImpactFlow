from dataclasses import dataclass

from app.matching import compatibility_score, greedy_match, is_eligible


@dataclass
class VF:  # volunteer fixture
    id: int
    skills: list[str]
    location: str
    background_check_status: str = "cleared"  # not the safety dimension under test by default


@dataclass
class BF:  # beneficiary fixture
    id: int
    needs: list[str]
    location: str
    is_minor: bool = False  # not the safety dimension under test by default


def test_no_overlap_no_location_scores_zero():
    v = VF(1, ["Logistics"], "Denver, CO")
    b = BF(1, ["Childcare Support"], "Chicago, IL")
    score, shared = compatibility_score(v, b)
    assert score == 0
    assert shared == ()


def test_shared_skill_outweighs_location_match():
    v_skill_only = VF(1, ["Mentorship"], "Denver, CO")
    b = BF(1, ["Mentorship"], "Chicago, IL")
    skill_score, _ = compatibility_score(v_skill_only, b)

    v_location_only = VF(2, ["Logistics"], "Chicago, IL")
    location_score, _ = compatibility_score(v_location_only, b)

    assert skill_score > location_score


def test_matching_is_case_and_whitespace_insensitive():
    v = VF(1, [" mentorship "], "Austin, TX")
    b = BF(1, ["Mentorship"], "Austin, TX")
    score, shared = compatibility_score(v, b)
    assert shared == ("mentorship",)
    assert score == 3 + 1


def test_greedy_match_empty_inputs():
    assert greedy_match([], []) == []


def test_greedy_match_skips_zero_score_pairs():
    v = VF(1, ["Logistics"], "Denver, CO")
    b = BF(1, ["Childcare Support"], "Chicago, IL")
    assert greedy_match([v], [b]) == []


def test_greedy_match_each_participant_used_at_most_once():
    volunteers = [VF(1, ["Mentorship"], "Austin, TX"), VF(2, ["Mentorship"], "Austin, TX")]
    beneficiaries = [BF(1, ["Mentorship"], "Austin, TX")]

    result = greedy_match(volunteers, beneficiaries)

    assert len(result) == 1
    volunteer_ids = [c.volunteer_id for c in result]
    beneficiary_ids = [c.beneficiary_id for c in result]
    assert len(volunteer_ids) == len(set(volunteer_ids))
    assert len(beneficiary_ids) == len(set(beneficiary_ids))


def test_greedy_match_prefers_higher_score_pair_over_lower():
    # v1 matches b1 on two shared categories + location (score 7); v1 could
    # also weakly match b2 on nothing but location (score 1). Greedy must
    # take the strong pair and leave b2 unmatched rather than the reverse.
    v1 = VF(1, ["Food Distribution", "Food Security"], "Phoenix, AZ")
    b1 = BF(1, ["Food Security", "Food Distribution"], "Phoenix, AZ")
    b2 = BF(2, [], "Phoenix, AZ")

    result = greedy_match([v1], [b1, b2])

    assert len(result) == 1
    assert result[0].beneficiary_id == 1


def test_greedy_match_is_deterministic_on_ties():
    # Two beneficiaries tie for the same volunteer at score 4 (one shared
    # category + same location). The lower beneficiary id should win, and
    # the result should be identical across repeated runs.
    v = VF(1, ["Logistics"], "Austin, TX")
    b_low_id = BF(1, ["Logistics"], "Austin, TX")
    b_high_id = BF(2, ["Logistics"], "Austin, TX")

    first = greedy_match([v], [b_low_id, b_high_id])
    second = greedy_match([v], [b_low_id, b_high_id])

    assert first == second
    assert first[0].beneficiary_id == 1


def test_greedy_match_can_leave_a_participant_unmatched_even_with_capacity():
    # This mirrors the seed data: Amara only overlaps with James on
    # "Mentorship" (score 3), but Marcus overlaps with James on two
    # categories (score 6) and wins him. Greedy doesn't backtrack, so
    # Amara ends up unmatched even though total assignment quality isn't
    # being globally optimized -- the known limitation vs. e.g. the
    # Hungarian algorithm.
    amara = VF(1, ["Tutoring", "Mentorship"], "Austin, TX")
    marcus = VF(2, ["Mentorship", "Job Placement"], "Atlanta, GA")
    james = BF(1, ["Job Placement", "Mentorship"], "Denver, CO")

    result = greedy_match([amara, marcus], [james])

    assert len(result) == 1
    assert result[0].volunteer_id == marcus.id


# ---------------------------------------------------------------- minor safety gate


def test_uncleared_volunteer_is_ineligible_for_a_minor_beneficiary():
    v = VF(1, ["Childcare Support"], "Chicago, IL", background_check_status="not_started")
    b = BF(1, ["Childcare Support"], "Chicago, IL", is_minor=True)
    assert is_eligible(v, b) is False


def test_cleared_volunteer_is_eligible_for_a_minor_beneficiary():
    v = VF(1, ["Childcare Support"], "Chicago, IL", background_check_status="cleared")
    b = BF(1, ["Childcare Support"], "Chicago, IL", is_minor=True)
    assert is_eligible(v, b) is True


def test_background_check_status_is_irrelevant_for_a_non_minor_beneficiary():
    v = VF(1, ["Logistics"], "Austin, TX", background_check_status="not_started")
    b = BF(1, ["Logistics"], "Austin, TX", is_minor=False)
    assert is_eligible(v, b) is True


def test_perfect_skill_and_location_match_still_scores_zero_when_ineligible():
    # A great fit on paper -- but the safety gate overrides skill/location
    # scoring entirely, not just discounts it.
    v = VF(1, ["Childcare Support"], "Chicago, IL", background_check_status="not_started")
    b = BF(1, ["Childcare Support"], "Chicago, IL", is_minor=True)
    score, shared = compatibility_score(v, b)
    assert score == 0
    assert shared == ()


def test_greedy_match_withholds_a_minor_match_until_background_check_clears():
    volunteer = VF(1, ["Childcare Support"], "Chicago, IL", background_check_status="not_started")
    beneficiary = BF(1, ["Childcare Support"], "Chicago, IL", is_minor=True)

    assert greedy_match([volunteer], [beneficiary]) == []

    cleared_volunteer = VF(1, ["Childcare Support"], "Chicago, IL", background_check_status="cleared")
    result = greedy_match([cleared_volunteer], [beneficiary])

    assert len(result) == 1
    assert result[0].volunteer_id == 1
    assert result[0].beneficiary_id == 1
