
from django.contrib.auth.models import User
from rest_framework.test import APITestCase


class SignupTest(APITestCase):
    def test_signup_success(self):

        data ={
            "username":"testuser",
            "email":"testuser@gmail.com",
            "password":"123456",
            "confirm_password":"123456"
        }

        response = self.client.post("/api/user/auth/signup/",data,format="json")
        self.assertEqual(response.status_code,201)

    def test_signup_password_mismatch(self):

        data = {
            "username":"testuser",
            "email":"test@gmail.com",
            "password":"123456",
            "confirm_password":"654321"
        }
        response = self.client.post("/api/user/auth/signup/",data,format="json")

        self.assertEqual(response.status_code,400)