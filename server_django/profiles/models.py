from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.

class StudentProfile(models.Model):
    profile_picture = models.ImageField(upload_to='profile_pictures', null=True, blank=True)
    linked_courses = models.ManyToManyField('courses.Course')
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email + ' - ' + self.user.first_name + ' ' + self.user.last_name
    
    class Meta:
        verbose_name = 'profile'
        verbose_name_plural = 'profiles'

class TutorProfile(models.Model):
    profile_picture = models.ImageField(upload_to='tutor_profile_pictures', null=True, blank=True)
    bio = models.TextField()
    linked_courses = models.ManyToManyField('courses.Course')
    rating = models.FloatField(default=0.0)
    helped = models.IntegerField(default=0)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email + ' - ' + self.user.first_name + ' ' + self.user.last_name
    
    class Meta:
        verbose_name = 'tutor profile'
        verbose_name_plural = 'tutor profiles'
