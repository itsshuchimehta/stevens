from rest_framework import serializers
from rest_framework.validators import ValidationError

from .models import User


class SignUpSerializer(serializers.ModelSerializer):
    """
    Serializer for User model for registration
    """
    email = serializers.EmailField(required=True, max_length=255)
    username = serializers.CharField(max_length=255, required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Create a new user with the given validated data.
        """
        password = validated_data.pop('password')

        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate(self, attrs):
        """
        Check if the given attributes are valid.
        """
        email_exists = User.objects.filter(email=attrs['email']).exists()
        username_exists = User.objects.filter(
            username=attrs['username']).exists()

        if email_exists:
            raise ValidationError('Email already exists.')
        if username_exists:
            raise ValidationError('Username already exists.')

        return super().validate(attrs)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name',
                  'last_name', 'date_of_birth', 'is_staff')
