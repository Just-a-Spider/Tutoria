from django.urls import path
from .views import ChatsListView
from chat import consumers

urlpatterns = [
    path('list/', ChatsListView.as_view({'get': 'list'}), name='chats-list'),
    path('<uuid:chat_id>/', ChatsListView.as_view({'get': 'retrieve'}), name='chat-detail'),
]

websocket_urlpatterns = [
    path('ws/chat/<uuid:chat_id>/', consumers.ChatConsumer.as_asgi()),
]
