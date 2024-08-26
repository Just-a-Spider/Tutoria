from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *
"""
We need to create a custom serializer to include the role in the token.
This way we can modify permissions based on the role.
"""
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        user_class = str(user.__class__.__name__)
        token['role'] = user_class.lower()
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        max_length=128,
        write_only=True
    )
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    gender = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = [
            'username',
            'email', 
            'password',
            'first_name', 
            'last_name', 
            'gender'
        ]
    
class LoginSerializer(serializers.Serializer):
    email_username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    # role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'email_username', 
            'password', 
            # 'role'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 
            'last_name', 
            'username',
            'email',
            'gender',
        ]