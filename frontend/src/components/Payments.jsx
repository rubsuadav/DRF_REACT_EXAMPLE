import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function Payments() {
  // 1) estado inicial para recoger los datos del cliente
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
  });

  const { subscriptionName, subscriptionPrice } = useParams();

  // 2) estado inicial para recoger los errores del formulario del cliente
  const [errors, setErrors] = useState({});

  // 3) instancias de los atrib del form para recoger los datos del cliente
  const { name, last_name, email, username, phone } = form;

  // 4) crear la funcion que se encargara en cambiar el estado del formualario
  function onInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // 4.1) limpiamos los errores del formulario del cliente
    setErrors({});
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

    // 6.2) pillo el id del precio mediante el del producto
    const priceResponse = await fetch("http://127.0.0.1:8000/api/price/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subscriptionName,
        price: subscriptionPrice,

      }),
    });
    const priceData = await priceResponse.json();
    try {
      // Si no hay errores en los datos del cliente y del precio, redireccionamos al cliente a la pasarela de pago
      if (!customerErrors) {
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
          // POST: parametros: customer_id, price_id
          const checkoutReponse = await fetch(
            "http://127.0.0.1:8000/api/checkout/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customer_id: customerData["id del cliente"],
                price_id: priceData["id del precio"],
                success_url: "http://localhost:5173/payment/success",
              }),
            }
          );
          const checkoutData = await checkoutReponse.json();
          window.location.href = checkoutData["url de la sesion"];
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
