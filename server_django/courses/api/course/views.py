from . import serializers
from courses import models
from profiles import models as p_models
from profiles.api import serializers as p_serializers
from rest_framework import status, filters
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from .filters import CourseFilter

class GetAllCoursesAPIView(ListAPIView):
    serializer_class = serializers.CourseModelSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CourseFilter
    ordering_fields = ['id', 'name', 'faculty']

    def get_queryset(self):
        free_courses = models.Course.objects.exclude(
            students__user=self.request.user
        ).order_by('id')
        return free_courses

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CourseModelSerializer
    lookup_field = 'id'

    # Integrated Methods
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
    
    def get_object(self):
        all_courses = models.Course.objects.all()
        course_id = self.kwargs.get('id')
        course = all_courses.filter(id=course_id).first()
        return course
    
    def perform_create(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
        raise PermissionDenied()
    
    def perform_update(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
        raise PermissionDenied()
    
    # Helper Methods
    def get_user_profile(self, user, profile_model):
        """Helper method to get user profile by user_id."""
        return profile_model.objects.get(user=user)

    # Actions
    @action(detail=True, methods=['get', 'post', 'delete'])
    def students(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        student_profile = self.get_user_profile(user, p_models.StudentProfile)

        if request.method == 'DELETE':
            course.students.remove(student_profile)
            return Response(
                {'message': 'Student removed successfully'}, 
                status=status.HTTP_204_NO_CONTENT
            )
            
        if request.method == 'POST':
            course.students.add(student_profile)
            return Response(
                {'message': 'Student added successfully'}, 
                status=status.HTTP_201_CREATED
            )
        
        students = course.students.all()
        serializer = p_serializers.StudentProfileSerializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get', 'post', 'delete'])
    def tutors(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        tutor_profile = self.get_user_profile(user, p_models.TutorProfile)

        if request.method == 'DELETE':
            if course.tutortryouts_set.filter(tutor=tutor_profile).exists():
                course.tutortryouts_set.filter(tutor=tutor_profile).delete()
                return Response(
                    {'message': 'You have successfully removed your application'}, 
                    status=status.HTTP_204_NO_CONTENT
                )
            course.tutors.remove(tutor_profile)
            return Response(
                {'message': 'Tutor removed successfully'}, 
                status=status.HTTP_204_NO_CONTENT
            )
        
        if request.method == 'POST':
            if course.tutors.filter(user=user).exists() or course.tutortryouts_set.filter(tutor=tutor_profile).exists():
                return Response(
                    {'message': 'You are already a tutor for this course'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Create a TutorTryOut instance
            tutor_tryout = models.TutorTryOuts.objects.create(tutor=tutor_profile, course=course)
            tutor_tryout.save()
            return Response(
                {'message': 'You have successfully applied to be a tutor'}, 
                status=status.HTTP_201_CREATED
            )

        tutors = course.tutors.all()
        serializer = p_serializers.TutorProfileSerializer(tutors, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def try_out_tutors(self, request, *args, **kwargs):
        course = self.get_object()
        try_out_tutors = course.tutortryouts_set.all()
        serializer = serializers.TryOutTutorModelSerializer(try_out_tutors, many=True)
        return Response(serializer.data)
