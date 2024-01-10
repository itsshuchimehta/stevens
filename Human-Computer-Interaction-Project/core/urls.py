
from django.urls import include, path


from core.views import (
    Home,
    MovieDetailView,
    SignUpView,
    TvSeriesDetailView,
    GenresContentView,
    AllMovieView,
    AllSeriesView,
)

urlpatterns = [
    path("", Home.as_view(), name="home"),

    path("movie-detail/<int:movie_id>/",
         MovieDetailView.as_view(), name="movie_details"),

    path("series-detail/<int:movie_id>",
         TvSeriesDetailView.as_view(), name="series_details"),

    path("genre/<int:genre_id>/<str:genre_name>/",
         GenresContentView.as_view(), name="genre_content"),

    path("movies/", AllMovieView.as_view(), name="movies"),

    path("tv-series/", AllSeriesView.as_view(), name="series"),

    path("signup/", SignUpView.as_view(), name="signup"),
]
