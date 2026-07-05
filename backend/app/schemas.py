from pydantic import BaseModel
from typing import List

class TrackOut(BaseModel):
    id: int
    title: str
    duration: int

    class Config:
        from_attributes = True

class AlbumOut(BaseModel):
    id: int
    title: str
    cover: str | None
    tracks: List[TrackOut]

    class Config:
        from_attributes = True



