from django.urls import path, include
from rest_framework import routers
from .views import Taskview, ProjectView, StripeCustomer, StripePrice, StripeCheckoutView
# para documentar la API de manera automática
from rest_framework.documentation import include_docs_urls

router = routers.DefaultRouter()

router.register(r'tasks', Taskview, "tasks")
router.register(r'projects', ProjectView, "projects")

urlpatterns = [
    path("api/", include(router.urls)),
    path("auth/", include("djoser.urls")),  # para autenticacion
    path("auth/", include("djoser.urls.authtoken")),  # para autenticacion
    path("auth/", include("djoser.urls.jwt")),  # para autenticacion JWT
    # para documentar la API de manera automática
    path("", include_docs_urls(
        title="Complete API REST FULL including authentication")),
    # PASARELA DE PAGO
    path("api/customer/", StripeCustomer.as_view()),
    path("api/price/", StripePrice.as_view()),
    path("api/checkout/", StripeCheckoutView.as_view())
]
