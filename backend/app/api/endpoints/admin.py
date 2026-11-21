from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, AuditLog
from app.schemas.schemas import AdminDashboardOut, UserOut
from app.services.admin_service import AdminService
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()

@router.get("/dashboard", response_model=AdminDashboardOut)
def get_admin_dashboard(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return AdminService.get_dashboard_stats(db)

@router.get("/users", response_model=List[UserOut])
def list_all_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    payload: Dict[str, str],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_role = payload.get("role")
    if new_role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    
    target_user.role = new_role
    db.commit()
    db.refresh(target_user)
    return {"message": f"User role updated to {new_role}", "user": target_user}

@router.get("/data-sources")
def get_data_sources(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    stats = AdminService.get_dashboard_stats(db)
    return stats["data_sources"]

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    stats = AdminService.get_dashboard_stats(db)
    return stats["recent_audits"]
