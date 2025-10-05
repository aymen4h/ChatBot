from django.db import models
from django.conf import settings


class Conversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations")
    title_en = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")

    author = models.CharField(max_length=20)
    msg_en = models.TextField(null=True, blank=True)
    msg_ar = models.TextField(null=True, blank=True)
    translated = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
