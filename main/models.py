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


class Products(models.Model):
    name = models.CharField(max_length=200, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return f'Producto {self.name} - {self.price} €'
