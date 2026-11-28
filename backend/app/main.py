import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.api.api_v1 import api_router
from app.models.models import User, UserProfile, UserPreferences
from app.core.security import get_password_hash
from app.services.alert_service import AlertService
from app.core.middleware import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    PerformanceTelemetryMiddleware
)

# Structured production logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
)
logger = logging.getLogger("urban_air_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    
    # Seed default demo accounts
    db = SessionLocal()
    try:
        # Demo Admin
        admin_user = db.query(User).filter(User.email == "admin@airsense.eco").first()
        if not admin_user:
            admin_user = User(
                email="admin@airsense.eco",
                hashed_password=get_password_hash("AdminPass123!"),
                full_name="Dr. Elena Vance (Lead Environmental Architect)",
                city="New York",
                role="admin",
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

            p = UserProfile(
                user_id=admin_user.id,
                preferred_aqi_standard="US_EPA",
                bio="Chief atmospheric scientist and platform supervisor."
            )
            pref = UserPreferences(
                user_id=admin_user.id,
                favorite_cities=["New York", "London", "Tokyo", "Delhi", "Paris"],
                aqi_alert_threshold=80
            )
            db.add(p)
            db.add(pref)
            db.commit()

        # Demo Standard User
        demo_user = db.query(User).filter(User.email == "sarah.chen@urbanair.io").first()
        if not demo_user:
            demo_user = User(
                email="sarah.chen@urbanair.io",
                hashed_password=get_password_hash("UserPass123!"),
                full_name="Sarah Chen",
                city="London",
                role="user",
                is_active=True,
                is_verified=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            p2 = UserProfile(
                user_id=demo_user.id,
                preferred_aqi_standard="US_EPA",
                health_conditions=["asthma", "outdoor runner"]
            )
            pref2 = UserPreferences(
                user_id=demo_user.id,
                favorite_cities=["London", "Paris", "Berlin"],
                aqi_alert_threshold=100
            )
            db.add(p2)
            db.add(pref2)
            db.commit()

        # Seed initial alerts
        AlertService.seed_initial_alerts(db)

    finally:
        db.close()
    
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Environmental Monitoring, Forecasting, and Health Intelligence Platform",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration (secure explicit origins + Vercel deployment preview pattern)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Production Security & Efficiency Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=180)
app.add_middleware(PerformanceTelemetryMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Server Error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal environmental processing error occurred. Please try again shortly.",
            "path": request.url.path
        }
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "product": "Urban Air Quality Assistant",
        "tagline": "Breathe Smarter. Live Healthier. Build Cleaner Cities.",
        "status": "operational",
        "docs": "/docs",
        "api": "/api"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "telemetry_source": "Open-Meteo & Copernicus CAMS Active"
    }
