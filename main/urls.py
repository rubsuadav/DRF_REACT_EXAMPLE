from django.urls import path, include
from rest_framework import routers
from .views import Taskview, ProjectView
# para documentar la API de manera automática
from rest_framework.documentation import include_docs_urls

# pasarela de pago
from .views import StripeCustomer, StripeCheckoutSession, StripePrice, NotificationView, StripeInvoice, ProductsView


router = routers.DefaultRouter()

router.register(r'tasks', Taskview, "tasks")
router.register(r'projects', ProjectView, "projects")
router.register(r'products', ProductsView, "products")

urlpatterns = [
    path("api/", include(router.urls)),
    path("auth/", include("djoser.urls")),  # para autenticacion
    path("auth/", include("djoser.urls.authtoken")),  # para autenticacion
    path("auth/", include("djoser.urls.jwt")),  # para autenticacion JWT
    # para documentar la API de manera automática
    path("", include_docs_urls(
        title="Complete API REST FULL including authentication")),
    # Pasarela de pago ##########################################
    path("api/customer/", StripeCustomer.as_view()),
    path("api/price/<int:product_id>/", StripePrice.as_view()),
    path("api/checkout/", StripeCheckoutSession.as_view()),
    path("api/invoice/<str:customer_id>/", StripeInvoice.as_view()),
    # Envio de emails ###########################################
    path("api/notification/", NotificationView.as_view()),
]
