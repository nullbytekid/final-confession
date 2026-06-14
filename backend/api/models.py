from django.db import models


class SiteConfig(models.Model):
    """Singleton config — always use pk=1 via load()."""

    site_password = models.CharField(
        max_length=128,
        blank=True,
        default="",
        verbose_name="Site password",
        help_text="Plain text password Kasandra uses to enter the site.",
    )
    said_yes = models.BooleanField(
        default=False,
        verbose_name="Said yes",
        help_text="Uncheck to reset — final page will show YES/NO again.",
    )
    said_yes_at = models.DateTimeField(null=True, blank=True, verbose_name="Said yes at")
    stop_courting = models.BooleanField(
        default=False,
        verbose_name="Stop courting",
        help_text="Uncheck to reset stop courting state.",
    )
    stop_courting_reason = models.TextField(
        blank=True,
        default="",
        verbose_name="Stop courting reason",
    )
    stop_courting_at = models.DateTimeField(
        null=True, blank=True, verbose_name="Stop courting at"
    )
    yes_email_sent = models.BooleanField(
        default=False,
        verbose_name="YES email sent",
        help_text="Whether the YES notification email was delivered.",
    )

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"

    def __str__(self):
        return "Confession Site Settings"

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    @property
    def password_set(self):
        return bool(self.site_password)
