from .serializers import TaskSerializer, ProjectSerializer
from .models import Task, Project

from rest_framework import viewsets, permissions

# pasarela de pago
import stripe
# from stripe._error import CardError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .validators import *
from rest_framework.exceptions import ValidationError
from stripe._error import InvalidRequestError


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


# Pasarela de pago ##########################################
# 1) inicializamos stripe mediante la clave secreta
stripe.api_key = 'sk_test_51N4BMaGgNDimUjxYRFP0Twid035y7vZvtrZTuL6nTSvwoOcdBgwSHVM2nRPULeAlCoAXMxWGBsxWDmrA2NN8s6yT00MPkWmoIv'


# 2) creamos el cliente
class StripeCustomer(APIView):
    def post(self, request, *args, **kwargs):
        try:
            name = request.data['name']
            last_name = request.data['last_name']
            email = request.data['email']
            username = request.data['username']
            phone = request.data['phone']

            # validamos los datos
            validate_customer(name, last_name, email, username, phone)

            # creamos el cliente
            customer = stripe.Customer.create(
                name=name + " " + last_name,  # nombre completo del cliente
                email=email,  # email del cliente
                phone=phone,  # telefono del cliente
                metadata={
                    "name": name,  # nombre del cliente
                    "last_name": last_name,  # apellido del cliente
                    "username": username  # nombre de usuario del cliente
                }
            )
            return Response(status=status.HTTP_201_CREATED, data={"id del cliente": customer.id})
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=e.detail)
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})


# 3) creamos el metodo que nos crea el precio del objeto a pagar
class StripePrice(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # obtenemos el precio del objeto a pagar de la solicitud (atrib OBLIGATORIO!!!!)
            price_value = int(request.data['price_value'])

            price = stripe.Price.create(
                # divisa en la que se va a pagar, ver (https://stripe.com/docs/currencies) para todas las divisas posibles
                currency="eur",  # Atributo obligatorio
                product_data={
                    # nombre del producto (atrib obligatorio), CAMBIARLO POR VUESTRO NOMBRE QUE QUERAIS PONER AL PRODUCTO!!!
                    "name": "Nombre de ejemplo"
                },
                # precio del producto, por def viene en centimos!!!! (atrib obligatorio!!!!)
                # price_value se considera en euros!!!
                unit_amount=price_value*100,

                # intervalo de pago para implementar pagos recurrentes (atrib opcional) (USADO PARA SUBCRIPCIONES!!!!!)
                # recurring={
                #    # intervalo de pago (atrib opcional), se puede quitar o cambiar a "day" o "year" o "week"
                #    "interval": "month"
                # } // DESCOMENTAR EN CASO DE IMPLEMENTAR PAGOS RECURRENTES MEDIANTE SUBCRIPCIONES!!!!
            )
            return Response(status=status.HTTP_201_CREATED, data={"id del precio": price.id})
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=str("El precio debe ser un número"))
        except InvalidRequestError:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=str("El precio debe de ser postivo o 0"))
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})


# 4) creamos el metodo que nos crea la sesion de la pasarela de pago del usuario
class StripeCheckoutSession(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # obtenemos el id del cliente desde los datos de la solicitud (atrib OBLIGATORIO)
            customer_id = request.data['customer_id']

            # obtenemos la cantidad de objetos a pagar de la solicitud (atrib OPCIONAL)
            # En el caso de que tengais varios items a pagar, x ejemplo varios PCs, etc (es decir, objetos tangibles))
            # quantity = request.data['quantity']

            # obtenemos el precio del objeto a pagar de la solicitud (atrib OBLIGATORIO)
            price_id = request.data['price_id']

            # validamos los datos (por defecto la cantidad es 1)
            # cambiar la cantidad si se quiere y poner "quantity" en vez de 1
            validate_checkout_session(customer_id, 1, price_id)

            session = stripe.checkout.Session.create(
                currency="eur",  # divisa en la que se va a pagar
                customer=customer_id,  # id del cliente (atrib obligatorio)
                line_items=[{
                    # cantidad de objetos a pagar (opcional ==> se puede quitar o poner "quantity" en vez de 1 si se quiere cambiar)
                    "quantity": 1,
                    "price": price_id,  # id del precio del producto
                }],
                mode="payment",  # modo de pago
                # (se puede cambiar a subscription para pagos recurrentes agregando "subscription" en vez de "payment"
                # SI EL PRICE_ID ES DE UN PRECIO RECURRENTE, ES DECIR, DE UNA SUBCRIPCION, es decir, tiene este atrib:
                # recurring={
                #    "interval": "month"
                # } )
                # SE DEBE DE CAMBIAR OBLIGATORIAMENTE EL MODO DE PAGO A "subscription", XQ SINO NO FUNCIONA!!!!

                # url de exito (atrib obligatorio)
                success_url=request.data.get(
                    'success_url', "https://example.com/success"),
            )
            return Response(status=status.HTTP_201_CREATED, data={"id de la sesion": session.id})
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e.detail[0])})
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})
