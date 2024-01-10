from django.conf import settings

import requests

from rest_framework import (
    permissions,
    status
)
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    DestroyAPIView,
    UpdateAPIView,
    ListCreateAPIView,
)
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from .models import Comment
from .serializer import (
    CommentSerializer,
    MovieSerializer,
    GenreSerializer,
)


MOVIE_API_KEY = settings.MOVIE_API_KEY


class MoviePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class TopRatedMovieListView(ListAPIView):
    """
    # API for accessing the list of movies that are top rated.
    """
    serializer_class = MovieSerializer
    pagination_class = MoviePagination

    def get_queryset(self):
        page = self.request.query_params.get('page')
        response = requests.get('https://api.themoviedb.org/3/movie/top_rated', params={
            'api_key': MOVIE_API_KEY,
            'language': 'en-US',
            'page': page,
        })
        data = response.json()
        return data.get("results", [])

    def list(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MovieDetailView(RetrieveAPIView):
    """
    # API for getting details for movie a movie.
    """
    serializer_class = MovieSerializer

    def get(self, request, movie_id):
        url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={MOVIE_API_KEY}'
        response = requests.get(url)

        data = response.json()
        # Check if the TMDb API response is successful
        if response.status_code == requests.codes.ok:
            serializer = self.serializer_class(data)
            # return Response(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Map TMDb status code to standard REST status code
            if response.status_code == 404:
                status_code = status.HTTP_404_NOT_FOUND
            else:
                status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            message = data.get('status_message', 'Unknown error')
            return Response({'detail': message}, status=status_code)


class GenreListView(APIView):
    """
    # API for accessing the list of genres.
    """
    serializer_class = GenreSerializer

    def get(self, request):
        url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={MOVIE_API_KEY}'
        response = requests.get(url)

        data = response.json()
        print(data)
        # Check if the TMDb API response is successful
        if response.status_code == requests.codes.ok:
            serializer = self.serializer_class(data)
            return Response(data)
            return Response(serializer.data)
        else:
            # Map TMDb status code to standard REST status code
            if response.status_code == 404:
                status_code = status.HTTP_404_NOT_FOUND
            else:
                status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            message = data.get('status_message', 'Unknown error')
            return Response({'detail': message}, status=status_code)

    # def get(self, request):
    #     data = self._get_genre_data()
    #     serializer = self.serializer_class(data=data[0], many=True)
    #     if serializer.is_valid():
    #         return Response(data)
    #         return Response(serializer.data)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def _get_genre_data(self):
    #     url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={MOVIE_API_KEY}'
    #     response = requests.get(url)
    #     data = response.json()

    #     if response.status_code == requests.codes.ok:
    #         return data.get('genres', [])
    #     else:
    #         raise Exception(
    #             f'TMDb API error: {data.get("status_message", "Unknown error")}')


class CommentListCreateAPIView(ListCreateAPIView):
    """
    # List all comments & Create a new comment
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Comment.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentDetailDataView(RetrieveAPIView):
    """
    # Retrieve a comment details
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class CommentDeleteAPIView(DestroyAPIView):
    """
    # Delete a comment
    After checking if the request user is the owner of the comment
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, *args, **kwargs):
        instance = self.get_object()
        if instance.user == self.request.user:
            self.perform_destroy(instance)
            return Response(
                {"detail": "Comment deleted!"},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": "You are not the owner of this comment!"},
            status=status.HTTP_400_BAD_REQUEST
        )


class UserCommentListAPIView(ListAPIView):
    """
    # List all comments of a user
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(user=user)


class CommentUpdateAPIView(UpdateAPIView):
    """
    # API to update a comment by the owner of the comment
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, *args, **kwargs):
        instance = self.get_object()
        if instance.user == self.request.user:
            self.perform_update(instance)
            return Response(
                {"detail": "Comment updated!"},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": "You are not the owner of this comment!"},
            status=status.HTTP_400_BAD_REQUEST
        )


class ContentCommentsAPIView(APIView):
    """
    # API to get comments for a given content
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, content_id, *args, **kwargs):
        """
        # API to FETCH comments for a given content id.
        args:
            * content_id: id of the content
            * type: int

        returns:
            * list: comments for a given content id
            * type: list of dict
        """
        comment_instance = Comment.objects.filter(
            content_id=content_id).order_by('-date_created')
        if not comment_instance:
            return Response(
                {"detail": "Object with given id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = CommentSerializer(comment_instance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
