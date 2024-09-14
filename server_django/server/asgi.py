import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django_asgi_application = get_asgi_application()

from .middleware.websocket_auth import TokenAuthMiddlewareStack
from chat.api.urls import websocket_urlpatterns as chat_websocket_urlpatterns
from notifications.api.urls import websocket_urlpatterns as notifications_websocket_urlpatterns

application = ProtocolTypeRouter({
    'http': django_asgi_application,
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            chat_websocket_urlpatterns +
            notifications_websocket_urlpatterns
        )
    ),
})