from django.contrib import admin
from profiles import models
from profiles.forms import StudentProfileForm, TutorProfileForm
from profiles.filters import RatingRangeFilter
from courses.models import Course

class StudentCourseInline(admin.TabularInline):
    model = Course.students.through
    extra = 0
    verbose_name_plural = "Courses"

class TutorCourseInline(admin.TabularInline):
    model = Course.tutors.through
    extra = 0
    verbose_name_plural = "Courses"

@admin.register(models.StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    form = StudentProfileForm
    list_display = ('user', 'profile_picture')
    search_fields = ('user__username', 'user__email')
    fieldsets = (
        (None, {'fields': ('user', 'profile_picture')}),
    )
    inlines = [StudentCourseInline]

@admin.register(models.TutorProfile)
class TutorProfileAdmin(admin.ModelAdmin):
    form = TutorProfileForm
    list_display = ('user', 'profile_picture', 'bio', 'rating', 'helped')
    list_filter = ('user__is_active', RatingRangeFilter)
    search_fields = ('user__username', 'user__email')
    fieldsets = (
        (None, {'fields': ('user', 'profile_picture', 'bio', 'rating', 'helped')}),
    )
    inlines = [TutorCourseInline]
