from django.urls import reverse
from rest_framework.test import APITestCase
from user.models import User

REGISTER_URL = reverse('local:register')
LOGIN_URL = reverse('local:login')
REGISTER_USER_DATA = {
    'first_name': 'John',
    'last_name': 'Doe',
    'username': 'johndoe',
    'gender': True,
    'email': 'john.doe@udh.edu.pe',
    'password': 'password123',
}
LOGIN_USER_DATA = {
    'email_username': 'john.doe@udh.edu.pe',
    'password': 'password123',
}

class BaseTest(APITestCase):
    def register(self, data=REGISTER_USER_DATA):
        self.client.post(REGISTER_URL, data, format='json')

    def login(self, data=LOGIN_USER_DATA):
        self.client.post(LOGIN_URL, data, format='json')

    def get_user(self, data=REGISTER_USER_DATA):
        self.register(data=data)
        user = User.objects.get(username=data['username'])
        return user
    
    def get_and_login_user(self, data=REGISTER_USER_DATA):
        user = self.get_user(data)
        self.client.post(
            LOGIN_URL, 
            {'email_username': data['email'], 'password': data['password']},
            format='json'
        )
        return user