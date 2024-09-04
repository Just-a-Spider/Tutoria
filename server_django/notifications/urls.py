from django.urls import path
from .consumers import NotificationConsumer
from .views import StudentNotificationListView, TutorNotificationListView

url_patterns = [
    path('student/', StudentNotificationListView.as_view({'get': 'list'}), name='student-notifications'),
    path('tutor/', TutorNotificationListView.as_view({'get': 'list'}), name='tutor-notifications'),
]

websocket_urlpatterns = [
    path('ws/notifications/', NotificationConsumer.as_asgi()),
]
