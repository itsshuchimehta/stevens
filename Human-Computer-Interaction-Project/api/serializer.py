# from django.contrib.auth.models import User. Group
from django.contrib.auth.hashers import make_password

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Comment, Genre, Movie

from django.contrib.auth import get_user_model as user_model


User = user_model()


class CommentSerializer(ModelSerializer):
    """
    Serializer for Comment model
    """
    class Meta:
        model = Comment
        fields = '__all__'


class GenreSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(allow_null=True)

    # class Meta:
    #     model = Genre
    #     fields = '__all__'


class MovieSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(allow_null=True)
    overview = serializers.CharField(allow_null=True)
    release_date = serializers.DateField(allow_null=True)
    vote_average = serializers.FloatField(allow_null=True)
    poster_path = serializers.CharField(allow_null=True)
    backdrop_path = serializers.CharField(allow_null=True)
    popularity = serializers.FloatField(allow_null=True)
    adult = serializers.BooleanField(allow_null=True)
    imdb_id = serializers.CharField(allow_null=True)
    vote_average = serializers.FloatField(allow_null=True)
    vote_count = serializers.IntegerField(allow_null=True)
    genres = serializers.ListField(allow_null=True)
