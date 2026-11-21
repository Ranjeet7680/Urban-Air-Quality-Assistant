from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import AlertOut, AlertPreferenceUpdate
from app.services.alert_service import AlertService
from app.api.deps import get_current_user_optional, get_current_user

router = APIRouter()

@router.get("/", response_model=List[AlertOut])
def list_alerts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user.id if current_user else None
    # Ensure some initial alerts exist
    AlertService.seed_initial_alerts(db)
    return AlertService.get_user_alerts(db, user_id=user_id)

@router.put("/{alert_id}/read")
def mark_read(alert_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    success = AlertService.mark_as_read(db, alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert marked as read"}

@router.post("/mark-all-read")
def mark_all_read(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user.id if current_user else None
    count = AlertService.mark_all_as_read(db, user_id=user_id)
    return {"message": f"{count} alerts marked as read"}

@router.post("/test-trigger", response_model=AlertOut)
def trigger_test_alert(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user.id if current_user else None
    city = current_user.city if current_user and current_user.city else "New York"
    return AlertService.create_alert(
        db=db,
        title=f"Air Quality Alert Triggered: {city}",
        message=f"Current sensor assimilation indicates AQI in {city} has risen to 125 (Unhealthy for Sensitive Groups). Sensitive individuals should reduce intense outdoor activity.",
        severity="warning",
        alert_type="high_aqi",
        location_name=city,
        aqi_value=125,
        user_id=user_id
    )

@router.post("/preferences")
def update_alert_preferences(
    prefs: AlertPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user_prefs = current_user.preferences
    if not user_prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")

    if prefs.notification_email is not None:
        user_prefs.notification_email = prefs.notification_email
    if prefs.notification_inapp is not None:
        user_prefs.notification_inapp = prefs.notification_inapp
    if prefs.notification_push is not None:
        user_prefs.notification_push = prefs.notification_push
    if prefs.aqi_alert_threshold is not None:
        user_prefs.aqi_alert_threshold = prefs.aqi_alert_threshold

    db.commit()
    return {"message": "Notification preferences updated successfully"}
