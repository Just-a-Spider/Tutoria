from .serializers import *
from ..models import StudentProfile, TutorProfile
from rest_framework import viewsets
from server.middleware.auth import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated

class StudentProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_queryset(self):
        return StudentProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        return StudentProfile.objects.get(user=self.request.user)

class TutorProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TutorProfileSerializer

    def get_queryset(self):
        return TutorProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        return TutorProfile.objects.get(user=self.request.user)
