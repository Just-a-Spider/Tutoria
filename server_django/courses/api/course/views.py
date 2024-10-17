from . import serializers
from courses import models
from profiles import models as p_models
from profiles.api import serializers as p_serializers
from rest_framework import status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from server.views.custom_views import CustomAuthenticatedModelViewset, CustomAuthenticatedAPIView
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from .filters import CourseFilter

class GetAllCoursesAPIView(ListAPIView):
    queryset = models.Course.objects.all().order_by('id')
    serializer_class = serializers.CourseModelSerializer
    pagination_class = LimitOffsetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CourseFilter
    ordering_fields = ['id', 'name', 'faculty']

class CourseViewSet(CustomAuthenticatedModelViewset):
    serializer_class = serializers.CourseModelSerializer
    lookup_field = 'id'
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        student_courses = models.Course.objects.filter(
            students__user=self.request.user
        )
        tutor_courses = models.Course.objects.filter(
            tutors__user=self.request.user
        )
        
        if tutor_courses.exists():
            student_courses.union(tutor_courses)

        return student_courses

    def get_user_profile(self, user, profile_model):
        """Helper method to get user profile by user_id."""
        return profile_model.objects.get(user=user)
    
    def perform_create(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
        raise PermissionDenied()
    
    def perform_update(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
        raise PermissionDenied()

    @action(detail=True, methods=['get'])
    def students(self, request, *args, **kwargs):
        course = self.get_object()
        students = course.students.all()
        serializer = p_serializers.StudentProfileSerializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tutors(self, request, *args, **kwargs):
        course = self.get_object()
        tutors = course.tutors.all()
        serializer = p_serializers.TutorProfileSerializer(tutors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_student(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        student_profile = self.get_user_profile(user, p_models.StudentProfile)
        course.students.add(student_profile)
        return Response(
            {'message': 'Student added successfully'}, 
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'])
    def remove_student(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        student_profile = self.get_user_profile(user, p_models.StudentProfile)
        course.students.remove(student_profile)
        return Response(
            {'message': 'Student removed successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=True, methods=['post'])
    def add_tutor(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        tutor_profile = self.get_user_profile(user, p_models.TutorProfile)
        # Create a TutorTryOut instance
        tutor_tryout = models.TutorTryOuts.objects.create(tutor=tutor_profile, course=course)
        tutor_tryout.save()
        return Response(
            {'message': 'You have successfully applied to be a tutor'}, 
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'])
    def remove_tutor(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        tutor_profile = self.get_user_profile(user, p_models.TutorProfile)
        course.tutors.remove(tutor_profile)
        return Response(
            {'message': 'Tutor removed successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )
