# APIKey Middleware for Django REST Framework
from rest_framework import exceptions
from django.conf import settings

class APIKeyMiddleware():
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'oauth' in request.path:
            return self.get_response(request)
        if request.path.startswith('/api/'):
            api_key = request.headers.get('X-API-KEY')
            if api_key != settings.API_KEY:
                raise exceptions.AuthenticationFailed('Invalid API key')
        response = self.get_response(request)
        return response