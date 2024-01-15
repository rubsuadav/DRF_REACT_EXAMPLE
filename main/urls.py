from django.urls import path, include
from rest_framework import routers
from .views import Taskview

router = routers.DefaultRouter()

router.register(r'tasks', Taskview, "tasks")

urlpatterns = [
    path("api/", include(router.urls))
]
