from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    city = Column(String(100), default="New York")
    role = Column(String(50), default="user")  # "user", "admin"
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    alerts = relationship("EnvironmentalAlert", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("GeneratedReport", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    avatar_url = Column(String(500), nullable=True)
    preferred_aqi_standard = Column(String(50), default="US_EPA")  # "US_EPA", "WHO", "EAQI", "NAQI"
    health_conditions = Column(JSON, default=list)  # ["asthma", "respiratory", "cardiovascular", "elderly", "children"]
    bio = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    notification_email = Column(Boolean, default=True)
    notification_inapp = Column(Boolean, default=True)
    notification_push = Column(Boolean, default=False)
    aqi_alert_threshold = Column(Integer, default=100)  # triggers when AQI > threshold
    favorite_cities = Column(JSON, default=lambda: ["New York", "London", "Delhi"])
    interests = Column(JSON, default=lambda: ["Air pollution", "Health awareness", "Outdoor activities"])
    dark_mode = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="preferences")

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    city = Column(String(100), index=True, nullable=False)
    country = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timezone = Column(String(50), default="UTC")
    is_active = Column(Boolean, default=True)

    stations = relationship("MonitoringStation", back_populates="location")

class MonitoringStation(Base):
    __tablename__ = "monitoring_stations"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    station_code = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    operator = Column(String(200), default="National Environmental Agency / Copernicus")
    sensor_type = Column(String(100), default="Reference Optical & Laser Photometer")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=15.0)
    status = Column(String(50), default="active")  # "active", "calibrating", "offline"
    last_sync = Column(DateTime, default=datetime.utcnow)

    location = relationship("Location", back_populates="stations")
    measurements = relationship("AirQualityMeasurement", back_populates="station")

class AirQualityMeasurement(Base):
    __tablename__ = "air_quality_measurements"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("monitoring_stations.id"), nullable=True, index=True)
    city = Column(String(100), index=True, nullable=False)
    observation_time = Column(DateTime, index=True, nullable=False)
    aqi = Column(Integer, nullable=False)
    aqi_category = Column(String(50), nullable=False)  # "Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"
    dominant_pollutant = Column(String(20), default="pm2_5")
    data_source = Column(String(100), default="Open-Meteo & Copernicus CAMS")
    temperature_c = Column(Float, nullable=True)
    humidity_percent = Column(Float, nullable=True)
    wind_speed_kmh = Column(Float, nullable=True)
    wind_direction_deg = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    station = relationship("MonitoringStation", back_populates="measurements")
    pollutants = relationship("PollutantMeasurement", back_populates="measurement", cascade="all, delete-orphan")

class PollutantMeasurement(Base):
    __tablename__ = "pollutant_measurements"

    id = Column(Integer, primary_key=True, index=True)
    measurement_id = Column(Integer, ForeignKey("air_quality_measurements.id", ondelete="CASCADE"), nullable=False, index=True)
    pollutant_code = Column(String(20), nullable=False, index=True)  # pm2_5, pm10, no2, so2, co, o3
    pollutant_name = Column(String(100), nullable=False)
    concentration = Column(Float, nullable=False)
    unit = Column(String(20), default="µg/m³")
    standard_limit = Column(Float, nullable=True)
    sub_index = Column(Integer, nullable=True)
    change_24h = Column(Float, default=0.0)
    observation_time = Column(DateTime, nullable=False)

    measurement = relationship("AirQualityMeasurement", back_populates="pollutants")

class AirQualityForecast(Base):
    __tablename__ = "air_quality_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("monitoring_stations.id"), nullable=True)
    city = Column(String(100), index=True, nullable=False)
    forecast_time = Column(DateTime, default=datetime.utcnow)
    target_time = Column(DateTime, index=True, nullable=False)
    aqi_predicted = Column(Integer, nullable=False)
    pm25_predicted = Column(Float, nullable=False)
    pm10_predicted = Column(Float, nullable=False)
    ozone_predicted = Column(Float, nullable=True)
    dominant_pollutant = Column(String(20), default="pm2_5")
    provider = Column(String(100), default="Open-Meteo CAMS Global Ensemble")
    confidence_level = Column(String(20), default="High")  # "High", "Medium", "Moderate"

class EnvironmentalAlert(Base):
    __tablename__ = "environmental_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="warning")  # "info", "warning", "critical", "hazardous"
    alert_type = Column(String(50), default="high_aqi")  # "high_aqi", "pm25_spike", "forecast_warning", "sensitive_group"
    location_name = Column(String(100), nullable=False)
    aqi_value = Column(Integer, nullable=True)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="alerts")

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), default="Air Quality Consultation")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String(20), nullable=False)  # "user", "assistant"
    content = Column(Text, nullable=False)
    measured_data_context = Column(JSON, nullable=True)  # Snapshot of current AQI & pollutants attached to query
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    conversation = relationship("AIConversation", back_populates="messages")

class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    report_type = Column(String(50), default="daily")  # "daily", "weekly", "monthly", "location_comparison"
    location_name = Column(String(100), nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    avg_aqi = Column(Float, nullable=False)
    max_aqi = Column(Integer, nullable=False)
    dominant_pollutant = Column(String(20), default="pm2_5")
    summary = Column(Text, nullable=False)
    ai_analysis = Column(Text, nullable=True)
    data_source = Column(String(100), default="Open-Meteo & Copernicus CAMS")
    file_path = Column(String(500), nullable=True)
    status = Column(String(50), default="ready")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="audit_logs")
