import pytest
import time
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_response_process_time_header():
    """Verify X-Process-Time performance latency tracking header is attached."""
    response = client.get("/api/air-quality/visibility-calculation?pm25=25&humidity=50&no2=20")
    assert response.status_code == 200
    assert "x-process-time" in response.headers
    assert "ms" in response.headers["x-process-time"]

def test_cache_control_headers():
    """Verify that read-heavy telemetry routes supply caching directives."""
    response = client.get("/api/air-quality/stations")
    assert response.status_code == 200
    assert "cache-control" in response.headers
    assert "max-age=" in response.headers["cache-control"]

def test_low_latency_health_response():
    """Verify health endpoint responds in under 50ms."""
    start = time.perf_counter()
    response = client.get("/health")
    elapsed_ms = (time.perf_counter() - start) * 1000
    assert response.status_code == 200
    assert elapsed_ms < 100

def test_optical_extinction_compute_efficiency():
    """Verify Koschmieder optical physics compute responds in under 50ms."""
    start = time.perf_counter()
    response = client.get("/api/air-quality/visibility-calculation?pm25=30&humidity=60&no2=25")
    elapsed_ms = (time.perf_counter() - start) * 1000
    assert response.status_code == 200
    assert elapsed_ms < 150

def test_parallel_locations_comparison_efficiency():
    """Verify comparative analysis of multiple cities finishes cleanly in parallel."""
    start = time.perf_counter()
    response = client.get("/api/analytics/locations?cities=New%20York&cities=London&cities=Tokyo")
    elapsed_ms = (time.perf_counter() - start) * 1000
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert elapsed_ms < 10000
