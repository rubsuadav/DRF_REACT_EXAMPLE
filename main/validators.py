import re
from rest_framework.exceptions import ValidationError


def validate_customer(name, last_name, email, username, phone):
    errors = {}
    if not name or len(name) < 3:
        errors["name"] = "El nombre debe tener al menos 3 caracteres."

    if not last_name or len(last_name) < 3:
        errors["last_name"] = "El apellido debe tener al menos 3 caracteres."

    if not username or len(username) < 3:
        errors["username"] = "El nombre de usuario debe tener al menos 3 caracteres."

    if not email or not re.match(r'^\w+([.-]?\w+)*@(gmail|hotmail|outlook)\.com$', email):
        errors["email"] = "El email debe ser de gmail, hotmail o outlook."

    if not phone or not re.match(r'^(\\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$', phone):
        errors["phone"] = "El teléfono es inválido."

    if errors:
        raise ValidationError(errors)
