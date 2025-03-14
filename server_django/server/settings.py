import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import sys

dotenv_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-@91^aooc_7yz4q$kvro-hpd#$wa=8(87to50=ip*&o9j-e0wel' or os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'


# CORS
if not DEBUG:
    ALLOWED_HOSTS = [
        # Heroku
        '.herokuapp.com',
    ]
    CORS_ALLOWED_ORIGINS = [
        'https://tutoria-server-c8883323cac2.herokuapp.com',
        'https://tutoria-frontend-2ac82f8af039.herokuapp.com',
        'https://accounts.google.com'    
    ]
    CORS_ALLOW_CREDENTIALS = True

    CSRF_TRUSTED_ORIGINS = [
        'https://tutoria-frontend-2ac82f8af039.herokuapp.com',   
        'https://tutoria-server-c8883323cac2.herokuapp.com',
        'https://accounts.google.com'
    ]
else:
    ALLOWED_HOSTS = ['*']
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'refresh', # To refresh the token from mobile
    'auth-x-mobile', # To know if the request is from mobile
    'x-api-key',  # Add the X-API-KEY header here
    'x-requested-with',
    'accept',
    'origin',
    'user-agent',
    'dnt',
    'cache-control',
    'x-csrftoken',
    'x-frame-options',
]

# Application definition

INSTALLED_APPS = [
    # Channels
    'daphne',
    'channels',

    # Aesthetic
    "unfold",

    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    # 'django.contrib.postgres', # new
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',

    # CORS
    'corsheaders',    

    # Social auth
    'social_django',

    # Local apps
    'user',
    'profiles',
    'chat',
    'notifications',
    'courses',
    'posts',
    'tutoring_sessions',

    # S3
    'storages',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Static Files
    'corsheaders.middleware.CorsMiddleware', # CORS
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',  # Google Auth
]

# If enabled, add API Key Middleware
if os.getenv('EAK', 'False') == 'True':
    MIDDLEWARE.append(
        'server.middleware.api_key.APIKeyMiddleware',  # API Key
    )

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'server/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'

ASGI_APPLICATION = 'server.asgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DB_ENGINE'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'NAME': os.getenv('DB_NAME'),
            'HOST': os.getenv('DB_HOST'),
            'PORT': os.getenv('DB_PORT'),
        }
    }
else:
    import dj_database_url

    DATABASES = {
        'default': dj_database_url.config(
            default=os.getenv('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }

    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
            "OPTIONS": {
                "access_key": os.environ.get('AWS_ACCESS_KEY'),
                "secret_key": os.environ.get('AWS_SECRET_ACCESS_KEY'),
                "bucket_name": os.environ.get('AWS_STORAGE_BUCKET_NAME'),
            },
        },
        "staticfiles": {
            "BACKEND":'whitenoise.storage.CompressedManifestStaticFilesStorage',
        }
    }

# Channels
REDIS_URL = os.getenv('REDISCLOUD_URL')

if REDIS_URL == '' or REDIS_URL is None:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        }
    }
else:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                'hosts': [REDIS_URL],
            },
        },
    }

if 'test' in sys.argv:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Lima'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'server/templates'),
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Rest_auth settings
REST_AUTH = {
    #'LOGIN_SERIALIZER': 'accounts.serializers.CustomLoginSerializer',
    #'TOKEN_SERIALIZER': 'accounts.serializers.CustomTokenSerializer',  #Esto es por si necesitamos más adelante
    #'REGISTER_SERIALIZER': 'accounts.serializers.CustomRegisterSerializer',
    #'USER_DETAILS_SERIALIZER': 'accounts.serializers.UsuarioSerializer',
}

# Rest Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'server.middleware.auth.CustomJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'PAGE_SIZE': 5,
}

# Simple JWT settings
SIMPLE_JWT = {
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=2),
    'ACCESS_TOKEN_LIFETIME': timedelta(days=3),
    'AUTH_COOKIE': 'access_token',  # Cookie name. Enables cookies if value is set.
    'REFRESH_TOKEN': 'refresh_token',  # Cookie name. Enables cookies if value is set.
    'AUTH_COOKIE_DOMAIN': None,     # A string like "example.com", or None for standard domain cookie.
    'AUTH_COOKIE_SECURE': True,    # Whether the auth cookies should be secure (https:// only).
    'AUTH_COOKIE_HTTP_ONLY' : True, # Http only cookie flag.It's not fetch by javascript.
    'AUTH_COOKIE_PATH': '/',        # The path of the auth cookie.
    'AUTH_COOKIE_SAMESITE': 'None',  # The SameSite flag of the auth cookie.
}

# AllAuth settings
#AUTH_USER_MODEL = 'accounts.BaseUser'
#ACCOUNT_EMAIL_VERIFICATION = 'none'

# Email settings
UNIVERSITY_DOMAIN = 'udh.edu.pe'

# Social Auth settings
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('GOOGLE_OAUTH2_SECRET')

SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
]

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

LOGIN_REDIRECT_URL = os.getenv('LOGIN_REDIRECT_URL')
LOGOUT_REDIRECT_URL = os.getenv('LOGOUT_REDIRECT_URL')

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'user.social.social_auth_pipeline.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
    'user.social.social_auth_pipeline.fetch_google_classroom_courses',  # Add this line
)

# Email Settings
# https://docs.djangoproject.com/en/5.0/topics/email/
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend" 
if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"                                   # Your email host
EMAIL_USE_TLS = True                                            # Do not question it, just use it
EMAIL_PORT = 587                                                # Same here
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')                  # your email address
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')          # your password
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER          


# Auth settings
AUTH_USER_MODEL = 'user.User'

# Unfold settings
from server.utils.unfold_settings import UNFOLD_SETTINGS
UNFOLD = UNFOLD_SETTINGS

# API Key
API_KEY = os.getenv('API_KEY')
