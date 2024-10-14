from .views import StudentProfileViewSet, TutorProfileViewSet
from django.urls import path

urlpatterns = [
    path('student/', StudentProfileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update', 
    })
    ),
    path('tutor/', TutorProfileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update', 
    })
    ),
]
