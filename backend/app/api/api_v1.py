from fastapi import APIRouter
from app.api.endpoints import (
    auth, users, air_quality, forecast, ai, alerts, analytics, reports, admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Onboarding"])
api_router.include_router(air_quality.router, prefix="/air-quality", tags=["Air Quality Telemetry"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["Atmospheric Forecast"])
api_router.include_router(ai.router, prefix="/ai", tags=["AirSense AI"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Pollution Alerts"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Historical Analytics"])
api_router.include_router(reports.router, prefix="/reports", tags=["Environmental Reports"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administrative Control"])
