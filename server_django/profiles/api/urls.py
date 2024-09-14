from .views import ProfileViewSet, TutorProfileViewSet
from django.urls import path

urlpatterns = [
    path('student/', ProfileViewSet.as_view({'get': 'list', 'post': 'create'})),
    path(
        'student/<int:pk>/', ProfileViewSet.as_view({
            'get': 'retrieve', 
            'put': 'update', 
            'delete': 'destroy'
        })
    ),
    path('tutor/', TutorProfileViewSet.as_view({'get': 'list', 'post': 'create'})),
    path(
        'tutor/<int:pk>/', TutorProfileViewSet.as_view({
            'get': 'retrieve', 
            'put': 'update', 
            'delete': 'destroy'
        })
    ),
]
