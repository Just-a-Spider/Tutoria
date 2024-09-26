from . import serializers
from server.views.custom_views import CustomAuthenticatedModelViewset
from posts import models
from profiles.models import StudentProfile, TutorProfile
from django.contrib.contenttypes.models import ContentType

class RequestHelpPostViewSet(CustomAuthenticatedModelViewset):
    serializer_class = serializers.RequestHelpPostModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return models.RequestHelpPost.objects.filter(course=self.kwargs.get('course_id'))
        
    def perform_create(self, serializer):
        user = self.request.user
        student = StudentProfile.objects.get(user=user)
        serializer.save(student=student, course_id=self.kwargs.get('course_id'))

class OfferHelpPostViewSet(CustomAuthenticatedModelViewset):
    serializer_class = serializers.OfferHelpPostModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return models.OfferHelpPost.objects.filter(course=self.kwargs.get('course_id'))

    def perform_create(self, serializer):
        user = self.request.user
        tutor_profile = TutorProfile.objects.get(user=user)
        serializer.save(tutor=tutor_profile, course_id=self.kwargs.get('course_id'))

class CommentViewSet(CustomAuthenticatedModelViewset):
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
        object_id = self.kwargs.get('post_pk')

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
        object_id = self.kwargs.get('post_pk')

        if not content_type_model or not object_id:
            raise ValueError("content_type and object_id must be provided")

        content_type = ContentType.objects.get(model=content_type_model)
        serializer.save(user=user, content_type=content_type, object_id=object_id)