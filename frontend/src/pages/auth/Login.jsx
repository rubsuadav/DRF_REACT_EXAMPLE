import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Local imports
import { useAuthContext } from "../../context/authContext";

export default function Login() {
  //1) importamos Contexto de autenticacion
  const { login } = useAuthContext();

  // para redireccionar al usuario ///
  let navigate = useNavigate();

  //2) creamos el estado del formulario
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  //3) declaramos el estado de los errores del backend
  const [errors, setErrors] = useState({});

  //4) instaciamos los atrib del formulario
  const { username, password } = form;

  //5) crear la funcion que se encargara en cambiar el estado del formualario
  function onInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });

    //limpiamos los errores
    setErrors({});
  }

  //6) crear la funcion que llamara al endpoint del login
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    Swal.fire({
      title: "¿Estas seguro de que quieres iniciar sesión?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        switch (response.status) {
          case 200:
            login(data.access, data.refresh);
            navigate("/");
            Swal.fire({
              title: "Sesión iniciada",
              text: "has iniciado la sesión con éxito",
              icon: "success",
            });
            break;
          case 401:
            setErrors(data);
            break;
          case 400:
            setErrors(data);
            break;
          default:
            break;
        }
      } else if (result.isDenied) {
        navigate("/login");
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Inicio de sesion
        </h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          {/* llamada a la funcion que se encargara de hacer el login a la API*/}
          <div className="mb-4">
            <label
              htmlFor="Nombre de usuario"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Username del usuario
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe tu nombre de usuario"
              name="username" // nombre del atributo de la entidad del backend
              value={username} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {/* validacion del campo del formulario */}
            {errors.username && (
              <p className="text-red-500 text-xs italic">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Contraseña"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe tu contraseña"
              name="password" // nombre del atributo de la entidad del backend
              value={password} // valor del atributo de la entidad del backend
              onChange={(e) => onInputChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-auto px-2 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Iniciar sesion
            </button>
            <Link
              className="w-auto px-1 py-3 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
              to="/"
            >
              Cancelar
            </Link>
            <Link
              className="w-auto px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline text-center"
              to="/register"
            >
              No tienes cuenta? Registrate
            </Link>
          </div>
          {/* MOSTRAMOS LOS ERRORES DEL ERROR 401 DE CREDENCIALES INCORRECTAS */}
          {errors.detail && (
            <p className="text-red-500 text-base italic">{errors.detail}</p>
          )}
        </form>
      </div>
    </div>
  );
}
