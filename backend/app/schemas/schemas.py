from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, ConfigDict

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    city: Optional[str] = "New York"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None
    city: Optional[str] = "New York"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserProfileOut(BaseModel):
    preferred_aqi_standard: str = "US_EPA"
    health_conditions: List[str] = []
    bio: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserPreferencesOut(BaseModel):
    notification_email: bool = True
    notification_inapp: bool = True
    notification_push: bool = False
    aqi_alert_threshold: int = 100
    favorite_cities: List[str] = ["New York", "London", "Delhi"]
    interests: List[str] = ["Air pollution", "Health awareness", "Outdoor activities"]
    dark_mode: bool = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    city: str
    role: str
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileOut] = None
    preferences: Optional[UserPreferencesOut] = None

    model_config = ConfigDict(from_attributes=True)

Token.model_rebuild()

class OnboardingRequest(BaseModel):
    full_name: Optional[str] = None
    city: str
    location_permission_granted: bool = False
    preferred_aqi_standard: Optional[str] = "US_EPA"
    health_conditions: List[str] = []
    interests: List[str] = []
    notification_email: bool = True
    notification_inapp: bool = True
    notification_push: bool = False
    aqi_alert_threshold: int = 100

# Air Quality Schemas
class PollutantOut(BaseModel):
    pollutant_code: str
    pollutant_name: str
    concentration: float
    unit: str
    standard_limit: Optional[float] = None
    sub_index: Optional[int] = None
    change_24h: float = 0.0
    status: str  # "Good", "Moderate", "Unhealthy", etc.
    standard_note: str

class MonitoringStationOut(BaseModel):
    id: int
    station_code: str
    name: str
    operator: str
    sensor_type: str
    latitude: float
    longitude: float
    elevation: float
    status: str
    city: str
    country: str
    current_aqi: Optional[int] = None
    aqi_category: Optional[str] = None
    last_sync: datetime

class AirQualityOut(BaseModel):
    city: str
    country: str
    latitude: float
    longitude: float
    observation_time: datetime
    last_updated: str
    data_source: str
    aqi: int
    aqi_category: str
    aqi_color: str
    dominant_pollutant: str
    health_summary: str
    temperature_c: Optional[float] = 22.0
    humidity_percent: Optional[float] = 55.0
    wind_speed_kmh: Optional[float] = 12.0
    wind_direction_deg: Optional[float] = 180.0
    standard_used: str  # US_EPA, WHO, EAQI, NAQI
    station_info: Optional[Dict[str, Any]] = None
    pollutants: List[PollutantOut]

# Forecast Schemas
class HourlyForecastItem(BaseModel):
    time: str
    timestamp: datetime
    aqi: int
    category: str
    pm25: float
    pm10: float
    ozone: Optional[float] = None
    temperature: Optional[float] = None

class DailyForecastItem(BaseModel):
    date: str
    avg_aqi: int
    max_aqi: int
    min_aqi: int
    category: str
    dominant_pollutant: str
    recommendation: str

class ForecastResponse(BaseModel):
    city: str
    provider: str
    generated_at: datetime
    confidence: str
    hourly: List[HourlyForecastItem]
    daily: List[DailyForecastItem]

# AI Schemas
class AIChatRequest(BaseModel):
    message: str
    city: Optional[str] = "New York"
    conversation_id: Optional[int] = None
    aqi_context: Optional[Dict[str, Any]] = None

class AIChatResponse(BaseModel):
    conversation_id: int
    reply: str
    measured_data_badge: str
    forecast_badge: str
    ai_badge: str
    suggested_actions: List[str]
    citations: List[str]

class AIExplainRequest(BaseModel):
    city: str
    aqi: int
    dominant_pollutant: str
    pollutants: Dict[str, float]

class AIExplainResponse(BaseModel):
    overview: str
    causes: List[str]
    health_impact: str
    dispersion_factor: str
    precautionary_actions: List[str]

# Alerts
class AlertOut(BaseModel):
    id: int
    title: str
    message: str
    severity: str
    alert_type: str
    location_name: str
    aqi_value: Optional[int] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AlertPreferenceUpdate(BaseModel):
    notification_email: Optional[bool] = None
    notification_inapp: Optional[bool] = None
    notification_push: Optional[bool] = None
    aqi_alert_threshold: Optional[int] = None

# Analytics
class AnalyticsOverviewOut(BaseModel):
    city: str
    period: str
    avg_aqi: float
    max_aqi: int
    min_aqi: int
    clean_air_days: int
    polluted_days: int
    dominant_pollutant: str
    daily_trend: List[Dict[str, Any]]
    pollutant_distribution: Dict[str, float]

# Reports
class ReportGenerateRequest(BaseModel):
    report_type: str = "daily"  # daily, weekly, monthly, location_comparison
    city: str = "New York"
    comparison_city: Optional[str] = None
    include_ai_summary: bool = True

class ReportOut(BaseModel):
    id: int
    title: str
    report_type: str
    location_name: str
    period_start: datetime
    period_end: datetime
    avg_aqi: float
    max_aqi: int
    dominant_pollutant: str
    summary: str
    ai_analysis: Optional[str] = None
    data_source: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Admin Schemas
class AdminDashboardOut(BaseModel):
    total_users: int
    active_users: int
    total_stations: int
    total_measurements: int
    active_alerts: int
    generated_reports: int
    api_status: Dict[str, Any]
    data_sources: List[Dict[str, Any]]
    recent_audits: List[Dict[str, Any]]
