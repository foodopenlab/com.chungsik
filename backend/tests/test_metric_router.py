from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_metric():
    res = client.get("/api/v1/metrics/myself")

    assert res.status_code == 200
    assert res.json()["id"] == "myself"


def test_every_metric_has_condition_and_source():
    items = client.get("/api/v1/metrics").json()["items"]

    assert items and all(m["condition"] and m["source"] for m in items)


def test_every_metric_is_marked_personal_or_team():
    items = client.get("/api/v1/metrics").json()["items"]

    assert items and {m["attribution"] for m in items} <= {"personal", "team"}


def test_hackathon_award_metric_is_marked_as_award():
    items = client.get("/api/v1/metrics").json()["items"]

    assert [m["id"] for m in items if m["side"] == "award"] == ["life-tutorial-award"]


def test_teach_metrics_include_forestry_lectures_and_ep50():
    items = {m["id"]: m for m in client.get("/api/v1/metrics").json()["items"]}

    assert (items["teach-satisfaction"]["value"], items["teach-youtube-reviews"]["value"]) == ("4.3–5.0", "9편")
