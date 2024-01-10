from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username=username, password=password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(
        max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    # profile_picture = models.ImageField(
    #     upload_to='profile_pictures', blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    objects = CustomUserManager()
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username
