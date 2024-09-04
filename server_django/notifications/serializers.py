from rest_framework import serializers
from .models import StudentNotification, TutorNotification

class StudentNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentNotification
        fields = '__all__'

class TutorNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorNotification
        fields = '__all__'

