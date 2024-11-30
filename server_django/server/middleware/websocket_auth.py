from channels.db import database_sync_to_async
from django.db import close_old_connections
from channels.sessions import CookieMiddleware, SessionMiddleware
from channels.auth import AuthMiddleware
from server.auth.strategies import CookieAuthenticationStrategy, TokenAuthenticationStrategy
from server.auth.authenticator import Authenticator

@database_sync_to_async
def get_user(scope):
    close_old_connections()
    headers = dict(scope['headers'])

    # Check for the Auth-X-Mobile header
    is_mobile = headers.get(b'auth-x-mobile', b'false') == b'true'

    if is_mobile:
        strategy = TokenAuthenticationStrategy()
    else:
        strategy = CookieAuthenticationStrategy()

    authenticator = Authenticator(strategy)
    user = authenticator.authenticate(headers)
    return user

class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)
        
def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))