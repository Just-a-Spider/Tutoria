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
        return f'Chat between {self.tutor.user.username} and {self.student.user.username}'

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.author.username} in chat between {self.chat.tutor.user.username} and {self.chat.student.user.username}'

class CourseChat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='chats')
    members = models.ManyToManyField(User, related_name='course_chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Chat for course {self.course.name}'
