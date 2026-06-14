# Love Confession Website 💖

Full-stack romantic confession site — Next.js frontend served by Django (one deploy for PythonAnywhere).

## Project Structure

```
final/
├── frontend/confession/   # Next.js source (build → backend/frontend_dist/)
├── backend/               # Django API + serves frontend
├── scripts/               # build_frontend.ps1 / .sh
└── PYTHONANYWHERE.md      # Deployment guide
```

## Quick start (production-like, one server)

```powershell
# 1. Build frontend into Django
.\scripts\build_frontend.ps1

# 2. Backend
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # edit with Brevo keys
python manage.py migrate
python manage.py runserver
```

Open **http://127.0.0.1:8000/** — frontend + API together.

---

## Frontend dev (optional hot reload)

```powershell
cd frontend/confession
copy .env.local.example .env.local
npm install
npm run dev
```

Runs at **http://localhost:3000** → API at **http://localhost:8000**

Re-run `build_frontend` before deploying.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — envelope, music, heart burst |
| `/confession/` | Step-by-step confession |
| `/final/` | Neon "MAY I COURT YOU?" + YES flow |

---

## Deploy to PythonAnywhere

See **[PYTHONANYWHERE.md](./PYTHONANYWHERE.md)** for full steps.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DJANGO_SECRET_KEY` | Random secret |
| `DJANGO_DEBUG` | `False` in production |
| `DJANGO_ALLOWED_HOSTS` | `yourusername.pythonanywhere.com` |
| `CSRF_TRUSTED_ORIGINS` | `https://yourusername.pythonanywhere.com` |
| `BREVO_API_KEY` | Brevo API key (`xkeysib-...`) |
| `BREVO_SENDER_EMAIL` | Verified sender |
| `MARLON_EMAIL` / `KASANDRA_EMAIL` | Notification recipients |

### Frontend dev only (`frontend/confession/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |

Production build uses same-origin `/api/` (no env needed).
