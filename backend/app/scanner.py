import os
import sys
from pathlib import Path

# Fix for "ModuleNotFoundError: No module named 'app'"
PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from mutagen.mp3 import MP3
from sqlalchemy.orm import Session
from app.models import Album, Track
from app.settings import MUSIC_DIR

def scan_music(db: Session):
    for album_folder in MUSIC_DIR.iterdir():
        if not album_folder.is_dir():
            continue

        # Check if album already exists
        album = db.query(Album).filter(Album.folder == str(album_folder)).first()
        if not album:
            album = Album(
                title=album_folder.name,
                folder=str(album_folder),
                cover=find_cover(album_folder)
            )
            db.add(album)
            db.flush()

        for file in sorted(album_folder.iterdir()):
            if file.suffix.lower() == ".mp3":
                # Check if track already exists
                existing_track = db.query(Track).filter(Track.filename == str(file)).first()
                if not existing_track:
                    audio = MP3(file)
                    track = Track(
                        title=file.stem,
                        filename=str(file),
                        duration=int(audio.info.length),
                        album_id=album.id
                    )
                    db.add(track)

    db.commit()

def find_cover(folder):
    for f in folder.iterdir():
        if f.suffix.lower() in [".jpg", ".png"]:
            return str(f)
    return None

if __name__ == "__main__":
    from app.database import SessionLocal, engine, Base
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    print(f"🔍 Scanning music library: {MUSIC_DIR}")
    try:
        scan_music(db)
        print("✅ Scan complete!")
    except Exception as e:
        print(f"❌ Scan failed: {e}")
    finally:
        db.close()



