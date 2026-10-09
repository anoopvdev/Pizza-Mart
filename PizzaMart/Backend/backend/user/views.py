from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import SingupSerializer,LoginSerializer


class SingupView(APIView):
    def post(self,request):
        serializer = SingupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "Singup successful",
                    "user":{
                        "id" : user.id,
                        "username":user.username,
                        "email":user.email,
                        'password':user.password
                        
                    }
                },status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,status=status.HTTP_400_BAD_REQUEST
        )

class LoginView(APIView):
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(
                serializer.validated_data,status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )