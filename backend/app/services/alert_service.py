from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import EnvironmentalAlert, User

class AlertService:
    @classmethod
    def get_user_alerts(cls, db: Session, user_id: Optional[int] = None) -> List[EnvironmentalAlert]:
        query = db.query(EnvironmentalAlert)
        if user_id:
            query = query.filter((EnvironmentalAlert.user_id == user_id) | (EnvironmentalAlert.user_id == None))
        return query.order_by(EnvironmentalAlert.created_at.desc()).limit(50).all()

    @classmethod
    def mark_as_read(cls, db: Session, alert_id: int) -> bool:
        alert = db.query(EnvironmentalAlert).filter(EnvironmentalAlert.id == alert_id).first()
        if alert:
            alert.is_read = True
            db.commit()
            return True
        return False

    @classmethod
    def mark_all_as_read(cls, db: Session, user_id: Optional[int] = None) -> int:
        query = db.query(EnvironmentalAlert).filter(EnvironmentalAlert.is_read == False)
        if user_id:
            query = query.filter((EnvironmentalAlert.user_id == user_id) | (EnvironmentalAlert.user_id == None))
        count = query.update({"is_read": True})
        db.commit()
        return count

    @classmethod
    def create_alert(
        cls,
        db: Session,
        title: str,
        message: str,
        severity: str = "warning",
        alert_type: str = "high_aqi",
        location_name: str = "New York",
        aqi_value: int = 110,
        user_id: Optional[int] = None
    ) -> EnvironmentalAlert:
        alert = EnvironmentalAlert(
            user_id=user_id,
            title=title,
            message=message,
            severity=severity,
            alert_type=alert_type,
            location_name=location_name,
            aqi_value=aqi_value,
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    @classmethod
    def seed_initial_alerts(cls, db: Session):
        count = db.query(EnvironmentalAlert).count()
        if count == 0:
            cls.create_alert(
                db,
                title="Moderate Ozone Advisory in Metropolitan Core",
                message="Elevated surface ozone (O3) observed during peak solar irradiance. Sensitive groups should avoid heavy afternoon cardio.",
                severity="warning",
                alert_type="high_aqi",
                location_name="New York",
                aqi_value=95
            )
            cls.create_alert(
                db,
                title="Optimal Morning Air Dispersion",
                message="Strong maritime breeze has cleared fine particulate aerosols across city sectors. Clean air window active.",
                severity="info",
                alert_type="forecast_warning",
                location_name="London",
                aqi_value=32
            )
            cls.create_alert(
                db,
                title="High Particulate (PM2.5) Notice",
                message="Stagnant boundary layer conditions have concentrated particulate matter above safe threshold.",
                severity="critical",
                alert_type="pm25_spike",
                location_name="Delhi",
                aqi_value=185
            )
