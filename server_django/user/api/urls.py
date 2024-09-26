from .views import *
from django.urls import path

app_name = 'user'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path(
        'send-password-reset-token/', 
        GetSendPasswordReset.as_view(), 
        name='send-password-reset-token'
    ),
    path(
        'password-reset/', 
        PasswordResetView.as_view(), 
        name='password-reset'
    ),
    # Session Related
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me')
]
