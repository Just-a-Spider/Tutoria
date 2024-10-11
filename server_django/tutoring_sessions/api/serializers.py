from tutoring_sessions import models
from rest_framework import serializers

class CreateSessionSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=models.Course.objects.all(), required=False)

    class Meta:
        model = models.Session
        fields = [
            'id',
            'date',
            'start_time',
            'end_time',
            'session_type',
            'course'
        ]
        read_only_fields = ['id']

class SessionMemberSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()
    class Meta:
        model = models.SessionMember
        exclude = ['id', 'session']

class FullSessionSerializer(serializers.ModelSerializer):
    course = serializers.StringRelatedField()
    tutor = serializers.StringRelatedField()
    sessionmember_set = SessionMemberSerializer(many=True)

    class Meta:
        model = models.Session
        fields = '__all__'