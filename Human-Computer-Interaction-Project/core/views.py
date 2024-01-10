import random
import requests
from api.models import Comment
from .forms import (
    CommentForm,
    CustomUserCreationForm,
)

from django.conf import settings
from django.shortcuts import render
from django.views.generic import (
    TemplateView,
    ListView,
    CreateView
)
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.urls import reverse, reverse_lazy

from django.contrib.auth import get_user_model
User = get_user_model()


API_KEY = settings.MOVIE_API_KEY


def request_data(url):
    try:
        try:
            response = requests.get(url,
                                    timeout=5,
                                    headers={'Content-Type': 'application/json'})
        except requests.Timeout:
            response = None
        if not response or response.status_code != 200:
            response = requests.get(url,
                                    timeout=5,
                                    headers={'Content-Type': 'application/json'})
            if response.status_code != 200:
                return None
    except (ConnectionError, requests.Timeout):
        return None

    results = response.json()

    return results


def get_movie_cast(movie_id: int):
    url = "https://api.themoviedb.org/3/movie/"+movie_id + \
        "/credits?api_key="+API_KEY+"&language=en-US"
    return request_data(url)['cast']


def get_similar_movie(movie_id: int):
    url = "https://api.themoviedb.org/3/movie/"+movie_id + \
        "/similar?api_key="+API_KEY+"&language=en-US&page=1"
    return request_data(url)['results']


def get_popular():
    url = "https://api.themoviedb.org/3/movie/popular?api_key="+API_KEY + \
        "&language=en-US&page=1&append_to_response=videos"
    return request_data(url)['results']


def get_top_rated():
    url = "https://api.themoviedb.org/3/movie/top_rated?api_key="+API_KEY + \
        "&language=en-US&page=1&append_to_response=videos"
    return request_data(url)['results']


def get_upcoming():
    url = "https://api.themoviedb.org/3/movie/upcoming?api_key="+API_KEY + \
        "&language=en-US&page=1&append_to_response=videos"
    return request_data(url)['results']


def get_trending():
    url = "https://api.themoviedb.org/3/trending/movie/day?api_key="+API_KEY
    return request_data(url)['results']


def get_latest_tv_series(page=1):
    url = "https://api.themoviedb.org/3/tv/on_the_air?api_key=" + \
        API_KEY+"&language=en-US&page="+str(page)
    results = request_data(url)['results']
    return results


def get_movie_detail(movie_id: str):
    url = "https://api.themoviedb.org/3/movie/"+str(movie_id) + \
        "?api_key="+API_KEY+"&language=en-US"
    return request_data(url)


def get_tv_series_detail(tv_id: str):
    url = "https://api.themoviedb.org/3/tv/"+str(tv_id) + \
        "?api_key="+API_KEY+"&language=en-US"
    return request_data(url)


def get_tv_series_cast(tv_id):
    url = "https://api.themoviedb.org/3/tv/"+str(tv_id) + \
        "/credits?api_key="+API_KEY+"&language=en-US"
    return request_data(url)['cast']


def get_tv_series_similar(tv_id):
    url = "https://api.themoviedb.org/3/tv/"+str(tv_id) + \
        "/similar?api_key="+API_KEY+"&language=en-US&page=1"
    return request_data(url)['results']


def get_movie_with_genre(genre_id):
    url = "https://api.themoviedb.org/3/discover/movie?api_key=" + \
        API_KEY + "&with_genres=" + str(genre_id)
    return request_data(url)['results']


def get_show_with_genre(genre_id):
    url = "https://api.themoviedb.org/3/discover/tv?api_key=" + \
        API_KEY + "&with_genres=" + str(genre_id)
    return request_data(url)['results']


def get_popular_tv_series():
    url = "https://api.themoviedb.org/3/tv/popular?api_key=" + \
        API_KEY + "&&language=en-US&page=1"
    return request_data(url)['results']


def get_top_rated_tv_series():
    url = "https://api.themoviedb.org/3/tv/top_rated?api_key=" + \
        API_KEY + "&language=en-US"
    return request_data(url)['results']


class Home(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, *args, **kwargs):

        popular_movies = get_popular()
        kwargs['carousel'] = popular_movies[:5]
        kwargs['popular_movies'] = popular_movies[5:17]

        upcoming_movies = get_upcoming()
        kwargs['upcoming'] = upcoming_movies[:12]

        top_rated_movies = get_top_rated()
        kwargs['top_rated'] = top_rated_movies[:12]

        latest_tv_series = get_latest_tv_series()
        kwargs['latest_tv_series'] = latest_tv_series[:12]

        kwargs['genres'] = settings.GENERES
        return super().get_context_data(**kwargs)


class ContentDetailView(CreateView):
    model = Comment
    form_class = CommentForm

    def post(self, request, **kwargs):
        if request.method == 'POST':
            request.POST._mutable = True
            movie_id = self.kwargs['movie_id']
            comment = request.POST.get('body')

            request.POST['content_id'] = movie_id
            request.POST['user'] = self.request.user
            request.POST._mutable = False
            form = CommentForm()
            if form.is_valid():
                form.save()
            else:
                print(form.errors)

        return super(ContentDetailView, self).post(request, **kwargs)


class MovieDetailView(ContentDetailView):
    template_name = 'movie_detail.html'

    def get_context_data(self, *args, **kwargs):
        movie_id = str(self.kwargs['movie_id'])
        kwargs['movie'] = get_movie_detail(movie_id)

        comments = Comment.objects.filter(content_id=movie_id).order_by('-date_created')
        kwargs['comments'] = comments

        kwargs['genres'] = settings.GENERES
        kwargs['credits'] = get_movie_cast(movie_id)
        kwargs['similar'] = get_similar_movie(movie_id)[:18]

        return super().get_context_data(**kwargs)


class TvSeriesDetailView(ContentDetailView):
    template_name = 'tv_series_detail.html'

    def get_context_data(self, *args, **kwargs):
        series_id = str(self.kwargs['movie_id'])
        kwargs['series'] = get_tv_series_detail(series_id)

        comments = Comment.objects.filter(content_id=series_id)
        kwargs['comments'] = comments

        kwargs['genres'] = settings.GENERES
        kwargs['credits'] = get_tv_series_cast(series_id)
        kwargs['similar'] = get_tv_series_similar(series_id)[:18]

        return super().get_context_data(**kwargs)


class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("home")
    template_name = "registration/signup.html"

    def get_context_data(self, *args, **kwargs):
        kwargs['genres'] = settings.GENERES
        return super().get_context_data(**kwargs)


class GenresContentView(TemplateView):
    template_name = "movie_results.html"

    def get_context_data(self, *args, **kwargs):
        content_id = str(self.kwargs['genre_id'])
        kwargs["content"] = get_movie_with_genre(content_id)
        kwargs["title"] = self.kwargs['genre_name']
        kwargs['genres'] = settings.GENERES
        return super().get_context_data(**kwargs)


class AllMovieView(TemplateView):
    template_name = "movie_results.html"

    def get_context_data(self, **kwargs):

        popular = get_popular()
        trending = get_trending()
        upcoming = get_upcoming()

        movie_list = popular + trending + upcoming
        # print(movie_list)
        # content = random.shuffle(movie_list)

        kwargs['content'] = movie_list
        kwargs['genres'] = settings.GENERES

        return super().get_context_data(**kwargs)


class AllSeriesView(TemplateView):
    template_name = "tv_results.html"

    def get_context_data(self, **kwargs):

        latest = get_latest_tv_series()
        top_rated = get_top_rated_tv_series()
        popular = get_popular_tv_series()

        content = latest + top_rated + popular

        kwargs['content'] = content
        kwargs['genres'] = settings.GENERES

        return super().get_context_data(**kwargs)
