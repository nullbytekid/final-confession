from django.conf import settings
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone

from .email_service import send_email
from .email_templates import yes_email_html
from .models import SiteConfig


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "said_yes",
        "yes_email_sent",
        "site_password",
        "stop_courting",
        "said_yes_at",
    )

    fieldsets = (
        (
            "Confession status",
            {
                "fields": (
                    "said_yes",
                    "said_yes_at",
                    "yes_email_sent",
                    "stop_courting",
                    "stop_courting_reason",
                    "stop_courting_at",
                ),
            },
        ),
        (
            "Site password",
            {
                "fields": ("site_password",),
                "description": (
                    "Set or change the password here. Stored as plain text so you "
                    "can always see it. Leave empty to disable the login gate."
                ),
            },
        ),
    )

    readonly_fields = ("said_yes_at", "stop_courting_at", "yes_email_sent")

    actions = ["reset_confession_flow", "reset_everything", "resend_yes_email"]

    def save_model(self, request, obj, form, change):
        if not obj.said_yes:
            obj.said_yes_at = None
            obj.yes_email_sent = False
        elif obj.said_yes and not obj.said_yes_at:
            obj.said_yes_at = timezone.now()

        if not obj.stop_courting:
            obj.stop_courting_reason = ""
            obj.stop_courting_at = None
        elif obj.stop_courting and not obj.stop_courting_at:
            obj.stop_courting_at = timezone.now()

        super().save_model(request, obj, form, change)

    @admin.action(description="Reset confession (YES + stop courting, keep password)")
    def reset_confession_flow(self, request, queryset):
        for obj in queryset:
            obj.said_yes = False
            obj.said_yes_at = None
            obj.stop_courting = False
            obj.stop_courting_reason = ""
            obj.stop_courting_at = None
            obj.yes_email_sent = False
            obj.save(update_fields=[
                "said_yes", "said_yes_at", "stop_courting",
                "stop_courting_reason", "stop_courting_at", "yes_email_sent",
            ])
        self.message_user(request, "Confession flow reset. YES/NO will show again.")

    @admin.action(description="Reset everything (confession + clear password)")
    def reset_everything(self, request, queryset):
        for obj in queryset:
            obj.said_yes = False
            obj.said_yes_at = None
            obj.stop_courting = False
            obj.stop_courting_reason = ""
            obj.stop_courting_at = None
            obj.site_password = ""
            obj.yes_email_sent = False
            obj.save()
        self.message_user(request, "Full reset done. Site is back to the beginning.")

    @admin.action(description="Resend YES email to Marlon")
    def resend_yes_email(self, request, queryset):
        sent_any = False
        for obj in queryset:
            if not obj.said_yes:
                continue
            sent = send_email(
                "💖 Kasandra said YESSSS!!!",
                yes_email_html(),
                text_content="Kasandra said YESSSS!!!",
                to_email=settings.MARLON_EMAIL,
            )
            if sent:
                obj.yes_email_sent = True
                obj.save(update_fields=["yes_email_sent"])
                sent_any = True
        if sent_any:
            self.message_user(request, "YES email sent to Marlon.")
        else:
            self.message_user(request, "Could not send email. Check Brevo settings.", level="ERROR")

    def has_add_permission(self, request):
        return not SiteConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        SiteConfig.load()
        if SiteConfig.objects.count() == 1:
            config = SiteConfig.objects.first()
            return HttpResponseRedirect(
                reverse("admin:api_siteconfig_change", args=[config.pk])
            )
        return super().changelist_view(request, extra_context=extra_context)
