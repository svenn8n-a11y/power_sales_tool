# 🎓 Pöppel Sales Academy (App)

Die Trainings-Plattform für B2B-Vertrieb (Workwear).
Gamifiziertes Einwandbehandlungs-Training mit DISG-Persönlichkeitsanalysen.

## 🚀 Features

### 1. Training (Dashboard)
*   **4 Level:** Aufgeteilt nach Schwierigkeit und Phase (P001-P128).
    1.  **Typ erkennen (Awareness):** Wer spricht da? (D/I/S/G)
    2.  **Einstieg & Pitch:** Der perfekte erste Eindruck.
    3.  **Einwandbehandlung:** Die Königsdisziplin.
    4.  **Closing:** Abschluss-Techniken.
*   **Fortschritt:** Tracking pro Lektion (Balken, Punkte, Sterne).

### 2. Interaktive Lektionen
*   **Quiz-Modus:** 4 Antwortmöglichkeiten (1 richtig, 3 falsch).
*   **DISG-Logik:** Antworten basieren auf dem Persönlichkeitstyp.
*   **Deep Content:** Psychologische Analyse & Frameworks (nach Erfolg freigeschaltet).
*   **Gamification:** Konfetti & "Winner Screen" bei Abschluss.

### 3. Admin & Content
*   **Import:** Automatisierter Import von Markdown-Lektionen (Upsert).
*   **Database:** Supabase (PostgreSQL) für User, Progress und Lessons.

## 💻 Tech Stack
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Database:** Supabase
*   **Icons:** Lucide React

## 🛠️ Setup & Run

1.  **Install:**
    ```bash
    npm install
    ```

2.  **Dev Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

## 📂 Struktur
*   `src/app/dashboard/training`: Haupt-Ansicht (Level-Übersicht).
*   `src/app/dashboard/training/[lessonId]`: Einzelne Lektion (Interactive).
*   `scripts/`: Import & Utility Skripte (Node.js).

## 📝 Wichtige SQL Skripte
*   `16_fix_levels.sql`: Ordnet Lektionen den 4 Levels zu.
*   `15_progress_tracking.sql`: Aktiviert Tracking (Punkte/Typen).
