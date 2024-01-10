# from rest_framework.authtoken.admin import TokenAdmin
from django.contrib import admin

from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'short_description',
        'content_id',
        'date_created',
        'user',
    ]
    list_filter = ('user', 'date_created', 'content_id')
    readonly_fields = ('date_created', 'user', 'content_id', 'body')
    search_fields = ('user__username', 'content_id', 'body')
    ordering = ('-date_created',)
    date_hierarchy = 'date_created'
    fieldsets = (
        (None, {
            'fields': ('user', 'content_id', 'body')
        }),
        ('Date Information', {
            'fields': ('date_created',),
        }),
    )
