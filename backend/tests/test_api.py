from app.models import Role
from tests.conftest import login, make_user


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_unauthenticated_request_is_rejected(client):
    res = client.get("/volunteers")
    assert res.status_code == 401


def test_admin_can_create_and_list_volunteers(client, admin_token):
    res = client.post(
        "/volunteers",
        json={"name": "Amara Okafor", "email": "amara@example.com", "skills": ["Mentorship"], "location": "Austin, TX"},
        headers=auth_headers(admin_token),
    )
    assert res.status_code == 201, res.text

    res = client.get("/volunteers", headers=auth_headers(admin_token))
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_non_admin_cannot_create_volunteer(client):
    make_user(client, "v@test.org", "pw", Role.VOLUNTEER)
    token = login(client, "v@test.org", "pw")

    res = client.post(
        "/volunteers",
        json={"name": "X", "email": "x@example.com", "skills": [], "location": "Austin, TX"},
        headers=auth_headers(token),
    )
    assert res.status_code == 403


def test_volunteer_only_sees_their_own_record(client, admin_token):
    r1 = client.post(
        "/volunteers",
        json={"name": "Amara Okafor", "email": "amara@example.com", "skills": [], "location": "Austin, TX"},
        headers=auth_headers(admin_token),
    )
    r2 = client.post(
        "/volunteers",
        json={"name": "Daniel Reyes", "email": "daniel@example.com", "skills": [], "location": "Denver, CO"},
        headers=auth_headers(admin_token),
    )
    amara_id = r1.json()["id"]
    r2.json()["id"]

    make_user(client, "amara-login@test.org", "pw", Role.VOLUNTEER, volunteer_id=amara_id)
    token = login(client, "amara-login@test.org", "pw")

    res = client.get("/volunteers", headers=auth_headers(token))
    assert res.status_code == 200
    names = [v["name"] for v in res.json()]
    assert names == ["Amara Okafor"]


def test_beneficiary_cannot_browse_the_volunteer_directory(client):
    make_user(client, "b@test.org", "pw", Role.BENEFICIARY)
    token = login(client, "b@test.org", "pw")

    res = client.get("/volunteers", headers=auth_headers(token))
    assert res.status_code == 403


def test_pending_people_are_not_matched_until_approved(client, admin_token):
    headers = auth_headers(admin_token)
    v = client.post(
        "/volunteers",
        json={"name": "Marcus Webb", "email": "marcus@example.com", "skills": ["Mentorship"], "location": "Atlanta, GA"},
        headers=headers,
    ).json()
    b = client.post(
        "/beneficiaries",
        json={"name": "James Turner", "needs": ["Mentorship"], "location": "Denver, CO"},
        headers=headers,
    ).json()
    assert v["status"] == "pending"  # the default -- nobody's reviewed them yet

    # Nothing to match: neither side is approved.
    res = client.post("/matches/generate", headers=headers)
    assert res.json()["created"] == []

    client.patch(f"/volunteers/{v['id']}", json={"status": "approved"}, headers=headers)
    client.patch(f"/beneficiaries/{b['id']}", json={"status": "approved"}, headers=headers)

    res = client.post("/matches/generate", headers=headers)
    assert res.status_code == 200, res.text
    body = res.json()
    assert len(body["created"]) == 1
    assert body["created"][0]["program"] == "mentorship"
    assert body["unmatched_volunteers"] == []
    assert body["unmatched_beneficiaries"] == []

    # Running it again shouldn't re-match already-matched people.
    res2 = client.post("/matches/generate", headers=headers)
    assert res2.json()["created"] == []


def test_non_admin_cannot_generate_matches(client):
    make_user(client, "v2@test.org", "pw", Role.VOLUNTEER)
    token = login(client, "v2@test.org", "pw")

    res = client.post("/matches/generate", headers=auth_headers(token))
    assert res.status_code == 403


def test_admin_can_approve_a_volunteer(client, admin_token):
    headers = auth_headers(admin_token)
    v = client.post(
        "/volunteers",
        json={"name": "Amara Okafor", "email": "amara@example.com", "skills": [], "location": "Austin, TX"},
        headers=headers,
    ).json()

    res = client.patch(f"/volunteers/{v['id']}", json={"status": "approved"}, headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["status"] == "approved"


def test_admin_can_reject_a_beneficiary(client, admin_token):
    headers = auth_headers(admin_token)
    b = client.post(
        "/beneficiaries",
        json={"name": "Wilson Family", "needs": [], "location": "Austin, TX"},
        headers=headers,
    ).json()

    res = client.patch(f"/beneficiaries/{b['id']}", json={"status": "rejected"}, headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["status"] == "rejected"


def test_invalid_status_is_rejected(client, admin_token):
    headers = auth_headers(admin_token)
    v = client.post(
        "/volunteers",
        json={"name": "Amara Okafor", "email": "amara2@example.com", "skills": [], "location": "Austin, TX"},
        headers=headers,
    ).json()

    res = client.patch(f"/volunteers/{v['id']}", json={"status": "on-the-moon"}, headers=headers)
    assert res.status_code == 400


def test_non_admin_cannot_approve_a_volunteer(client, admin_token):
    v = client.post(
        "/volunteers",
        json={"name": "Amara Okafor", "email": "amara3@example.com", "skills": [], "location": "Austin, TX"},
        headers=auth_headers(admin_token),
    ).json()

    make_user(client, "v3@test.org", "pw", Role.VOLUNTEER)
    token = login(client, "v3@test.org", "pw")

    res = client.patch(f"/volunteers/{v['id']}", json={"status": "approved"}, headers=auth_headers(token))
    assert res.status_code == 403


def test_minor_beneficiary_is_not_matched_until_background_check_clears(client, admin_token):
    headers = auth_headers(admin_token)
    v = client.post(
        "/volunteers",
        json={"name": "Nia Washington", "email": "nia@example.com", "skills": ["Childcare Support"], "location": "Chicago, IL"},
        headers=headers,
    ).json()
    b = client.post(
        "/beneficiaries",
        json={"name": "Nguyen Household", "needs": ["Childcare Support"], "location": "Chicago, IL", "is_minor": True},
        headers=headers,
    ).json()
    assert v["background_check_status"] == "not_started"
    assert b["is_minor"] is True

    client.patch(f"/volunteers/{v['id']}", json={"status": "approved"}, headers=headers)
    client.patch(f"/beneficiaries/{b['id']}", json={"status": "approved"}, headers=headers)

    # A perfect skill+location fit, but the background check hasn't cleared.
    res = client.post("/matches/generate", headers=headers)
    assert res.json()["created"] == []

    clear = client.patch(f"/volunteers/{v['id']}/background-check", json={"status": "cleared"}, headers=headers)
    assert clear.status_code == 200, clear.text
    assert clear.json()["background_check_status"] == "cleared"

    res2 = client.post("/matches/generate", headers=headers)
    body = res2.json()
    assert len(body["created"]) == 1
    assert body["created"][0]["volunteer_id"] == v["id"]
    assert body["created"][0]["beneficiary_id"] == b["id"]


def test_non_admin_cannot_clear_a_background_check(client, admin_token):
    v = client.post(
        "/volunteers",
        json={"name": "Nia Washington", "email": "nia2@example.com", "skills": [], "location": "Chicago, IL"},
        headers=auth_headers(admin_token),
    ).json()

    make_user(client, "v4@test.org", "pw", Role.VOLUNTEER)
    token = login(client, "v4@test.org", "pw")

    res = client.patch(f"/volunteers/{v['id']}/background-check", json={"status": "cleared"}, headers=auth_headers(token))
    assert res.status_code == 403


def test_invalid_background_check_status_is_rejected(client, admin_token):
    headers = auth_headers(admin_token)
    v = client.post(
        "/volunteers",
        json={"name": "Nia Washington", "email": "nia3@example.com", "skills": [], "location": "Chicago, IL"},
        headers=headers,
    ).json()

    res = client.patch(f"/volunteers/{v['id']}/background-check", json={"status": "trust-me"}, headers=headers)
    assert res.status_code == 400
