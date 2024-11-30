import requests
from django.conf import settings
from django.shortcuts import redirect
from courses.models import Course, Faculty
from profiles.models import StudentProfile, TutorProfile
from django.db import transaction
from django.utils import timezone
from user.api.serializers import CustomTokenObtainPairSerializer


from social_core.pipeline.partial import partial
from user.models import User
from django.contrib.auth.hashers import make_password

@partial
def create_user(backend, user=None, response=None, *args, **kwargs):
    if user:
        return {'user': user}

    email = response.get('email')
    first_name = response.get('given_name')
    last_name = response.get('family_name')

    from server.utils.user_utils import create_random_username
    #Generate a random username
    username = create_random_username()

    # Create an encrypted password
    password = make_password(None)

    # Check if a Student with the given username already exists
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'password': password
        }
    )

    return {'user': user}

def login_success_response(user):
    refresh = CustomTokenObtainPairSerializer.get_token(user)
    access_token = refresh.access_token
    refresh_token = str(refresh)
    user.last_login = timezone.now()
    user.save()

    response = redirect(settings.LOGIN_REDIRECT_URL)
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=str(access_token),
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )

    return response

def fetch_google_classroom_courses(backend, user, response, *args, **kwargs):
    if backend.name != 'google-oauth2':
        return

    access_token = response.get('access_token')
    if not access_token:
        return

    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    # Fetch the user's Google Classroom courses
    courses_url = 'https://classroom.googleapis.com/v1/courses'
    response = requests.get(courses_url, headers=headers)
    if response.status_code != 200:
        return

    courses_data = response.json().get('courses', [])

    # Link the user with Tutor and Student profiles
    tutor_profile, _ = TutorProfile.objects.get_or_create(user=user)
    student_profile, _ = StudentProfile.objects.get_or_create(user=user)

    # Use a transaction to ensure atomicity
    with transaction.atomic():
        for course_data in courses_data:
            if course_data.get('courseState') != 'ACTIVE':
                continue

            course_name = course_data.get('name')
            course_faculty = course_data.get('descriptionHeading').split(': ')[1]

            # Get or create the faculty
            faculty, _ = Faculty.objects.get_or_create(name=course_faculty)

            # Get or create the course
            course, created = Course.objects.get_or_create(
                name=course_name.split(' (')[0],
                defaults={'semester': 1, 'faculty': faculty}
            )

            # Link the course to the student profile
            course.students.add(student_profile)

    # Login the user with JWT from the user's view
    return login_success_response(user)

