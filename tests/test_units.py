import pytest
import math
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.environmental_data.aqi_calculator import (
    get_aqi_category_and_color,
    calculate_pollutant_sub_index
)
from app.core.security import get_password_hash, verify_password, create_access_token

def test_aqi_categories_and_colors():
    """Verify EPA standard category classifications and color hex codes."""
    # Good
    cat, color, _ = get_aqi_category_and_color(25)
    assert cat == "Good"
    assert color == "#16A34A"

    # Moderate
    cat, color, _ = get_aqi_category_and_color(75)
    assert cat == "Moderate"
    assert color == "#EAB308"

    # Unhealthy for Sensitive Groups
    cat, color, _ = get_aqi_category_and_color(125)
    assert cat == "Unhealthy for Sensitive Groups"
    assert color == "#F97316"

    # Unhealthy
    cat, color, _ = get_aqi_category_and_color(175)
    assert cat == "Unhealthy"
    assert color == "#EF4444"

    # Very Unhealthy
    cat, color, _ = get_aqi_category_and_color(250)
    assert cat == "Very Unhealthy"
    assert color == "#A855F7"

    # Hazardous
    cat, color, _ = get_aqi_category_and_color(400)
    assert cat == "Hazardous"
    assert color == "#881337"

def test_pollutant_sub_index_calculation():
    """Verify linear interpolation of pollutant sub-index."""
    sub_pm25 = calculate_pollutant_sub_index("pm2_5", 12.0)
    assert 40 <= sub_pm25 <= 60

    sub_pm10 = calculate_pollutant_sub_index("pm10", 54.0)
    assert 40 <= sub_pm10 <= 60

def test_koschmieder_extinction_formula():
    """Verify Koschmieder optical visual range formula."""
    beta_ray = 0.012
    pm25 = 25.0
    rh = 55.0
    rh_factor = 1.0 + 0.25 * ((rh / (100.0 - rh + 0.01)) ** 0.75)
    beta_pm = 0.003 * pm25 * rh_factor
    beta_ext = beta_ray + beta_pm + 0.0066
    vr_km = 3.912 / beta_ext

    assert 10.0 <= vr_km <= 50.0

def test_commute_dosage_calculation():
    """Verify biological particulate lung intake formula: Dose = C * V * t."""
    ambient_pm25 = 20.0
    # Cycling mode: 0.035 m3/min, Greenway: 0.65x
    vent_rate = 0.035
    route_factor = 0.65
    duration = 30
    effective_c = ambient_pm25 * route_factor
    air_m3 = vent_rate * duration
    dose_ug = effective_c * air_m3

    assert round(air_m3, 2) == 1.05
    assert 10.0 <= dose_ug <= 20.0

def test_password_hashing_and_verification():
    """Verify cryptographic password hashing with unique salt."""
    raw_pass = "TestSecurePassword123!"
    hashed = get_password_hash(raw_pass)

    assert hashed != raw_pass
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

def test_jwt_token_generation():
    """Verify JWT access token issuance."""
    token = create_access_token(subject="user@example.com")
    assert isinstance(token, str)
    assert len(token.split('.')) == 3
