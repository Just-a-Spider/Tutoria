from .views import *
from django.urls import path

app_name = 'user'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # Session Related
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me')
]
