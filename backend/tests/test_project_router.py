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


def test_awards_are_shown_only_for_awarded_projects():
    items = client.get("/api/v1/projects").json()["items"]

    assert {p["slug"]: p["award"] for p in items if p["award"]} == {
        "metabole": "최우수상 · 과정 최종 프로젝트 1위",
        "life-tutorial": "해커톤 우수상",
    }
