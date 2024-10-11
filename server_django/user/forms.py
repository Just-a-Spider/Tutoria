from user.models import User
from unfold.forms import UserChangeForm as UnfoldUserChangeForm, UserCreationForm as UnfoldUserCreationForm

class UserAdminForm(UnfoldUserChangeForm):
    class Meta:
        model = User
        fields = '__all__'

class UserCreationAdminForm(UnfoldUserCreationForm):
    class Meta:
        model = User
        fields = '__all__'