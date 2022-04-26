from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class GameEntry(models.Model):
    statusTypes = [
        ("NP", "Not Played"),
        ("CP", "Currently Playing"),
        ("C", "Completed"),
        ("DNF", "Did Not Finish")
    ]

    title = models.CharField(max_length=50, blank=False)
    genre = models.CharField(max_length=50, blank=True)
    console = models.CharField(max_length=50, blank=False)
    service = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=500, unique=False, blank=True)
    status = models.CharField(max_length=50, unique=False, choices=statusTypes)
    owned = models.BooleanField(null=False, default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)

class List(models.Model):
    title = models.CharField(max_length=50, default="",blank=False)
    gameEntries = models.ManyToManyField(GameEntry)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
