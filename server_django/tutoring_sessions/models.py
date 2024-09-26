import uuid
from django.db import models

class Session(models.Model):
    SESSION_TYPES = [
        ('G', 'In-Group'),
        ('I', 'Individual')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tutor = models.ForeignKey('profiles.TutorProfile', on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    session_type = models.CharField(max_length=1, choices=SESSION_TYPES)
    video_file = models.FileField(upload_to='videos/', null=True, blank=True)

    def __str__(self):
        return f'{self.tutor.user.get_full_name()} - {self.start_time}'
    
    class Meta:
        verbose_name = 'tutoring session'
        verbose_name_plural = 'tutoring sessions'
        ordering = ['start_time']
        db_table = 'tutoring_sessions'

class SessionMember(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    student = models.ForeignKey('profiles.StudentProfile', on_delete=models.CASCADE)
    attended = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.student.user.get_full_name()} - {self.session.start_time}'
    
    class Meta:
        verbose_name = 'session member'
        verbose_name_plural = 'session members'
        unique_together = ['session', 'student']
        db_table = 'session_members'
