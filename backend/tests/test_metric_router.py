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
