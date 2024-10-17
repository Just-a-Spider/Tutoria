import django_filters
from courses import models

class CourseFilter(django_filters.FilterSet):
    class Meta:
        model = models.Course
        fields = {
            'name': ['icontains'],
            'faculty': ['exact'],
            'students__user__username': ['icontains'],
            'tutors__user__username': ['icontains'],
        }