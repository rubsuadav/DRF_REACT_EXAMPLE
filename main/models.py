from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Project(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(max_length=1000, blank=True)
    done = models.BooleanField(default=False)
    tasks = models.ManyToManyField(Task)

    def __str__(self):
        return self.title


class Person(models.Model):
    name = models.CharField(max_length=200, unique=True)
    age = models.IntegerField()
    projects = models.ManyToManyField(Project)
    tasks = models.ManyToManyField(Task)

    def __str__(self):
        return self.name
