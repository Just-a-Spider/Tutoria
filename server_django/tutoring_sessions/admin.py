from django.contrib import admin
from tutoring_sessions import models

class SessionMemberInline(admin.TabularInline):
    model = models.SessionMember
    extra = 0 
    readonly_fields = ['student']

@admin.register(models.Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'date', 'start_time', 'end_time', 'session_type', 'course']
    list_filter = ['tutor', 'date', 'session_type', 'course']
    search_fields = ['tutor__user__username', 'course__name']
    ordering = ['date', 'start_time']
    readonly_fields = ['date', 'start_time', 'end_time', 'course']
    fieldsets = [
        ('Meta', {'fields': ['tutor', 'session_type']}),
        ('Date and Time', {'fields': ['date', 'start_time', 'end_time']}),
        ('Course', {'fields': ['course']}),
    ]
    inlines = [SessionMemberInline]
