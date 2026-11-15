from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('login/',AdminLoginView.as_view(),name='admin'),
    path('users/',AdminUserListView.as_view(),name='admin-user'),
    path('users/<int:pk>/',AdminUserDetailView.as_view(),name='admin-user-detail'),
    path('token/refresh/',TokenRefreshView.as_view(),name='taken-refresh'),
    path('dashboard/',AdminDashboardView.as_view(),name="admin-dashboard"),
    path('contact-message/',AdminContactMessageView.as_view(),name='admin-contact-message'),
    path('contact-message/<int:pk>/',AdminContactEnquiryDetailsView.as_view(),name='admin-contact-detail')
    

]
