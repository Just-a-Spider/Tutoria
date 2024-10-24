from rest_framework.viewsets import ModelViewSet
from notifications.models import StudentNotification, TutorNotification
from .serializers import StudentNotificationSerializer, TutorNotificationSerializer

class StudentNotificationListView(ModelViewSet):
    serializer_class = StudentNotificationSerializer
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        return StudentNotification.objects.filter(user=self.request.user)
    
class TutorNotificationListView(ModelViewSet):
    serializer_class = TutorNotificationSerializer
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        return TutorNotification.objects.filter(user=self.request.user)
