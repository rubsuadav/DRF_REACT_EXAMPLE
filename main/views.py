from .serializers import TaskSerializer, ProjectSerializer
from .models import Task, Project

from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError


# pasarela de pago
import stripe
try:
    from local_settings import STRIPE_SECRET_KEY
except ImportError:
    pass

from .validators import validate_customer


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


# PAASARELA DE PAGO POR SUSCRIPCIONES
# O) inicializar stripe
try:
    stripe.api_key = STRIPE_SECRET_KEY
except NameError:
    pass


# 1) Crear un cliente
class StripeCustomer(APIView):
    def post(self, request, *args, **kwargs):
        try:
            name = request.data["name"]
            last_name = request.data["last_name"]
            email = request.data["email"]
            username = request.data["username"]
            phone = request.data["phone"]

            # validamos los datos
            validate_customer(name, last_name, email, username, phone)
            customer = stripe.Customer.create(
                name=name + " " + last_name,
                email=email,
                phone=phone,
                metadata={
                    "name": name,
                    "last_name": last_name,
                    "username": username
                }
            )
            return Response(status=status.HTTP_201_CREATED, data={"id del cliente": customer.id})
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=e.detail)
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos"})


# 2) Creamos el objeto de la subcripcion
class StripePrice(APIView):
    def post(self, request, *args, **kwargs):
        try:
            stripe_product = stripe.Product.create(
                name=request.data['name'],
            )

            price = stripe.Price.create(
                currency="eur",
                product=stripe_product.id,
                unit_amount=int(round(int(request.data["price"])*100)),

                # atributo necesario para implementar la suscripcion
                recurring={
                    # intervalo de pago (atrib obligatorio)
                    "interval": "month",
                    # periodo de prueba (atrib opcional)
                    "trial_period_days": 30,
                    "interval_count": 1  # número de intervalos entre las facturaciones de la suscripción
                }
                # como interval ==> month, el precio se cobrará cada mes
            )
            return Response(status=status.HTTP_201_CREATED, data={"id del precio": price.id})
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})


class StripeCheckoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # obtenemos los 2 parametros necesarios para la sesion
            customer_id = request.data["customer_id"]
            price_id = request.data["price_id"]

            session = stripe.checkout.Session.create(
                currency="eur",
                customer=customer_id,
                mode="subscription",
                success_url=request.data.get(
                    'success_url', "https://example.com/success"
                ),
                line_items=[{
                    "price": price_id,
                    "quantity": 1
                }]
            )
            return Response(status=status.HTTP_201_CREATED, data={"url de la sesion": session.url})
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})
