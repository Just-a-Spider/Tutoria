from django.contrib import admin
from .models import RequestHelpPost, OfferHelpPost, Comment
from .filters import PostTypeFilter

@admin.register(RequestHelpPost)
class RequestHelpPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'course', 'student', 'created_at')
    search_fields = ('title', 'subject', 'course__name', 'student__user__username')
    list_filter = ('course',)

@admin.register(OfferHelpPost)
class OfferHelpPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'course', 'tutor', 'created_at')
    search_fields = ('title', 'subject', 'course__name', 'tutor__user__username')
    list_filter = ('course',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'user', 'post', 'post_type', 'created_at')
    search_fields = ('content', 'user__username', 'post__title', 'post__course')
    list_filter = (PostTypeFilter,)

    def post_type(self, obj):
        if isinstance(obj.post, RequestHelpPost):
            return 'Request Help Post'
        elif isinstance(obj.post, OfferHelpPost):
            return 'Offer Help Post'
        return 'Unknown'
    post_type.short_description = 'Post Type'
