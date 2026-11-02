from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .serializers import *
import secrets
from datetime import timedelta
from django.contrib.auth.hashers import make_password,check_password
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import EmailOTP,passwordRestOTP,UserProfile
from django.contrib.auth import get_user_model
import logging
import hashlib
from django.conf import settings
from django.core.validators import validate_email
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
logger = logging.getLogger(__name__)

User = get_user_model()
"""----------------------------SignUp views----------------------------"""


"""----------------------------verifyOtp views----------------------------"""




            



# """------------------------------------------------Sample 2---------------------------------"""
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):

    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response({
            "error": "Username and Password are required"
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return Response({
            "error": "Invalid username or password"
        }, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({
            "error": "Please verify your email first."
        }, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "username": user.username,
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }, status=status.HTTP_200_OK)
# OTP verification

# """------------------------------------------------Sample 3---------------------------------"""
class SendSignupOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        
        # 1. Validate signup data
        if not serializer.is_valid():
            return Response(
                {
                    "message": "Signup validation failed.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        username = data["username"]
        email = data["email"].strip().lower()
        phone = data["phone"]
        password = data["password"]

        
        otp = f"{secrets.randbelow(1_000_000):06d}"
        print(otp)

        try:
            
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    phone=phone,
                    password=password,
                    is_active=False,
                )

                EmailOTP.objects.create(
                    user=user,
                    otp_hash=make_password(otp),
                    expires_at=timezone.now() + timedelta(minutes=5),
                )

                # 4. Send OTP email
                sent = send_mail(
                    subject="PizzaMart Email Verification OTP",
                    message=(
                        f"Hello {username},\n\n"
                        f"Your PizzaMart verification code is {otp}.\n"
                        "It expires in 5 minutes.\n\n"
                        "If you did not request this code, "
                        "please ignore this email."
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )

                if sent != 1:
                    raise RuntimeError("OTP email was not sent.")

        except Exception:
            logger.exception("Signup OTP failed")

            return Response(
                {
                    "message": "Could not complete signup or send OTP. "
                               "Please check your email configuration."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Return success without exposing the OTP or password
        return Response(
            {
                "message": "OTP sent successfully. Verify your email within 5 minutes.",
                "email": email,
            },
            status=status.HTTP_200_OK
        )


class VerifySingupOTPview(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self,request):
        email = request.data.get("email","").strip().lower()
        otp = request.data.get("otp","").strip()

        if not email or not otp:
            return Response({
                "error":"Email and OTP are required"
            },status=status.HTTP_400_BAD_REQUEST)
        if not otp.isdigit() or len(otp) !=6:
            return Response({
                "error":"Enter a valid 6-digit OTP"
            },status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                user = User.objects.select_for_update().get(email__iexact=email,is_active=False,)
                record = EmailOTP.objects.select_for_update().filter(user=user).order_by("-id").first()
                if user is None:
                    return Response({
                        "error":"No otp found. Please signup again"
                    },status=status.HTTP_400_BAD_REQUEST)
            
                if timezone.now() >= record.expires_at:
                    record.delete()
                    user.delete()
                    return Response({
                        "error":"OTP expired.Please signup again"
                    },status=status.HTTP_400_BAD_REQUEST)
                if record.attempts >=5:
                    return Response({
                        "error":"Too many attempts. please sign up again"
                    },status=status.HTTP_429_TOO_MANY_REQUESTS)
                record.attempts +=1
                if not check_password(otp,record.otp_hash):
                    record.save(update_fields=["attempts"])
                    return Response({
                        "error":"Incorrect OTP"
                    },status=status.HTTP_400_BAD_REQUEST)
                user.is_active =True
                user.save(update_fields=["is_active"])
                record.delete()
        except(User.DoesNotExist,EmailOTP.DoesNotExist):
            return Response({
                "error":"No pending verification found. Please signup again"
            },status=status.HTTP_400_BAD_REQUEST)
        return Response({
            "message":"Email verified Successfully. You con now log in"
        },status=status.HTTP_200_OK)
def hash_reset_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class forgotPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    

    def post(self, request):
        email = request.data.get("email", "")
        
    
        
        if not isinstance(email, str):
            return Response(
                {"error": "Email must be a string."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.strip()

        if not email:
            return Response(
                {"error": ["Email is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.filter(email__iexact=email)
        if user is None:
            return Response({
                "error":"This email is not registered"
            },status=status.HTTP_404_NOT_FOUND)

        generic_message = (
            "If an account exists for this email, "
            "password-reset instructions will be sent."
        )

        user = User.objects.filter(email__iexact=email).first()

        print("EMAIL RECEIVED:", repr(email))
        print("USER FOUND:", user is not None)
        print("USER ACTIVE:", user.is_active if user else None)


        logger.info(
            "Password reset requested: user_found=%s, active=%s",
            user is not None,
            user.is_active if user else None,
        )

        # Do not send OTP for unknown or inactive accounts.
        if not user or not user.is_active:
            return Response(
                {"error":"Please verify your email first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = f"{secrets.randbelow(1_000_000):06d}"
        expires_at = timezone.now() + timedelta(minutes=5)

        passwordRestOTP.objects.update_or_create(
            user=user,
            defaults={
                "otp_hash": make_password(otp),
                "expires_at": expires_at,
                "attempts": 0,
                "reset_token_hash": "",
                "reset_token_expires_at": None,
            },
        )

        subject = "PizzaMart Password Reset OTP"
        message = (
            f"Hello {user.username},\n\n"
            "You requested to reset your PizzaMart password.\n\n"
            f"Your OTP is: {otp}\n\n"
            "This OTP expires in 5 minutes.\n"
            "Do not share this OTP with anyone.\n\n"
            "Thank you,\n"
            "PizzaMart Team"
        )

        try:
            print("OTP GENERATED")
            print("ABOUT TO SEND EMAIL TO:", user.email)
            sent = send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            print("EMAIL SEND RESULT:", sent)

            logger.info(
                "Password reset email result: sent=%s, recipient=%s",
                sent,
                user.email,
            )

            if sent != 1:
                raise RuntimeError("Email backend did not send the message.")

        except Exception:
            logger.exception("Failed to send password-reset OTP")

            passwordRestOTP.objects.filter(user=user).delete()

            return Response(
                {
                    "error": (
                        "Unable to send the email right now. "
                        "Please try again."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {"message": generic_message},
            status=status.HTTP_200_OK,
        )


class VerifyRestOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes=[]
    def post(self,request):
        email = request.data.get('email',"").strip()
        otp = request.data.get('otp',"").strip()
        if not  otp:
            return Response({
                "error":"Email and OTP are required"
            },status=status.HTTP_400_BAD_REQUEST)
        if len(otp) != 6 or not otp.isdigit():
            return Response({
                "error":"Enter a valid 6-digit OTP."
            },status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email__iexact=email,is_active=True).first()
        if not user:
            return Response({
                "error":"Invalid or expired otp"
            },status=status.HTTP_400_BAD_REQUEST)
        try:
            reset_otp = passwordRestOTP.objects.get(user=user)

        except passwordRestOTP.DoesNotExist:
            return Response({
                "error":"Invalide or expire OTP"
            },status=status.HTTP_400_BAD_REQUEST)
        if reset_otp.expires_at <=timezone.now():
            reset_otp.delete()
            return Response({
                "error":"OTP has expire.Please request another"
            },status=status.HTTP_400_BAD_REQUEST)
        if reset_otp.attempts >=5:
            reset_otp.delete()
            return Response({
                "error":"Too many attemts.Please request another OTP"
            },status=status.HTTP_429_TOO_MANY_REQUESTS)
        if not check_password(otp,reset_otp.otp_hash):
            reset_otp.attempts +=1
            reset_otp.save(update_fields=["attempts"])
            return Response({
                "error":"Invalide or expire otp"
            },status=status.HTTP_400_BAD_REQUEST)
        reset_token = secrets.token_urlsafe(32)
        reset_otp.reset_token_hash = hash_reset_token(reset_token)
        reset_otp.reset_token_expires_at=(timezone.now() + timedelta(minutes=5))
        reset_otp.save(update_fields=["reset_token_hash","reset_token_expires_at"])
        return Response({
            "message":"OTP verified. You can rest your password",
            "reset_token":reset_token
        },status=status.HTTP_200_OK)

class RestPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes =[]

    def post(self,request):
        email = request.data.get('email',"").strip()
        reset_token = request.data.get("reset_token","")
        new_password = request.data.get('new_password',"")
        confirm_password = request.data.get('confirm_password',"")
        if not all([email,reset_token,new_password,confirm_password]):
            return Response({
                "error":"All feilds are required"
            },status=status.HTTP_400_BAD_REQUEST)
        if new_password != confirm_password:
            return Response({
                "confirm_password":["Password does not match"]
            },status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({
                "new_password":["password must be at least 8 character"]
            },status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email__iexact=email).first()
        if not user :
            return Response({
                "error":"Invalid or expire reset session"
            },status=status.HTTP_400_BAD_REQUEST)
        try :
            reset_otp =passwordRestOTP.objects.get(user=user)
        except passwordRestOTP.DoesNotExist:
            return Response({
                "error":"Invalide or expired reset session"
            },status=status.HTTP_400_BAD_REQUEST)
        if (
            not reset_otp.reset_token_hash
            or not reset_otp.reset_token_expires_at
            or reset_otp.reset_token_expires_at <=timezone.now()
            or not secrets.compare_digest(reset_otp.reset_token_hash,hash_reset_token(reset_token))
        ):
            return Response({
                "error" :"Invalide or expired reset session"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password,user=user)
        except ValidationError as exc:
            return Response({
                "new_password": list(exc.messages)
            },status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save(update_fields=["password"])
        reset_otp.delete()
        return Response({
            "message":"Password reset successful . Please login"
        },status=status.HTTP_200_OK)

#  REsend Otp views.....................

class ResendResetOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes =[]


    def post(self,request):
        email = request.data.get('email',"").strip()
        if not email :
            return Response({
                "error":"Email is Required."
            },status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email__iexact = email,is_active=True).first()
        if not user:
            return Response({
                "error":(
                    "This email is not exists."
                )
            },status=status.HTTP_400_BAD_REQUEST)
        otp = f"{secrets.randbelow(1_000_000):06d}"
        print(otp)
        try:
            sent = send_mail(
                subject= "Pizza Mart Password Reset OTP",
                message=(
                    f"Your new PizzaMart password-reset OTP is :{otp} \n\n"
                    "This OTP expires in 5 minuties."
                    "Do not share with anyone."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False
            )
            if sent !=1:
                raise RuntimeError ("Email was not sent.")

            passwordRestOTP.objects.update_or_create(
                user=user,
                defaults={
                    "otp_hash":make_password(otp),
                    "expires_at":timezone.now()+timedelta(minutes=5),
                    "attempts":0,
                    "reset_token_hash":"",
                    "reset_token_expires_at":None,
                },
            )
        except Exception:
            logger.exception("Failed to resend password reset OTP.")
            return Response({
                "error":(
                    "Unable to resend OTP right now .Please try again"
                )
            },status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({
            "message":"A new OTP has sent to your registered email."
        },status=status.HTTP_200_OK)

# User profile View

class UserProfileView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, JSONParser, FormParser]

    def get_profile(self, user):
        profile, created = UserProfile.objects.get_or_create(
            user=user
        )
        return profile

    # GET PROFILE
    def get(self, request):

        # profile = self.get_profile(request.user)
        UserProfile.objects.get_or_create(user=request.user)

        serializer = UserProfileSerializer(
            request.user,
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # UPDATE PROFILE
    def patch(self, request):

        # profile = self.get_profile(request.user)
        UserProfile.objects.get_or_create(user=request.user)

        serializer = UserProfileSerializer(
           request.user,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "Profile updated successfully",
                "profile": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # FULL PROFILE UPDATE
    def put(self, request):

        profile = self.get_profile(request.user)

        serializer = UserProfileSerializer(
            profile,
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "Profile updated successfully",
                "profile": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# Cart Views

class CartViews(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self,request):
        cart,created = Cart.objects.get_or_create(user=request.user)
        items = CartItems.objects.filter(cart=cart)
        data = []
        for item in items:
            data.append({
                "id":item.id,
                "pizza_id":item.pizzas.id,
                "name":item.pizzas.name,
                "price":float(item.pizzas.price),
                "qunatity":item.quantity,
                "subtotal":float(item.pizzas.price * item.quantity)
            })
            return Response({
                "cart_id":cart.id,
                "items":data
            })
        serializer = CartSerializer(cart)
        return Response(serializers.data)

    def post(self,request):
        user = request.user
        Cart.objects.get_or_create(user=user)
        pizza_id = request.data.get('pizza_id')
        quantity = request.data.get("quantity",1)

        try:
            quantity = int(quantity)
            if quantity < 1:
                raise ValueError()
        except (ValueError,TypeError):
            return Response(
                {
                    "error":"Qantity must be a positive"
                },status=status.HTTP_400_BAD_REQUEST
            )
        try:
            pizza = Pizzas.objects.get(id=pizza_id,is_available= True)
        except Pizzas.DoesNotExist:
            return Response({
                "error":"Product not found"
            },status=status.HTTP_404_NOT_FOUND)

        cart,create = Cart.objects.get_or_create(user=request.user)
        cart_items,created = CartItems.objects.get_or_create(cart=cart,pizza=pizza,defaults={"qunatity":quantity})
        if not create:
            cart_items.quantity += quantity
            cart_items.save()
            return Response({
                "message":"Product added to cart successfully"
            },status=status.HTTP_200_OK)

    def patch(self,request,item_id):
        try:
            cart = Cart.objects.get(user=request.user)
            item = CartItems.objects.get(id=item_id,cart=cart)
        except(Cart.DoesNotExist,CartItems.DoesNotExist):
            return Response({
                "error":"Cart items not found"
            },status=status.HTTP_404_NOT_FOUND)
        action = request.data.get("action")

        if action == "increase":
            item.quantity +=1

        elif action == "decrease":
            item.quantity -=1
            if item.quantity <=0:
                item.delete()
                return Response({
                    "message":"Item removed from cart"
                })
        else:
            return Response({
                "error":"Invalid action"
            },status=status.HTTP_400_BAD_REQUEST)
        item.save()
        return Response({
            "message":"Cart qunatity updated",
            "qunatity": item.quantity
        })

    def delete(self,request,item_id):

        try:
            cart =Cart.objects.get(user=request.user)
            item = CartItems.objects.get(id=item_id,cart=cart)
        except(Cart.DoesNotExist,CartItems.DoesNotExist):
            return Response({
                "error":"Cart item not found"
            },status=status.HTTP_404_NOT_FOUND)
        item.delete()

        return Response({
            "message":"Item removed successfully",
            
        },status=status.HTTP_200_OK)


