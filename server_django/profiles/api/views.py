from .serializers import *
from ..models import StudentProfile, TutorProfile
from rest_framework import viewsets
from server.middleware.auth import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated

class ProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer

class TutorProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = TutorProfile.objects.all()
    serializer_class = TutorProfileSerializer

