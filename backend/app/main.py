from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3
from botocore.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

from app.settings import (
    R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET,
    DATABASE_URL
)

# -------------------------
# S3 CLIENT (R2)
# -------------------------
s3_client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    config=Config(signature_version="s3v4")
)

# -------------------------
# DATABASE SETUP
# -------------------------
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------
# FASTAPI INIT
# -------------------------
app = FastAPI(title="Music App Backend")

origins = [
    "https://music.kyawhtet.com",
    "https://music-app-nine-dun.vercel.app",
    # add more frontends later if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# UTILS
# -------------------------
def fetch_tracks(db: Session):
    # Updated to include cover_key
    result = db.execute(text("SELECT track_id, album_name, track_name, audio_key, cover_key FROM tracks ORDER BY track_id ASC"))
    return [dict(row._mapping) for row in result]

def build_albums(tracks):
    albums = {}
    for t in tracks:
        album_name = t["album_name"]
        if album_name not in albums:
            # Return a relative path so the frontend can prepend its own API_BASE_URL
            cover_url = f"/artwork/{t['track_id']}" if t.get("cover_key") else "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"

            albums[album_name] = {
                "id": len(albums) + 1,
                "name": album_name,
                "tracks": [],
                "cover": cover_url
            }
        albums[album_name]["tracks"].append({
            "track_id": t["track_id"],
            "name": t["track_name"]
        })
    return list(albums.values())

# ... later in endpoints
@app.get("/artwork/{track_id}")
def get_artwork(track_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT cover_key FROM tracks WHERE track_id = :tid"),
        {"tid": track_id}
    ).fetchone()

    if not result or not result[0]:
        # Fallback to a placeholder if no cover found
        return RedirectResponse("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17")

    cover_key = result[0]

    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": R2_BUCKET, "Key": cover_key},
            ExpiresIn=3600
        )
        return RedirectResponse(url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# -------------------------
# API ENDPOINTS
# -------------------------
@app.get("/albums")
def albums_only(db: Session = Depends(get_db)):
    tracks = fetch_tracks(db)
    albums = build_albums(tracks)
    return [{"id": a["id"], "name": a["name"]} for a in albums]

@app.get("/albums-with-tracks")
def albums_with_tracks(db: Session = Depends(get_db)):
    tracks = fetch_tracks(db)
    albums = build_albums(tracks)
    return albums

@app.get("/stream/{track_id}")
def stream(track_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT audio_key FROM tracks WHERE track_id = :tid"),
        {"tid": track_id}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Track not found")

    audio_key = result[0]

    try:
        # Generate a presigned URL that lasts for 1 hour
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": R2_BUCKET,
                "Key": audio_key
            },
            ExpiresIn=3600
        )
        return RedirectResponse(url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating stream URL: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
