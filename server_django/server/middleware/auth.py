from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import TokenError
from user.models import *
from user.api.serializers import CustomTokenObtainPairSerializer
from server.utils.user_utils import set_token_cookie

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except TokenError:
            # Access token is invalid or expired
            if refresh_token:
                try:
                    # Attempt to refresh the access token using the refresh token
                    new_access_token = CustomTokenObtainPairSerializer.get_token(request.user).access_token
                    response = set_token_cookie(new_access_token)
                    validated_token = self.get_validated_token(new_access_token)
                    user = self.get_user(validated_token)
                    return (user, validated_token, response)
                except TokenError:
                    return None
            return None

    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            return None