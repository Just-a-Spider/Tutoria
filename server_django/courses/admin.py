from django.contrib import admin
from courses import models

class CourseStudentsInline(admin.TabularInline):
    model = models.CourseStudents
    extra = 1

class CourseTutorsInline(admin.TabularInline):
    model = models.CourseTutors
    extra = 1

class CourseTryOutsInline(admin.TabularInline):
    model = models.TutorTryOuts
    extra = 1

@admin.register(models.Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    fieldsets = (
        (None, {'fields': ('name',)}),
    )

@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'faculty')
    search_fields = ('name',)
    fieldsets = (
        (None, {'fields': ('name', 'faculty')}),
    )
    inlines = [CourseStudentsInline, CourseTutorsInline, CourseTryOutsInline]

@admin.register(models.CourseTutors)
class CourseTutorsAdmin(admin.ModelAdmin):
    list_display = ('tutor', 'course',)
    search_fields = ('tutor__user__username', 'course__name',)
    fieldsets = (
        (None, {'fields': ('course', 'tutor')}),
    )

@admin.register(models.TutorTryOuts)
class TutorTryOutsAdmin(admin.ModelAdmin):
    readonly_fields = ('last_tryout', 'started_at',)
    list_display = ('tutor', 'course',)
    search_fields = ('tutor__user__username', 'course__name',)
    fieldsets = (
        ('Data', {'fields': ('course', 'tutor')}),
        ('Status', {'fields': ('tryouts_left', 'calification', 'started_at', 'last_tryout')}),
    )