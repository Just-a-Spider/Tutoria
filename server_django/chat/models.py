import uuid
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tutor = models.ForeignKey('profiles.TutorProfile', on_delete=models.CASCADE, related_name='chats')
    student = models.ForeignKey('profiles.StudentProfile', on_delete=models.CASCADE, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Chat {self.pk}'

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message {self.pk}'    
