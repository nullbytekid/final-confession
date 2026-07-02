from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path("status/", views.site_status, name="site_status"),
    path("verify-password/", csrf_exempt(views.verify_password), name="verify_password"),
    path("set-password/", csrf_exempt(views.set_password), name="set_password"),
    path("opened/", csrf_exempt(views.opened), name="opened"),
    path("respond/", csrf_exempt(views.respond), name="respond"),
    path("stop-courting/", csrf_exempt(views.stop_courting), name="stop_courting"),
    path("wheresa/wellness/", views.wheresa_wellness, name="wheresa_wellness"),
    path("wheresa/date-confirm/", views.wheresa_date_confirm, name="wheresa_date_confirm"),
]
