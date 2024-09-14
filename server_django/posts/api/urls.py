from . import views
from django.urls import path

urlpatterns = [
    # Request Help Posts
    path(
        'request-help-posts/', 
        views.RequestHelpPostViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='request-help-posts-list'
    ),
    path(
        'request-help-posts/<uuid:pk>/', 
        views.RequestHelpPostViewSet.as_view({
            'get': 'retrieve', 'put': 'update', 'delete': 'destroy'
        }),
        name='request-help-posts-detail'
    ),
    path(
        'request-help-posts/<uuid:pk>/comments/', 
        views.CommentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='request-help-posts-comments'
    ),

    # Offer Help Posts
    path(
        'offer-help-posts/', 
        views.OfferHelpPostViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='offer-help-posts-list'
    ),
    path(
        'offer-help-posts/<uuid:pk>/', 
        views.OfferHelpPostViewSet.as_view({
            'get': 'retrieve', 'put': 'update', 'delete': 'destroy'
        }),
        name='offer-help-posts-detail'
    ),
    path(
        'offer-help-posts/<uuid:pk>/comments/', 
        views.CommentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='offer-help-posts-comments'
    ),
]