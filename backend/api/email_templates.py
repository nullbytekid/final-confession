"""HTML email templates for Brevo."""

BASE_STYLE = """
body { margin:0; padding:0; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; }
.wrapper { max-width:560px; margin:0 auto; padding:24px 16px; }
.card { border-radius:20px; overflow:hidden; box-shadow:0 8px 32px rgba(255,105,180,0.25); }
.header { background:linear-gradient(135deg,#ff6b9d,#c44569); padding:32px 24px; text-align:center; }
.header h1 { color:#fff; margin:0; font-size:28px; text-shadow:0 2px 8px rgba(0,0,0,0.15); }
.body { background:#fff5f8; padding:32px 28px; text-align:center; }
.body p { color:#5c3d4e; font-size:18px; line-height:1.7; margin:0 0 16px; }
.highlight { color:#c44569; font-weight:700; font-size:22px; }
.emoji { font-size:48px; display:block; margin-bottom:16px; }
.footer { background:#ffe4ec; padding:16px; text-align:center; font-size:12px; color:#a07080; }
.reason-box { background:#fff; border:2px dashed #ffb6c9; border-radius:12px; padding:20px; margin:20px 0; text-align:left; }
.reason-box p { font-style:italic; color:#8b4563; }
"""


def _wrap(header: str, body_html: str) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>{BASE_STYLE}</style></head>
<body>
<div class="wrapper"><div class="card">
  <div class="header"><h1>{header}</h1></div>
  <div class="body">{body_html}</div>
  <div class="footer">Made with 💖 · MMDT love confession website for KCB</div>
</div></div>
</body></html>"""


def yes_email_html() -> str:
    return _wrap(
        "💖 Kasandra said YESSSS!!!",
        """
        <span class="emoji">💕✨💕</span>
        <p class="highlight">Kasandra said YESSSS!!!</p>
        <p>She clicked YES on your confession website.<br>Your heart did the right thing. 💌</p>
        """,
    )


def stop_courting_marlon_html(reason: str) -> str:
    safe_reason = reason.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return _wrap(
        "💔 Stop Courting",
        f"""
        <span class="emoji">💔</span>
        <p>Kasandra said <span class="highlight">stop courting her</span> because of the reason:</p>
        <div class="reason-box"><p>"{safe_reason}"</p></div>
        """,
    )


def stop_courting_kasandra_html(reason: str) -> str:
    safe_reason = reason.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return _wrap(
        "💔 You stopped courting",
        f"""
        <span class="emoji">🌸</span>
        <p>You let Marlon stop courting you because of the reason:</p>
        <div class="reason-box"><p>"{safe_reason}"</p></div>
        <p>Take care of yourself, Kasandra. 💌</p>
        """,
    )


def opened_email_html() -> str:
    return _wrap(
        "💌 Envelope Opened",
        """
        <span class="emoji">💌</span>
        <p>Someone opened your confession page!</p>
        <p>The journey has begun... ✨</p>
        """,
    )


def _escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def wheresa_wellness_email_html(message: str) -> str:
    safe_message = _escape(message)
    return _wrap(
        "💕 Kasandra's wellness check-in",
        f"""
        <span class="emoji">🥺💕</span>
        <p>Kasandra answered on <span class="highlight">"My dearest Kasandra..."</span></p>
        <div class="reason-box"><p>"{safe_message}"</p></div>
        <p>She shared how she's doing — take a moment to read her words. 💌</p>
        """,
    )


def wheresa_date_confirm_email_html(message: str) -> str:
    safe_message = _escape(message)
    return _wrap(
        "💖 Kasandra said YES to Claveria!",
        f"""
        <span class="emoji">🗺️💕</span>
        <p>Kasandra said <span class="highlight">YES</span> to your date invite!</p>
        <p><strong>WHO:</strong> MARLON AND KASANDRA<br>
        <strong>WHERE:</strong> PROVINCE OF CLAVERIA<br>
        <strong>WHEN:</strong> Saturday, June 4, 2026 at 2:00 PM</p>
        <p>Her message to you:</p>
        <div class="reason-box"><p>"{safe_message}"</p></div>
        """,
    )
