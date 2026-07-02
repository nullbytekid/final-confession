from django.contrib import admin
from django.urls import include, path, re_path

from api import frontend_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    re_path(
        r"^_next/(?P<path>.*)$",
        frontend_views.serve_frontend_asset,
        name="frontend_next",
    ),
    re_path(
        r"^(?!(?:admin|api)(?:/|$))(?P<path>.*)$",
        frontend_views.serve_frontend_page,
        name="frontend",
    ),
]
