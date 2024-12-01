from .views import StudentProfileViewSet, TutorProfileViewSet
from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
router.register('student', StudentProfileViewSet, basename='student')
router.register('tutor', TutorProfileViewSet, basename='tutor')

urlpatterns = router.urls
