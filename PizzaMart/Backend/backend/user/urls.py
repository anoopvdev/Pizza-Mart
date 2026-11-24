from django.urls import path
from .views import *
from .views import login_user
from admin .views import AdminLoginView
from products .views import *
from .order_views import *

urlpatterns = [
    path('google/',GoogleLoginView.as_view(),name='google-login'),
   
    path('signup/',SendSignupOTPView.as_view(),name='signup'),
    
    path("signup/verify-otp/",VerifySingupOTPview.as_view(),name="verify-otp"),
    path('login/',login_user,name="user"),
    path("forgot-password/",forgotPasswordView.as_view(),name='forgot-password'),
    path("verify-reset-otp/",VerifyRestOTPView.as_view(),name='verify-rest-otp'),
    path('reset-password/',RestPasswordView.as_view(),name='reset-password'),
    path('resend-reset-otp/',ResendResetOTPView.as_view(),name="resend-reset-otp"),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('cart/',CartViews.as_view(),name='cart'),
    path('cart/<int:item_id>/',CartViews.as_view(),name='cart-items'),
    path('login/',AdminLoginView.as_view(),name='admin'),
    path('products/',UserProductListView.as_view(),name='user-products'),
    path('orders/checkout/',CheckoutAPIView.as_view(),name='checkout'),
    path('orders/verify-payment/',VerifyRazorpayPaymentAPIView.as_view(),name='verify-payment'),
    path('orders/',MyOrdersAPIView.as_view(),name='orders'),
    path('orders/<str:order_number>/cancel/',OrderDetailAPIView.as_view(),name='order-cancel'),
    path("orders/<str:order_number>/refund-request/",RefundRequestAPIViews.as_view(),name='refund-request'),
    path("orders/<str:order_number>/",OrderDetailAPIView.as_view(),name='order-detail'),
    path('addresses/',AddressListCreateAPIView.as_view(),name='address-list'),
    path('addresses/<int:pk>/',AddressDetailAPIView.as_view(),name='address-details'),
    path('addresses/<int:pk>/make-default/',MakeDefaultAddressAPIView.as_view(),name='make-default-address'),
    path('contact/',ContactView.as_view(),name='contact-message'),
    
]

