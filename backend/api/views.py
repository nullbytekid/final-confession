from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .email_service import send_email
from .email_templates import (
    opened_email_html,
    stop_courting_kasandra_html,
    stop_courting_marlon_html,
    yes_email_html,
)
from .models import SiteConfig
from .serializers import PasswordSerializer, ResponseSerializer, StopCourtingSerializer


def _is_authenticated(request) -> bool:
    return bool(request.session.get("site_authenticated"))


@api_view(["GET"])
def site_status(request):
    config = SiteConfig.load()
    said_yes_at = config.said_yes_at.isoformat() if config.said_yes_at else None
    return Response(
        {
            "password_set": config.password_set,
            "authenticated": _is_authenticated(request),
            "said_yes": config.said_yes,
            "said_yes_at": said_yes_at,
            "stop_courting": config.stop_courting,
        }
    )


@csrf_exempt
@api_view(["POST"])
def verify_password(request):
    serializer = PasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    config = SiteConfig.load()
    if not config.password_set:
        return Response(
            {"detail": "No password configured yet."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if serializer.validated_data["password"] != config.site_password:
        return Response(
            {"detail": "Incorrect password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    request.session["site_authenticated"] = True
    return Response({"status": "ok"})


@csrf_exempt
@api_view(["POST"])
def set_password(request):
    serializer = PasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    config = SiteConfig.load()
    if not config.said_yes:
        return Response(
            {"detail": "You must say yes first."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if config.password_set:
        return Response(
            {"detail": "Password already set."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    config.site_password = serializer.validated_data["password"]
    config.save()
    request.session["site_authenticated"] = True
    return Response({"status": "ok"})


@csrf_exempt
@api_view(["POST"])
def opened(request):
    send_email(
        "💌 Envelope Opened",
        opened_email_html(),
        to_email=settings.MARLON_EMAIL,
    )
    return Response({"status": "ok"}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
def respond(request):
    serializer = ResponseSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    config = SiteConfig.load()

    if config.said_yes and config.yes_email_sent:
        return Response(
            {
                "status": "ok",
                "needs_password": not config.password_set,
                "already": True,
            },
            status=status.HTTP_200_OK,
        )

    first_time = not config.said_yes
    if first_time:
        config.said_yes = True
        config.said_yes_at = timezone.now()
        config.save()

    sent = send_email(
        "💖 Kasandra said YESSSS!!!",
        yes_email_html(),
        text_content="Kasandra said YESSSS!!!",
        to_email=settings.MARLON_EMAIL,
    )

    if not sent:
        if first_time:
            config.said_yes = False
            config.said_yes_at = None
            config.save()
        return Response(
            {"detail": "Email could not be sent. Check Brevo settings and try again."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    config.yes_email_sent = True
    config.save(update_fields=["yes_email_sent"])

    return Response(
        {"status": "ok", "needs_password": not config.password_set},
        status=status.HTTP_200_OK,
    )


@csrf_exempt
@api_view(["POST"])
def stop_courting(request):
    serializer = StopCourtingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    config = SiteConfig.load()
    if not config.said_yes:
        return Response(
            {"detail": "Must say yes first."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    reason = serializer.validated_data["reason"]
    config.stop_courting = True
    config.stop_courting_reason = reason
    config.stop_courting_at = timezone.now()
    config.save()

    send_email(
        "💔 Kasandra said stop courting",
        stop_courting_marlon_html(reason),
        text_content=f"Kasandra said stop courting her because of the reason: {reason}",
        to_email=settings.MARLON_EMAIL,
    )
    send_email(
        "💔 You let Marlon stopped courting you",
        stop_courting_kasandra_html(reason),
        text_content=f"You let marlon stop courting you because of the reason: {reason}",
        to_email=settings.KASANDRA_EMAIL,
    )

    return Response({"status": "ok"}, status=status.HTTP_200_OK)
