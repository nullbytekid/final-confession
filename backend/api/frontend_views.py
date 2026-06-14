import mimetypes
import os

from django.conf import settings
from django.http import FileResponse, Http404


def _frontend_root():
    return settings.FRONTEND_DIST


def _safe_path(*parts):
    root = os.path.abspath(_frontend_root())
    target = os.path.abspath(os.path.join(root, *parts))
    if not target.startswith(root):
        raise Http404("Invalid path")
    return target


def serve_frontend_asset(request, path):
    """Serve Next.js static assets (_next/static/...)."""
    file_path = _safe_path("_next", path)
    if not os.path.isfile(file_path):
        raise Http404("Asset not found")

    content_type, _ = mimetypes.guess_type(file_path)
    return FileResponse(open(file_path, "rb"), content_type=content_type or "application/octet-stream")


def serve_frontend_page(request, path=""):
    """Serve exported Next.js HTML pages."""
    path = path.strip("/")

    if path:
        direct = _safe_path(path)
        if os.path.isfile(direct):
            content_type, _ = mimetypes.guess_type(direct)
            return FileResponse(
                open(direct, "rb"),
                content_type=content_type or "application/octet-stream",
            )

        candidates = [
            _safe_path(path, "index.html"),
            _safe_path(f"{path}.html"),
        ]
    else:
        candidates = [_safe_path("index.html")]

    for candidate in candidates:
        if os.path.isfile(candidate):
            return FileResponse(open(candidate, "rb"), content_type="text/html; charset=utf-8")

    # SPA fallback for client-side routes
    index_path = _safe_path("index.html")
    if os.path.isfile(index_path):
        return FileResponse(open(index_path, "rb"), content_type="text/html; charset=utf-8")

    raise Http404("Frontend not built. Run scripts/build_frontend.ps1 first.")
