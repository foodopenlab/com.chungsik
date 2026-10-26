from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_term():
    res = client.get("/api/v1/terms/myself")

    assert res.status_code == 200
    assert res.json() == {"id": 0, "field": "myself", "dev": "myself", "note": None, "sortOrder": 0}


def test_list_has_twenty_pairs_starting_with_line_stops():
    items = client.get("/api/v1/terms").json()["items"]

    assert (len(items), items[0]["field"]) == (20, "라인이 자주 서요")
