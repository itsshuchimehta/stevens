from django.contrib import admin
from django.urls import path, include

from .views import (
    CommentListCreateAPIView,
    UserCommentListAPIView,
    CommentDetailDataView,
    ContentCommentsAPIView,
    CommentDeleteAPIView,
    CommentUpdateAPIView,

    TopRatedMovieListView,
    MovieDetailView,
    GenreListView
)

urlpatterns = [

    # List all comments & Create a new comment
    path('comment/', CommentListCreateAPIView.as_view()),

    # List all comments of a user
    path('comment/user/', UserCommentListAPIView.as_view()),

    # Retrieve a comment details
    path('comment/<int:pk>/', CommentDetailDataView.as_view()),

    # Get comments for a given content_id
    path('comment/content/<int:content_id>/',
         ContentCommentsAPIView.as_view()),

    # Delete a comment
    path('comment/<int:pk>/delete/', CommentDeleteAPIView.as_view()),

    # Update a comment
    path('comment/<int:pk>/update/', CommentUpdateAPIView.as_view()),



    # List all movies
    path('movie/top_rated/', TopRatedMovieListView.as_view()),

    # Movie details
    path('movie/<int:movie_id>/', MovieDetailView.as_view(), name='movie-detail'),

    # List all genres
    path('genre/', GenreListView.as_view()),
]
