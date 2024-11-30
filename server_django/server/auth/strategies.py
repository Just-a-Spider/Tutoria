from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser

class AuthenticationStrategy:
    def authenticate(self, headers):
        raise NotImplementedError
    
class CookieAuthenticationStrategy(AuthenticationStrategy):
    def authenticate(self, headers):
        if b'cookie' in headers:
            cookie_str = headers[b'cookie'].decode()
            cookies_dict = dict(item.split("=") for item in cookie_str.split("; "))
            access_token = cookies_dict.get('access_token')
            if access_token:
                jwt_auth = JWTAuthentication()
                try:
                    validated_token = jwt_auth.get_validated_token(access_token)
                    user = jwt_auth.get_user(validated_token)
                    return user
                except Exception:
                    return AnonymousUser()
        return AnonymousUser()
    
class TokenAuthenticationStrategy(AuthenticationStrategy):
    def authenticate(self, headers):
        if b'authorization' in headers:
            access_token = headers[b'authorization'].decode().split(' ')[1]
            jwt_auth = JWTAuthentication()
            try:
                validated_token = jwt_auth.get_validated_token(access_token)
                user = jwt_auth.get_user(validated_token)
                return user
            except Exception:
                return AnonymousUser()
        return AnonymousUser()  