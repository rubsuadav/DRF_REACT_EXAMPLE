import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// cargar la clave publica de stripe
const stripePromise = loadStripe(
  "pk_test_51N4BMaGgNDimUjxY3aZ4eFC8osFpmDa0h9SXRzfHSJLmrTzXZvG8HbmRVXgR8m97vMU80ObFAuOSFfZr2ZOWxVft00NNHuk0Ue"
);

export default function Payments() {
  // 1) estados iniciales del formulario para recoger los datos del cliente y el valor del precio ya que son obligatorios desde el backend

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

  // 2) estado inicial para recoger los datos del cliente y el valor del precio
  const [customerId, setCustomerId] = useState({});
  const [priceId, setPriceId] = useState({});
  const [sessionId, setSessionId] = useState({});

  // 3) estado inicial para recoger los errores del formulario
  const [errors, setErrors] = useState({});

  // 4) creamos las instancias de los atrib del form

  // 4.1) instancias de los atrib del form para recoger los datos del cliente
  const { name, last_name, email, username, phone } = form;

  // 4.2) instancias de los atrib del form para recoger el valor del precio
  const { price_value } = form2;

  // 5) crear la funcion que se encargara en cambiar el estado del formualario
  function onInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setForm2({ ...form2, [e.target.name]: e.target.value });

    //limpiamos los errores
    setErrors({});
  }

  // 6) crear la funcion que se encargara de enviar los datos del formulario al backend
  // llamada a los endpoints de la API del backend
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

    // 7.1) validamos los campos del form para recoger los datos del cliente
    switch (customerResponse.status) {
      case 400:
        console.log(customerData);
        setErrors(customerData); //corregir mostrar errores correctamente
        break;
      case 201:
        setCustomerId(customerData);
        break;
      default:
        break;
    }

    // POST: parametros: price_value
    const priceResponse = await fetch("http://127.0.0.1:8000/api/price/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form2),
    });
    const priceData = await priceResponse.json();

    // 7.2) validamos los campos del form para recoger el valor del precio
    switch (priceResponse.status) {
      case 400:
        setErrors(priceData);
        break;
      case 201:
        setPriceId(priceData);
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
        customer_id: customerId["id del cliente"],
        price_id: priceId["id del precio"],
      }),
    });
    const paymentData = await paymentResponse.json();
    setSessionId(paymentData["id de la sesion"]);

    // resolvemos la promesa de stripe
    const stripe = await stripePromise;

    // llamada a la funcion de stripe para redirigir al cliente a la pasarela de pago
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.log(error);
    }
  }

  return (
    /* podemos copiar el jsx del register y adaptarlo!!!*/
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <form onSubmit={(e) => handleSubmit(e)}>
          {/* llamada a la funcion que se encargara de hacer el login a la API*/}
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
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
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
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
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
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
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
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
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
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
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
              Precio del producto
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe el precio del producto"
              name="price_value" // nombre del atributo de la entidad del backend
              value={price_value} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {errors.price_value && (
              <p className="text-red-500 text-xs italic">
                {errors.price_value}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-auto px-2 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Confirmar pago
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
