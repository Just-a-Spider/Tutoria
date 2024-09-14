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
    students = models.ManyToManyField('profiles.StudentProfile')
    tutors = models.ManyToManyField('profiles.TutorProfile')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'course'
        verbose_name_plural = 'courses'