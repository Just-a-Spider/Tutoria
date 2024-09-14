from django.db import models
from uuid import uuid4
from user.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class BasePost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=140)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE)

    class Meta:
        abstract = True

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    post = GenericForeignKey('content_type', 'object_id')

class RequestHelpPost(BasePost):
    subject = models.CharField(max_length=140)
    student = models.ForeignKey('profiles.StudentProfile', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Request Help Post'
        verbose_name_plural = 'Request Help Posts'
        ordering = ['-created_at']

class OfferHelpPost(BasePost):
    subject = models.CharField(max_length=140)
    tutor = models.ForeignKey('profiles.TutorProfile', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Offer Help Post'
        verbose_name_plural = 'Offer Help Posts'
        ordering = ['-created_at']