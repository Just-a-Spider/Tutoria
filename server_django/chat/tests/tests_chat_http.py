from django.urls import reverse
from rest_framework.test import APITestCase
from chat.models import Chat
from user.models import User
from profiles.models import TutorProfile, StudentProfile

REGISTER_URL = reverse('local:register')
LOGIN_URL = reverse('local:login')
REGISTER_USER_DATA_1 = {
    'first_name': 'John',
    'last_name': 'Doe',
    'gender': False,
    'username': 'johndoe',
    'email': 'john.doe@udh.edu.pe',
    'password': 'password123'
}
REGISTER_USER_DATA_2 = {
    'first_name': 'Jane',
    'last_name': 'Doe',
    'gender': True,
    'username': 'janedoe',
    'email': 'jane.doe@udh.edu.pe',
    'password': 'password123'
}
LOGIN_USER_DATA = {
    'email_username': 'john.doe@udh.edu.pe',
    'password': 'password123',
}

class HttpChatsListTest(APITestCase):
    def setUp(self):
        self.client.post(REGISTER_URL, REGISTER_USER_DATA_1, format='json')
        self.client.post(REGISTER_URL, REGISTER_USER_DATA_2, format='json')
        self.client.post(LOGIN_URL, LOGIN_USER_DATA, format='json')
        tutor_profile = TutorProfile.objects.get(
            user=User.objects.get(
                email=REGISTER_USER_DATA_1['email']
            )
        )
        student_profile = StudentProfile.objects.get(
            user=User.objects.get(
                email=REGISTER_USER_DATA_2['email']
            )
        )
        Chat.objects.create(
            tutor=tutor_profile,
            student=student_profile
        )

    def test_get_chats_list(self):
        response = self.client.get(reverse('chats-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tutor'], REGISTER_USER_DATA_1['email'])
        self.assertEqual(response.data[0]['student'], REGISTER_USER_DATA_2['email'])

    def test_get_chat_by_id(self):
        chat_id = Chat.objects.first().id
        response = self.client.get(reverse('chat-detail', kwargs={'chat_id': chat_id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['tutor'], REGISTER_USER_DATA_1['email'])
        self.assertEqual(response.data['student'], REGISTER_USER_DATA_2['email'])
        self.assertEqual(response.data['id'], str(chat_id))
        self.assertEqual(response.data['last_message'], None)
