from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_project():
    res = client.get("/api/v1/projects/myself")

    assert res.status_code == 200
    assert res.json()["slug"] == "myself"


def test_list_returns_five_projects_in_order():
    items = client.get("/api/v1/projects").json()["items"]

    assert [p["slug"] for p in items] == ["metabole", "life-tutorial", "localhost-daegu", "townpulse", "remakeday"]
