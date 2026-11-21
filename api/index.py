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

# Ensure tables are ready for serverless requests
try:
    from app.database.session import Base, engine
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: could not run Base.metadata.create_all: {e}")
