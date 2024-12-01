from .serializers import StudentProfileSerializer, TutorProfileSerializer, UploadProfilePictureSerializer
from ..models import StudentProfile, TutorProfile
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class UserProfileViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        return queryset.first()
    
    def list(self, request, *args, **kwargs):
        # Override the list method to call retrieve instead
        return self.retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='upload-profile-picture')
    def upload_profile_picture(self, request):
        try:
            serializer = UploadProfilePictureSerializer(data=request.data)
            if serializer.is_valid():
                profile_picture = serializer.validated_data['profile_picture']
                user_profile = self.get_object()
                # Delete the current profile picture if it exists
                if user_profile.profile_picture:
                    user_profile.profile_picture.delete()
                user_profile.profile_picture = profile_picture
                user_profile.save()
                return Response(
                    # Return the image URL
                    {'message': f'{user_profile.profile_picture.url}'},
                    status=status.HTTP_200_OK
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(e)

    class Meta:
        abstract = True
    
class StudentProfileViewSet(UserProfileViewSet):
    model = StudentProfile

    def get_serializer_class(self):
        if self.action == 'upload_profile_picture':
            return UploadProfilePictureSerializer
        return StudentProfileSerializer

class TutorProfileViewSet(UserProfileViewSet):  
    model = TutorProfile

    def get_serializer_class(self):
        if self.action == 'upload_profile_picture':
            return UploadProfilePictureSerializer
        return TutorProfileSerializer
