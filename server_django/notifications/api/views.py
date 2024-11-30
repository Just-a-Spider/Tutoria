from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from notifications import models
from . import serializers

class BaseNotiViewSet(ModelViewSet):
    filter_fields = ['read']
    lookup_field = 'id'

    def get_queryset(self):
        return self.noti_model.objects.filter(user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        obj = queryset.get(id=self.kwargs['id'])
        return obj

    def retrieve(self, request, *args, **kwargs):
        # Mark notification as seen
        instance = self.get_object()
        instance.read = True
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='seen')
    def seen_notifications(self, request):
        queryset = self.get_queryset().filter(read=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='unseen')
    def unseen_notifications(self, request):
        queryset = self.get_queryset().filter(read=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'], url_path='clear')
    def clear_notifications(self, request):
        queryset = self.get_queryset().filter(read=True)
        queryset.delete()
        return Response(status=204)

class StudentNotificationListView(BaseNotiViewSet):
    serializer_class = serializers.StudentNotificationSerializer
    noti_model = models.StudentNotification

class TutorNotificationListView(BaseNotiViewSet):
    serializer_class = serializers.TutorNotificationSerializer
    noti_model = models.TutorNotification