from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ChatsListView
from chat import consumers

router = DefaultRouter()
router.register(r'', ChatsListView, basename='chat')

urlpatterns = router.urls

websocket_urlpatterns = [
    path('ws/chat/<uuid:chat_id>/', consumers.ChatConsumer.as_asgi()),
]
