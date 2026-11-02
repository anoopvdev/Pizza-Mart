import re
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
# from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import *

DISPOSABLE_DOMAINS = {"mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com"}
"""-----------------------------------Sample test------------------"""

User = get_user_model()
class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(
        write_only = True
    )

    def validate(self,data):
        username = data['username']
        password = data['password']

        user = authenticate(
            username = username,
            password = password
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalied username or password "
            )
        refresh = RefreshToken.for_user(user)
        return{
            "message" : "Login successful",
            
            "user" :{
                "id":user.id,
                "username":user.username,
                "password":user.password
            },
            "refresh" : str(refresh),
            "access" : str(refresh.access_token),
        }

"""---------------------------------------------Validated serializer------------------------------"""

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=3)
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        value = value.strip()

        if not re.fullmatch(r'^[A-Za-z]+(?:\s[A-Za-z]+)*$', value):
            raise serializers.ValidationError(
                "Username must contain letters only."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Username already taken."
            )

        return value

    def validate_email(self, value):
        email = value.strip().lower()

        pattern = r'^[a-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'

        if not re.fullmatch(pattern, email):
            raise serializers.ValidationError(
            "Enter a valid email address."
            )

        if '..' in email:
            raise serializers.ValidationError(
            "Email cannot contain consecutive dots."
        )

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
            "This email is already registered."
        )

        return email

    def validate_phone(self, value):
        value = value.strip()

        if not re.fullmatch(r"[6-9]\d{9}", value):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian phone number."
            )

        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "This phone number is already registered."
            )

        return value

    def validate_password(self, value):
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        try:
            django_validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)

        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": [
                    "Passwords do not match."
                ]
            })

        return data

class VerifyUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()

# User profile update serializer 
class UserProfileSerializer(serializers.ModelSerializer):

    gender = serializers.CharField(
        source="profile.gender",
        required=False,
        allow_blank=True
    )

    profile_image = serializers.ImageField(
        source="profile.profile_image",
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "email",
            "phone",
            "gender",
            "profile_image",
        ]
        read_only_fields = ["id"]

    def validate_username(self, value):
        value = value.strip()

        if not re.fullmatch(r"[A-Za-z]+", value):
            raise serializers.ValidationError(
                "Username must contain letters only."
            )

        queryset = User.objects.filter(username__iexact=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        queryset = User.objects.filter(email__iexact=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    def validate_phone(self, value):
        value = value.strip()

        queryset = User.objects.filter(phone=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This phone number is already registered."
            )

        return value

    def update(self, instance, validated_data):

        profile_data = validated_data.pop("profile", {})

        # Update User table
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        # Update UserProfile table
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(
                user=instance
            )

            for field, value in profile_data.items():
                setattr(profile, field, value)

            profile.save()

        return instance

# class ContactMessageSerializer(serializers.Serializer):
#     name = serializers.CharField(max_length=100)
#     email = serializers.EmailField(max_length=254)
#     phone = serializers.CharField(max_length=20,req)


#  Cart Serializer

class CartItemsSerializer(serializers.Serializer):
    pizza_name = serializers.CharField(source = "pizza.name",read_only = True)
    product_price = serializers.DecimalField(source="pizza.price",max_digits=10,decimal_places=2,read_only=True)
    class Meta:
        model = CartItems
        fields = [
            "id",
            "pizza",
            "pizza_name",
            "pizza_price",
            "qunatity"
        ]
class CartSerializer(serializers.Serializer):
    items = CartItemsSerializer(many = True , read_only = True)
    class Meta:
        model = Cart
        fields = ["id","items"]  
