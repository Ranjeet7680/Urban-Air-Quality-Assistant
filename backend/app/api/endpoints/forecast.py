from fastapi import APIRouter, Query
from app.services.forecast_service import ForecastService

router = APIRouter()

@router.get("/hourly")
async def get_hourly_forecast(city: str = Query("New York")):
    data = await ForecastService.get_forecast(city=city)
    return {
        "city": data["city"],
        "provider": data["provider"],
        "generated_at": data["generated_at"],
        "confidence": data["confidence"],
        "hourly": data["hourly"]
    }

@router.get("/daily")
async def get_daily_forecast(city: str = Query("New York")):
    data = await ForecastService.get_forecast(city=city)
    return {
        "city": data["city"],
        "provider": data["provider"],
        "generated_at": data["generated_at"],
        "confidence": data["confidence"],
        "daily": data["daily"]
    }
