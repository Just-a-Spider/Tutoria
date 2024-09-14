from . import serializers
from courses import models
from rest_framework import viewsets

class CourseViewSet(viewsets.ModelViewSet):
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseModelSerializer
    http_method_names = ['get', 'put', 'delete']

    def link_profile(self, profile, course, is_student):
        if is_student:
            course.students.add(profile)
        else:
            course.tutors.add(profile)

    def unlink_profile(self, profile, course, is_student):
        if is_student:
            course.students.remove(profile)
        else:
            course.tutors.remove(profile)