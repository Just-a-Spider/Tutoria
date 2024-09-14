from channels.db import database_sync_to_async
from django.db import close_old_connections
from channels.sessions import CookieMiddleware, SessionMiddleware
from channels.auth import AuthMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser

@database_sync_to_async
def get_user(scope):
    close_old_connections()
    headers = dict(scope['headers'])
    access_token = None

    if b'cookie' in headers:
        cookie_str = headers[b'cookie'].decode()
        cookies_dict = dict(item.split("=") for item in cookie_str.split("; "))
        access_token = cookies_dict.get('access_token')

    if not access_token:
        return AnonymousUser()
    
    jwt_auth = JWTAuthentication()
    try:
        validated_token = jwt_auth.get_validated_token(access_token)
        user = jwt_auth.get_user(validated_token)
    except Exception:
        user = AnonymousUser()
    return user

class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)
        
def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))