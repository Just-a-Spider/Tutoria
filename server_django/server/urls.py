from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('user.api.urls', namespace='local')),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('profiles/', include('profiles.api.urls')),
    path('chats/', include('chat.api.urls')),
    path('notifications/', include('notifications.api.urls')),
    path('posts/', include('posts.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
