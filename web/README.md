# Next.js Sortiermeister

Next.js Frontend für das Sortiermeister-Spiel.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Projektstruktur

```
web/
??? src/
?   ??? app/              # Next.js App Router Pages
?   ?   ??? layout.tsx    # Root Layout
?   ?   ??? page.tsx      # Home (redirect)
?   ?   ??? game/
?   ?       ??? page.tsx  # Haupt-Spielseite
?   ??? components/       # React Komponenten
?   ?   ??? LoginForm.tsx
?   ?   ??? PlayerInfo.tsx
?   ?   ??? SortingBox.tsx
?   ?   ??? GameResultModal.tsx
?   ?   ??? Leaderboard.tsx
?   ??? hooks/            # Custom React Hooks
?   ?   ??? useGameState.ts
?   ??? services/         # API Services
?   ?   ??? api.ts
?   ??? types/            # TypeScript Typen
?   ?   ??? index.ts
?   ??? utils/            # Utilities
?       ??? colors.ts
?       ??? sorting.ts
??? public/
?   ??? scripts/          # Legacy JS (optional)
?   ??? styles/           # CSS
??? package.json
```

## Features

- ? Vollständig in React/TypeScript umgesetzt
- ? Component-basierte Architektur
- ? Type-Safe API-Kommunikation
- ? Custom Hooks für Game State
- ? Wiederverwendbare UI-Komponenten
- ? Server-Side Rendering (SSR) ready

## Backend

Das .NET Backend muss auf Port 5000 laufen:

```bash
cd ../RestAPI
dotnet run
```
