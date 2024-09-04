from .models import StudentProfile, TutorProfile
from user.models import User
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    linked_courses = serializers.StringRelatedField(many=True)

    class Meta:
        model = StudentProfile
        fields = '__all__'

class TutorProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = TutorProfile
        fields = '__all__'
