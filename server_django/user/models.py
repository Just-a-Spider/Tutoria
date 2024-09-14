from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    gender = models.BooleanField(default=False)
    # Add any other custom fields here

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')