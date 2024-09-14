from . import serializers
from posts import models
from rest_framework import viewsets
from profiles.models import StudentProfile, TutorProfile
from server.middleware.auth import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType

class RequestHelpPostViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = models.RequestHelpPost.objects.all()
    serializer_class = serializers.RequestHelpPostModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def perform_create(self, serializer):
        user = self.request.user
        student = StudentProfile.objects.get(user=user)
        serializer.save(student=student)

class OfferHelpPostViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = models.OfferHelpPost.objects.all()
    serializer_class = serializers.OfferHelpPostModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def perform_create(self, serializer):
        user = self.request.user
        tutor_profile = TutorProfile.objects.get(user=user)
        serializer.save(tutor=tutor_profile)

class CommentViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.CommentModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        # Get the comments for a specific post
        content_type_model = None
        # Check the url, if it contains request-help-posts, then it is a comment for RequestHelpPost
        # Otherwise, it is a comment for OfferHelpPost
        if 'request-help-posts' in self.request.path:
            content_type_model = 'requesthelppost'
        else:
            content_type_model = 'offerhelppost'
        # Get the object_id from the url
        object_id = self.kwargs.get('pk')

        if not content_type_model or not object_id:
            raise ValueError("content_type and object_id must be provided")
        
        content_type = ContentType.objects.get(model=content_type_model)

        return models.Comment.objects.filter(content_type=content_type, object_id=object_id)


    def perform_create(self, serializer):
        user = self.request.user
        content_type_model = None
        # Check the url, if it contains request-help-posts, then it is a comment for RequestHelpPost
        # Otherwise, it is a comment for OfferHelpPost
        if 'request-help-posts' in self.request.path:
            content_type_model = 'requesthelppost'
        else:
            content_type_model = 'offerhelppost'
        # Get the object_id from the url
        object_id = self.kwargs.get('pk')

        if not content_type_model or not object_id:
            raise ValueError("content_type and object_id must be provided")

        content_type = ContentType.objects.get(model=content_type_model)
        serializer.save(user=user, content_type=content_type, object_id=object_id)