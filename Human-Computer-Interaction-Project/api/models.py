from django.contrib.auth import get_user_model as user_model
from django.db import models
from django.urls import reverse
from django.template.defaultfilters import truncatechars

User = user_model()


class Comment(models.Model):
    content_id = models.BigIntegerField(null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    body = models.TextField(max_length=255, null=False, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.content_id) + '-' + self.body[:15]

    def get_absolute_url(self):
        return reverse('movie_details', args=[str(self.content_id)])

    @property
    def short_description(self):
        return truncatechars(self.body, 35)

class Genre(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Movie(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    overview = models.TextField()
    release_date = models.DateField()
    vote_average = models.FloatField()
    poster_path = models.CharField(max_length=255)
    backdrop_path = models.CharField(max_length=255)
    popularity = models.FloatField()
    adult = models.BooleanField()
    imdb_id = models.CharField(max_length=255)
    genre_ids = models.ManyToManyField(Genre)

    def __str__(self):
        return self.title

    def get_genre_names(self):
        return self.genre_ids.values_list('name', flat=True)

    def get_genre_ids(self):
        return self.genre_ids.values_list('id', flat=True)

    def get_genre_names_str(self):
        return ', '.join(self.get_genre_names())

    def get_genre_ids_str(self):
        return ', '.join(map(str, self.get_genre_ids()))
