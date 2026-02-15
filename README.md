# 🥋 Sales Dojo (Power Sales Tool)

**The ultimate interactive sales training platform.**  
*Adapts to your personality (DISG) and learning style (VARK).*

---

## 🎯 Project Goal
Traditional sales training is static (PDFs, Videos). **Sales Dojo** makes it dynamic.  
Our goal is to transform "passive knowledge" into "active skill" by simulating real-world sales conversations.

The system understands who you are (e.g., a "Dominant" learner who learns by doing) and tailors the content accordingly.

## ✨ Key Features

### 1. 🧠 Smart Onboarding (Psychographics)
- **Problem:** Needs assessment is often skipped.
- **Solution:** A 12-question assessment classifies the user into:
    - **VARK:** Visual, Auditory, Read/Write, Kinesthetic.
    - **DISG:** Dominant, Initiative, Steady, Conscientious.

### 2. 🥋 Interactive Dojo (The Core)
- **Simulations:** Users face tough objections (e.g., "Too Expensive").
- **Neutral Design:** No "green/red" buttons to hint at answers. You have to *know* the answer.
- **Adaptive Feedback:** 
    - A "Dominant" user gets short, direct feedback ("Too soft. Lose the apology.").
    - A "Steady" user gets encouraging guidance ("Good attempt, but try to build more rapport first.").

### 3. 📊 Dashboard & Progress
- **Personalized:** Shows content relevant to your profile.
- **Tracking:** Saves scores, attempts, and completion status in Supabase.

---

## 🛠 Tech Stack

We use a modern, robust stack designed for speed and scalability.

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | [Next.js 14](https://nextjs.org/) | App Router, Server Components, React SC. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, Dark Mode support. |
| **Backend** | [Supabase](https://supabase.com/) | PostgreSQL, Auth, Row Level Security. |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icons. |
| **Ingestion** | Python | Automated script to import Markdown content. |

---

## 🚀 Getting Started (For Developers)

Follow these steps to get the "Dojo" running on your machine.

### 1. Clone the Repo
```bash
git clone https://github.com/svenn8n-a11y/power_sales_tool.git
cd power_sales_tool
```

### 2. Install Dependencies (App)
The main application lives in `Academy/App`.

```bash
cd Academy/App
npm install
```

### 3. Environment Setup
Create a `.env.local` file in `Academy/App`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Optional: For admin scripts
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 4. Database Setup
The database schema (`public.lessons`, `public.user_progress`) needs to be created.
See [ACADEMY_ARCHITECTURE.md](./ACADEMY_ARCHITECTURE.md) for the full SQL setup commands.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📚 Further Documentation

- **[Architecture & Schema](./ACADEMY_ARCHITECTURE.md):** Deep dive into the database relations and adaptive logic.
- **[Content Ingestion](./scripts/ingest_lessons.py):** How we import markdown files into the App.

---

*Built with ❤️ (and AI) for Sales Excellence.*
