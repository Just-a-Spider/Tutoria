from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .course.views import CourseViewSet, GetAllCoursesAPIView
from .post.views import GetMyPostsViewSet, RequestHelpPostViewSet, OfferHelpPostViewSet, CommentViewSet
from django.urls import path, include

# Create the main router
router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course')

# Create nested routers for request-help-posts and offer-help-posts under courses
courses_router = NestedDefaultRouter(router, r'', lookup='course')
courses_router.register(r'request-help-posts', RequestHelpPostViewSet, basename='course-request-help-posts')
courses_router.register(r'offer-help-posts', OfferHelpPostViewSet, basename='course-offer-help-posts')

# Create nested routers for comments under request-help-posts and offer-help-posts
request_help_posts_router = NestedDefaultRouter(courses_router, r'request-help-posts', lookup='post')
request_help_posts_router.register(r'comments', CommentViewSet, basename='request-help-post-comments')

offer_help_posts_router = NestedDefaultRouter(courses_router, r'offer-help-posts', lookup='post')
offer_help_posts_router.register(r'comments', CommentViewSet, basename='offer-help-post-comments')

nested_urlpatterns = router.urls + courses_router.urls + request_help_posts_router.urls + offer_help_posts_router.urls

urlpatterns = [
    path('all-courses/', GetAllCoursesAPIView.as_view(), name='all-courses'),
    path('<int:course_id>/my-posts/', GetMyPostsViewSet.as_view({'get': 'list'}), name='my-posts')
] + nested_urlpatterns
