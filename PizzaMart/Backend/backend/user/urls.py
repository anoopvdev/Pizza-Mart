from django.urls import path
from .views import *
from .views import login_user
from admin .views import AdminLoginView
urlpatterns = [
    # path('signup/',SingnUpViews.as_view(),name='signUp'),
    # path('verify/',VerifyOTP.as_view(),name='verify'),
    path('signup/',SendSignupOTPView.as_view(),name='signup'),
    # path('login/',LoginView.as_view(),name='login'),
    path("signup/verify-otp/",VerifySingupOTPview.as_view(),name="verify-otp"),
    path('login/',login_user,name="login"),
    path("forgot-password/",forgotPasswordView.as_view(),name='forgot-password'),
    path("verify-reset-otp/",VerifyRestOTPView.as_view(),name='verify-rest-otp'),
    path('reset-password/',RestPasswordView.as_view(),name='reset-password'),
    path('resend-reset-otp/',ResendResetOTPView.as_view(),name="resend-reset-otp"),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('cart/',CartViews.as_view(),name='cart'),
    path('cart/<int:item_id>/',CartViews.as_view(),name='cart-items'),
    path('login/',AdminLoginView.as_view(),name='admin')
    
]
