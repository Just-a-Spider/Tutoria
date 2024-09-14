from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from courses.models import Faculty, Course

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

class BaseTest(APITestCase):
    def register_user(self):
        return self.client.post(REGISTER_URL, REGISTER_USER_DATA, format='json')

    def login_user(self):
        return self.client.post(LOGIN_URL, LOGIN_USER_DATA, format='json')
    
    def create_course(self):
        faculty = Faculty.objects.create(name='Engineering')
        self.course = Course.objects.create(name='Calculus', semester=1, faculty=faculty)

    def setUp(self):
        self.create_course()
        self.register_user()
        self.login_user()

class PostTests(BaseTest):
    def test_create_offer_help_post(self):
        url = reverse('offer-help-posts-list')
        data = {
            'title': 'Offer Help Post',
            'description': 'This is an offer help post',
            'subject': 'Math',
            'course': str(self.course.id)
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_request_help_post(self):
        url = reverse('request-help-posts-list')
        data = {
            'title': 'Request Help Post',
            'description': 'This is a request help post',
            'subject': 'Math',
            'course': str(self.course.id)
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class CommentTests(BaseTest):
    def create_posts(self):
        url = reverse('offer-help-posts-list')
        data = {
            'title': 'Offer Help Post',
            'description': 'This is an offer help post',
            'subject': 'Math',
            'course': str(self.course.id)
        }
        response = self.client.post(url, data, format='json')
        self.offer_post_id = response.data['id']
        url = reverse('request-help-posts-list')
        data = {
            'title': 'Request Help Post',
            'description': 'This is a request help post',
            'subject': 'Math',
            'course': str(self.course.id)
        }
        response = self.client.post(url, data, format='json')

    def test_create_comment_offer_help_post(self):
        self.create_posts()
        url = reverse('offer-help-posts-comments', args=[self.offer_post_id])
        data = {
            'content': 'This is a comment'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_comment_request_help_post(self):
        self.create_posts()
        url = reverse('request-help-posts-comments', args=[self.offer_post_id])
        data = {
            'content': 'This is a comment'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        