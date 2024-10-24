from courses import models
from rest_framework import serializers

class CourseModelSerializer(serializers.ModelSerializer):
    faculty = serializers.StringRelatedField()
    students = serializers.SerializerMethodField()
    tutors = serializers.SerializerMethodField()
    try_out_tutors = serializers.SerializerMethodField()

    def get_students(self, obj):
        return obj.students.count()
    
    def get_tutors(self, obj):
        return obj.tutors.count()
    
    def get_try_out_tutors(self, obj):
        return obj.count_try_out_tutors()

    class Meta:
        model = models.Course
        exclude = ['semester']

class TryOutTutorModelSerializer(serializers.ModelSerializer):
    tutor = serializers.StringRelatedField()

    class Meta:
        model = models.TutorTryOuts
        exclude = ['course']