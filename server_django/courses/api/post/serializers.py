from posts import models
from rest_framework import serializers


class SimpleCommentContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = ['content']

class CommentModelSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    content_type = serializers.StringRelatedField(read_only=True)
    object_id = serializers.UUIDField(read_only=True)
    post = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = models.Comment
        fields = '__all__'

class RequestHelpPostModelSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()

    class Meta:
        model = models.RequestHelpPost
        exclude = ['course']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['pfp_url'] = instance.student.profile_picture.url if instance.student.profile_picture else None
        return representation

class OfferHelpPostModelSerializer(serializers.ModelSerializer):
    tutor = serializers.StringRelatedField()

    class Meta:
        model = models.OfferHelpPost
        exclude = ['course']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['pfp_url'] = instance.tutor.profile_picture.url if instance.tutor.profile_picture else None
        return representation
    
class CombinedPostSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    subject = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(instance, models.RequestHelpPost):
            representation['post_type'] = 'Solicitud de ayuda'
            representation['pfp_url'] = instance.student.profile_picture.url if instance.student.profile_picture else None
        elif isinstance(instance, models.OfferHelpPost):
            representation['post_type'] = 'Oferta de ayuda'
            representation['pfp_url'] = instance.tutor.profile_picture.url if instance.tutor.profile_picture else None
        return representation