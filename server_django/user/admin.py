from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from user import models
from .forms import UserAdminForm, UserCreationAdminForm
from django.urls import reverse
from django.utils.html import format_html

class UserAdmin(BaseUserAdmin):
    form = UserAdminForm
    add_form = UserCreationAdminForm

    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'last_login', 'student_profile_link', 'tutor_profile_link')    
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    fieldsets = (
        ('User info', {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username','password1', 'password2'),
        }),
    )
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('date_joined',)
    filter_horizontal = ('groups', 'user_permissions',)

    def formfield_for_dbfield(self, db_field, **kwargs):
        formfield = super().formfield_for_dbfield(db_field, **kwargs)
        if db_field.name == 'username':
            formfield.label = 'Código'
        return formfield

    def student_profile_link(self, obj):
        if hasattr(obj, 'studentprofile'):
            url = reverse('admin:profiles_studentprofile_change', args=[obj.studentprofile.id])
            return format_html('<a href="{}">See Profile</a>', url)
        return 'No Profile'

    def tutor_profile_link(self, obj):
        if hasattr(obj, 'tutorprofile'):
            url = reverse('admin:profiles_tutorprofile_change', args=[obj.tutorprofile.id])
            return format_html('<a href="{}">See Profile</a>', url)
        return 'No Profile'

    student_profile_link.short_description = 'Student Profile'
    tutor_profile_link.short_description = 'Tutor Profile'

@admin.register(models.PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('email', 'token', 'created_at')
    search_fields = ('email', 'token')
    fieldsets = (
        (None, {'fields': ('email', 'token', 'created_at')}),
    )

# Register the User model last to change the order
admin.site.register(models.User, UserAdmin)