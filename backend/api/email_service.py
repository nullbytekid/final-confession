import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_email(
    subject: str,
    html_content: str,
    *,
    text_content: str | None = None,
    to_email: str | None = None,
) -> bool:
    """Send a styled HTML email via the Brevo API."""
    api_key = settings.BREVO_API_KEY
    sender_email = settings.BREVO_SENDER_EMAIL
    recipient = to_email or settings.BREVO_RECIPIENT_EMAIL

    if not all([api_key, sender_email, recipient]):
        logger.warning("Brevo credentials missing — email not sent.")
        return False

    if api_key.startswith("xsmtpsib-"):
        logger.error(
            "BREVO_API_KEY is an SMTP key (xsmtpsib-). "
            "Create an API key (xkeysib-) in Brevo → SMTP & API → API Keys."
        )
        return False

    payload = {
        "sender": {"name": "Love Confession", "email": sender_email},
        "to": [{"email": recipient}],
        "subject": subject,
        "htmlContent": html_content,
        "textContent": text_content or _strip_html(html_content),
    }

    try:
        response = requests.post(
            BREVO_API_URL,
            headers={
                "api-key": api_key,
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        return True
    except requests.HTTPError as exc:
        body = ""
        if exc.response is not None:
            body = exc.response.text
        logger.error("Brevo email failed: %s — %s", exc, body)
        return False
    except requests.RequestException as exc:
        logger.error("Brevo email failed: %s", exc)
        return False


def _strip_html(html: str) -> str:
    import re

    text = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", text).strip()
