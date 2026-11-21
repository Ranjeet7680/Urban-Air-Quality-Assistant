from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, UserProfile, UserPreferences, AuditLog
from app.schemas.schemas import OnboardingRequest, UserOut
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/onboarding", response_model=UserOut)
def complete_onboarding(
    data: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.full_name:
        current_user.full_name = data.full_name
    current_user.city = data.city

    # Update or create profile
    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
    
    if data.preferred_aqi_standard:
        profile.preferred_aqi_standard = data.preferred_aqi_standard
    profile.health_conditions = data.health_conditions

    # Update preferences
    prefs = current_user.preferences
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.add(prefs)
    
    prefs.notification_email = data.notification_email
    prefs.notification_inapp = data.notification_inapp
    prefs.notification_push = data.notification_push
    prefs.aqi_alert_threshold = data.aqi_alert_threshold
    prefs.interests = data.interests
    if data.city and data.city not in (prefs.favorite_cities or []):
        prefs.favorite_cities = [data.city] + [c for c in (prefs.favorite_cities or []) if c != data.city]

    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="ONBOARDING_COMPLETED",
        resource="USER",
        details=f"User configured city={data.city}, threshold={data.aqi_alert_threshold}"
    )
    db.add(audit)
    db.commit()
    db.refresh(current_user)

    return current_user

@router.put("/profile")
def update_profile(
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if "full_name" in payload:
        current_user.full_name = payload["full_name"]
    if "city" in payload:
        current_user.city = payload["city"]

    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    if "preferred_aqi_standard" in payload:
        profile.preferred_aqi_standard = payload["preferred_aqi_standard"]
    if "bio" in payload:
        profile.bio = payload["bio"]
    if "phone" in payload:
        profile.phone = payload["phone"]
    if "health_conditions" in payload:
        profile.health_conditions = payload["health_conditions"]

    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/preferences")
def update_preferences(
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = current_user.preferences
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.add(prefs)

    for field in ["notification_email", "notification_inapp", "notification_push", "aqi_alert_threshold", "dark_mode"]:
        if field in payload:
            setattr(prefs, field, payload[field])
    
    if "favorite_cities" in payload:
        prefs.favorite_cities = payload["favorite_cities"]
    if "interests" in payload:
        prefs.interests = payload["interests"]

    db.commit()
    return {"message": "Preferences updated successfully", "preferences": payload}
