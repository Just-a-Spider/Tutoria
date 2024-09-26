from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from server.utils.test_base_test import BaseTest

REGISTER_URL = reverse('local:register')
LOGIN_URL = reverse('local:login')
REGISTER_USER_DATA = {
    'first_name': 'John',
    'last_name': 'Doe',
    'gender': False,
    'username': 'johndoe',
    'email': 'john.doe@udh.edu.pe',
    'password': 'password123'
}
LOGIN_USER_DATA = {
    'email_username': 'john.doe@udh.edu.pe',
    'password': 'password123',
}

class RegisterViewTests(APITestCase):
    def test_register_success(self):
        response = self.client.post(REGISTER_URL, REGISTER_USER_DATA, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['detail'], 'Registro Exitoso')

    def test_register_invalid_email(self):
        invalid_email_data = REGISTER_USER_DATA.copy()
        invalid_email_data['email'] = 'john.doe@gmail.com'
        response = self.client.post(REGISTER_URL, invalid_email_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Correo no pertenece a la universidad')

    def test_register_existing_user(self):
        self.client.post(REGISTER_URL, REGISTER_USER_DATA, format='json')
        response = self.client.post(REGISTER_URL, REGISTER_USER_DATA, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class LoginViewsTests(BaseTest):
    def setUp(self):
        self.register()

    def test_login_success(self):
        response = self.client.post(LOGIN_URL, LOGIN_USER_DATA, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Login successful')

    def test_login_invalid_credentials(self):
        invalid_login_data = {
            'email_username': LOGIN_USER_DATA['email_username'],
            'password': 'wrongpassword'
        }
        response = self.client.post(LOGIN_URL, invalid_login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Credenciales Incorrectas')

class MeLogoutViewsTests(BaseTest):
    def setUp(self):
        self.user = self.get_and_login_user()

    def test_me_success(self):
        url = reverse('local:me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Create the expected data dictionary without the password field
        self.assertEqual(response.data['email'], self.user.email)

    def test_logout_success(self):
        url = reverse('local:logout')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Logout successful')

    # Change the token expiration time to 1 second for testing purposes
    # def test_with_expired_access_token(self): 
    #     import time
    #     time.sleep(4)
    #     url = reverse('me')
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class RefreshTokenViewTests(BaseTest):
    def setUp(self):
        self.user = self.get_and_login_user()

    def test_refresh_token_success(self):
        url = reverse('local:refresh')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
