# Sortiermeister - Spieler- und Ranglisten-System

## ?? Überblick

Das Sortiermeister-Projekt wurde um ein vollständiges Spieler- und Ranglisten-System erweitert, das speziell für den Tag der offenen Tür konzipiert wurde.

## ? Neue Features

### 1. **Einfaches Spieler-Login-System**
- Kinder melden sich mit ihrem Namen an (kein Passwort erforderlich)
- Bei erstmaliger Anmeldung wird automatisch ein neuer Spieler angelegt
- Bei wiederholter Anmeldung wird der bestehende Account geladen
- Auswahl von Sortieralgorithmus und Schwierigkeitsgrad beim Login

### 2. **Session-basierte Authentifizierung**
- Cookie-basierte Sessions für jeden Browser/Client
- Session bleibt 2 Stunden aktiv
- Abmelden-Button löscht die Session für das nächste Kind

### 3. **Spielergebnisse speichern**
- Jedes Spielergebnis wird in der Datenbank gespeichert
- Speichert: Spieler, Algorithmus, Schwierigkeit, Zeit in ms, Gewonnen/Verloren
- Automatische Verknüpfung mit dem angemeldeten Spieler

### 4. **Rangliste / Leaderboard**
- Top 10 Spieler basierend auf ihrer besten Zeit
- Zeigt pro Spieler nur die beste Leistung
- Anzeige von: Platz, Name, beste Zeit, Schwierigkeit
- Button im Spiel zum Anzeigen der Rangliste

### 5. **Mehrere Clients gleichzeitig**
- Server läuft zentral auf Linux
- Jeder Client (Browser) hat seine eigene Session
- Alle sehen die gleiche globale Rangliste
- SQLite-Datenbank für zuverlässige Persistierung

## ??? Architektur

### Backend (ASP.NET Core 8)

#### Modelle
- **Player** (`Models/Player.cs`)
  - Id, Name (eindeutig), CreatedAt, LastLogin
  - Navigation zu GameResults

- **GameResult** (`Models/GameResult.cs`)
  - Id, PlayerId, Algorithm, Difficulty, TimeInMs, Won, CreatedAt
  - Fremdschlüssel zu Player

#### Datenbank
- **GameDbContext** (`Data/GameDbContext.cs`)
  - EF Core mit SQLite
  - Datenbank: `sortiermeister.db`
  - Automatische Erstellung beim Start

#### API-Endpoints (`Controllers/PlayerController.cs`)

**POST /api/player/login**
```json
Request: { "name": "Max", "algorithm": "InsertionSort", "difficulty": "Medium" }
Response: { "playerId": 1, "name": "Max", "isNewPlayer": false }
```

**POST /api/player/logout**
- Löscht die Session

**GET /api/player/current**
```json
Response: { "name": "Max", "totalGames": 5, "gamesWon": 3, "bestTimeInMs": 12450 }
```

**POST /api/player/result**
```json
Request: { "timeInMs": 15230, "won": true }
Response: { "message": "Ergebnis gespeichert", "resultId": 42 }
```

**GET /api/player/leaderboard?todayOnly=false**
```json
Response: [
  { "rank": 1, "playerName": "Anna", "bestTimeInMs": 8500, "difficulty": "Hard", ... }
]
```

### Frontend (HTML/CSS/JavaScript)

#### Login-Flow
1. Startseite zeigt Login-Dialog
2. Eingabe: Name, Algorithmus, Schwierigkeitsgrad
3. Klick auf "Spiel starten" ? Login-Request
4. Bei Erfolg: Spiel wird angezeigt

#### Spiel-UI
- Oben rechts: Spielername + Abmelden-Button + Rangliste-Button
- Spiel läuft wie bisher
- Am Ende: Ergebnis wird automatisch gespeichert

#### Leaderboard
- Modal-Dialog mit Top 10
- Tabelle: Platz, Name, Zeit, Schwierigkeit

## ?? Installation & Start

### Voraussetzungen
- .NET 8 SDK
- Linux-Server (oder Windows/macOS für Development)

### Schritte

1. **Projekt klonen** (falls noch nicht geschehen)
```bash
git clone <repository-url>
cd Fork/RestAPI
```

2. **Dependencies installieren**
```bash
dotnet restore
```

3. **Anwendung starten**
```bash
dotnet run
```

4. **Browser öffnen**
```
http://localhost:5000/sites/index.html
```

### Für Production (Linux-Server)

1. **Veröffentlichen**
```bash
dotnet publish -c Release -o ./publish
```

2. **Auf Server deployen**
```bash
scp -r ./publish user@server:/path/to/app
```

3. **Auf Server starten**
```bash
cd /path/to/app
dotnet RestAPI.dll
```

4. **Optional: Als Service einrichten** (systemd)
```bash
sudo nano /etc/systemd/system/sortiermeister.service
```
```ini
[Unit]
Description=Sortiermeister Game

[Service]
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/dotnet /path/to/app/RestAPI.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=sortiermeister
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl enable sortiermeister
sudo systemctl start sortiermeister
```

## ?? Datenbank

Die SQLite-Datenbank `sortiermeister.db` wird automatisch beim ersten Start erstellt.

### Schema

**Players**
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| Id | int | Primary Key |
| Name | string | Eindeutig, nicht null |
| CreatedAt | DateTime | Zeitpunkt der Registrierung |
| LastLogin | DateTime | Letzter Login |

**GameResults**
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| Id | int | Primary Key |
| PlayerId | int | Foreign Key zu Players |
| Algorithm | string | z.B. "InsertionSort" |
| Difficulty | string | Easy/Medium/Hard/SuperHard |
| TimeInMs | int | Zeit in Millisekunden |
| Won | bool | true = Spieler hat gewonnen |
| CreatedAt | DateTime | Zeitpunkt des Spiels |

### Datenbank zurücksetzen
```bash
rm sortiermeister.db
dotnet run  # Datenbank wird neu erstellt
```

## ?? Workflow am Tag der offenen Tür

1. **Kind kommt herein**
   - Öffnet Browser auf einem der Laptops
   - Gibt seinen Namen ein
   - Wählt Schwierigkeit
   - Klickt auf "Spiel starten"

2. **Kind spielt**
   - Kann beliebig viele Versuche machen
   - Jeder Versuch wird gespeichert
   - Nur die beste Zeit zählt für die Rangliste

3. **Kind schaut Rangliste an**
   - Klick auf "Rangliste"-Button
   - Sieht Top 10 aller Spieler

4. **Kind meldet sich ab**
   - Klick auf "Abmelden"
   - Nächstes Kind kann sich anmelden

5. **Nächstes Kind**
   - Gleicher Prozess
   - Eigener Account / eigene Session
   - Gleiche globale Rangliste

## ?? Konfiguration

### Session-Timeout ändern
In `Program.cs`:
```csharp
options.IdleTimeout = TimeSpan.FromHours(2); // Ändern auf gewünschte Zeit
```

### Anzahl Einträge in Rangliste
In `PlayerController.cs`, Methode `GetLeaderboard`:
```csharp
.Take(10) // Ändern auf gewünschte Anzahl
```

### Schwierigkeitsgrade
In `index.html` und `index.js` können weitere Schwierigkeitsgrade hinzugefügt werden.

## ?? Troubleshooting

### Session funktioniert nicht
- Prüfe, ob Browser Cookies akzeptiert
- Prüfe CORS-Einstellungen in `Program.cs`

### Datenbank-Fehler
- Stelle sicher, dass Schreibrechte für `sortiermeister.db` existieren
- Lösche DB und starte neu: `rm sortiermeister.db && dotnet run`

### Rangliste lädt nicht
- Prüfe Browser-Konsole (F12) auf Fehler
- Prüfe, ob API erreichbar ist: `curl http://localhost:5000/api/player/leaderboard`

## ?? Änderungen gegenüber Original

### Neue Dateien
- `Models/Player.cs`
- `Models/GameResult.cs`
- `Data/GameDbContext.cs`
- `DTOs/GameDTOs.cs`
- `Controllers/PlayerController.cs`

### Geänderte Dateien
- `Program.cs` - Session & DbContext konfiguriert
- `wwwroot/sites/index.html` - Login-Dialog & Rangliste hinzugefügt
- `wwwroot/scripts/index.js` - API-Integration & Login-Flow

### Neue Packages
- Microsoft.EntityFrameworkCore.Sqlite (8.0.11)
- Microsoft.EntityFrameworkCore.Design (8.0.11)

## ?? Anpassungen

### Design ändern
Alle Styles in `wwwroot/styles/style.css`

### Weitere Sortieralgorithmen hinzufügen
1. In `index.html`: Option zu `<select id="algorithmSelect">` hinzufügen
2. Logik bereits im Backend vorhanden (wird automatisch gespeichert)

### Statistiken erweitern
In `PlayerController.cs` können weitere Statistiken berechnet werden (z.B. Durchschnittszeit, Win-Rate)

## ?? Credits

Entwickelt für den Tag der offenen Tür der HTL Dornbirn ??
