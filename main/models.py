from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)


class Project(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(max_length=1000, blank=True)
    done = models.BooleanField(default=False)
    tasks = models.ManyToManyField(Task)
