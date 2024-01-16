from .serializers import TaskSerializer, ProjectSerializer
from .models import Task, Project

from rest_framework import viewsets, permissions


class Taskview(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    # Sobrescribes los permisos que se configuran en el settings.py pa q funcione la lib
    permission_classes = [permissions.AllowAny]


# API REST FULL con modelo complejo
class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    # Sobrescribes los permisos que se configuran en el settings.py pa q funcione la lib
    permission_classes = [permissions.AllowAny]
