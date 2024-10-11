from django import forms
from profiles.models import StudentProfile, TutorProfile

class StudentProfileForm(forms.ModelForm):
    class Meta:
        model = StudentProfile
        fields = '__all__'

class TutorProfileForm(forms.ModelForm):
    class Meta:
        model = TutorProfile
        fields = '__all__'