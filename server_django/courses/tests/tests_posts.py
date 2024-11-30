from django.urls import reverse
from rest_framework import status
from server.utils.test_base_test import BaseTest
from courses.models import Faculty, Course
from server_django.posts.models import OfferHelpPost, RequestHelpPost

class PostTests(BaseTest):
    def setUp(self):
        self.user = self.get_and_login_user()
        self.faculty = Faculty.objects.create(name='Faculty')
        self.course = Course.objects.create(
            name='Calculus',
            semester=1,
            faculty=self.faculty
        )

    def test_create_offer_help_post(self):
        url = reverse('course-offer-help-posts-list', kwargs={'course_id': self.course.id})
        data = {
            'title': 'Offer Help Post',
            'description': 'This is an offer help post',
            'subject': 'Math',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_request_help_post(self):
        url = reverse('course-request-help-posts-list', kwargs={'course_id': self.course.id})
        data = {
            'title': 'Request Help Post',
            'description': 'This is a request help post',
            'subject': 'Math',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class CommentTests(BaseTest):
    def setUp(self):
        self.user = self.get_and_login_user()
        self.faculty = Faculty.objects.create(name='Faculty')
        self.course = Course.objects.create(
            name='Calculus',
            semester=1,
            faculty=self.faculty
        )
        self.offer_post = OfferHelpPost.objects.create(
            title='Offer Help Post',
            description='This is an offer help post',
            subject='Math',
            tutor=self.user.tutorprofile,
            course=self.course
        )
        self.request_post = RequestHelpPost.objects.create(
            title='Request Help Post',
            description='This is a request help post',
            subject='Math',
            student=self.user.studentprofile,
            course=self.course
        )
        
    def create_posts(self):
        url = reverse('course-offer-help-posts-list', kwargs={'course_id': self.course.id})
        data = {
            'title': 'Offer Help Post',
            'description': 'This is an offer help post',
            'subject': 'Math',
        }
        self.client.post(url, data, format='json')
        url = reverse('course-request-help-posts-list', kwargs={'course_id': self.course.id})
        data = {
            'title': 'Request Help Post',
            'description': 'This is a request help post',
            'subject': 'Math',
        }
        self.client.post(url, data, format='json')

    def test_create_comment_offer_help_post(self):
        self.create_posts()
        url = reverse('offer-help-post-comments-list', kwargs={'course_id': self.course.id, 'post_pk': self.offer_post.id})
        data = {
            'content': 'This is a comment'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_comment_request_help_post(self):
        self.create_posts()
        url = reverse('request-help-post-comments-list', kwargs={'course_id': self.course.id, 'post_pk': self.request_post.id})
        data = {
            'content': 'This is a comment'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        