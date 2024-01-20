import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// local imports
import { useAuthContext } from "../context/authContext";

export default function Navbar() {
  //AGREGAMOS EL CONTEXTO DE AUTENTICACION Y AUTORIZACION
  const { isAuthenticated, logout } = useAuthContext();

  // para redireccionar al usuario //
  let navigate = useNavigate();

  //CERRAR SESION
  function Logout() {
    Swal.fire({
      title: "¿Estas seguro de que quieres cerrar sesión?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Sesión cerrada",
          text: "has cerrado la sesión con éxito",
          icon: "success",
        });
      } else if (result.isDenied) {
        navigate("/");
      }
    });
  }

  return (
    <header className="text-white body-font bg-blue-800">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to={"/"}
          className="flex title-font font-medium items-center mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Inicio</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link to={"/tasks"} className="mr-5 hover:text-gray-900">
            Tareas
          </Link>
          <Link to={"/projects"} className="mr-5 hover:text-gray-900">
            Proyectos
          </Link>
        </nav>
        {!isAuthenticated && (
          <>
            <Link
              to={"/register"}
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 text-black"
            >
              Registrarse
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            <Link
              to={"/login"}
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 text-black ml-5"
            >
              Iniciar Sesion
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <button
            onClick={Logout}
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 text-black"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
}
