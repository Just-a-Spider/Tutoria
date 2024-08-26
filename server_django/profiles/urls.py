from .views import ProfileViewSet, TutorProfileViewSet
from django.urls import path

urlpatterns = [
    path('profile/', ProfileViewSet.as_view({'get': 'list', 'post': 'create'})),
    path(
        'profile/<int:pk>/', ProfileViewSet.as_view({
            'get': 'retrieve', 
            'put': 'update', 
            'delete': 'destroy'
        })
    ),
    path('tutor_profile/', TutorProfileViewSet.as_view({'get': 'list', 'post': 'create'})),
    path(
        'tutor_profile/<int:pk>/', TutorProfileViewSet.as_view({
            'get': 'retrieve', 
            'put': 'update', 
            'delete': 'destroy'
        })
    ),
]
