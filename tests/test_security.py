import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from fastapi.testclient import TestClient
from app.main import app
from app.database.session import Base, engine

Base.metadata.create_all(bind=engine)
client = TestClient(app)

def test_security_headers_present():
    """Verify presence of defense-in-depth HTTP security headers."""
    response = client.get("/health")
    assert response.status_code == 200
    headers = response.headers

    assert headers.get("x-content-type-options") == "nosniff"
    assert headers.get("x-frame-options") == "DENY"
    assert headers.get("x-xss-protection") == "1; mode=block"
    assert "max-age=" in headers.get("strict-transport-security", "")
    assert "default-src" in headers.get("content-security-policy", "")
    assert headers.get("referrer-policy") == "strict-origin-when-cross-origin"

def test_sql_injection_resilience():
    """Verify that SQL injection attempt characters do not cause unhandled crashes."""
    sql_payload = "New York' OR 1=1 --"
    response = client.get(f"/api/air-quality/current?city={sql_payload}")
    # The API should gracefully handle or fallback without 500 database syntax error
    assert response.status_code in [200, 400, 404]

def test_unauthorized_endpoints_protected():
    """Verify that protected endpoints reject unauthenticated requests."""
    response = client.get("/api/alerts/")
    assert response.status_code in [401, 403]

    response_admin = client.get("/api/admin/dashboard")
    assert response_admin.status_code in [401, 403]

def test_invalid_jwt_token_rejected():
    """Verify malformed or forged tokens are rejected."""
    headers = {"Authorization": "Bearer invalid.token.payload"}
    response = client.get("/api/alerts/", headers=headers)
    assert response.status_code in [401, 403]

def test_rate_limiter_headers():
    """Verify that rate limiter attaches limit and remaining headers."""
    response = client.get("/api/air-quality/world-map")
    assert response.status_code == 200
    assert "x-ratelimit-limit" in response.headers
    assert "x-ratelimit-remaining" in response.headers
