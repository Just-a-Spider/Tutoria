import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail
from django.conf import settings

class User(AbstractUser):
    # Add any other custom fields here

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

class PasswordResetToken(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def send_email(self):
        send_mail(
            subject='Password reset token',
            message=f'Your password reset token is {self.token}',
            recipient_list=[self.email],
            from_email=settings.EMAIL_HOST_USER,
            html_message=f'Your password reset token is <b>{self.token}</b>',
        )
        pass
    
    @staticmethod
    def generate_token():
        return uuid.uuid4().hex
        

    class Meta:
        verbose_name = 'password reset token'
        verbose_name_plural = 'password reset tokens'
        db_table = 'password_reset_tokens'

    def __str__(self):
        return self.email
