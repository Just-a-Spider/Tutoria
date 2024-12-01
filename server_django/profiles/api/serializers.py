from ..models import StudentProfile, TutorProfile
from user.models import User
from rest_framework import serializers

class UploadProfilePictureSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']

class StudentProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StudentProfile
        exclude = ['user', 'id']

class SelectStudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['user']

class TutorProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = TutorProfile
        exclude = ['user', 'id']
