# 🥋 Sales Academy Documentation

Technical architecture and database schema for the adaptive learning platform.

## 🏗 System Architecture

- **Frontend:** Next.js 14 (App Router)
- **Backend/Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Lucide Icons
- **Auth:** Supabase Auth (SSR + Client)

---

## 💾 Database Schema

### 1. Profiles (`public.profiles`)
Stores user data and psychometric profiles (VARK/DISG).

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  vark_primary varchar(10), -- 'V', 'A', 'R', 'K'
  vark_scores jsonb,        -- { "V": 5, "A": 2, ... }
  disg_primary varchar(10), -- 'D', 'I', 'S', 'G'
  disg_scores jsonb,        -- { "D": 8, "I": 3, ... }
  created_at timestamptz default now()
);
-- RLS: Users can view/edit own profile.
```

### 2. User Progress (`public.user_progress`)
Tracks learning achievements per lesson.

```sql
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  lesson_id text not null,       -- e.g., '1', 'risiko-zu-hoch'
  score integer default 0,       -- 0-100
  completed boolean default false,
  attempts integer default 0,
  last_attempt_at timestamptz default now(),
  unique(user_id, lesson_id)
);
-- RLS: Users can view/edit own progress.
```

### 3. Lessons (`public.lessons`)
Stores content for dynamic lessons.

```sql
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,     -- URL-friendly ID
  title text not null,
  category text,                 -- 'Einwandbehandlung', 'Closing', etc.
  content_markdown text,         -- Raw Markdown content
  meta_json jsonb,               -- Metadata
  vark_content jsonb,            -- JSON with specific content per type
  disg_matrix jsonb,             -- JSON with DISG-specific responses
  created_at timestamptz default now()
);
-- RLS: Publicly readable (authenticated or anon).
```

---

## 🧠 Adaptive Logic

### VARK (Learning Style)
- **V (Visual):** Displays videos/diagrams via VideoComponent.
- **A (Auditory):** Displays audio player/transcripts.
- **R (Read/Write):** Displays detailed text/guides.
- **K (Kinesthetic):** Displays interactive simulations (`LessonInteractive`).

### DISG (Personality)
- **D (Dominant):** Short, results-oriented text (Bullet points).
- **I (Influential):** Storytelling, social proof.
- **S (Steady):** Trust-building, step-by-step guides.
- **G (Conscientious):** Data, facts, ROI calculations.

---

## 🛠 Setup Commands

Run these in Supabase SQL Editor to initialize:

```sql
-- 1. Profiles updates
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS disg_primary varchar(20);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS disg_scores jsonb;

-- 2. Create User Progress
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  lesson_id text not null,
  score integer default 0,
  completed boolean default false,
  attempts integer default 0,
  last_attempt_at timestamptz default now(),
  unique(user_id, lesson_id)
);
alter table public.user_progress enable row level security;
create policy "Users can view own progress." on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress." on public.user_progress for all using (auth.uid() = user_id);

-- 3. Create Lessons Table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  category text, 
  content_markdown text,
  meta_json jsonb,
  vark_content jsonb,
  disg_matrix jsonb,
  created_at timestamptz default now()
);
alter table public.lessons enable row level security;
create policy "Public lessons are viewable by everyone." on public.lessons for select using (true);
```
