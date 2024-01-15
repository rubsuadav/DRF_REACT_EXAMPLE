from .serializers import TaskSerializer
from .models import Task

from rest_framework import viewsets

class Taskview(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()