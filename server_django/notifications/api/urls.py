from django.urls import path
from ..consumers import NotificationConsumer
from .views import StudentNotificationListView, TutorNotificationListView

urlpatterns = [
    path(
        'student/', StudentNotificationListView.as_view({'get': 'list'}), 
        name='student-notifications'
    ),
    path(
        'tutor/', TutorNotificationListView.as_view({'get': 'list'}), 
        name='tutor-notifications'
    ),
]

websocket_urlpatterns = [
    path('ws/notifications/<int:user_id>/', NotificationConsumer.as_asgi()),
]
