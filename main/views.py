from .serializers import TaskSerializer, ProjectSerializer
from .models import Task, Project

from rest_framework import viewsets, permissions
from rest_framework import status

# pasarela de pago
import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from .validators import *
from rest_framework.exceptions import ValidationError
from stripe._error import InvalidRequestError

# envio de emails
from django.core.mail import EmailMultiAlternatives
from django.utils.text import slugify
from django.core.files.base import ContentFile
from unidecode import unidecode
from django.utils.encoding import smart_str
try:
    from local_settings import *
except ImportError:
    pass


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
try:
    stripe.api_key = STRIPE_SECRET_KEY
except NameError:
    pass


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
            # Creamos el producto en stripe a partir del producto de la base de datos
            stripe_product = stripe.Product.create(
                # nombre del producto (atrib obligatorio)
                name=request.data['name'],
            )

            price = stripe.Price.create(
                # divisa en la que se va a pagar, ver (https://stripe.com/docs/currencies) para todas las divisas posibles
                currency="eur",  # Atributo obligatorio
                # id del producto (atrib obligatorio)
                product=stripe_product.id,
                # precio del producto, por def viene en centimos!!!! (atrib obligatorio!!!!)
                # price_value se considera en euros!!!
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

            # obtenemos el precio de la subscripcion a pagar de la solicitud (atrib OBLIGATORIO)
            price_id = request.data['price_id']

            validate_checkout_session(customer_id, price_id)

            session = stripe.checkout.Session.create(
                currency="eur",  # divisa en la que se va a pagar
                customer=customer_id,  # id del cliente (atrib obligatorio)
                line_items=[{
                    # id del precio del producto (atrib obligatorio)
                    "price": price_id,
                    # cantidad de productos a pagar (atrib obligatorio)
                    "quantity": 1
                }],
                mode="subscription",  # modo de pago (atrib obligatorio)
                # url de exito (atrib obligatorio)
                success_url=request.data.get(
                    'success_url', "https://example.com/success"),
            )
            return Response(status=status.HTTP_201_CREATED, data={"url de la sesion": session.url})
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e.detail[0])})
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})


# Envio de emails ##########################################
def send_notification(recipients, subject, message, attached_file=None):
    # Convertimos los datos a cadenas de texto usando smart_str
    recipients = [smart_str(recipients)
                  for recipients in recipients]  # destinatarios
    subject = smart_str(subject)  # asunto
    message = smart_str(message)  # mensaje

    # Eliminamos cualquier caracter no ASCII usando unidecode
    recipients = [unidecode(recipients) for recipients in recipients]
    subject = unidecode(subject)
    message = unidecode(message)

    # Creamos el email con los datos
    email = EmailMultiAlternatives(
        subject=subject,
        body=message,
        to=recipients,
        from_email=unidecode(EMAIL_HOST_USER)
    )

    if attached_file:
        file_name = slugify(attached_file.name)
        file_content = ContentFile(attached_file.read().decode('latin-1'))
        email.attach(file_name, file_content.read(),
                     attached_file.content_type)

    try:
        email.send(fail_silently=False)
    except Exception as e:
        raise e


class NotificationView(APIView):
    # permission_classes = [permissions.IsAdminUser]
    def post(self, request, *args, **kwargs):
        try:
            recipients = request.data['recipients'].split(' ')
            subject = request.data['subject']
            message = request.data['message']
            file = request.FILES.get('file')
            try:
                send_notification(
                    recipients, subject, message, file)
                datos = {'message': "Enviando notificación..."}
                return Response(data=datos, status=status.HTTP_201_CREATED)
            except Exception:
                datos = {'error': "Credenciales del servidor SMTP inválidas."}
                return Response(data=datos, status=status.HTTP_401_UNAUTHORIZED)
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": "No se han enviado todos los datos."})
