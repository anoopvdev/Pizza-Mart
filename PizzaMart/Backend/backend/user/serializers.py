from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
class SingupSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(
        write_only = True,
        required = True
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'phone',
            'password',
            'confirm_password'
            
        ]

        extra_kwargs = {
            'password ':{
                'write_only':True
            }
        }
    def validate(self,data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password':'Password do not match'
            })
        return data
    def create(self,validated_data):
        validated_data.pop('confirm_password')
        phone = validated_data.pop('phone')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone = validated_data['phone'],
            password=validated_data['password']
            

        )
        return user

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