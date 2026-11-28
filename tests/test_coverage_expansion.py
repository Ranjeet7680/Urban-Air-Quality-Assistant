import pytest
import sys
import os
import uuid

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_auth_token(email: str = "sarah.chen@urbanair.io", password: str = "UserPass123!") -> str:
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    return res.json()["access_token"]

def get_admin_token() -> str:
    res = client.post("/api/auth/login", json={"email": "admin@airsense.eco", "password": "AdminPass123!"})
    assert res.status_code == 200
    return res.json()["access_token"]

def test_auth_full_lifecycle():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    # Registration
    reg_res = client.post("/api/auth/register", json={
        "email": unique_email,
        "password": "SecurePassword123!",
        "full_name": "Test Engineer",
        "city": "Tokyo"
    })
    assert reg_res.status_code == 200
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # /me endpoint
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

    # Google login (creates or signs in)
    g_res = client.post("/api/auth/google-login", json={
        "email": f"google_{uuid.uuid4().hex[:8]}@example.com",
        "full_name": "Google User",
        "avatar_url": "https://example.com/avatar.png",
        "city": "Paris"
    })
    assert g_res.status_code == 200
    assert "access_token" in g_res.json()

    # Forgot password
    fp_res = client.post("/api/auth/forgot-password", json={"email": unique_email})
    assert fp_res.status_code == 200
    assert "message" in fp_res.json()

    # Logout
    logout_res = client.post("/api/auth/logout", headers=headers)
    assert logout_res.status_code == 200

def test_user_profile_and_preferences():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Update profile
    p_put = client.put("/api/users/profile", headers=headers, json={
        "full_name": "Sarah Chen",
        "city": "London",
        "preferred_aqi_standard": "WHO",
        "bio": "Environmental researcher and outdoor enthusiast.",
        "health_conditions": ["asthma"]
    })
    assert p_put.status_code == 200

    # Update preferences
    pref_put = client.put("/api/users/preferences", headers=headers, json={
        "favorite_cities": ["Tokyo", "Berlin", "London"],
        "aqi_alert_threshold": 95,
        "notification_push": True
    })
    assert pref_put.status_code == 200

    # Onboarding
    onboard_res = client.post("/api/users/onboarding", headers=headers, json={
        "full_name": "Sarah Chen",
        "city": "London",
        "preferred_aqi_standard": "US_EPA",
        "aqi_alert_threshold": 80,
        "health_conditions": ["asthma"],
        "interests": ["Clean Air"]
    })
    assert onboard_res.status_code == 200

def test_alerts_workflow():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Test trigger alert
    trigger_res = client.post("/api/alerts/test-trigger", headers=headers)
    assert trigger_res.status_code == 200
    alert_id = trigger_res.json()["id"]

    # List alerts
    list_res = client.get("/api/alerts/", headers=headers)
    assert list_res.status_code == 200
    alerts = list_res.json()
    assert len(alerts) > 0

    # Mark single alert read
    read_res = client.put(f"/api/alerts/{alert_id}/read", headers=headers)
    assert read_res.status_code == 200

    # Mark all read
    all_read = client.post("/api/alerts/mark-all-read", headers=headers)
    assert all_read.status_code == 200

def test_analytics_endpoints():
    overview_res = client.get("/api/analytics/overview?city=New%20York&days=7")
    assert overview_res.status_code == 200
    data = overview_res.json()
    assert data["city"] == "New York"
    assert "avg_aqi" in data
    assert "daily_trend" in data
    assert len(data["daily_trend"]) > 0

    loc_res = client.get("/api/analytics/locations?cities=New%20York&cities=London&cities=Tokyo")
    assert loc_res.status_code == 200
    loc_data = loc_res.json()
    assert len(loc_data) >= 2
    assert "city" in loc_data[0]
    assert "aqi" in loc_data[0]

def test_advanced_air_quality_models():
    # Audio briefing
    audio_res = client.get("/api/air-quality/audio-briefing?city=London&standard=US_EPA")
    assert audio_res.status_code == 200
    audio_data = audio_res.json()
    assert "speech_text" in audio_data
    assert "aqi" in audio_data

    # Inversion detection
    inv_res = client.get("/api/air-quality/inversion-detection?city=London")
    assert inv_res.status_code == 200
    assert "thermal_inversion_active" in inv_res.json()

    # Source attribution
    src_res = client.get("/api/air-quality/source-attribution?city=New%20York")
    assert src_res.status_code == 200
    assert "primary_source" in src_res.json()

    # Visibility calculation
    vis_res = client.get("/api/air-quality/visibility-calculation?pm25=35.0&humidity=65.0&no2=22.0")
    assert vis_res.status_code == 200
    assert "visual_range_km" in vis_res.json()

    # Commute exposure
    commute_res = client.get("/api/air-quality/commute-exposure?city=New%20York&mode=cycling&route=Hudson%20River%20Greenway&duration_minutes=25")
    assert commute_res.status_code == 200
    assert "total_inhaled_pm25_ug" in commute_res.json()

    # LoRaWAN mesh
    lora_res = client.get("/api/air-quality/lorawan-mesh?city=New%20York")
    assert lora_res.status_code == 200
    assert "nodes" in lora_res.json()

def test_admin_metrics_and_audit():
    admin_token = get_admin_token()
    headers = {"Authorization": f"Bearer {admin_token}"}

    dash_res = client.get("/api/admin/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert "total_users" in dash_data

    users_res = client.get("/api/admin/users", headers=headers)
    assert users_res.status_code == 200
    assert len(users_res.json()) > 0

    sources_res = client.get("/api/admin/data-sources", headers=headers)
    assert sources_res.status_code == 200

    audit_res = client.get("/api/admin/audit-logs", headers=headers)
    assert audit_res.status_code == 200
    assert isinstance(audit_res.json(), list)
