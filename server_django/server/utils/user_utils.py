from user.models import *
from user.api.serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.conf import settings
import random
import string

def set_token_cookie(token, key=None):
    token_key = settings.SIMPLE_JWT['AUTH_COOKIE'] if key==None else settings.SIMPLE_JWT['REFRESH_TOKEN']
    response = Response()
    response.set_cookie(
        key=token_key,
        value=token,
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )
    return response

def login_success_response(user, mobile=False):
    refresh = CustomTokenObtainPairSerializer.get_token(user)
    access_token = refresh.access_token
    refresh_token = str(refresh)
    user.last_login = timezone.now()
    user.save()

    if mobile:
        mobile_response = Response({
            'access_token': str(access_token),
            'refresh_token': refresh_token,
        }, status=status.HTTP_200_OK)
        return mobile_response

    response = Response({'detail': 'Login successful'})
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=str(access_token),
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )
    return response

def authenticate_user(user, password, mobile=False):
    if not user.check_password(password) or not user.is_active:
        return Response({'detail': 'Credenciales Incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    return login_success_response(user, mobile)

def refresh_jwt_token(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({'detail': 'No se encontró el token de refresco'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        new_refresh_token = CustomTokenObtainPairSerializer.get_token(request.user)
        new_access_token = new_refresh_token.access_token
        response = set_token_cookie(new_access_token)
        return response

    except Exception as e:
        print(e)
        return Response({'detail': 'Token de refresco no válido'}, status=status.HTTP_400_BAD_REQUEST)

def create_random_username():
    adjectives = [
        'Quick', 'Lazy', 'Sleepy', 'Noisy', 'Hungry', 'Brave', 'Calm', 'Eager', 'Fancy', 'Gentle'
    ]
    nouns = [
        'Panda', 'Tiger', 'Elephant', 'Lion', 'Giraffe', 'Zebra', 'Monkey', 'Kangaroo', 'Penguin', 'Dolphin'
    ]
    numbers = ''.join(random.choices(string.digits, k=4))

    while True:
        username = f"{random.choice(adjectives)}{random.choice(nouns)}{numbers}"
        if not User.objects.filter(username=username).exists():
            break

    return username