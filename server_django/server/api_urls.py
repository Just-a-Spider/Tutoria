from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/', include('user.api.urls', namespace='local')),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('profiles/', include('profiles.api.urls')),
    path('courses/', include('courses.api.urls')),
    path('chats/', include('chat.api.urls')),
    path('notifications/', include('notifications.api.urls')),
    path('sessions/', include('tutoring_sessions.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
