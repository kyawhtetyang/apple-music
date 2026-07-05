from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Database Configuration
# Default to SQLite only for local Mac testing
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/music.db")

# Cloudflare R2 Configuration
# These MUST be provided in your .env file
R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_BUCKET = os.getenv("R2_BUCKET")

# Music Library Configuration (for local scanner)
MUSIC_DIR = BASE_DIR / "music_library"

# Validation to help with debugging
if not all([R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET]):
    print("⚠️ WARNING: One or more Cloudflare R2 credentials are missing from .env")


