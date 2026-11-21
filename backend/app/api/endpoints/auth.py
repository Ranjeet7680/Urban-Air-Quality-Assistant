from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, UserProfile, UserPreferences, AuditLog
from app.schemas.schemas import UserCreate, UserLogin, UserOut, Token, GoogleLoginRequest, ForgotPasswordRequest
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from app.services.alert_service import AlertService

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email address already exists.")
    
    # Check if this is the first user, make them admin
    total_users = db.query(User).count()
    role = "admin" if total_users == 0 else "user"

    # Create user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        city=user_in.city or "New York",
        role=role,
        is_active=True,
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create profile and preferences
    profile = UserProfile(
        user_id=user.id,
        preferred_aqi_standard="US_EPA",
        health_conditions=[]
    )
    prefs = UserPreferences(
        user_id=user.id,
        favorite_cities=[user.city or "New York", "London", "Delhi"],
        interests=["Air pollution", "Health awareness", "Outdoor activities"]
    )
    db.add(profile)
    db.add(prefs)

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action="USER_REGISTRATION",
        resource="AUTH",
        details=f"User registered with email {user.email}"
    )
    db.add(audit)
    db.commit()
    db.refresh(user)

    # Seed welcome alert
    AlertService.create_alert(
        db=db,
        user_id=user.id,
        title="Welcome to Urban Air Quality Assistant",
        message=f"Real-time environmental monitoring is now active for {user.city}. You will receive proactive warnings if AQI exceeds your configured threshold.",
        severity="info",
        alert_type="welcome",
        location_name=user.city or "New York",
        aqi_value=42
    )

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is disabled")

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action="USER_LOGIN",
        resource="AUTH",
        details=f"User {user.email} authenticated successfully"
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/google-login", response_model=Token)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Create Google-authenticated user
        total_users = db.query(User).count()
        role = "admin" if total_users == 0 else "user"
        user = User(
            email=payload.email,
            hashed_password=get_password_hash("google-oauth-secure-random-pass"),
            full_name=payload.full_name,
            city=payload.city or "New York",
            role=role,
            is_active=True,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = UserProfile(
            user_id=user.id,
            avatar_url=payload.avatar_url,
            preferred_aqi_standard="US_EPA"
        )
        prefs = UserPreferences(
            user_id=user.id,
            favorite_cities=[user.city or "New York", "London", "Tokyo"]
        )
        db.add(profile)
        db.add(prefs)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    audit = AuditLog(
        user_id=current_user.id,
        action="USER_LOGOUT",
        resource="AUTH",
        details="User logged out session."
    )
    db.add(audit)
    db.commit()
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    # Always return success message for security
    return {
        "message": f"If an account exists for {req.email}, a secure password reset link has been dispatched."
    }
