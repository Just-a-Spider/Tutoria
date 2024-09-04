from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from .serializers import *
from django.conf import settings
from ..utils.authentication import CustomJWTAuthentication

from ..utils.functions import authenticate_user, set_token_cookie
from profiles.models import StudentProfile, TutorProfile

class RegisterView(APIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data.get('password')
        first_name = serializer.validated_data.get('first_name')
        last_name = serializer.validated_data.get('last_name')
        gender = serializer.validated_data.get('gender')
        email = serializer.validated_data.get('email')
        username = serializer.validated_data.get('username')
        
        if email.split('@')[1] != settings.UNIVERSITY_DOMAIN:
            return Response(
                {'detail': 'Correo no pertenece a la universidad'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.first_name = first_name
        user.last_name = last_name
        user.gender = gender
        user.save()

        # Create both a profile and a tutor profile for the user
        StudentProfile.objects.create(user=user)
        TutorProfile.objects.create(user=user)

        return Response({'detail': 'Registro Exitoso'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': 'Datos de entrada no válidos'}, status=status.HTTP_400_BAD_REQUEST)
        email_username = serializer.validated_data.get('email_username')
        password = serializer.validated_data.get('password')

        try:
            if '@udh.edu.pe' in email_username:
                user = User.objects.get(email=email_username)
            else:
                user = User.objects.get(username=email_username)
        except User.DoesNotExist:
            return Response({'detail': 'Usuario no Encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return authenticate_user(user, password)

class LogoutView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = Response({'detail': 'Logout successful'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class MeView(RetrieveAPIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        user = self.request.user
        if not user:
            raise NotFound('User not found')
        return user

class RefreshTokenView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'No se encontró el token de refresco'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Create a new access token
            new_refresh_token = CustomTokenObtainPairSerializer.get_token(request.user)
            new_access_token = new_refresh_token.access_token
            response = Response({'detail': 'Token de refresco exitoso'})
            set_token_cookie(response, new_access_token)
            return response

        except Exception as e:
            print(e)
            return Response({'detail': 'Token de refresco no válido'}, status=status.HTTP_400_BAD_REQUEST)