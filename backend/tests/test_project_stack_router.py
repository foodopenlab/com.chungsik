from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_myself_roundtrips_hardcoded_project_stack():
    res = client.get("/api/v1/project-stacks/myself")

    assert res.status_code == 200
    assert res.json() == {"projectSlug": "myself", "stackId": "myself"}


def test_list_links_every_project_to_stacks():
    items = client.get("/api/v1/project-stacks").json()["items"]

    assert {i["projectSlug"] for i in items} == {"metabole", "life-tutorial", "localhost-daegu", "townpulse", "remakeday"}
