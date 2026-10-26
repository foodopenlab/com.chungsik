from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_profile():
    res = client.get("/api/v1/profiles/myself")

    assert res.status_code == 200
    assert res.json() == {"id": 0, "name": "myself", "headline": "myself", "subtitle": "myself"}


def test_list_returns_site_owner():
    items = client.get("/api/v1/profiles").json()["items"]

    assert [p["name"] for p in items] == ["김충식"]
