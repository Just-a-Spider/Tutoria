from django.db import models
from uuid import uuid4

class StudentNotification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, max_length=16)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'student_notification'
        verbose_name_plural = 'student_notifications'

class TutorNotification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, max_length=16)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'tutor_notification'
        verbose_name_plural = 'tutor_notifications'
