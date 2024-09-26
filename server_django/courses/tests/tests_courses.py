from server.utils.test_base_test import BaseTest
from django.urls import reverse
from courses import models

class TestCourse(BaseTest):
    def setUp(self):
        self.faculty = models.Faculty.objects.create(
            name='Test Faculty',
        )
        self.course = models.Course.objects.create(
            name='Test Course',
            semester=1,
            faculty=self.faculty,
        )

    def test_create_course(self):
        self.assertEqual(self.course.name, 'Test Course')
        self.assertEqual(self.course.semester, 1)
        self.assertEqual(self.course.faculty, self.faculty)

class TestCourseViewset(BaseTest):
    def setUp(self):
        self.faculty = models.Faculty.objects.create(
            name='Test Faculty',
        )
        self.course = models.Course.objects.create(
            name='Test Course',
            semester=1,
            faculty=self.faculty,
        )
        self.user = self.get_and_login_user()
        
    def test_get_courses(self):
        response = self.client.get(reverse('course-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Course')
        self.assertEqual(response.data[0]['semester'], 1)
        self.assertEqual(response.data[0]['faculty'], 'Test Faculty')

    def test_get_course(self):
        response = self.client.get(reverse('course-detail', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Test Course')
        self.assertEqual(response.data['semester'], 1)
        self.assertEqual(response.data['faculty'], 'Test Faculty')

    def test_get_students(self):
        self.course.students.add(self.user.studentprofile)
        response = self.client.get(reverse('course-students', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user']['username'], self.user.username)

    def test_add_student(self):
        response = self.client.post(reverse('course-add-student', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 201)
        self.assertIn(self.user.studentprofile, self.course.students.all())

    def test_remove_student(self):
        self.course.students.add(self.user.studentprofile)
        response = self.client.delete(reverse('course-remove-student', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 204)
        self.assertNotIn(self.user.studentprofile, self.course.students.all())

    def test_get_tutors(self):
        self.course.tutors.add(self.user.tutorprofile)
        response = self.client.get(reverse('course-tutors', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user']['username'], self.user.username)

    def test_add_tutor(self):
        response = self.client.post(reverse('course-add-tutor', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 201)
        self.assertTrue(models.TutorTryOuts.objects.filter(tutor=self.user.tutorprofile, course=self.course).exists())

    def test_remove_tutor(self):
        self.course.tutors.add(self.user.tutorprofile)
        response = self.client.delete(reverse('course-remove-tutor', kwargs={'id': self.course.id}))
        self.assertEqual(response.status_code, 204)
        self.assertNotIn(self.user.tutorprofile, self.course.tutors.all())
