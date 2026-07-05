from sqlalchemy.orm import Session
from app.models import Album

def get_albums(db: Session):
    return db.query(Album).all()

def get_album(db: Session, album_id: int):
    return db.query(Album).filter(Album.id == album_id).first()



