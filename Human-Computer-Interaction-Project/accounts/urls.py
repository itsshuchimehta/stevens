from django.contrib import admin
from django.urls import path, include

from .views import *


urlpatterns = [

    # Sign up user
    path('signup/', RegisterView.as_view(), name='signup'),

    # Login user
    path('login/', LoginView.as_view(), name='login'),

    # Authenticated User details
    path('user/', UserView.as_view(), name='user'),

    # Logout user
    path('logout/', LogoutView.as_view(), name='logout'),
]
