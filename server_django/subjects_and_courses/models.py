from django.db import models

# Create your models here.

class Course(models.Model):
    name = models.CharField(max_length=100)
    semester = models.IntegerField()
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'course'
        verbose_name_plural = 'courses'