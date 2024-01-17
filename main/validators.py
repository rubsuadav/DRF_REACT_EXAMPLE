import re
from rest_framework.exceptions import ValidationError


def validate_customer(name, last_name, email, username, phone):
    if not name or len(name) < 3:
        raise ValidationError("El nombre debe tener al menos 3 caracteres.")

    if not last_name or len(last_name) < 3:
        raise ValidationError("El apellido debe tener al menos 3 caracteres.")

    if not username or len(username) < 3:
        raise ValidationError(
            "El nombre de usuario debe tener al menos 3 caracteres.")

    if not email or not re.match(r'^\w+([.-]?\w+)*@(gmail|hotmail|outlook)\.com$', email):
        raise ValidationError("El email debe ser de gmail, hotmail o outlook.")

    if not phone or not re.match(r'^(\\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$', phone):
        raise ValidationError("El teléfono es inválido.")


def validate_checkout_session(customer_id, quantity, price_id):
    if not customer_id:
        raise ValidationError("El id del cliente es obligatorio.")

    if not price_id:
        raise ValidationError("El id del precio es obligatorio.")

    if quantity and quantity < 1:
        raise ValidationError("La cantidad debe ser mayor que 0.")


def validate_price_value(price_value):
    if not price_value or price_value < 0:
        raise ValidationError("El precio debe de minimo gratis ")
