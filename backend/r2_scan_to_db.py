import os
import boto3
from sqlalchemy import create_engine, text
from app.settings import (
    R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET,
    DATABASE_URL
)

# -------------------------
# CONNECT TO R2 AND LIST TRACKS
# -------------------------
print(f"Scanning bucket: {R2_BUCKET}...")
s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY
)

try:
    resp = s3.list_objects_v2(Bucket=R2_BUCKET)
except Exception as e:
    print(f"Error connecting to R2: {e}")
    exit(1)

# Group files by album (folder)
album_files = {}

if "Contents" in resp:
    for obj in resp["Contents"]:
        key = obj["Key"]
        parts = key.split("/")
        if len(parts) > 1:
            album_name = parts[0]
            if album_name not in album_files:
                album_files[album_name] = {"tracks": [], "images": []}

            if key.lower().endswith(".mp3"):
                album_files[album_name]["tracks"].append(key)
            elif key.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                album_files[album_name]["images"].append(key)

# Identify best cover for each album
album_covers = {}
for album_name, files in album_files.items():
    if not files["images"]:
        album_covers[album_name] = None
        continue

    # Preferred names: cover, front, folder, thumb
    images = files["images"]
    cover = images[0] # Default to first image
    for img in images:
        low = img.lower()
        if any(x in low for x in ["cover", "front", "folder", "thumb", "tape"]):
            cover = img
            break
    album_covers[album_name] = cover

print(f"Found {len(album_files)} albums in R2.")

# -------------------------
# PUSH TO DATABASE
# -------------------------
try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        # Re-create table with cover_key column
        is_postgres = DATABASE_URL.startswith("postgresql")
        id_col = "SERIAL PRIMARY KEY" if is_postgres else "INTEGER PRIMARY KEY AUTOINCREMENT"

        # We drop and recreate for simplicity to add the column,
        # or we could ALTER if we wanted to preserve data.
        # Since this is a sync script, recreate is safer for schema consistency.
        conn.execute(text("DROP TABLE IF EXISTS tracks;"))
        conn.execute(text(f"""
        CREATE TABLE tracks (
            track_id {id_col},
            album_name TEXT,
            track_name TEXT,
            audio_key TEXT UNIQUE,
            cover_key TEXT
        );
        """))
        conn.commit()

        # Insert tracks
        count = 0
        for album_name, files in album_files.items():
            cover_key = album_covers.get(album_name)
            for audio_key in files["tracks"]:
                track_name = os.path.splitext(os.path.basename(audio_key))[0]
                try:
                    conn.execute(text("""
                    INSERT INTO tracks (album_name, track_name, audio_key, cover_key)
                    VALUES (:album, :track, :key, :cover)
                    """), {
                        "album": album_name,
                        "track": track_name,
                        "key": audio_key,
                        "cover": cover_key
                    })
                    count += 1
                except Exception as insert_err:
                    print(f"Skip {audio_key}: {insert_err}")

        conn.commit()
        print(f"Sync complete! Synced {count} tracks with covers.")

except Exception as e:
    print("Database Error:", e)


