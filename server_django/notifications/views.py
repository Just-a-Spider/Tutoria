from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from user.utils.authentication import CustomJWTAuthentication
from .models import StudentNotification, TutorNotification
from .serializers import StudentNotificationSerializer, TutorNotificationSerializer


class NotificationListView(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    
class StudentNotificationListView(NotificationListView):
    serializer_class = StudentNotificationSerializer

    def get_queryset(self):
        return StudentNotification.objects.filter(user=self.request.user)
    
class TutorNotificationListView(NotificationListView):
    serializer_class = TutorNotificationSerializer

    def get_queryset(self):
        return TutorNotification.objects.filter(user=self.request.user)
