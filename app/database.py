import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Use normal SQLite file locally.
# Vercel's serverless environment uses /tmp for writable temporary storage.
if os.getenv("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/ecommerce.db"
else:
    DATABASE_URL = "sqlite:///./ecommerce.db"


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
