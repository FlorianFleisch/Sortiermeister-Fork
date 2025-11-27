# Sortiermeister Frontend Dev Setup

## Start

1. Backend starten (ASP.NET Core)
   - In Visual Studio / Docker starten
   - Stelle sicher, dass CORS `http://localhost:3000` erlaubt
   - Standard-API-Basis: `http://localhost:5000/api` (siehe `Program.cs` + Container-Port)

2. Frontend starten (Next.js)
   - Terminal:
     - `cd web`
     - `npm install`
     - `.env.local` anlegen und Backend-URL setzen:
       
       ```env
       NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/player
       ```
       
       (Oder nutze die bestehende `next.config.js` Rewrite: Frontend fragt `/api/*` an und wird auf Backend weitergeleitet)
     - `npm run dev`
   - Browser öffnen: `http://localhost:3000`

## Hinweis
- Routen:
  - `/` leitet nach `/game`
  - `/game` zeigt das Spiel inklusive Login an
- API-Calls lesen die Basis-URL aus `NEXT_PUBLIC_API_BASE_URL` oder verwenden `/api/player` via Next.js-Rewrite.
- Beide Dienste (Backend + Frontend) müssen parallel laufen.
