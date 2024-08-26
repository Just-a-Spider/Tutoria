from .models import StudentProfile, TutorProfile
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'

class TutorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorProfile
        fields = '__all__'
