# Apple Music Backend V1

FastAPI backend for Apple Music Local Player.

## Prerequisites

- Python 3.9+
- pip
- PostgreSQL (optional, defaults to SQLite)

## Setup & Run

1. Create and activate a Conda environment (recommended):
conda create -n fk python=3.10
conda activate fk

2. Install dependencies:
pip install -r requirements.txt

3. Run the backend server:
uvicorn app.main:app --reload

## Music Library

- Place your MP3 files in the `music_library/` directory. Each subfolder is treated as an album.
- Example:
music_library/
  Pink Floyd - The Dark Side of the Moon/
    01 - Speak to Me.mp3
    cover.jpg
- The backend scans the library on startup and extracts metadata for the frontend.

## Folder Structure

backend/
├─ app/           # FastAPI application code
├─ music_library/ # Your MP3 files
├─ requirements.txt
└─ main.py / uvicorn entry point

## Notes

- The backend serves API endpoints that the frontend consumes.
- Ensure the backend is running before starting the frontend.


