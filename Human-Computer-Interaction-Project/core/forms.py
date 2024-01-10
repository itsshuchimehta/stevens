
from django.contrib.auth.forms import UserCreationForm
from django import forms

from api.models import Comment
from django.contrib.auth import get_user_model
User = get_user_model()


class CommentForm(forms.ModelForm):

    body = forms.CharField(
        required=True,
        widget=forms.Textarea(
            attrs={
                'class': 'form-control',
                'placeholder': 'What do you think...?',
                'rows': 2,
            }
        )
    )

    class Meta:
        model = Comment
        fields = ['body', 'content_id', 'user']


class CustomUserCreationForm(UserCreationForm):

    username = forms.CharField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Username',
            }
        )
    )

    password1 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password',
                'autocomplete': 'new-password',
            }
        )
    )

    password2 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Confirm Password',
                'autocomplete': 'new-password',
            }
        )
    )

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')
