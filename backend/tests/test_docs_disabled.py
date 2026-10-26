import importlib

from fastapi.testclient import TestClient

import main
from core.matrix.grid_keymaker_secret_manager import get_settings


def test_docs_are_hidden_when_disabled(monkeypatch):
    monkeypatch.setenv("DOCS_ENABLED", "false")
    get_settings.cache_clear()
    client = TestClient(importlib.reload(main).app)
    get_settings.cache_clear()

    assert [client.get(p).status_code for p in ("/docs", "/redoc", "/openapi.json")] == [404, 404, 404]
