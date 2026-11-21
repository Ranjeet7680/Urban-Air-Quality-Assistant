import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from fastapi.testclient import TestClient
from app.main import app
from app.database.session import Base, engine, SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

# Initialize SQLite tables and seed demo accounts for tests
Base.metadata.create_all(bind=engine)
_db = SessionLocal()
try:
    if not _db.query(User).filter(User.email == "sarah.chen@urbanair.io").first():
        _demo = User(
            email="sarah.chen@urbanair.io",
            hashed_password=get_password_hash("UserPass123!"),
            full_name="Sarah Chen",
            city="London",
            role="user",
            is_active=True,
            is_verified=True
        )
        _db.add(_demo)
    if not _db.query(User).filter(User.email == "admin@airsense.eco").first():
        _admin = User(
            email="admin@airsense.eco",
            hashed_password=get_password_hash("AdminPass123!"),
            full_name="System Administrator",
            city="New York",
            role="admin",
            is_active=True,
            is_verified=True
        )
        _db.add(_admin)
    _db.commit()
finally:
    _db.close()

client = TestClient(app)

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "database" in data

def test_current_air_quality():
    res = client.get("/api/air-quality/current?city=New%20York")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "New York"
    assert "aqi" in data
    assert "aqi_category" in data
    assert len(data["pollutants"]) == 6
    assert data["dominant_pollutant"] in ["PM2.5", "PM10", "NO2", "O3", "SO2", "CO"]

def test_stations_roster():
    res = client.get("/api/air-quality/stations")
    assert res.status_code == 200
    stations = res.json()
    assert len(stations) > 0
    assert "station_code" in stations[0]
    assert "latitude" in stations[0]
    assert "longitude" in stations[0]

def test_forecast_endpoints():
    hourly_res = client.get("/api/forecast/hourly?city=London")
    assert hourly_res.status_code == 200
    assert len(hourly_res.json()["hourly"]) > 0

    daily_res = client.get("/api/forecast/daily?city=London")
    assert daily_res.status_code == 200
    assert len(daily_res.json()["daily"]) > 0

def test_user_authentication():
    # Test login with pre-seeded demo user
    res = client.post(
        "/api/auth/login",
        json={"email": "sarah.chen@urbanair.io", "password": "UserPass123!"}
    )
    assert res.status_code == 200
    token_data = res.json()
    assert "access_token" in token_data
    assert token_data["user"]["full_name"] == "Sarah Chen"

def test_airsense_ai_chat():
    res = client.post(
        "/api/ai/chat",
        json={
            "message": "Is it safe to go for a run in New York right now?",
            "city": "New York"
        }
    )
    assert res.status_code == 200
    ai_data = res.json()
    assert "reply" in ai_data
    assert len(ai_data["suggested_actions"]) > 0
    assert len(ai_data["citations"]) > 0

def test_reports_generation():
    res = client.post(
        "/api/reports/generate",
        json={
            "report_type": "daily",
            "city": "Tokyo",
            "include_ai_summary": True
        }
    )
    assert res.status_code == 200
    rep = res.json()
    assert rep["location_name"] == "Tokyo"
    assert "avg_aqi" in rep

def test_admin_dashboard():
    # Login as admin to obtain authenticated bearer token
    login_res = client.post(
        "/api/auth/login",
        json={"email": "admin@airsense.eco", "password": "AdminPass123!"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/admin/dashboard", headers=headers)
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_users"] >= 1
    assert len(stats["data_sources"]) >= 4

def test_world_map_and_deep_tech():
    # World map telemetry
    wm_res = client.get("/api/air-quality/world-map")
    assert wm_res.status_code == 200
    wm = wm_res.json()
    assert len(wm) >= 15
    assert "continent" in wm[0]
    assert "satellite_aod" in wm[0]

    # Global rankings
    gr_res = client.get("/api/air-quality/global-rankings")
    assert gr_res.status_code == 200
    gr = gr_res.json()
    assert len(gr["cleanest"]) == 5
    assert len(gr["most_polluted"]) == 5

    # Sentinel 5P Satellite layers
    sat_res = client.get("/api/air-quality/sentinel5p-data")
    assert sat_res.status_code == 200
    sat = sat_res.json()
    assert len(sat["products"]) == 4

    # Thermal Inversion Detector
    inv_res = client.get("/api/air-quality/inversion-detection?city=Delhi")
    assert inv_res.status_code == 200
    inv = inv_res.json()
    assert "thermal_inversion_active" in inv
    assert "mixing_layer_height_meters" in inv

if __name__ == "__main__":
    print("Executing Urban Air Quality Assistant test suite...")
    test_health_check()
    print("✓ Health check passed")
    test_current_air_quality()
    print("✓ Current air quality passed")
    test_stations_roster()
    print("✓ Station roster passed")
    test_forecast_endpoints()
    print("✓ Atmospheric forecast passed")
    test_user_authentication()
    print("✓ Authentication & JWT passed")
    test_airsense_ai_chat()
    print("✓ AirSense AI reasoning passed")
    test_reports_generation()
    print("✓ Report generation passed")
    test_admin_dashboard()
    print("✓ Admin dashboard passed")
    test_world_map_and_deep_tech()
    print("✓ Real-time AQI World Map & Deep-Tech passed")
    print("\nALL 9 CORE SYSTEM & ADVANCED TECH TESTS PASSED SUCCESSFULLY!")
