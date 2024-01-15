from rest_framework import serializers
from .models import Task, Project


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


# serializdor (convertidor ORM --> JSON) de un modelo con MtM
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
