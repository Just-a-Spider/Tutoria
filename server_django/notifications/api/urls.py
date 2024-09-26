from django.urls import path
from rest_framework.routers import DefaultRouter
from notifications.consumers import NotificationConsumer
from .views import StudentNotificationListView, TutorNotificationListView

router = DefaultRouter()
router.register(r'student', StudentNotificationListView, basename='student')
router.register(r'tutor', TutorNotificationListView, basename='tutor')

urlpatterns = router.urls

websocket_urlpatterns = [
    path('ws/notifications/<int:user_id>/', NotificationConsumer.as_asgi()),
]
