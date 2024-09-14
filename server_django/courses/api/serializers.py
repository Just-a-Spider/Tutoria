from courses import models
from rest_framework import serializers

class CourseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Course
        fields = '__all__'