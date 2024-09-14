from posts import models
from rest_framework import serializers

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
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj):
        comments = models.Comment.objects.filter(content_type__model='requesthelppost', object_id=obj.id)
        return CommentModelSerializer(comments, many=True).data

    class Meta:
        model = models.RequestHelpPost
        fields = '__all__'

class OfferHelpPostModelSerializer(serializers.ModelSerializer):
    tutor = serializers.StringRelatedField()
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj):
        comments = models.Comment.objects.filter(content_type__model='offerhelppost', object_id=obj.id)
        return CommentModelSerializer(comments, many=True).data
    
    class Meta:
        model = models.OfferHelpPost
        fields = '__all__'