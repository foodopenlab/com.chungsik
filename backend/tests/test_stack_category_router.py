from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_category():
    res = client.get("/api/v1/stack-categories/myself")

    assert res.status_code == 200
    assert res.json() == {"id": "myself", "label": "myself", "sortOrder": 0}


def test_list_returns_six_categories_in_slide_order():
    res = client.get("/api/v1/stack-categories")

    assert [c["id"] for c in res.json()["items"]] == [
        "frontend", "backend", "data-ai", "infra", "quality", "ai-tools",
    ]
