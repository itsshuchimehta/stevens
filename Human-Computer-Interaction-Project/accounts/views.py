from django.shortcuts import render

from .models import User
from .serializer import SignUpSerializer, UserSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed

import jwt
import datetime


JWT_SECRET_KEY = 'SECRET_KEY'


class RegisterView(generics.GenericAPIView):
    """
    # To register a new user.
    """
    serializer_class = SignUpSerializer

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_data = {
            "details": "User created successfully",
            "data": serializer.data
        }
        return Response(data=response_data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    # To login a user.
    """

    def post(self, request: Request) -> Response:
        password = request.data['password']
        username = request.data['username']

        user = User.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        jwt_token = jwt.encode(payload, JWT_SECRET_KEY,
                               algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=jwt_token, httponly=True)
        response.data = {
            'jwt': jwt_token
        }
        return response


class UserView(APIView):
    """
    # To get user details if the user is authenticated.
    """

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()

        serializer = UserSerializer(user)

        return Response(data=serializer.data)


class LogoutView(APIView):
    """
    # To logout a user.
    """

    def post(self, request: Request) -> Response:
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'details': 'success'
        }
        response.status_code = status.HTTP_200_OK
        return response
