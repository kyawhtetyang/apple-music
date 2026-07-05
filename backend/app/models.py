from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    folder = Column(String)
    cover = Column(String)

    tracks = relationship("Track", back_populates="album", cascade="all, delete")

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    filename = Column(String)
    duration = Column(Integer)

    album_id = Column(Integer, ForeignKey("albums.id"))
    album = relationship("Album", back_populates="tracks")



