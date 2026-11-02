from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import AllowAny
from  rest_framework_simplejwt.tokens import RefreshToken,AccessToken
import secrets
class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]


    def post(self,request):
        email = request.data.get("email").strip()
        password = request.data.get("password")

        if not email or not password:
            return Response({
                "error":"Email and password required"
            },status=status.HTTP_400_BAD_REQUEST)
        email_valid = secrets.compare_digest(email.lower(),settings.PIZZAMART_ADMIN_EMAIL.strip().lower())
        password_valid = secrets.compare_digest(password,settings.PIZZAMART_ADMIN_PASSWORD)


        if not email_valid or not password_valid : 
            return Response({
                "message":"Invalid admin email or password"
            },status=status.HTTP_401_UNAUTHORIZED)

        token = AccessToken()
        token['admin'] = True
        token['admin_email'] = email
        return Response({
            "message":"Admin login successful",
            "access": str(token),
            "email":email
        },status=status.HTTP_200_OK)
        