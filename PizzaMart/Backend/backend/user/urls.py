from django.urls import path
from .views import SingupView,LoginView

urlpatterns = [
    path('auth/signup/',SingupView.as_view(),name='signup'),
    path('auth/login/',LoginView.as_view(),name='login')
]
