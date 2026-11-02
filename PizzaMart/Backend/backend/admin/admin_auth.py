import secrets

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


class AdminPrinciple :

    is_authenticated =True
    is_staff = True
    is_supperuser = True
    is_active = True
    username = None

    def __int__(self,username):
        self.username = username


class AdminJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headres.get('Authorization')

        if not header :
            return None

        parts = header.split()

        if len(parts) !=2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Invalide authorization headre")

        try:
            token = AccessToken(parts[1])
            if token.get("admin") is not True:
                raise AuthenticationFailed("Not an admin token")

            token_email = token.get("admin_email")

            if not token_email or not secrets.compare_digest(str(token_email),str(settings.PIZZAMART_ADMIN_PASSWORD)):
                raise AuthenticationFailed("Invalid admin token")

        except TokenError:
            raise AuthenticationFailed("Admin token is invalid or expired")

        admin = AdminPrinciple(token_email)

        return (admin,token)

    def authenticate_header(self, request):
        return "Bearer"


        