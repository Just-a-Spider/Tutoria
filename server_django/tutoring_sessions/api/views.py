from server.views.custom_views import CustomAuthenticatedModelViewset
from tutoring_sessions import models
from courses.models import Course
from profiles.models import StudentProfile, TutorProfile
from profiles.api.serializers import SelectStudentProfileSerializer
from . import serializers

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied


class SessionViewSet(CustomAuthenticatedModelViewset):
    lookup_field = 'id'

    # Default Methods
    def get_queryset(self):
        # Return the sessions the user is a tutor for and also a student
        return models.Session.objects.filter(
            tutor__user=self.request.user
            ) | models.Session.objects.filter(
                sessionmember__student__user=self.request.user
            ) 

    def get_serializer_class(self):
        if self.action == 'members':
            return SelectStudentProfileSerializer
        elif self.action == 'instance':
            return serializers.FullSessionSerializer
        return serializers.CreateSessionSerializer

    # Modify the create to allow only tutors that are listed as tutors for the course
    def perform_create(self, serializer):
        tutor = TutorProfile.objects.get(user=self.request.user)
        course = Course.objects.get(id=self.request.data['course'])
        if tutor not in course.tutors.all():
            raise PermissionDenied('You are not a tutor for this course')
        serializer.save(tutor=tutor, course=course)

    # Custom Methods
    def add_student(self, request, id=None):
        session = self.get_object()
        student = StudentProfile.objects.get(user=request.data['user'])
        if models.SessionMember.objects.filter(session=session, student=student).exists():
            raise PermissionDenied('You are already a member of this session')
        if student.user == request.user:
            raise PermissionDenied('You cannot add yourself to a session')
        models.SessionMember.objects.create(session=session, student=student)
        return Response({'detail': 'Student added to session'})
    
    # Actions
    @action(detail=True, methods=['get', 'post', 'delete'])
    def members(self, request, id=None):
        if request.method == 'POST':
            return self.add_student(request, id)
        session = self.get_object()
        if request.method == 'DELETE':
            student = StudentProfile.objects.get(user=request.data['user'])
            member = models.SessionMember.objects.get(session=session, student=student)
            member.delete()
            return Response({'detail': 'Student removed from session'})
        members = session.sessionmember_set.all()
        serializer = serializers.SessionMemberSerializer(members, many=True)
        return Response(serializer.data)

class FullSessionViewSet(CustomAuthenticatedModelViewset):
    queryset = models.Session.objects.all()
    serializer_class = serializers.FullSessionSerializer
