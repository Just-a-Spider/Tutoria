from courses import models
from profiles import models as p_models
from rest_framework import serializers

class CourseModelSerializer(serializers.ModelSerializer):
    faculty = serializers.StringRelatedField()
    students = serializers.SerializerMethodField()
    tutors = serializers.SerializerMethodField()
    try_out_tutors = serializers.SerializerMethodField()
    is_student = serializers.SerializerMethodField()
    is_tutor = serializers.SerializerMethodField()
    is_try_out_tutor = serializers.SerializerMethodField()

    def get_students(self, obj):
        # ManytoManyField.count() is a method that returns the number of objects in the related object set
        return obj.students.count()
    
    def get_tutors(self, obj):
        return obj.tutors.count()
    
    def get_try_out_tutors(self, obj):
        return obj.count_try_out_tutors()
    
    def get_is_student(self, obj):
        user = self.context['request'].user
        return obj.students.filter(user=user).exists()
    
    def get_is_tutor(self, obj):
        user = self.context['request'].user
        tutor_profile = p_models.TutorProfile.objects.filter(user=user).first()
        return obj.tutors.filter(user=user).exists()
    
    def get_is_try_out_tutor(self, obj):
        user = self.context['request'].user
        tutor_profile = p_models.TutorProfile.objects.filter(user=user).first()
        return obj.tutortryouts_set.filter(tutor=tutor_profile).exists()

    class Meta:
        model = models.Course
        exclude = ['semester']

class TryOutTutorModelSerializer(serializers.ModelSerializer):
    tutor = serializers.StringRelatedField()

    class Meta:
        model = models.TutorTryOuts
        exclude = ['course']