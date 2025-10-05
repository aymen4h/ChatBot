from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    summary_en = models.TextField(null=True, blank=True)
    summary_ar = models.TextField(null=True, blank=True)


