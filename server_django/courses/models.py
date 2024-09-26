import uuid
from django.db import models

class Faculty(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'faculty'
        verbose_name_plural = 'faculties'

class Course(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    semester = models.IntegerField()
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    students = models.ManyToManyField('profiles.StudentProfile', through='CourseStudents')
    tutors = models.ManyToManyField('profiles.TutorProfile', through='CourseTutors')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'course'
        verbose_name_plural = 'courses'
        db_table = 'courses'

    def count_try_out_tutors(self):
        return self.tutortryouts_set.count()

class CourseStudents(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey('profiles.StudentProfile', on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.course.name} - {self.student.user.username}'
    
    class Meta:
        verbose_name = 'course student'
        verbose_name_plural = 'course students'
        db_table = 'course_students'
        unique_together = ('course', 'student')

class CourseTutors(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    tutor = models.ForeignKey('profiles.TutorProfile', on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.course.name} - {self.tutor.user.username}'
    
    class Meta:
        verbose_name = 'course tutor'
        verbose_name_plural = 'course tutors'
        db_table = 'course_tutors'
        unique_together = ('course', 'tutor')

class TutorTryOuts(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tutor = models.ForeignKey('profiles.TutorProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    last_tryout = models.DateTimeField(auto_now=True)
    tryouts_left = models.IntegerField(default=3)
    calification = models.FloatField(default=0.0)

    def __str__(self):
        return f'Tryout of {self.tutor.user.username} in {self.course.name}'
    
    class Meta:
        verbose_name = 'tutor tryout'
        verbose_name_plural = 'tutor tryouts'
        db_table = 'tutor_tryouts'

class TryOutCalifications(models.Model):
    id = models.AutoField(primary_key=True)
    tryout = models.ForeignKey(TutorTryOuts, on_delete=models.CASCADE)
    student = models.ForeignKey('profiles.StudentProfile', on_delete=models.CASCADE)
    calification = models.FloatField()
    feedback = models.TextField()

    def __str__(self):
        return f'{self.student.user.username} calification to {self.tryout.tutor.user.username}'
    
    class Meta:
        verbose_name = 'tryout calification'
        verbose_name_plural = 'tryout califications'
        db_table = 'tryout_califications'
