import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Swal from "sweetalert2";

// cargar la clave publica de stripe
const stripePromise = loadStripe(
  "pk_test_51N4BMaGgNDimUjxY3aZ4eFC8osFpmDa0h9SXRzfHSJLmrTzXZvG8HbmRVXgR8m97vMU80ObFAuOSFfZr2ZOWxVft00NNHuk0Ue"
);

export default function Payments() {
  // 1.1) estado inicial para recoger los datos del cliente
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
  });

  // 1.2) estado inicial para recoger el valor del precio
  const [form2, setForm2] = useState({
    price_value: "",
  });

  // 2.1) estado inicial para recoger los errores del formulario del cliente
  const [errors, setErrors] = useState({});

  // 2.2) estado inicial para recoger los errores del formulario del precio
  const [errors2, setErrors2] = useState({});

  // 3.1) instancias de los atrib del form para recoger los datos del cliente
  const { name, last_name, email, username, phone } = form;

  // 3.2) instancias de los atrib del form para recoger el valor del precio
  const { price_value } = form2;

  // 4) crear la funcion que se encargara en cambiar el estado del formualario
  function onInputChange(e, formType) {
    if (formType === "customer") {
      setForm({ ...form, [e.target.name]: e.target.value });
      // 4.1) limpiamos los errores del formulario del cliente
      setErrors({});
    } else if (formType === "price") {
      setForm2({ ...form2, [e.target.name]: e.target.value });
      // 4.2) limpiamos los errores del formulario del precio
      setErrors2({});
    }
  }

  // 5) crear la funcion que se encargara de enviar los datos del formulario al backend
  async function handleSubmit(e) {
    e.preventDefault();
    // POST: parametros: name, last_name, email, username, phone
    const customerResponse = await fetch(
      "http://127.0.0.1:8000/api/customer/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );
    const customerData = await customerResponse.json();

    // 6.1) validamos los campos del form para recoger los datos del cliente
    let customerErrors = null;
    switch (customerResponse.status) {
      case 400:
        customerErrors = customerData;
        setErrors(customerData);
        break;
      case 201:
        break;
      default:
        break;
    }

    // POST: parametros: price_value
    // Verificar que el precio sea mayor que 0 antes de enviar el formulario
    if (form2.price_value < 0) {
      setErrors2({ price_value: "El precio no debe de ser menor que 0" });
      return;
    }

    const priceResponse = await fetch("http://127.0.0.1:8000/api/price/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form2),
    });
    const priceData = await priceResponse.json();

    // 6.2) validamos los campos del form para recoger el valor del precio
    let priceErrors = null;
    switch (priceResponse.status) {
      case 400:
        priceErrors = priceData;
        setErrors2(priceData);
        break;
      case 201:
        break;
      default:
        break;
    }

    // POST: parametros: customer_id, price_id
    const paymentResponse = await fetch("http://127.0.0.1:8000/api/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customerData["id del cliente"],
        price_id: priceData["id del precio"],
        success_url: "http://localhost:5173/payment/success",
      }),
    });
    const paymentData = await paymentResponse.json();

    // resolvemos la promesa de stripe
    const stripe = await stripePromise;

    try {
      // Si no hay errores en los datos del cliente y del precio, redireccionamos al cliente a la pasarela de pago
      if (!customerErrors && !priceErrors) {
        const alert = await Swal.fire({
          title: "Datos del formulario correctos",
          text: "Se te redireccionara a la pasarela de pago si pulsas en el boton de confirmar",
          icon: "success",
          confirmButtonText: "Si",
          denyButtonText: "No",
          showDenyButton: true,
          showConfirmButton: true,
        });
        if (alert.isConfirmed) {
          await stripe.redirectToCheckout({
            sessionId: paymentData["id de la sesion"],
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Imposible redireccionar a la pasarela de pago",
        text: "Debes de rellenar todos los campos del formulario correctamente",
        icon: "error",
      });
    }
  }

  return (
    /* podemos copiar el jsx del register y adaptarlo!!!*/
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label
              htmlFor="Nombre de usuario"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe tu nombre de usuario"
              name="name" // nombre del atributo de la entidad del backend
              value={name} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e, "customer")} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {/* validacion del campo del formulario */}
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Apellidos"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Apellidos del usuario
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Introduce tus apellidos"
              name="last_name" // nombre del atributo de la entidad del backend
              value={last_name} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e, "customer")} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs italic">{errors.last_name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Username"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Username del usuario
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Introduce tu username"
              name="username" // nombre del atributo de la entidad del backend
              value={username} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e, "customer")} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Email"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Email del usuario
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe tu email"
              name="email" // nombre del atributo de la entidad del backend
              value={email} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e, "customer")} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Telefono"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Telefono del usuario
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe tu telefono"
              name="phone" // nombre del atributo de la entidad del backend
              value={phone} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e, "customer")} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {errors.phone && (
              <p className="text-red-500 text-xs italic">{errors.phone}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Precio"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Precio del producto (en € o $)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe el precio del producto"
              name="price_value" // nombre del atributo de la entidad del backend
              value={price_value} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e, "price")} // llamada a la funcion que se encargara de actualizar el estado de la entidad
              required
            />
            {errors2.price_value && (
              <p className="text-red-500 text-xs italic">
                {errors2.price_value}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-auto px-2 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Redireccionar a la pasarela de pago
            </button>
            <Link
              className="w-auto px-1 py-3 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
              to="/"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
