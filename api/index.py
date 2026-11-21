import sys
import os
import shutil

# Add backend directory to sys.path so app.* imports resolve properly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(parent_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure SQLite database is accessible on Vercel's ephemeral filesystem
if os.environ.get("VERCEL"):
    db_source = os.path.join(backend_dir, "urban_air_quality.db")
    db_tmp = "/tmp/urban_air_quality.db"
    if os.path.exists(db_source) and not os.path.exists(db_tmp):
        try:
            shutil.copy2(db_source, db_tmp)
        except Exception as e:
            print(f"Error copying DB to /tmp: {e}")
    if os.path.exists(db_tmp):
        os.environ["DATABASE_URL"] = f"sqlite:///{db_tmp}"

from app.main import app

# Ensure tables and demo accounts are ready for serverless requests
try:
    from app.database.session import Base, engine, SessionLocal
    from app.models.models import User, UserProfile, UserPreferences
    from app.core.security import get_password_hash
    from app.services.alert_service import AlertService

    Base.metadata.create_all(bind=engine)
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

        # Demo User
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
                bio="Health conscious runner & clean air advocate."
            )
            pref2 = UserPreferences(
                user_id=demo_user.id,
                favorite_cities=["London", "Paris", "New York"],
                aqi_alert_threshold=100
            )
            db.add(p2)
            db.add(pref2)
            db.commit()

        AlertService.seed_initial_alerts(db)
    except Exception as err:
        print(f"Error seeding DB: {err}")
    finally:
        db.close()
except Exception as e:
    print(f"Warning: could not run Base.metadata.create_all: {e}")
