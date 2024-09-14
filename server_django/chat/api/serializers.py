from rest_framework import serializers
from chat.models import Chat

class ChatSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    tutor = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()

    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return last_message.content
        return None
    
    def get_tutor(self, obj):
        return obj.tutor.user.email
    
    def get_student(self, obj):
        return obj.student.user.email

    class Meta:
        model = Chat
        fields = [
            'id', 
            'tutor',
            'student',
            'last_message',
            'created_at', 
        ]



