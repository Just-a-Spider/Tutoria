from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from server.middleware.auth import CustomJWTAuthentication
from ..models import StudentNotification, TutorNotification
from .serializers import StudentNotificationSerializer, TutorNotificationSerializer
from profiles.models import StudentProfile, TutorProfile


class NotificationListView(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    
class StudentNotificationListView(NotificationListView):
    serializer_class = StudentNotificationSerializer

    def get_queryset(self):
        profile = StudentProfile.objects.get(user=self.request.user)
        return StudentNotification.objects.filter(user=profile)
    
class TutorNotificationListView(NotificationListView):
    serializer_class = TutorNotificationSerializer

    def get_queryset(self):
        profile = TutorProfile.objects.get(user=self.request.user)
        return TutorNotification.objects.filter(user=profile)
