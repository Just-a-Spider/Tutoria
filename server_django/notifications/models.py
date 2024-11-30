from django.db import models
from uuid import uuid4

class BaseNotification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, max_length=16)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    instance_id = models.UUIDField(null=True, default=None) # For example, the course id
    subinstance_id = models.UUIDField(null=True, default=None) # For example, the post id
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    
    class Meta:
        abstract = True

class StudentNotification(BaseNotification):
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'student_notification'
        verbose_name_plural = 'student_notifications'

class TutorNotification(BaseNotification):
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'tutor_notification'
        verbose_name_plural = 'tutor_notifications'
