from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_stack():
    res = client.get("/api/v1/stacks/myself")

    assert res.status_code == 200
    assert res.json() == {
        "id": "myself", "categoryId": "myself", "label": "myself",
        "icon": None, "monogram": "ME", "sortOrder": 0,
    }


def test_list_orders_by_category_then_stack():
    items = client.get("/api/v1/stacks").json()["items"]

    assert (items[0]["id"], items[-1]["id"]) == ("nextjs", "github")
