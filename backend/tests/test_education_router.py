from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_education():
    res = client.get("/api/v1/educations/myself")

    assert res.status_code == 200
    assert res.json()["title"] == "myself"


def test_list_returns_ax_academy_with_period():
    items = client.get("/api/v1/educations").json()["items"]

    assert [(e["title"], e["startedOn"], e["endedOn"]) for e in items] == [
        ("IBM × RedHat AI Transformation Academy", "2026-04-29", "2026-10-27"),
    ]
