from server.views.custom_views import CustomAuthenticatedModelViewset
from notifications.models import StudentNotification, TutorNotification
from .serializers import StudentNotificationSerializer, TutorNotificationSerializer

class StudentNotificationListView(CustomAuthenticatedModelViewset):
    serializer_class = StudentNotificationSerializer
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        return StudentNotification.objects.filter(user=self.request.user)
    
class TutorNotificationListView(CustomAuthenticatedModelViewset):
    serializer_class = TutorNotificationSerializer
    http_method_names = ['get', 'head', 'options']

    def get_queryset(self):
        return TutorNotification.objects.filter(user=self.request.user)
