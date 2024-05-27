from django.urls import path, include
from rest_framework import routers
from .views import Taskview, ProjectView, PersonView
from django.conf import settings
from django.conf.urls.static import static
# para documentar la API de manera automática
from rest_framework.documentation import include_docs_urls


router = routers.DefaultRouter()

router.register(r'tasks', Taskview, "tasks")
router.register(r'projects', ProjectView, "projects")
router.register(r'persons', PersonView, "persons")

urlpatterns = [
    path("api/", include(router.urls)),
    path("auth/", include("djoser.urls")),  # para autenticacion
    path("auth/", include("djoser.urls.authtoken")),  # para autenticacion
    path("auth/", include("djoser.urls.jwt")),  # para autenticacion JWT
    # para documentar la API de manera automática
    path("", include_docs_urls(
        title="Complete API REST FULL including authentication")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
