from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.SessionViewSet, basename='tutoring-sessions')
router.register(r'details', views.FullSessionViewSet, basename='full-sessions')

urlpatterns = router.urls
