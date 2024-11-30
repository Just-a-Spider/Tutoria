from . import serializers
from posts import models
from profiles.models import StudentProfile, TutorProfile
from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

class GetMyPostsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.CombinedPostSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        user = self.request.user
        student = StudentProfile.objects.get(user=user)
        student_posts = models.RequestHelpPost.objects.filter(student=student, course__id=course_id)
        tutor_posts = models.OfferHelpPost.objects.filter(tutor__user=user, course__id=course_id)
        my_posts = list(student_posts) + list(tutor_posts)
        my_posts.sort(key=lambda post: post.created_at, reverse=True)
        return my_posts

class RequestHelpPostViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RequestHelpPostModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return models.RequestHelpPost.objects.filter(course=self.kwargs.get('course_id'))
        
    def perform_create(self, serializer):
        user = self.request.user
        student = StudentProfile.objects.get(user=user)
        serializer.save(student=student, course_id=self.kwargs.get('course_id'))

class OfferHelpPostViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.OfferHelpPostModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return models.OfferHelpPost.objects.filter(course=self.kwargs.get('course_id'))

    def perform_create(self, serializer):
        user = self.request.user
        tutor_profile = TutorProfile.objects.get(user=user)
        serializer.save(tutor=tutor_profile, course_id=self.kwargs.get('course_id'))

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CommentModelSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    pagination_class = LimitOffsetPagination

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

        return models.Comment.objects.filter(content_type=content_type, object_id=object_id).order_by('-created_at')


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
        
        # Extract the profile_mode query parameter
        profile_mode = self.request.query_params.get('profile_mode', 'student')

        pfp_url = None

        # Get the profile picture of the user's profile
        if profile_mode == 'student':
            student_profile = StudentProfile.objects.get(user=user)
            pfp_url = student_profile.profile_picture.url if student_profile.profile_picture else None
        else:
            tutor_profile = TutorProfile.objects.get(user=user)
            pfp_url = tutor_profile.profile_picture.url if tutor_profile.profile_picture else None

        serializer.save(
            user=user, 
            content_type=content_type, 
            object_id=object_id,
            pfp_url=pfp_url
        )