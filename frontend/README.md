# Apple Music Frontend V1

React frontend for Apple Music Local Player.

## Prerequisites

- Node.js 16+ (includes npm)
- Browser (Chrome, Edge, etc.)

## Setup & Run

1. Navigate to the frontend folder:
cd frontend
2. Install dependencies:
npm install
3. Run the development server:
npm run dev
4. Open your browser at the URL provided by Vite (usually http://localhost:5173).

## Folder Structure

frontend/
├─ src/            # React components and pages
├─ public/         # Static assets
├─ package.json    # Dependencies and scripts
└─ vite.config.js  # Vite configuration

## Notes

- The frontend communicates with the backend API at /api by default.
- Place album cover images inside the corresponding music_library/ folder in the backend for them to appear correctly.


