from django.urls import reverse
from server.utils.test_base_test import BaseTest
from chat.models import Chat
from user.models import User
from profiles.models import TutorProfile, StudentProfile

REGISTER_USER_DATA_2 = {
    'first_name': 'Jane',
    'last_name': 'Doe',
    'gender': True,
    'username': 'janedoe',
    'email': 'jane.doe@udh.edu.pe',
    'password': 'password123'
}

class HttpChatsListTest(BaseTest):
    def setUp(self):
        self.user = self.get_and_login_user()
        self.user2 = self.get_user(data=REGISTER_USER_DATA_2)
        tutor_profile = TutorProfile.objects.get(
            user=User.objects.get(
                email=self.user.email
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
        response = self.client.get(reverse('chat-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tutor'], self.user.email)
        self.assertEqual(response.data[0]['student'], self.user2.email)

    def test_get_chat_by_id(self):
        chat_id = Chat.objects.first().id
        response = self.client.get(reverse('chat-detail', kwargs={'chat_id': chat_id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['tutor'], self.user.email)
        self.assertEqual(response.data['student'], self.user2.email)
        self.assertEqual(response.data['id'], str(chat_id))
        self.assertEqual(response.data['last_message'], None)
