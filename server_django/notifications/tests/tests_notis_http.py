from django.urls import reverse
from server.utils.test_base_test import BaseTest
from chat.models import Chat
from user.models import User

REGISTER_USER_DATA_2 = {
    'first_name': 'Jane',
    'last_name': 'Doe',
    'gender': True,
    'username': 'janedoe',
    'email': 'jane.doe@udh.edu.pe',
    'password': 'password123'
}

