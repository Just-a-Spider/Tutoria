from . import views
from django.urls import path


urlpatterns = [
    path(
        'courses/', 
        views.CourseViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='courses-list'
    ),
    path(
        'courses/<int:course_id>/', 
        views.CourseViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})
    ),
]