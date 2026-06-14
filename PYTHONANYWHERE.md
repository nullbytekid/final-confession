# Deploy to PythonAnywhere

Single Django app serves **both** the API and the Next.js frontend.

---

## 1. Upload project

Upload the `final/` folder to PythonAnywhere, e.g.:

```
/home/yourusername/confession/
├── backend/
├── frontend/
└── scripts/
```

Or clone from Git if you use a repo.

---

## 2. Create virtualenv & install deps

In a **Bash console** on PythonAnywhere:

```bash
cd ~/confession/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 3. Build frontend into Django

Requires **Node.js** on PythonAnywhere (available on paid plans; on free tier build locally and upload `backend/frontend_dist/`).

```bash
cd ~/confession
chmod +x scripts/build_frontend.sh
./scripts/build_frontend.sh
```

Or build on your PC and upload the `backend/frontend_dist/` folder.

---

## 4. Configure environment

Create `backend/.env`:

```env
DJANGO_SECRET_KEY=long-random-secret-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourusername.pythonanywhere.com
CSRF_TRUSTED_ORIGINS=https://yourusername.pythonanywhere.com

BREVO_API_KEY=xkeysib-your-key
BREVO_SENDER_EMAIL=marlontk1221@gmail.com
BREVO_RECIPIENT_EMAIL=marlontk1221@gmail.com
MARLON_EMAIL=marlontk1221@gmail.com
KASANDRA_EMAIL=kasandracristinabeleganilao@gmail.com
```

---

## 5. Django setup

```bash
cd ~/confession/backend
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

---

## 6. Configure Web app (WSGI)

In PythonAnywhere **Web** tab:

**Source code:** `/home/yourusername/confession/backend`

**WSGI file** — replace contents with:

```python
import os
import sys

path = '/home/yourusername/confession/backend'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'confession_project.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Note:** `settings.py` loads `backend/.env` by absolute path. If you still see `Invalid HTTP_HOST` before pulling the latest code, add this line in the WSGI file *before* `get_wsgi_application()`:

```python
os.environ.setdefault('DJANGO_ALLOWED_HOSTS', 'yourusername.pythonanywhere.com')
```

**Virtualenv:** `/home/yourusername/confession/backend/venv`

Click **Reload** after changes.

---

## 7. Static files (optional)

Django serves the frontend from `frontend_dist/` via views.  
For admin CSS, map **Static files**:

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/yourusername/confession/backend/staticfiles/` |

Run `collectstatic` after deploy.

---

## 8. Verify

Visit:

- `https://yourusername.pythonanywhere.com/` — landing page
- `https://yourusername.pythonanywhere.com/confession/` — confession
- `https://yourusername.pythonanywhere.com/final/` — final page
- `https://yourusername.pythonanywhere.com/admin/` — Django admin
- `https://yourusername.pythonanywhere.com/api/status/` — API

---

## Local test (same as production)

```powershell
# From project root
.\scripts\build_frontend.ps1

cd backend
.\venv\Scripts\pip install -r requirements.txt
.\venv\Scripts\python manage.py runserver
```

Open **http://127.0.0.1:8000/** — frontend + API on one server.

---

## Frontend dev (optional)

For hot reload during development, still use Next.js dev server:

```powershell
cd frontend/confession
copy .env.local.example .env.local
npm run dev
```

`.env.local` sets `NEXT_PUBLIC_API_URL=http://localhost:8000`.

Before deploying, run `build_frontend` again so API calls use same-origin `/api/`.
